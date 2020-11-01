<template>
    <div class="report" ref="report">
        <div class="wrapper" :style="`background-image: url(${backgroundUrl})`">
            <p class="title" :style="`background-image: url(${titleUrl})`">会战总结报告</p>
            <div class="content">
                <p>
                    尊敬的
                    <span class="params">{{ username }}</span>
                    :
                </p>
                <p>
                    以下为您于
                    <span class="params">{{ guild.month }}</span>
                    月
                    <span class="params">{{ guild.constellationName }}</span>
                    会战，在
                    <span class="params">{{ guild.guildName }}</span>
                    公会中的总结
                </p>
                <p>
                    众人拾柴火焰高，您的公会在本期会战中取得了第
                    <span class="params">{{ guild.rank }}</span>
                    名的成绩
                </p>
                <p>
                    本期一共挑战团队副本
                    <span class="params">{{ ChallengeSum }}</span>
                    次
                </p>
                <p>
                    伤害排名第
                    <span class="params">{{ damage.index }}</span>
                    名，伤害总量为
                    <span class="params">{{ damage.value.toLocaleString() }}</span>
                </p>
                <p>
                    分数排名第
                    <span class="params">{{ score.index }}</span>
                    名，分数总量为
                    <span class="params">{{ score.value.toLocaleString() }}</span>
                </p>
                <p>
                    伤害分数转换率排名第
                    <span class="params">{{ rate.index }}</span>
                    名，数目为
                    <span class="params">{{ rate.value }}</span>
                </p>
                <Echarts
                    :options="options"
                    type="mini-chart"
                    class="chart"
                    @chart-finished="chartFinished"
                ></Echarts>
            </div>
            <div class="sign">
                <span>兰德索尔委员会</span>
                <img :src="signUrl" alt="karin" />
            </div>
        </div>
    </div>
</template>

<script>
import { getSimilarString } from '../utils/'

import Echarts from './Echarts'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
    components: {
        Echarts,
    },
    props: ['username'],
    computed: {
        ...mapState({
            guild: (state) => state.guild,
            signal: (state) => state.signal,
        }),
        damage() {
            return this.sortThenReturnValue((a, b) => b.damage - a.damage, 'damage')
        },
        score() {
            return this.sortThenReturnValue((a, b) => b.score - a.score, 'score')
        },
        rate() {
            return this.sortThenReturnValue((a, b) => b.rate - a.rate, 'rate')
        },
        ChallengeSum() {
            return this.guild.userReportData.find(({ name }) => name == this.username)?.number || 0
        },
        trigger() {
            return this.guild.dateReportTracker + this.username
        },
    },
    watch: {
        trigger: {
            handler() {
                if (this.username) {
                    this.setOptions()
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            options: null,
            backgroundUrl: browser.runtime.getURL('icons/guild.png'),
            titleUrl: browser.runtime.getURL('icons/laurel.png'),
            signUrl: browser.runtime.getURL('icons/karin.png'),
        }
    },
    methods: {
        chartFinished() {
            this.$nextTick(() => {
                if (this.signal.exportMode) {
                    const report = this.$refs.report
                    // console.log('report');
                    this.$emit('dom-finished', report)
                }
            })
        },
        sortThenReturnValue(sort, property) {
            if (this.guild.userReportData.length < 1 || !this.username) {
                return {
                    index: 0,
                    value: 0,
                }
            }
            const newArr = cloneDeep(this.guild.userReportData).sort(sort)
            const user = newArr.find(({ name }) => name == this.username)
            const index = newArr.indexOf(user) + 1
            const value = user[property]
            return {
                index,
                value,
            }
        },
        setOptions() {
            const series = []
            const map = new Map(this.guild.bossList.map((bossName) => [bossName, 0]))
            for (const [date, data] of [...this.guild.dateReport]) {
                if (data.length < 1) continue
                const { damage_list } = data.find(({ name }) => this.username == name)
                damage_list.forEach(({ boss_name, damage }) => {
                    const bossName = getSimilarString(boss_name, this.guild.bossList)
                    map.set(bossName, map.get(bossName) + damage)
                })
            }
            const data = []
            for (const bossName of this.guild.bossList) {
                data.push(map.get(bossName))
            }
            series.push({
                data,
                type: 'bar',
                barWidth: '30%',
            })
            this.options = {
                animation: false,
                grid: {
                    top: '5%',
                    left: '5%',
                    containLabel: true,
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function ({ value }) {
                        return value.toLocaleString()
                    },
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

<style lang="scss" scoped>
.report {
    width: 900px;
    height: 500px;
    padding: 0 50px;
    overflow-y: scroll;
    * {
        font-family: KaiTi;
    }
    .wrapper {
        font-size: 20px;
        text-align: center;
        padding: 50px 0;
        background-color: aliceblue;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: local;
        .title {
            font-size: 30px;
            font-weight: bold;
            padding: 10px 0 40px;
            margin: 0;
            background-size: 50%;
            background-repeat: no-repeat;
            background-position: center;
        }
        .params {
            font-weight: bold;
        }
        .content {
            display: inline-block;
            text-align: left;
            .chart {
                background-color: #ffffffa6;
            }
        }
        .sign {
            text-align: right;
            margin-top: 50px;
            padding-right: 20px;
            span {
                vertical-align: bottom;
                font-size: 30px;
                font-family: STXinwei;
            }
            img {
                padding-left: 20px;
                display: inline-block;
            }
        }
    }
}
</style>