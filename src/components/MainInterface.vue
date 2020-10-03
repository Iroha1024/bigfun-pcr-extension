<template>
    <a-modal centered :footer="null" :visible="isVisible" width="auto" @cancel="toggleModal">
        <a-tabs default-active-key="1" v-model="activeKey" @tabClick="tabClick">
            <a-tab-pane key="1" tab="每日报表">
                <date-report v-show="activeKey == 1"></date-report>
            </a-tab-pane>
            <a-tab-pane key="2" tab="总结报表">
                <summary-report v-show="activeKey == 2" ref="child"></summary-report>
            </a-tab-pane>
            <a-tab-pane key="3" tab="转化率报表">
                <inversion-rate-report v-show="activeKey == 3"></inversion-rate-report>
            </a-tab-pane>
            <a-tab-pane key="4" tab="个人总结">
                <my-report v-show="activeKey == 4" ref="child"></my-report>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script>
import DateReport from './DateReport'
import SummaryReport from './SummaryReport'
import InversionRateReport from './InversionRateReport'
import MyReport from './MyReport'

export default {
    components: {
        DateReport,
        SummaryReport,
        InversionRateReport,
        MyReport,
    },
    props: ['isVisible', 'toggleModal'],
    data() {
        return {
            activeKey: '1',
        }
    },
    created() {
        this.$store.dispatch('user/getUserName')
        this.$store.dispatch('user/getUserInfoList')
        this.$store.dispatch('guild/getInfo')
    },
    methods: {
        tabClick(key) {
            if (key == '2' || key == '4') {
                if (this.$refs.child) {
                    this.$refs.child.getTodayReport()
                }
            }
        },
    },
}
</script>

<style lang="scss">
.chart {
    width: 900px !important;
    height: 500px !important;
}
</style>
