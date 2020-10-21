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
