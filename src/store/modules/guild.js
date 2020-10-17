import { getGuildDailyReport, getRank, getBattleList } from '../../api/'
import { getMinDate } from '../../utils/'

const guild = {
    namespaced: true,
    state: {
        month: 1,
        constellationName: '',
        rank: 0,
        guildName: '',
        dateList: [],
        bossList: [],
        dateReport: new Map(),
        dateReportTracker: 0,
        battleList: [],
        currentBattleId: null,
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
    },
    actions: {
        async getBattleListInfo({ commit }) {
            const {
                data: { data },
            } = await getBattleList()
            commit('setBattleList', data)
        },
        async getBattleInfo({ commit, state }) {
            const {
                data: {
                    data: { rank },
                },
            } = await getRank()
            commit('setRank', rank)
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
                const month = getMonth(day_list)
                commit('setMonth', month)
                commit('setConstellationName', constellationName)
                commit('setGuildName', guildName)
                commit('setDateList', day_list)
            } catch {
                return Promise.reject('当前公会战信息尚未公开')
            }
        },
    },
}

function getMonth(dateList) {
    const date = getMinDate(dateList)
    return date.month() + 1
}

export default guild
