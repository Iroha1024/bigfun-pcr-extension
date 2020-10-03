<template>
    <div>
        <p>会战总结报告</p>
        <p>尊敬的{{ user.username }}:</p>
        <p>
            以下为您于{{ guild.month }}月{{ guild.constellationName }}会战，在{{
                guild.guildName
            }}公会中的总结。众人拾柴火焰高，您的公会在本期会战中取得了第{{ guild.rank }}名的成绩
        </p>
        <p>本期一共挑战团队副本{{ ChallengeSum }}次</p>
        <p>伤害排名第{{ damage.index }}名，伤害总量为{{ damage.value.toLocaleString() }}</p>
        <p>分数排名第{{ score.index }}名，分数总量为{{ score.value.toLocaleString() }}</p>
        <p>伤害分数转换率排名第{{ rate.index }}名，数目为{{ rate.value }}</p>
        <v-chart :options="options" class="mini-chart" />
        <p>兰德索尔委员会</p>
    </div>
</template>

<script>
import { getSimilarString } from '../utils/'
import { getDateReportMixin } from '../mixin/getDateReport'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
    mixins: [getDateReportMixin],
    computed: {
        ...mapState({
            user: (state) => state.user,
            guild: (state) => state.guild,
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
            return this.user.userInfoList.find(({ username }) => username == this.user.username)
                .ChallengeSum
        },
    },
    data() {
        return {
            options: null,
        }
    },
    async created() {
        await this.getDateReportInfo()
        this.setOptions()
    },
    methods: {
        sortThenReturnValue(sort, property) {
            const newArr = cloneDeep(this.user.userInfoList).sort(sort)
            const user = newArr.find(({ username }) => username == this.user.username)
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
            for (const [date, data] of [...this.guild.dateReport].reverse()) {
                if (data.length < 1) continue
                const { damage_list } = data.find(({ name }) => this.user.username == name)
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
.mini-chart {
    width: 540px;
    height: 360px;
}
</style>
