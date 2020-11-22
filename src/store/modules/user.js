import { getUser } from '../../api/'

const user = {
    namespaced: true,
    state: {
        username: '',
    },
    mutations: {
        setUserName(state, username) {
            state.username = username
        },
    },
    actions: {
        async getUserName({ commit }) {
            const data = await getUser()
            const {
                data: { player_name },
            } = data
            commit('setUserName', player_name)
        },
    },
}

export default user
