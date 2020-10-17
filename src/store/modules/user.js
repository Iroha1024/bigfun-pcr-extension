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
            const {
                data: {
                    data: { player_name },
                },
            } = await getUser()
            commit('setUserName', player_name)
        },
    },
}

export default user
