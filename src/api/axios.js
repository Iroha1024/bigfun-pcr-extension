import axios from 'axios'

const baseURL = 'https://www.bigfun.cn/api/'

const instance = axios.create({
    baseURL,
})

export { instance }
