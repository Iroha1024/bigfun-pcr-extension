import stringSimilarity from 'string-similarity'

/**
 * @param {string[]} dateList
 */
export const getMaxDate = (dateList) =>
    new Date(Math.max(...dateList.map((item) => new Date(item))))

/**
 * @param {Date} date
 */
export const isTimeDifferenceLessOneDay = (date) => {
    const MilliSecondsPerDay = 24 * 60 * 60 * 1000
    return new Date() - date < MilliSecondsPerDay
}

/**
 * Date 转换为YYYY-MM-DD
 *
 * @param {Date} date
 */
export const transformDate = (date) => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) {
        month = '0' + month
    }
    const day = date.getDate()
    return `${year}-${month}-${day}`
}

/**
 * 在给定列表中寻找最相似的字符串
 *
 * @param {String} str
 * @param {String[]} strList
 */
export const getSimilarString = (str, strList) => {
    const matches = stringSimilarity.findBestMatch(str, strList)
    return matches.bestMatch.target
}
