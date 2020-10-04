import Vue from 'vue'
import App from '../App.vue'

import store from '../store/'

import '../plugins/ant-design-vue/'
import '../plugins/echarts'
import 'default-passive-events'

Vue.config.productionTip = false

const div = document.createElement('div')
document.body.appendChild(div)

new Vue({
    el: div,
    store,
    render: (h) => h(App),
})
