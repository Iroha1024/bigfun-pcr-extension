import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import guildDailyReport from './modules/guildDailyReport'
import bossReport from './modules/bossReport'
import guildSummaryReport from './modules/guildSummaryReport'

export default new Vuex.Store({
    modules: {
        guildDailyReport,
        bossReport,
        guildSummaryReport,
    },
})
