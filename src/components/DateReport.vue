<template>
    <div>
        <a-select :value="currentDate" style="width: 120px" @change="handleChange">
            <a-select-option
                :value="date"
                v-for="(date, index) of guildDailyReport.dateList"
                :key="index"
            >
                {{ date }}
            </a-select-option>
        </a-select>
        <v-chart :options="options" class="chart" />
    </div>
</template>

<script>
import { getDateReport, getBossReport } from '../api/request'
import { getMaxDate, isTimeDifferenceLessOneDay, transformDate, getSimilarString } from '../utils/'

import { mapState } from 'vuex'

export default {
    async created() {
        await this.getBossReportInfo()
        this.setCurrentDate()
        await this.getDateReportInfo()
        this.setOptions()
    },
    data() {
        return {
            currentDate: '',
            options: null,
        }
    },
    computed: {
        userList() {
            return this.guildDailyReport.dateReport.get(this.currentDate).map((item) => item.name)
        },
        ...mapState({
            guildDailyReport: (state) => state.guildDailyReport,
            bossReport: (state) => state.bossReport,
        }),
    },
    methods: {
        async getBossReportInfo() {
            const {
                data: {
                    data: { boss_list },
                },
            } = await getBossReport()
            this.$store.commit('bossReport/setBossList', boss_list)
        },
        setCurrentDate() {
            const date = transformDate(new Date())
            if (this.guildDailyReport.dateList.includes(date)) {
                this.currentDate = date
            } else {
                const maxDate = getMaxDate(this.guildDailyReport.dateList)
                this.currentDate = transformDate(maxDate)
            }
            // console.log(this.currentDate);
        },
        async getDateReportInfo() {
            const {
                data: { data },
            } = await getDateReport(this.currentDate)
            this.$store.commit('guildDailyReport/setDateReport', {
                key: this.currentDate,
                value: data,
            })
            // console.log(this.guildDailyReport.dateReport)
        },
        async handleChange(value) {
            this.currentDate = value
            if (
                !this.guildDailyReport.dateReport.has(this.currentDate) ||
                isTimeDifferenceLessOneDay(new Date(this.currentDate))
            ) {
                await this.getDateReportInfo()
            }
            this.setOptions()
        },
        setOptions() {
            const series = this.bossReport.bossList.map((boss) => ({
                name: boss,
                type: 'bar',
                data: [],
            }))
            let index = 0
            for (const { damage_list } of this.guildDailyReport.dateReport.get(this.currentDate)) {
                series.forEach(({ data }) => {
                    data[index] = 0
                })
                for (const { boss_name, damage } of damage_list) {
                    const bossName = getSimilarString(boss_name, this.bossReport.bossList)
                    const { data } = series.find((item) => item.name == bossName)
                    data[index] += damage
                }
                index++
            }
            // console.log(series)
            this.options = {
                color: ['#003366', '#006699', '#4cabce', '#e5323e', '#c1567e'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    type: 'plain',
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                        start: 0,
                        end: 33,
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 0,
                        end: 33,
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: this.userList,
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
