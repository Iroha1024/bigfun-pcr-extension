import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import minMax from 'dayjs/plugin/minMax'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(minMax)

dayjs.tz.setDefault('Asia/Shanghai')

/**
 * @param {string[]} dateList
 */
export const getMaxDate = (dateList) => dayjs.max(...dateList.map((date) => dayjs(date)))

export const getTrueDate = () => dayjs.tz().subtract(5, 'hour')

export const isSameDate = (date) => getTrueDate().isSame(dayjs(date), 'date')

export const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

export { dayjs }
