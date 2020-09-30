<template>
    <div>
        <a-select :value="currentUserName" style="width: 200px" @change="handleChange">
            <a-select-option
                :value="user.username"
                v-for="(user, index) of userInfoList"
                :key="index"
            >
                {{ user.username }}
            </a-select-option>
        </a-select>
        <v-chart :options="options" class="chart" />
    </div>
</template>

<script>
import { getMaxDate, isTimeDifferenceLessOneDay, transformDate } from '../utils/'
import { getDateReport, getGuildSummaryReport, getUser } from '../api/request'

import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            guildDailyReport: (state) => state.guildDailyReport,
            bossReport: (state) => state.bossReport,
        }),
        vaildDateList() {
            return this.guildDailyReport.dateList.filter((item) => new Date() > new Date(item))
        },
    },
    data() {
        return {
            today: null,
            userInfoList: [],
            currentUserName: '',
            options: null,
        }
    },
    async created() {
        await this.getUserInfo()
        await this.getDateReport()
        await this.getGuildSummaryReportInfo()
        this.setOptions()
    },
    methods: {
        async getUserInfo() {
            const {
                data: {
                    data: { player_name },
                },
            } = await getUser()
            this.currentUserName = player_name
        },
        async getDateReport() {
            const maxDate = transformDate(getMaxDate(this.vaildDateList))
            if (isTimeDifferenceLessOneDay(maxDate)) {
                this.today = maxDate
            }
            for (const date of this.vaildDateList) {
                if (!this.guildDailyReport.dateReport.has(date)) {
                    const {
                        data: { data },
                    } = await getDateReport(date)
                    this.$store.commit('guildDailyReport/setDateReport', { key: date, value: data })
                }
            }
        },
        async getTodayReport() {
            if (this.today) {
                const {
                    data: { data },
                } = await getDateReport(this.today)
                this.$store.commit('guildDailyReport/setDateReport', { key: date, value: data })
            }
        },
        async getGuildSummaryReportInfo() {
            const {
                data: {
                    data: { data },
                },
            } = await getGuildSummaryReport()
            this.userInfoList = data.map(({ username, damage, score }) => ({
                username,
                damage,
                score,
            }))
        },
        handleChange(value) {
            this.currentUserName = value
            this.setOptions()
        },
        setOptions() {
            const series = []
            for (const [date, data] of [...this.guildDailyReport.dateReport].reverse()) {
                if (data.length < 1) continue
                const { damage_list } = data
                    .filter(({ name }) => this.currentUserName == name)
                    .pop()
                damage_list.forEach(({ boss_name, damage }) => {
                    const bossname = boss_name.trim()
                    const index = this.bossReport.bossList
                        .map(({ boss_name }) => boss_name)
                        .indexOf(bossname)
                    const data = new Array(this.bossReport.bossList.length).fill(0)
                    data[index] = damage
                    series.push({
                        name: date.slice(5),
                        type: 'bar',
                        barGap: '-100%',
                        barMaxWidth: '20%',
                        stack: bossname,
                        data,
                    })
                })
            }
            this.options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: function (params) {
                        let str = '',
                            coreInfo = '',
                            sum = 0
                        for (const { seriesName, value, color } of params.reverse()) {
                            if (value > 0) {
                                coreInfo += `
                                    <div style="display: flex; align-items: center;">
                                        <div style="
                                                background-color:${color};
                                                width: 10px;
                                                height: 10px;
                                                border-radius: 5px;
                                                margin-right: 5px;">
                                        </div>
                                        <span>${seriesName}: ${value.toLocaleString()}</span>
                                    </div>`
                                sum += value
                            }
                        }
                        sum = sum.toLocaleString()
                        const title = `总和：${sum}`
                        str = `${title}${coreInfo}`
                        return str
                    },
                },
                legend: {
                    type: 'plain',
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: this.bossReport.bossList.map(({ boss_name }) => boss_name),
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                ],
                series,
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
