import { instance } from '../axios'

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

