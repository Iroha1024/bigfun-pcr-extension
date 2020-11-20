<template>
    <div class="report">
        <div class="export-layer" :style="`background-image: url(${paperUrl})`" ref="report">
            <div class="wrapper" :style="`background-image: url(${backgroundUrl})`">
                <p class="title">会战总结报告</p>
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
                <div class="bottom">
                    <div class="sign">
                        <p class="text">会长盖章：</p>
                        <div
                            class="seal"
                            :style="`transform: rotate(${getRotateDeg(
                                0,
                                -8
                            )}) translate(${getOffset(10, -10)})`"
                        >
                            <div class="content">
                                {{ guild.leaderName }}
                            </div>
                        </div>
                    </div>
                    <img
                        :src="signUrl"
                        alt="kokoro"
                        :style="`transform: rotate(${getRotateDeg(6, -12)}) translate(${getOffset(
                            5,
                            5
                        )})`"
                    />
                </div>
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
            return this.sortThenReturnValue('damage')
        },
        score() {
            return this.sortThenReturnValue('score')
        },
        rate() {
            return this.sortThenReturnValue('rate')
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
            paperUrl: browser.runtime.getURL('icons/paper.jpg'),
            backgroundUrl: browser.runtime.getURL('icons/guild.png'),
            signUrl: browser.runtime.getURL('icons/kokoro.png'),
        }
    },
    methods: {
        getRotateDeg(max, min) {
            max = Math.random() * max
            min = Math.random() * min
            return `${~~(max + min)}deg`
        },
        getOffset(max, min) {
            let xMax = Math.random() * max
            let xMin = Math.random() * min
            let yMax = Math.random() * max
            let yMin = Math.random() * min
            return `${~~(xMax - xMin)}px, ${~~(yMax - yMin)}px`
        },
        chartFinished() {
            this.$nextTick(() => {
                if (this.signal.exportMode) {
                    const report = this.$refs.report
                    // console.log('report');
                    this.$emit('dom-finished', report)
                }
            })
        },
        sortThenReturnValue(property) {
            if (this.guild.userReportData.length < 1 || !this.username) {
                return {
                    index: 0,
                    value: 0,
                }
            }
            const newArr = cloneDeep(this.guild.userReportData).sort(
                (a, b) => b[property] - a[property]
            )
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
    height: 500px;
    padding: 0 50px;
    overflow-y: scroll;
}
.export-layer {
    width: 800px;
    * {
        font-family: KaiTi;
    }
    .wrapper {
        font-size: 22px;
        text-align: center;
        padding: 50px 0;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: local;
        .title {
            font-size: 35px;
            font-weight: bold;
            padding: 10px 0 40px;
            margin: 0;
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
        .bottom {
            margin-top: 50px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            .sign {
                .text {
                    font-size: 30px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    text-align: left;
                }
                .seal {
                    position: relative;
                    left: 80px;
                    border: 8px solid #f50000;
                    border-radius: 10px;
                    writing-mode: vertical-rl;
                    .content {
                        min-width: 50px;
                        min-height: 50px;
                        max-height: 160px;
                        margin: 5px;
                        padding: 10px;
                        letter-spacing: 5px;
                        font-size: 30px;
                        color: #fff;
                        font-family: KaiTi;
                        background-color: #f50000;
                    }
                }
            }
            img {
                width: 200px;
                height: 200px;
                position: relative;
                top: 50px;
            }
        }
    }
}
</style>
