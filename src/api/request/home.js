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
