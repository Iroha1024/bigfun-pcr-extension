<template>
    <a-modal centered :footer="null" :visible="isVisible" width="auto" @cancel="toggleModal">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="每日报表">
                <date-report></date-report>
            </a-tab-pane>
            <a-tab-pane key="2" tab="总结报表">
                <summary-report></summary-report>
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
}
</script>

<style lang="scss" scoped></style>
