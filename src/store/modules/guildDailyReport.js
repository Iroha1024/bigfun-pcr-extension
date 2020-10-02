import { getGuildDailyReport } from '../../api/'

const guildDailyReport = {
    namespaced: true,
    state: {
        dateList: [],
        dateReport: new Map(),
    },
    mutations: {
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
                    data: { day_list },
                },
            } = await getGuildDailyReport()
            commit('setDateList', day_list)
        },
    },
}

export default guildDailyReport
