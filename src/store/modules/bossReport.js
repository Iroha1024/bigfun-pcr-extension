const bossReport = {
    namespaced: true,
    state: {
        bossList: [],
    },
    mutations: {
        setBossList(state, bossList) {
            state.bossList = bossList.map((boos) => boos.boss_name)
        },
    },
}

export default bossReport
