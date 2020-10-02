import { getUser } from '../../api/'

const home = {
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
        async getInfo({ commit }) {
            const {
                data: {
                    data: { player_name },
                },
            } = await getUser()
            commit('setUserName', player_name)
        },
    },
}

export default home
