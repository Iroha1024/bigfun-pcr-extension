<template>
    <a-modal
        centered
        :footer="null"
        :visible="isVisible"
        :width="1000"
        @cancel="toggleModal"
    >
        <a-tabs v-model="activeKey">
            <a-tab-pane v-for="item of tabList" :key="item.key" :tab="item.name">
                <component
                    :is="item.component"
                    :active="activeKey == item.key"
                ></component>
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
            tabList: [
                {
                    name: '每日报表',
                    key: '0',
                    component: DateReport,
                },
                {
                    name: '总结报表',
                    key: '1',
                    component: SummaryReport,
                },
                {
                    name: '转化率报表',
                    key: '2',
                    component: InversionRateReport,
                },
                {
                    name: '个人总结',
                    key: '3',
                    component: MyReport,
                },
            ],
            activeKey: '0',
        }
    },
    created() {
        this.$store.dispatch('user/getUserName')
        this.$store.dispatch('user/getUserInfoList')
        this.$store.dispatch('guild/getInfo')
    },
}
</script>

<style lang="scss" scoped>
/deep/ .ant-tabs-tabpane {
    display: flex;
    justify-content: center;
}
</style>
