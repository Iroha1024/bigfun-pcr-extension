import Vue from 'vue'
import App from '../App.vue'

import 'ant-design-vue/dist/antd.css'

import { Modal, Select } from 'ant-design-vue'

Vue.use(Modal)
Vue.use(Select)

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoomSlider'
import 'echarts/lib/component/dataZoomInside'

Vue.component('v-chart', ECharts)

Vue.config.productionTip = false

const div = document.createElement('div')
document.body.appendChild(div)

new Vue({
    el: div,
    render: (h) => h(App),
})
