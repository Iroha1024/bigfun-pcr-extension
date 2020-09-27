import { getGuildLog } from '../../api/request'

const guildLog = {
    namespaced: true,
    state: {
        dateList: [],
    },
    mutations: {
        setDateList(state, dateList) {
            state.dateList = dateList
        },
    },
    actions: {
        async getInfo({ commit }) {
            const {
                data: {
                    data: { day_list },
                },
            } = await getGuildLog()
            commit('setDateList', day_list)
        },
    },
}

export default guildLog
