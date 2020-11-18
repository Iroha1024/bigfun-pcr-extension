import Vue from 'vue'

import {
    Modal,
    Select,
    Tabs,
    Checkbox,
    Button,
    Icon,
    message,
    Row,
    Col,
    Divider,
    notification,
} from 'ant-design-vue'

Vue.use(Modal)
Vue.use(Select)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Divider)
Vue.use(notification)

Vue.prototype.$message = ({ type, msg }) => message[type](msg)
Vue.prototype.$notification = notification
