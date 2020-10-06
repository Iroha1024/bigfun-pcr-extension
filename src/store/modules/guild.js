import { getGuildDailyReport, getRank } from '../../api/'
import { transformDate, getMaxDate } from '../../utils/'

const guild = {
    namespaced: true,
    state: {
        month: 1,
        constellationName: '',
        rank: 0,
        guildName: '',
        currentDate: '',
        dateList: [],
        bossList: [],
        dateReport: new Map(),
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
        setCurrentDate(state, currentDate) {
            state.currentDate = currentDate
        },
        setDateList(state, dateList) {
            state.dateList = dateList
        },
        setBossList(state, bossList) {
            state.bossList = bossList.map((boos) => boos.boss_name)
        },
        setDateReport(state, { key, value }) {
            state.dateReport.set(key, value)
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
            const getMonth = (dateList) => {
                const date = new Date(Math.min(...dateList.map((item) => new Date(item))))
                return date.getMonth() + 1
            }
            const month = getMonth(day_list)
            const currentDate = getCurrentDate(day_list)
            commit('setMonth', month)
            commit('setConstellationName', constellationName)
            commit('setGuildName', guildName)
            commit('setCurrentDate', currentDate)
            commit('setDateList', day_list)
        },
    },
}

function getCurrentDate(dateList) {
    let date = transformDate(new Date())
    if (!dateList.includes(date)) {
        const maxDate = getMaxDate(dateList)
        date = transformDate(maxDate)
    }
    return date
}

export default guild
