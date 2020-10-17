import { getGuildDailyReport, getRank, getBattleList, getDateReport } from '../../api/'
import { dayjs, getMaxDate, isToday, formatDate } from '../../utils/'

const guild = {
    namespaced: true,
    state: {
        month: 1,
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
            state.vaildDateList = dateList.filter((item) => dayjs.tz() > dayjs(item))
        },
        setBossList(state, bossList) {
            state.bossList = bossList.map((boos) => boos.boss_name)
        },
        setDateReport(state, { key, value }) {
            state.dateReport.set(key, value)
            state.dateReportTracker += 1
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
                        user.rate = parseFloat((user.score / user.damage).toFixed(3))
                        user.number += number
                    } else {
                        temp.push({
                            name,
                            damage,
                            score,
                            rate: parseFloat((score / damage).toFixed(3)),
                            number,
                        })
                    }
                }
            }
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
        async getBattleInfo({ commit, state }) {
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
                const {
                    data: {
                        data: {
                            clan: { all_ranking },
                        },
                    },
                } = await getRank()
                const battle = all_ranking.find(
                    (item) => item.clan_battle_name == constellationName
                )
                const { month, ranking } = battle
                commit('setRank', ranking)
                commit('setMonth', month)
            } catch {
                return Promise.reject('当前公会战信息尚未公开')
            }
        },
        async getDateReportInfo({ commit, state }) {
            for (const date of state.vaildDateList) {
                const {
                    data: { data },
                } = await getDateReport(date, state.currentBattleId)
                commit('setDateReport', { key: date, value: data })
            }
            commit('setUserReportData')
        },
        async refreshDateReport({ commit, state }) {
            const maxDate = getMaxDate(state.vaildDateList)
            if (isToday(maxDate)) {
                const date = formatDate(maxDate)
                const {
                    data: { data },
                } = await getDateReport(date, state.currentBattleId)
                commit('setDateReport', { key: date, value: data })
                commit('setUserReportData')
                console.log('object')
            }
        },
    },
}

export default guild
