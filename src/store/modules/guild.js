import { getGuildDailyReport, getRank } from '../../api/'

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
    },
    actions: {
        async getInfo({ commit }) {
            const {
                data: {
                    data: { rank },
                },
            } = await getRank()
            commit('setRank', rank)
            const {
                data: {
                    data: {
                        battle_info: { name: constellationName },
                        clan_info: { name: guildName },
                        day_list,
                    },
                },
            } = await getGuildDailyReport()
            const month = getMonth(day_list)
            commit('setMonth', month)
            commit('setConstellationName', constellationName)
            commit('setGuildName', guildName)
            commit('setDateList', day_list)
        },
    },
}

function getMonth(dateList) {
    const date = new Date(Math.min(...dateList.map((item) => new Date(item))))
    return date.getMonth() + 1
}

export default guild
