<template>
    <div>
        <v-chart :options="options" class="chart" />
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            guildSummaryReport: (state) => state.guildSummaryReport,
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
            const userInfoList = this.guildSummaryReport.userInfoList
                .map(({ username, damage, score }) => ({
                    username,
                    damage,
                    score,
                    rate: parseFloat((score / damage).toFixed(3)),
                }))
                .sort((a, b) => a.rate - b.rate)
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
