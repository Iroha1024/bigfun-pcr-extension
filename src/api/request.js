import { baseURL, instance } from './axios'

/**
 * 公会日志
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report-collect%2Fa
 */
export const getGuildLog = () => {
    const url = `${baseURL}feweb?target=gzlj-clan-day-report-collect%2Fa`
    return instance.get(url)
}

/**
 * 指定日期全员出刀数据
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report%2Fa&date=2020-09-23&page=1&size=30
 */
export const getDateReport = (date) => {
    const url = `${baseURL}feweb?target=gzlj-clan-day-report%2Fa&date=${date}&page=1&size=30`
    return instance.get(url)
}

/**
 * boss 报表
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-boss-report-collect%2Fa
 */
export const getBossReport = () => {
    const url = `${baseURL}feweb?target=gzlj-clan-boss-report-collect%2Fa`
    return instance.get(url)
}

/**
 * 公会总表
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-collect-report%2Fa
 */
export const getGuildSummaryReport = () => {
    const url = `${baseURL}feweb?target=gzlj-clan-collect-report%2Fa`
    return instance.get(url)
}

/**
 * 个人信息
 *
 * https://www.bigfun.cn/api/feweb?target=get-gzlj-user-info%2Fa&flush_user_info=0
 */
export const getUser = () => {
    const url = `${baseURL}feweb?target=get-gzlj-user-info%2Fa&flush_user_info=0`
    return instance.get(url)
}
