export const download = (url, name) => {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
}
