import { getGuildDailyReport } from '../../api/'

const guildDailyReport = {
    namespaced: true,
    state: {
        month: 1,
        constellationName: '',
        lastRanking: 0,
        guildName: '',
        dateList: [],
        dateReport: new Map(),
    },
    mutations: {
        setMonth(state, month) {
            state.month = month
        },
        setConstellationName(state, constellationName) {
            state.constellationName = constellationName
        },
        setLastRanking(state, lastRanking) {
            state.lastRanking = lastRanking
        },
        setGuildName(state, guildName) {
            state.guildName = guildName
        },
        setDateList(state, dateList) {
            state.dateList = dateList
        },
        setDateReport(state, { key, value }) {
            state.dateReport.set(key, value)
        },
    },
    actions: {
        async getInfo({ commit }) {
            const {
                data: {
                    data: {
                        battle_info: { name: constellationName },
                        clan_info: { last_ranking: lastRanking, name: guildName },
                        day_list,
                    },
                },
            } = await getGuildDailyReport()
            const getMonth = (dateList) => {
                const date = new Date(Math.min(...dateList.map((item) => new Date(item))))
                return date.getMonth() + 1
            }
            const month = getMonth(day_list)
            commit('setMonth', month)
            commit('setConstellationName', constellationName)
            commit('setLastRanking', lastRanking)
            commit('setGuildName', guildName)
            commit('setDateList', day_list)
        },
    },
}

export default guildDailyReport
