import { getMaxDate, isToday, formatDate, dayjs } from '../utils/'
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
            return this.guild.dateList.filter((item) => dayjs.tz() > dayjs(item))
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
            const maxDate = getMaxDate(this.vaildDateList)
            if (isToday(maxDate)) {
                this.today = formatDate(maxDate)
            }
        },
        async getDateReportInfo() {
            this.isInGuildWarTime()
            for (const date of this.vaildDateList) {
                if (!this.guild.dateReport.has(date)) {
                    const {
                        data: { data },
                    } = await getDateReport(date, this.guild.currentBattleId)
                    this.$store.commit('guild/setDateReport', { key: date, value: data })
                }
            }
        },
        async getTodayReport() {
            if (this.today) {
                const {
                    data: { data },
                } = await getDateReport(this.today, this.guild.currentBattleId)
                this.$store.commit('guild/setDateReport', { key: this.today, value: data })
            }
        },
    },
}

export { getDateReportMixin }
