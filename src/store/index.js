import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './modules/user'
import guild from './modules/guild'
import storage from './modules/storage'

export default new Vuex.Store({
    modules: {
        user,
        guild,
        storage,
    },
})
