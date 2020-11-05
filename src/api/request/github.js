import { instance } from '../axios'

const baseUrl = 'https://api.github.com'

const owner = 'Iroha1024'
const repo = 'bigfun-pcr-extension'

export const getLatestRelease = () => {
    const url = `${baseUrl}/repos/${owner}/${repo}/releases/latest`
    return instance.get(url)
}

export const getChangelog = () => {
    const url = `${baseUrl}/repos/${owner}/${repo}/contents/CHANGELOG.md`
    return instance.get(url, {
        headers: { Accept: 'application/vnd.github.v3.html' },
    })
}
