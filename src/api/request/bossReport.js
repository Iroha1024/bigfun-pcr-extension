import { instance } from '../axios'

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
