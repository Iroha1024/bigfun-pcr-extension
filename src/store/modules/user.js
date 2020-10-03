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
            const userInfoList = data.map(({ username, damage, score, number }) => ({
                username,
                damage,
                score,
                rate: parseFloat((score / damage).toFixed(3)),
                ChallengeSum: number,
            }))
            commit('setUserInfoList', userInfoList)
        },
    },
}

export default user
