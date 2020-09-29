const bossReport = {
    namespaced: true,
    state: {
        bossList: [],
    },
    mutations: {
        setBossList(state, bossList) {
            state.bossList = bossList
        },
    },
}

export default bossReport