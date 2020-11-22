import axios from 'axios'

const baseURL = 'https://www.bigfun.cn/api/'

const instance = axios.create({
    baseURL,
})

const config = {
    headers: { 'Bigfun-Request': true },
}

instance.interceptors.response.use(
    (repsonse) => {
        const {
            config: { headers },
            data,
        } = repsonse
        if (headers['Bigfun-Request']) {
            const { code, message } = data
            if (code != 0) {
                return Promise.reject({
                    type: 'error',
                    msg: message,
                })
            } else {
                return data
            }
        }
        return data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export { instance, config }
