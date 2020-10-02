import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './modules/user'
import guild from './modules/guild'

export default new Vuex.Store({
    modules: {
        user,
        guild,
    },
})
