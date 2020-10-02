import { getUser, getGuildSummaryReport } from '../../api/'

const user = {
    namespaced: true,
    state: {
        username: '',
        userInfoList: [],
    },
    mutations: {
        setUserName(state, username) {
            state.username = username
        },
        setUserInfoList(state, userInfoList) {
            state.userInfoList = userInfoList
        },
    },
    actions: {
        async getUserName({ commit }) {
            const {
                data: {
                    data: { player_name },
                },
            } = await getUser()
            commit('setUserName', player_name)
        },
        async getUserInfoList({ commit }) {
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

export default user
