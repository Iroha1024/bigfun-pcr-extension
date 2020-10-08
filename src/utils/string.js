import stringSimilarity from 'string-similarity'

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
