import Vue from 'vue'

import ECharts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoomSlider'
import 'echarts/lib/component/dataZoomInside'
import 'echarts/lib/component/title'

Vue.prototype.$echarts = ECharts
