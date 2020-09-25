import axios from 'axios'

const baseURL = 'https://www.bigfun.cn/api/'

const instance = axios.create({
    baseURL,
    timeout: 1000,
})

export { baseURL, instance }
