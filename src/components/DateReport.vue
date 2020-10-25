<template>
    <div>
        <a-select :value="currentDate" style="width: 120px" @change="handleChange">
            <a-select-option
                :value="date"
                v-for="(date, index) of guild.vaildDateList"
                :key="index"
            >
                {{ date }}
            </a-select-option>
        </a-select>
        <echarts :options="options" type="chart"></echarts>
    </div>
</template>

<script>
import { getDateReport, getBossReport } from '../api/'
import { isSameDate, getSimilarString, getMaxDate, formatDate, getTrueDate } from '../utils/'

import Echarts from './Echarts'

import { mapState } from 'vuex'

export default {
    components: {
        Echarts,
    },
    async created() {
        this.getCurrentDate()
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
            const date = formatDate(getTrueDate())
            if (this.guild.dateList.includes(date)) {
                this.currentDate = date
            } else {
                const maxDate = getMaxDate(this.guild.dateList)
                this.currentDate = formatDate(maxDate)
            }
        },
        async getDateReportInfo() {
            const {
                data: { data },
            } = await getDateReport(this.currentDate, this.guild.currentBattleId)
            this.$store.commit('guild/setDateReport', {
                key: this.currentDate,
                value: data,
            })
            // console.log(this.guild.dateReport)
        },
        async handleChange(value) {
            this.currentDate = value
            if (isSameDate(this.currentDate)) {
                await this.getDateReportInfo()
            }
            this.setOptions()
        },
        setOptions() {
            const series = []
            for (const { damage_list, name } of this.guild.dateReport.get(this.currentDate)) {
                damage_list.forEach(({ boss_name, damage, kill, reimburse }) => {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    const index = this.userList.indexOf(name)
                    const data = []
                    data[index] = [name, damage, kill, reimburse]
                    series.push({
                        name: bossName,
                        type: 'bar',
                        stack: bossName,
                        data,
                    })
                })
            }
            // console.log(series)
            this.options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter(params) {
                        let str = '',
                            coreInfo = '',
                            title = ''
                        for (const { axisValue, seriesName, value, color } of params.reverse()) {
                            if (Array.isArray(value)) {
                                coreInfo += `
                                    <div style="display: flex; align-items: center;">
                                        <div style="
                                                background-color: ${color};
                                                width: 10px;
                                                height: 10px;
                                                border-radius: 5px;
                                                margin-right: 5px;">
                                        </div>
                                        <span style="margin-right: 10px;">${seriesName}: ${value[1].toLocaleString()}</span>
                                        <span style="color: #ef5f5f;">${
                                            value[2] == 1 ? '尾刀' : ''
                                        }</span>
                                        <span style="color: #f90;">${
                                            value[3] == 1 ? '补偿刀' : ''
                                        }</span>
                                    </div>`
                            }
                            title = axisValue
                        }
                        str = `${title}${coreInfo}`
                        return str
                    },
                },
                legend: {
                    type: 'plain',
                    data: this.guild.bossList,
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
