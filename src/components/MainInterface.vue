<template>
    <a-modal centered :footer="null" :visible="isVisible" width="auto" @cancel="toggleModal">
        <a-tabs default-active-key="1" @tabClick="tabClick" forceRender>
            <a-tab-pane key="1" tab="每日报表">
                <date-report></date-report>
            </a-tab-pane>
            <a-tab-pane key="2" tab="总结报表">
                <summary-report ref="summaryReport"></summary-report>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script>
import DateReport from './DateReport'
import SummaryReport from './SummaryReport'

export default {
    components: {
        DateReport,
        SummaryReport,
    },
    props: ['isVisible', 'toggleModal'],
    created() {
        this.$store.dispatch('guildLog/getInfo')
    },
    methods: {
        tabClick(key) {
            if (key == '2') {
                if (this.$refs.summaryReport) {
                    this.$refs.summaryReport.getTodayReport()
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
