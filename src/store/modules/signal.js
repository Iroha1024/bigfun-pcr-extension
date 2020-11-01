import domtoimage from 'dom-to-image'

const signal = {
    namespaced: true,
    state: {
        exportMode: false,
        exportDom: null,
    },
    mutations: {
        setExportMode(state, exportMode) {
            state.exportMode = exportMode
        },
        setExportDom(state, exportDom) {
            state.exportDom = exportDom
        },
    },
    actions: {
        getReportUrl({ dispatch, state }) {
            return new Promise((resolve) => {
                setTimeout(async () => {
                    if (state.exportDom) {
                        document.body.appendChild(state.exportDom)
                        const url = await domtoimage.toPng(state.exportDom, {
                            style: {
                                overflowY: 'visible',
                                height: 'auto',
                            },
                        })
                        document.body.removeChild(state.exportDom)
                        resolve(url)
                    } else {
                        dispatch('getReportUrl').then((res) => {
                            resolve(res)
                        })
                    }
                }, 50)
            })
        },
    },
}

export default signal
