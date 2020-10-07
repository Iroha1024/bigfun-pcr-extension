import { getMaxDate, isTimeDifferenceLessOneDay, transformDate } from '../utils/'
import { getDateReport } from '../api/'

const getDateReportMixin = {
    props: ['active'],
    data() {
        return {
            today: null,
        }
    },
    computed: {
        vaildDateList() {
            return this.guild.dateList.filter((item) => new Date() > new Date(item))
        },
    },
    watch: {
        active(val) {
            if (val) {
                this.getTodayReport()
            }
        },
    },
    methods: {
        isInGuildWarTime() {
            const maxDate = transformDate(getMaxDate(this.vaildDateList))
            if (isTimeDifferenceLessOneDay(maxDate)) {
                this.today = maxDate
            }
        },
        async getDateReportInfo() {
            this.isInGuildWarTime()
            for (const date of this.vaildDateList) {
                if (!this.guild.dateReport.has(date)) {
                    const {
                        data: { data },
                    } = await getDateReport(date)
                    this.$store.commit('guild/setDateReport', { key: date, value: data })
                }
            }
        },
        async getTodayReport() {
            if (this.today) {
                const {
                    data: { data },
                } = await getDateReport(this.today)
                this.$store.commit('guild/setDateReport', { key: this.today, value: data })
            }
        },
    },
}

export { getDateReportMixin }
