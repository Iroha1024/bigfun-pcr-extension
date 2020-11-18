import Vue from 'vue'

import {
    Modal,
    Select,
    Tabs,
    Checkbox,
    Button,
    Icon,
    message,
    Alert,
    Row,
    Col,
    Divider,
} from 'ant-design-vue'

Vue.use(Modal)
Vue.use(Select)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Divider)

Vue.prototype.$message = ({ type, msg }) => message[type](msg)
