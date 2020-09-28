import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import guildLog from './modules/guildLog'

export default new Vuex.Store({
    modules: {
        guildLog,
    },
})
