import {
    getGuildDailyReport,
    getRank,
    getBattleList,
    getDateReport,
    getBossReport,
} from '../../api/'
import { dayjs, formatDate, getTrueDate } from '../../utils/'

const guild = {
    namespaced: true,
    state: {
        month: 0,
        constellationName: '',
        rank: 0,
        guildName: '',
        dateList: [],
        vaildDateList: [],
        bossList: [],
        dateReport: new Map(),
        dateReportTracker: 0,
        battleList: [],
        currentBattleId: null,
        userReportData: [],
    },
    mutations: {
        setMonth(state, month) {
            state.month = month
        },
        setConstellationName(state, constellationName) {
            state.constellationName = constellationName
        },
        setRank(state, rank) {
            state.rank = rank
        },
        setGuildName(state, guildName) {
            state.guildName = guildName
        },
        setDateList(state, dateList) {
            state.dateList = dateList
        },
        setVaildDateList(state) {
            state.vaildDateList = state.dateList.filter((item) => getTrueDate() > dayjs(item))
        },
        setBossList(state, bossList) {
            state.bossList = bossList.map((boos) => boos.boss_name)
        },
        setDateReport(state, { key, value }) {
            state.dateReport.set(key, value)
            state.dateReportTracker += 1
        },
        clearDateReport(state) {
            state.dateReport.clear()
        },
        setBattleList(state, battleList) {
            state.battleList = battleList
        },
        setCurrentBattleId(state, id) {
            state.currentBattleId = id
        },
        setUserReportData(state) {
            const temp = []
            for (const data of state.dateReport.values()) {
                for (const { name, damage, score, number } of data) {
                    const user = temp.find((item) => item.name == name)
                    if (user) {
                        user.damage += damage
                        user.score += score
                        user.number += number
                    } else {
                        temp.push({
                            name,
                            damage,
                            score,
                            number,
                        })
                    }
                }
            }
            temp.forEach((user) => {
                user.rate = parseFloat((user.score / user.damage).toFixed(3))
                if (isNaN(user.rate)) user.rate = 0
            })
            state.userReportData = temp
        },
    },
    actions: {
        async getBattleListInfo({ commit }) {
            const {
                data: { data },
            } = await getBattleList()
            commit('setBattleList', data)
        },
        async getBattleInfo({ dispatch, commit, state }) {
            try {
                const {
                    data: {
                        data: {
                            battle_info: { name: constellationName },
                            clan_info: { name: guildName },
                            day_list,
                        },
                    },
                } = await getGuildDailyReport(state.currentBattleId)
                commit('setConstellationName', constellationName)
                commit('setGuildName', guildName)
                commit('setDateList', day_list)
                commit('setVaildDateList')
            } catch {
                return Promise.reject({
                    type: 'error',
                    msg: '当前公会战信息尚未公开',
                })
            }
            await dispatch('getRankInfo')
        },
        async getRankInfo({ commit, state }) {
            const {
                data: {
                    data: {
                        clan: { all_ranking },
                    },
                },
            } = await getRank()
            const battle = all_ranking.find(
                (item) => item.clan_battle_name == state.constellationName
            )
            const { month, ranking } = battle
            commit('setRank', ranking)
            commit('setMonth', month)
        },
        async getBossReportInfo({ commit, state }) {
            const {
                data: {
                    data: { boss_list },
                },
            } = await getBossReport(state.currentBattleId)
            commit('setBossList', boss_list)
        },
        async getDateReportInfo({ commit, state }) {
            commit('clearDateReport')
            for (const date of state.vaildDateList) {
                const {
                    data: { data },
                } = await getDateReport(date, state.currentBattleId)
                commit('setDateReport', { key: date, value: data })
            }
            commit('setUserReportData')
        },
        async refreshDateReport({ dispatch, commit, state }) {
            commit('setVaildDateList')
            const date = formatDate(getTrueDate())
            if (!state.vaildDateList.includes(date)) return
            await dispatch('getRankInfo')
            const {
                data: { data },
            } = await getDateReport(date, state.currentBattleId)
            commit('setDateReport', { key: date, value: data })
            commit('setUserReportData')
        },
    },
}

export default guild
