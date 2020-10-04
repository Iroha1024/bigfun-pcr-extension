<template>
    <div>
        <echarts :options="options" type="chart"></echarts>
    </div>
</template>

<script>
import Echarts from './Echarts'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
    components: {
        Echarts,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
        }),
    },
    data() {
        return {
            options: null,
        }
    },
    created() {
        this.setOptions()
    },
    methods: {
        setOptions() {
            const userInfoList = cloneDeep(this.user.userInfoList).sort((a, b) => a.rate - b.rate)
            const series = [
                {
                    name: '转化率',
                    type: 'bar',
                    data: userInfoList.map(({ rate }) => rate),
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
                        data: userInfoList.map(({ username }) => username),
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
