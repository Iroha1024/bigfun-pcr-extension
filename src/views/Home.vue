<template>
    <a-modal
        centered
        class="modal"
        :closable="false"
        :footer="null"
        :visible="isVisible"
        width="auto"
        @cancel="toggleModal"
        @contextmenu.native.prevent="refresh"
    >
        <Loading :loading="loading">
            <Select v-if="!isSelected"></Select>
            <a-tabs v-else v-model="activeKey">
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
        </Loading>
    </a-modal>
</template>

<script>
import DateReport from '../components/DateReport'
import SummaryReport from '../components/SummaryReport'
import InversionRateReport from '../components/InversionRateReport'
import MyReport from '../components/MyReport'
import Export from '../components/Export'
import About from '../components/About'
import Loading from '../components/Loading'
import Select from '../components/Select'

import { mapState } from 'vuex'

export default {
    components: {
        Loading,
        Select,
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
            loading: true,
        }
    },
    computed: {
        ...mapState({
            guild: (state) => state.guild,
        }),
        isSelected() {
            return this.guild.currentBattleId != null
        },
    },
    watch: {
        async 'guild.currentBattleId'(val) {
            if (val != null) {
                this.loading = true
                try {
                    await this.$store.dispatch('guild/getBattleInfo')
                    await this.$store.dispatch('guild/getDateReportInfo')
                } catch (error) {
                    await this.$store.commit('guild/setCurrentBattleId', null)
                    await this.$message.error(error)
                } finally {
                    this.loading = false
                }
            }
        },
    },
    async created() {
        await Promise.all([
            this.$store.dispatch('guild/getBattleListInfo'),
            this.$store.dispatch('user/getUserName'),
        ])
        this.loading = false
    },
    methods: {
        forceRender(name) {
            const component = this.tabList.find((tab) => tab.name == name)
            component.forceRender = true
        },
        async refresh() {
            this.loading = true
            await this.$store.dispatch('guild/refreshDateReport')
            this.loading = false
        },
    },
}
</script>

<style lang="scss" scoped>
.modal {
    user-select: none;
}
</style>
