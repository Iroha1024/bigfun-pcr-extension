<template>
    <div>
        <a-select :value="currentUserName" style="width: 200px" @change="handleChange">
            <a-select-option
                :value="user.username"
                v-for="(user, index) of user.userInfoList"
                :key="index"
            >
                {{ user.username }}
            </a-select-option>
        </a-select>
        <echarts :options="options" type="chart"></echarts>
    </div>
</template>

<script>
import { getSimilarString } from '../utils/'
import { getUser } from '../api/'
import { getDateReportMixin } from '../mixin/getDateReport'
import { getUserInfoMixin } from '../mixin/getUserInfo'

import Echarts from './Echarts'

import { mapState } from 'vuex'
import debounce from 'lodash.debounce'

export default {
    mixins: [getDateReportMixin, getUserInfoMixin],
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
            handler: debounce(function () {
                this.setOptions()
            }, 500),
            immediate: true,
        },
    },
    async created() {
        this.setUserName()
        await this.getDateReportInfo()
    },
    methods: {
        setUserName() {
            const unwatch = this.$watch(
                'user.username',
                (name) => {
                    if (name.length > 0) {
                        this.currentUserName = name
                        if (unwatch) {
                            unwatch()
                        }
                    }
                },
                { immediate: true }
            )
        },
        handleChange(value) {
            this.currentUserName = value
            this.setOptions()
        },
        setOptions() {
            const series = []
            for (const [date, data] of [...this.guild.dateReport].reverse()) {
                if (data.length < 1) continue
                const { damage_list } = data.find(({ name }) => this.currentUserName == name)
                damage_list.forEach(({ boss_name, damage }) => {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    const index = this.guild.bossList.indexOf(bossName)
                    const data = new Array(this.guild.bossList.length).fill(0)
                    data[index] = damage
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
                    formatter: function (params) {
                        let str = '',
                            coreInfo = '',
                            sum = 0
                        for (const { seriesName, value, color } of params.reverse()) {
                            if (value > 0) {
                                coreInfo += `
                                    <div style="display: flex; align-items: center;">
                                        <div style="
                                                background-color:${color};
                                                width: 10px;
                                                height: 10px;
                                                border-radius: 5px;
                                                margin-right: 5px;">
                                        </div>
                                        <span>${seriesName}: ${value.toLocaleString()}</span>
                                    </div>`
                                sum += value
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
