import { baseURL, instance } from './axios'

/**
 * 公会日志
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report-collect%2Fa
 */
export const getGuildLog = () => {
    const guildLog = `${baseURL}feweb?target=gzlj-clan-day-report-collect%2Fa`
    return instance.get(guildLog)
}

/**
 * 指定日期全员出刀数据
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report%2Fa&date=2020-09-23&page=1&size=30
 */
export const getDateReport = (date) => {
    const dateReport = `${baseURL}feweb?target=gzlj-clan-day-report%2Fa&date=${date}&page=1&size=30`
    return instance.get(dateReport)
}

/**
 * boss 报表
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-boss-report-collect%2Fa
 */
export const getBossReport = () => {
    const bossReport = `${baseURL}feweb?target=gzlj-clan-boss-report-collect%2Fa`
    return instance.get(bossReport)
}
