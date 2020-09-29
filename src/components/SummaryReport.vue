<template>
    <div>
        <a-select :value="currentUserName" style="width: 200px" @change="handleChange">
            <a-select-option
                :value="user.username"
                v-for="(user, index) of userInfoList"
                :key="index"
            >
                {{ user.username }}
            </a-select-option>
        </a-select>
        <v-chart :options="options" class="chart" />
    </div>
</template>

<script>
import { getMaxDate, isTimeDifferenceLessOneDay, transformDate } from '../utils/'
import { getDateReport, getGuildSummaryReport, getUser } from '../api/request'

import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            guildLog: (state) => state.guildLog,
            bossReport: (state) => state.bossReport,
        }),
        vaildDateList() {
            return this.guildLog.dateList.filter((item) => new Date() > new Date(item))
        },
    },
    data() {
        return {
            today: null,
            userInfoList: [],
            currentUserName: '',
            options: null,
        }
    },
    async created() {
        await this.getUserInfo()
        await this.getDateReport()
        await this.getGuildSummaryReportInfo()
        this.setOptions()
    },
    methods: {
        async getUserInfo() {
            const {
                data: {
                    data: { player_name },
                },
            } = await getUser()
            this.currentUserName = player_name
        },
        async getDateReport() {
            const maxDate = transformDate(getMaxDate(this.vaildDateList))
            if (isTimeDifferenceLessOneDay(maxDate)) {
                this.today = maxDate
            }
            for (const date of this.vaildDateList) {
                if (!this.guildLog.dateReport.has(date)) {
                    const {
                        data: { data },
                    } = await getDateReport(date)
                    this.$store.commit('guildLog/setDateReport', { key: date, value: data })
                }
            }
        },
        async getTodayReport() {
            if (this.today) {
                const {
                    data: { data },
                } = await getDateReport(this.today)
                this.$store.commit('guildLog/setDateReport', { key: date, value: data })
            }
        },
        async getGuildSummaryReportInfo() {
            const {
                data: {
                    data: { data },
                },
            } = await getGuildSummaryReport()
            this.userInfoList = data.map(({ username, damage, score }) => ({
                username,
                damage,
                score,
            }))
        },
        handleChange(value) {
            this.currentUserName = value
            this.setOptions()
        },
        setOptions() {
            const series = []
            for (const [date, data] of [...this.guildLog.dateReport]) {
                if (data.length < 1) continue
                const { damage_list } = data
                    .filter(({ name }) => this.currentUserName == name)
                    .pop()
                damage_list.forEach(({ boss_name, damage }) => {
                    const bossname = boss_name.trim()
                    const index = this.bossReport.bossList
                        .map(({ boss_name }) => boss_name)
                        .indexOf(bossname)
                    const data = new Array(this.bossReport.bossList.length).fill(0)
                    data[index] = damage
                    series.push({
                        name: date,
                        type: 'bar',
                        stack: bossname,
                        data,
                    })
                })
            }
            console.log(series)
            this.options = {
                color: ['#003366', '#006699', '#4cabce', '#e5323e', '#c1567e'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    type: 'plain',
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: this.bossReport.bossList.map(({ boss_name }) => boss_name),
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
