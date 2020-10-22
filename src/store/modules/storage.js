const storage = {
    namespaced: true,
    state: {
        autoComplete: false,
        showTitleTip: false,
    },
    mutations: {
        setStorage(state, { key, value }) {
            state[key] = value
            chrome.storage.sync.set({ [key]: value }, () => {
                console.log({ [key]: value })
            })
        },
    },
    actions: {
        getStorage({ commit }, property) {
            return new Promise((resolve) => {
                chrome.storage.sync.get(property, (data) => {
                    if (!Object.prototype.hasOwnProperty('showTitleTip')) {
                        commit('setStorage', { key: 'showTitleTip', value: true })
                    }
                    for (const key in data) {
                        commit('setStorage', { key, value: data[key] })
                    }
                    resolve()
                })
            })
        },
    },
}

export default storage
