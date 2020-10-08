import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import * as isTodayPlugin from 'dayjs/plugin/isToday'
import minMax from 'dayjs/plugin/minMax'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isTodayPlugin)
dayjs.extend(minMax)

dayjs.tz.setDefault('Asia/Shanghai')

/**
 * @param {string[]} dateList
 */
export const getMaxDate = (dateList) => dayjs.max(...dateList.map((date) => dayjs(date)))

/**
 * @param {string[]} dateList
 */
export const getMinDate = (dateList) => dayjs.min(...dateList.map((date) => dayjs(date)))

export const isToday = (date) => dayjs(date).isToday()

export const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

export { dayjs }
