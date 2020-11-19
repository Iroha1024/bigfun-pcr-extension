<template>
    <div>
        <a-select defaultValue="rate" style="width: 120px" @change="handleChange">
            <a-select-option :value="sort.type" v-for="(sort, index) of sortList" :key="index">
                {{ sort.name }}
            </a-select-option>
        </a-select>
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
            userReportData: [],
            sortList: [
                {
                    name: '伤害',
                    type: 'damage',
                },
                {
                    name: '分数',
                    type: 'score',
                },
                {
                    name: '转化率',
                    type: 'rate',
                },
            ],
            showDamageY: true,
            showScoreY: false,
        }
    },
    created() {
        this.sort('rate')
        this.setOptions()
    },
    methods: {
        handleChange(type) {
            switch (type) {
                case 'damage':
                    this.showDamageY = true
                    this.showScoreY = false
                    break
                case 'score':
                    this.showDamageY = false
                    this.showScoreY = true
                    break
                default:
                    break
            }
            this.sort(type)
            this.setOptions()
        },
        sort(type) {
            this.userReportData = cloneDeep(this.guild.userReportData).sort(
                (a, b) => a[type] - b[type]
            )
        },
        setOptions() {
            const series = [
                {
                    name: '伤害',
                    type: 'bar',
                    data: this.userReportData.map(({ damage }) => damage),
                    yAxisIndex: 0,
                },
                {
                    name: '分数',
                    type: 'bar',
                    data: this.userReportData.map(({ score }) => score),
                    yAxisIndex: 1,
                },
                {
                    name: '转化率',
                    type: 'line',
                    data: this.userReportData.map(({ rate }) => rate),
                    yAxisIndex: 2,
                },
            ]
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
                        data: this.userReportData.map(({ name }) => name),
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '伤害',
                        show: this.showDamageY,
                        position: 'left',
                    },
                    {
                        type: 'value',
                        name: '分数',
                        show: this.showScoreY,
                        position: 'left',
                    },
                    {
                        type: 'value',
                        name: '转化率',
                    },
                ],
                series,
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
