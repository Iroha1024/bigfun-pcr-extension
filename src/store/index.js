import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import guildLog from './modules/guildLog'
import bossReport from './modules/bossReport'

export default new Vuex.Store({
    modules: {
        guildLog,
        bossReport,
    },
})
