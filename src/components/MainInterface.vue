<template>
    <a-modal
        :bodyStyle="{ padding: '24px 40px' }"
        centered
        :footer="null"
        :visible="isVisible"
        width="auto"
        @cancel="toggleModal"
    >
        <a-tabs v-model="activeKey">
            <a-tab-pane
                v-for="item of tabList"
                :key="item.key"
                :tab="item.name"
                :forceRender="item.forceRender"
            >
                <component
                    v-show="activeKey == item.key"
                    :is="item.component"
                    :active="activeKey == item.key"
                    @export="forceRender"
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
import Export from './Export'
import About from './About'

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
                    forceRender: false,
                },
                {
                    name: '总结报表',
                    key: '1',
                    component: SummaryReport,
                    forceRender: false,
                },
                {
                    name: '转化率报表',
                    key: '2',
                    component: InversionRateReport,
                    forceRender: false,
                },
                {
                    name: '个人总结',
                    key: '3',
                    component: MyReport,
                    forceRender: false,
                },
                {
                    name: '导出',
                    key: '4',
                    component: Export,
                    forceRender: false,
                },
                {
                    name: '关于',
                    key: '5',
                    component: About,
                    forceRender: false,
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
    methods: {
        forceRender(name) {
            const component = this.tabList.find((tab) => tab.name == name)
            component.forceRender = true
        },
    },
}
</script>

<style lang="scss" scoped></style>
