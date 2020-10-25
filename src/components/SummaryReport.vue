<template>
    <div>
        <a-select :value="currentUserName" style="width: 200px" @change="handleChange">
            <a-select-option
                :value="user.name"
                v-for="(user, index) of guild.userReportData"
                :key="index"
            >
                {{ user.name }}
            </a-select-option>
        </a-select>
        <echarts :options="options" type="chart"></echarts>
    </div>
</template>

<script>
import { getSimilarString, dayjs } from '../utils/'
import { getUser } from '../api/'

import Echarts from './Echarts'

import { mapState } from 'vuex'

export default {
    components: {
        Echarts,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            guild: (state) => state.guild,
        }),
    },
    data() {
        return {
            currentUserName: '',
            options: null,
        }
    },
    watch: {
        'guild.dateReportTracker': {
            handler: 'setOptions',
        },
    },
    created() {
        this.setUserName()
        this.setOptions()
    },
    methods: {
        setUserName() {
            this.currentUserName = this.user.username
        },
        handleChange(value) {
            this.currentUserName = value
            this.setOptions()
        },
        setOptions() {
            const series = []
            for (const [date, data] of [...this.guild.dateReport].sort(
                (a, b) => dayjs(a[0]) - dayjs(b[0])
            )) {
                if (data.length < 1) continue
                const { damage_list } = data.find(({ name }) => this.currentUserName == name)
                damage_list.forEach(({ boss_name, damage, kill, reimburse }) => {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    const index = this.guild.bossList.indexOf(bossName)
                    const data = []
                    data[index] = [bossName, damage, kill, reimburse]
                    series.push({
                        name: date.slice(5),
                        type: 'bar',
                        barGap: '-100%',
                        barMaxWidth: '20%',
                        stack: bossName,
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
                    formatter(params) {
                        let str = '',
                            coreInfo = '',
                            sum = 0
                        for (const { seriesName, value, color } of params.reverse()) {
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
                                sum += value[1]
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
                        data: this.guild.bossList,
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
