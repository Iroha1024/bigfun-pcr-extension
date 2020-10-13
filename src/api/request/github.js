import { instance } from '../axios'

const baseUrl = 'https://api.github.com'

export const getLatestRelease = () => {
    const url = `${baseUrl}/repos/Iroha1024/bigfun-pcr-extension/releases/latest`
    return instance.get(url)
}
