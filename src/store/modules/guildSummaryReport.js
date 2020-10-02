import { getGuildSummaryReport } from '../../api/'

const guildSummaryReport = {
    namespaced: true,
    state: {
        userInfoList: [],
    },
    mutations: {
        setUserInfoList(state, userInfoList) {
            state.userInfoList = userInfoList
        },
    },
    actions: {
        async getInfo({ commit }) {
            const {
                data: {
                    data: { data },
                },
            } = await getGuildSummaryReport()
            const userInfoList = data.map(({ username, damage, score }) => ({
                username,
                damage,
                score,
            }))
            commit('setUserInfoList', userInfoList)
        },
    },
}

export default guildSummaryReport
