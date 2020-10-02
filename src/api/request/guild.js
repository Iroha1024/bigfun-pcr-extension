import { instance } from '../axios'

//团队战排名

/**
 * data: {  rank: 排名, }
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-my-clan%2Fa
 */
export const getRank = () => {
    const url = '/feweb?target=gzlj-my-clan%2Fa'
    return instance.get(url)
}

// 公会日表

/**
 * data: {battle_info: { name: 星座名, }, clan_info: { name: 公会名}, day_list: 时间}
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report-collect%2Fa
 */
export const getGuildDailyReport = () => {
    const url = '/feweb?target=gzlj-clan-day-report-collect%2Fa'
    return instance.get(url)
}

/**
 * data: [{ name: 用户名, damage_list: [{ boss_name: boss名, damage: 伤害, }] }]
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report%2Fa&date=2020-09-23&page=1&size=30
 */
export const getDateReport = (date) => {
    const url = `/feweb?target=gzlj-clan-day-report%2Fa&date=${date}&page=1&size=30`
    return instance.get(url)
}

//boss报表

/**
 * data: { boss_list: [{ boss_name: boss名 }] }
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-boss-report-collect%2Fa
 */
export const getBossReport = () => {
    const url = '/feweb?target=gzlj-clan-boss-report-collect%2Fa'
    return instance.get(url)
}
