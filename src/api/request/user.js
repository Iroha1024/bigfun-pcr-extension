import { instance } from '../axios'

// 首页

/**
 * data: {player_name: 用户名}
 *
 * https://www.bigfun.cn/api/feweb?target=get-gzlj-user-info%2Fa&flush_user_info=0
 */
export const getUser = () => {
    const url = '/feweb?target=get-gzlj-user-info%2Fa&flush_user_info=0'
    return instance.get(url)
}

//公会总表

/**
 * data: { data: [{ username: 用户名, damage: 伤害, score: 分数, }] }
 *
 * https://www.bigfun.cn/api/feweb?target=gzlj-clan-collect-report%2Fa
 */
export const getGuildSummaryReport = () => {
    const url = '/feweb?target=gzlj-clan-collect-report%2Fa'
    return instance.get(url)
}
