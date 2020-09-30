import Vue from 'vue'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoomSlider'
import 'echarts/lib/component/dataZoomInside'
import 'echarts/lib/component/title'

Vue.component('v-chart', ECharts)
