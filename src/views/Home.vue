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
        <template #title v-if="isShowTip">
            <a-alert
                message="鼠标右键刷新数据，设置中鼠标滑轮上下滚动可切换会战期数"
                type="info"
                closeText="关闭"
                :afterClose="closeTip"
            />
        </template>
        <Loading :loading="loading">
            <Select v-if="!isSelected" :type="1"></Select>
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
import DateReport from './DateReport'
import SummaryReport from './SummaryReport'
import InversionRateReport from './InversionRateReport'
import MyReport from './MyReport'
import Export from './Export'
import Setting from './Setting'
import About from './About'
import Loading from '../components/Loading'
import Select from '../components/Select'

import { mapState } from 'vuex'
import clonedeep from 'lodash.clonedeep'

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
                    name: '设置',
                    key: '5',
                    component: Setting,
                    forceRender: false,
                },
                {
                    name: '关于',
                    key: '6',
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
            storage: (state) => state.storage,
        }),
        isSelected() {
            return this.guild.currentBattleId != null
        },
        isShowTip() {
            return this.isSelected && this.storage.showTitleTip
        },
    },
    watch: {
        async 'guild.currentBattleId'(val) {
            if (val != null) {
                this.loading = true
                try {
                    await this.$store.dispatch('guild/getBattleInfo')
                } catch (error) {
                    this.$store.commit('guild/setCurrentBattleId', null)
                    await this.$message(error)
                    this.loading = false
                    return
                }
                await this.$store.dispatch('guild/getBossReportInfo')
                await this.$store.dispatch('guild/getDateReportInfo')
                await this.$store.dispatch('storage/getStorage', ['autoComplete', 'showTitleTip'])
                this.loading = false
            }
        },
    },
    async created() {
        await this.$store.dispatch('guild/getBattleListInfo')
        await this.$store.dispatch('user/getUserName')
        this.loading = false
        this.autoComplete()
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
        autoComplete() {
            chrome.storage.sync.get('autoComplete', ({ autoComplete }) => {
                if (autoComplete) {
                    const battleList = clonedeep(this.guild.battleList)
                    battleList.sort((a, b) => Number(a.id) - Number(b.id))
                    const battle = battleList.pop()
                    this.$store.commit('guild/setCurrentBattleId', battle.id)
                }
            })
        },
        closeTip() {
            this.$store.commit('storage/setStorage', {
                key: 'showTitleTip',
                value: false,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.modal {
    user-select: none;
}
</style>
