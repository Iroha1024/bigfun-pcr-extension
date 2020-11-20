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
        <Echarts :options="options" type="chart"></Echarts>
    </div>
</template>

<script>
import { getDateReport, getBossReport } from '../api/'
import { isSameDate, getSimilarString, getMaxDate, formatDate, getTrueDate } from '../utils/'

import Echarts from '../components/Echarts'

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
            let temp = []
            //相同用户数据分层
            const find = (index) => {
                const data = temp.find((item) => item[index] == undefined)
                if (data == undefined) {
                    const arr = []
                    temp.push(arr)
                    return arr
                }
                return data
            }
            let series = []
            for (const { damage_list, name } of this.guild.dateReport.get(this.currentDate)) {
                damage_list.forEach(({ boss_name, damage, kill, reimburse }) => {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    const index = this.userList.indexOf(name)
                    const data = find(index)
                    data[index] = { bossName, data: [name, damage, kill, reimburse] }
                })
                if (damage_list.length == 0) {
                    series.push({
                        name: 'null',
                        type: 'bar',
                        stack: 'null',
                        data: [[name, 0, 0, 0]],
                    })
                }
            }
            // console.log(temp);
            temp = temp
                .map((item) => {
                    const level = []
                    item.forEach(({ bossName, data }) => {
                        let current = level.find((item) => item.name == bossName)
                        if (current == undefined) {
                            current = {
                                name: bossName,
                                type: 'bar',
                                stack: bossName,
                                data: [],
                            }
                            level.push(current)
                        }
                        current.data.push(data)
                    })
                    return level
                })
                .flat()
            series = [...temp, ...series]
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
                                        <span style="margin-right: 10px;">${
                                            seriesName == 'null'
                                                ? '未出🔪'
                                                : `${seriesName}: ${value[1].toLocaleString()}`
                                        }</span>
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
