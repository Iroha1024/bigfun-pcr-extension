import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import home from './modules/home'
import guildDailyReport from './modules/guildDailyReport'
import bossReport from './modules/bossReport'
import guildSummaryReport from './modules/guildSummaryReport'

export default new Vuex.Store({
    modules: {
        home,
        guildDailyReport,
        bossReport,
        guildSummaryReport,
    },
})
