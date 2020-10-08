<template>
    <div>
        <a-select :value="currentDate" style="width: 120px" @change="handleChange">
            <a-select-option :value="date" v-for="(date, index) of guild.dateList" :key="index">
                {{ date }}
            </a-select-option>
        </a-select>
        <echarts :options="options" type="chart"></echarts>
    </div>
</template>

<script>
import { getDateReport, getBossReport } from '../api/'
import { isToday, getSimilarString, getMaxDate, formatDate, dayjs } from '../utils/'

import Echarts from './Echarts'

import { mapState } from 'vuex'

export default {
    components: {
        Echarts,
    },
    async created() {
        this.getCurrentDate()
        await this.getBossReportInfo()
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
            return this.guild.dateReport.get(this.currentDate).map((item) => item.name)
        },
        ...mapState({
            guild: (state) => state.guild,
        }),
    },
    methods: {
        getCurrentDate() {
            const unwatch = this.$watch(
                'guild.dateList',
                (dateList) => {
                    if (dateList.length > 0) {
                        let date = formatDate(dayjs.tz())
                        if (!dateList.includes(date)) {
                            const maxDate = getMaxDate(dateList)
                            this.currentDate = formatDate(maxDate)
                        }
                        if (unwatch) {
                            unwatch()
                        }
                    }
                },
                { immediate: true }
            )
        },
        async getBossReportInfo() {
            const {
                data: {
                    data: { boss_list },
                },
            } = await getBossReport()
            this.$store.commit('guild/setBossList', boss_list)
        },
        async getDateReportInfo() {
            const {
                data: { data },
            } = await getDateReport(this.currentDate)
            this.$store.commit('guild/setDateReport', {
                key: this.currentDate,
                value: data,
            })
            // console.log(this.guild.dateReport)
        },
        async handleChange(value) {
            this.currentDate = value
            if (!this.guild.dateReport.has(this.currentDate) || isToday(this.currentDate)) {
                await this.getDateReportInfo()
            }
            this.setOptions()
        },
        setOptions() {
            const series = this.guild.bossList.map((boss) => ({
                name: boss,
                type: 'bar',
                data: [],
            }))
            let index = 0
            for (const { damage_list } of this.guild.dateReport.get(this.currentDate)) {
                series.forEach(({ data }) => {
                    data[index] = 0
                })
                for (const { boss_name, damage } of damage_list) {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    const { data } = series.find((item) => item.name == bossName)
                    data[index] += damage
                }
                index++
            }
            // console.log(series)
            this.options = {
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
