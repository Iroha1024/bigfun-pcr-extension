import { instance } from '../axios'

//团队战排名

/**
 * data: [{ id: 公会战id }]
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-battle-list%2Fa
 */
export const getBattleList = () => {
    const url = '/feweb?target=gzlj-clan-battle-list%2Fa'
    return instance.get(url)
}

// 公会日表

/**
 * data: {battle_info: { name: 星座名, }, clan_info: { name: 公会名}, day_list: 时间}
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report-collect%2Fa
 */
export const getGuildDailyReport = (battleId) => {
    const url = '/feweb?target=gzlj-clan-day-report-collect%2Fa'
    return instance.get(url, {
        params: {
            battle_id: battleId,
        },
    })
}

/**
 * data: [{ name: 用户名, damage_list: [{ boss_name: boss名, damage: 伤害, }] }]
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-day-report%2Fa&date=2020-09-23&page=1&size=30
 */
export const getDateReport = (date, battleId) => {
    const url = '/feweb?target=gzlj-clan-day-report%2Fa'
    return instance.get(url, {
        params: {
            date,
            page: 1,
            size: 30,
            battle_id: battleId,
        },
    })
}

//boss报表

/**
 * data: { boss_list: [{ boss_name: boss名 }] }
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-boss-report-collect%2Fa
 */
export const getBossReport = (battleId) => {
    const url = '/feweb?target=gzlj-clan-boss-report-collect%2Fa'
    return instance.get(url, {
        params: {
            battle_id: battleId,
        },
    })
}

//公会总表

/**
 * data: { clan: { all_ranking: [{ clan_battle_name: 星座名, month: 月份, ranking: 排名 }] } }
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-collect-report%2Fa
 */

export const getRank = () => {
    const url = '/feweb?target=gzlj-clan-collect-report%2Fa'
    return instance.get(url)
}
