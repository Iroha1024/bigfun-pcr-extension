<template>
    <div class="main-interface">

    </div>
</template>

<script>
import { getGuildLog, getDateReport, getBossReport } from '../api/request'

export default {
    async created() {
        await this.getGuildLogInfo()
        await this.getBossReportInfo()
        // await this.getDateReportInfo()
    },
    data() {
        return {
            guildLog: {
                day_list: []
            },
            boss_list: []
        }
    },
    methods: {
        async getGuildLogInfo() {
            const { data: { data: { day_list } } } = await getGuildLog()
            this.guildLog.day_list = day_list
            console.log(this.guildLog.day_list)
        },
        async getDateReportInfo() {
            for (const date of this.guildLog.day_list) {
                const { data } = await getDateReport(date)
                console.log(data)
            }
        },
        async getBossReportInfo() {
            const { data: { data: { boss_list } } } = await getBossReport()
            this.boss_list = boss_list
        }
    },
}
</script>

<style lang="scss" scoped></style>
