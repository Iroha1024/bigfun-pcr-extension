import Vue from 'vue'

import { Modal, Select, Tabs, Checkbox, Button, Icon, message } from 'ant-design-vue'

Vue.use(Modal)
Vue.use(Select)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Icon)

Vue.prototype.$message = message
