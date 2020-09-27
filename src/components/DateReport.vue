<template>
    <div class="boss-data-chart">
        <a-select :value="currentDate" style="width: 120px" @change="handleChange">
            <a-select-option :value="date" v-for="(date, index) of guildLog.dayList" :key="index">
                {{ date }}
            </a-select-option>
        </a-select>
        <v-chart :options="options" style="width: 900px; height: 500px" />
    </div>
</template>

<script>
import { getGuildLog, getDateReport, getBossReport } from '../api/request'

export default {
    async created() {
        await this.getGuildLogInfo()
        this.setCurrentDate()
        await this.getBossReportInfo()
        await this.getDateReportInfo()
        this.setOptions()
    },
    data() {
        return {
            guildLog: {
                dayList: [],
            },
            bossList: [],
            currentDate: '',
            dateReport: new Map(),
            options: null,
        }
    },
    computed: {
        userList() {
            return this.dateReport.get(this.currentDate).map((item) => item.name)
        },
    },
    methods: {
        async getGuildLogInfo() {
            const {
                data: {
                    data: { day_list },
                },
            } = await getGuildLog()
            this.guildLog.dayList = day_list
            // console.log(this.guildLog.dayList)
        },
        setCurrentDate() {
            const date = this.transformDate(new Date())
            if (this.guildLog.dayList.includes(date)) {
                this.currentDate = date
            } else {
                const maxDate = new Date(
                    Math.max(...this.guildLog.dayList.map((item) => new Date(item)))
                )
                this.currentDate = this.transformDate(maxDate)
            }
            // console.log(this.currentDate);
        },
        transformDate(date) {
            const year = date.getFullYear()
            let month = date.getMonth() + 1
            if (month < 10) {
                month = '0' + month
            }
            const day = date.getDate()
            return `${year}-${month}-${day}`
        },
        async getDateReportInfo() {
            const {
                data: { data },
            } = await getDateReport(this.currentDate)
            this.dateReport.set(this.currentDate, data)
            // console.log(this.dateReport)
        },
        async getBossReportInfo() {
            const {
                data: {
                    data: { boss_list },
                },
            } = await getBossReport()
            this.bossList = boss_list
            // console.log(this.bossList.map((item) => item.boss_name))
        },
        async handleChange(value) {
            this.currentDate = value
            if (!this.dateReport.has(value)) {
                await this.getDateReportInfo()
            }
            this.setOptions()
        },
        setOptions() {
            const series = this.bossList.map(({ boss_name }) => ({
                name: boss_name,
                type: 'bar',
                data: [],
            }))
            let index = 0
            for (const { damage_list } of this.dateReport.get(this.currentDate)) {
                series.forEach(({ data }) => {
                    data[index] = 0
                })
                for (const { boss_name, damage } of damage_list) {
                    const { data } = series.find((item) => item.name == boss_name.trim())
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
