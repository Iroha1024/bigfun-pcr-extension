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
        <template #title>
            <span class="title">{{ guild.constellationName }}</span>
        </template>
        <Loading :loading="loading">
            <Select v-if="!isSelected" :type="1"></Select>
            <a-tabs v-else v-model="activeKey">
                <a-tab-pane v-for="item of tabList" :key="item.key" :tab="item.name">
                    <component
                        v-show="activeKey == item.key"
                        :is="item.component"
                        :active="activeKey == item.key"
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
                {
                    name: '导出',
                    key: '4',
                    component: Export,
                },
                {
                    name: '设置',
                    key: '5',
                    component: Setting,
                },
                {
                    name: '关于',
                    key: '6',
                    component: About,
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
            return this.isSelected && this.isVisible && this.storage.showTitleTip
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
                await Promise.all([
                    this.$store.dispatch('guild/getLeaderInfo'),
                    this.$store.dispatch('guild/getBossReportInfo'),
                    this.$store.dispatch('guild/getDateReportInfo'),
                    this.$store.dispatch('storage/getStorage', ['autoComplete', 'showTitleTip']),
                ])
                this.loading = false
            }
        },
        isShowTip() {
            if (this.isShowTip) {
                this.$notification.open({
                    message: '小提示',
                    description: '鼠标右键刷新数据，设置中鼠标滑轮上下滚动可切换会战期数',
                    duration: 0,
                    onClose: () => {
                        this.closeTip()
                    },
                })
            } else {
                this.$notification.destroy()
            }
        },
    },
    async created() {
        await this.$store.dispatch('guild/getBattleListInfo')
        this.loading = false
        this.autoComplete()
    },
    methods: {
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
    .title {
        font-size: 22px;
    }
    & /deep/ .ant-modal-body {
        padding-top: 0;
    }
}
</style>
