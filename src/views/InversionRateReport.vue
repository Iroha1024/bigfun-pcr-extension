<template>
    <div>
        <Echarts :options="options" type="chart"></Echarts>
    </div>
</template>

<script>
import Echarts from '../components/Echarts'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
    components: {
        Echarts,
    },
    computed: {
        ...mapState({
            guild: (state) => state.guild,
        }),
    },
    data() {
        return {
            options: null,
        }
    },
    watch: {
        'guild.userReportData': {
            handler: 'setOptions',
            immediate: true,
        },
    },
    methods: {
        setOptions() {
            const userReportData = cloneDeep(this.guild.userReportData).sort(
                (a, b) => a.rate - b.rate
            )
            const series = [
                {
                    name: '转化率',
                    type: 'bar',
                    data: userReportData.map(({ rate }) => rate),
                },
            ]
            this.options = {
                title: {
                    show: true,
                    text: '伤害->分数转化率',
                },
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
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: userReportData.map(({ name }) => name),
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
