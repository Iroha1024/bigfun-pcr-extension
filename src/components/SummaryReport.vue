<template>
    <div class=""></div>
</template>

<script>
import { getMaxDate, isTimeDifferenceLessOneDay, transformDate } from '../utils/'
import { getDateReport } from '../api/request'

import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            guildLog: (state) => state.guildLog,
        }),
        vaildDateList() {
            return this.guildLog.dateList.filter((item) => new Date() > new Date(item))
        },
    },
    data() {
        return {
            today: null,
        }
    },
    created() {
        this.getDateReport()
    },
    methods: {
        async getDateReport() {
            const maxDate = transformDate(getMaxDate(this.vaildDateList))
            if (isTimeDifferenceLessOneDay(maxDate)) {
                this.today = maxDate
            }
            for (const date of this.vaildDateList) {
                if (!this.guildLog.dateReport.has(date)) {
                    const {
                        data: { data },
                    } = await getDateReport(date)
                    this.$store.commit('guildLog/setDateReport', { key: date, value: data })
                }
            }
        },
        async getTodayReport() {
            if (this.today) {
                const {
                    data: { data },
                } = await getDateReport(this.today)
                this.$store.commit('guildLog/setDateReport', { key: date, value: data })
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
