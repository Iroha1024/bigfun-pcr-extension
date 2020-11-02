<template>
    <div class="export">
        <Report :username="username" class="export-report" @dom-finished="domFinished"></Report>
        <div>
            <a-checkbox
                :checked="myReport.checked"
                :disabled="myReport.disabled"
                @change="changeMyReport"
            >
                {{ myReport.label }}
            </a-checkbox>
            <a-checkbox :checked="allReports.checked" @change="changeAllReports">
                {{ allReports.label }}
            </a-checkbox>
        </div>
        <div v-show="isShowGuildMemberList">
            <a-divider />
            <a-checkbox-group v-model="checkedGuildMemberList" class="member-list">
                <a-row
                    v-for="(group, index) of guildMemberList"
                    :key="index"
                    type="flex"
                    :gutter="[24, 16]"
                >
                    <a-col :span="6" v-for="(name, index) of group" :key="index">
                        <a-checkbox :value="name">{{ name }}</a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
        </div>
        <a-button
            class="button"
            icon="export"
            type="primary"
            :loading="loading"
            @click="exportReport"
        >
            导出
        </a-button>
    </div>
</template>

<script>
import Report from '../components/Report'

import { mapState } from 'vuex'
import jszip from 'jszip'
import { saveAs } from 'file-saver'

export default {
    components: {
        Report,
    },
    computed: {
        ...mapState({
            guild: (state) => state.guild,
            user: (state) => state.user,
            signal: (state) => state.signal,
        }),
        loading() {
            return this.signal.exportMode
        },
    },
    data() {
        return {
            myReport: {
                label: '个人总结',
                checked: true,
                disabled: false,
            },
            allReports: {
                label: '公会全员总结',
                checked: false,
                disabled: false,
            },
            guildMemberList: [],
            checkedGuildMemberList: [],
            isShowGuildMemberList: false,
            username: '',
        }
    },
    created() {
        this.initGuildMemberList()
        this.initCheckedGuildMemberList()
    },
    methods: {
        initGuildMemberList() {
            const numPerGroup = 4
            for (let i = 0; i < this.guild.userReportData.length; i++) {
                if (i % numPerGroup == 0) {
                    this.guildMemberList.push([])
                }
                const j = ~~(i / numPerGroup)
                this.guildMemberList[j].push(this.guild.userReportData[i].name)
            }
        },
        initCheckedGuildMemberList() {
            this.checkedGuildMemberList = this.guild.userReportData.map(({ name }) => name)
        },
        changeMyReport({ target: { checked } }) {
            this.myReport.checked = checked
        },
        changeAllReports({ target: { checked } }) {
            this.allReports.checked = checked
            if (checked) {
                this.initCheckedGuildMemberList()
            }
            this.myReport.disabled = checked
            this.isShowGuildMemberList = checked
        },
        async exportReport() {
            this.$store.commit('signal/setExportMode', true)
            const list = []
            if (this.myReport.checked && !this.myReport.disabled) {
                await this.pushUrl(this.user.username, list)
            }
            if (this.allReports.checked) {
                for (const name of this.checkedGuildMemberList) {
                    await this.pushUrl(name, list)
                }
            }
            const zip = new jszip()
            const zipName = `${this.guild.constellationName}公会战报告`
            const reportList = zip.folder(zipName)
            for (const { username, blob } of list) {
                reportList.file(`${username}.png`, blob)
            }
            const result = await zip.generateAsync({ type: 'blob' })
            saveAs(result, `${zipName}.zip`)
            this.$store.commit('signal/setExportMode', false)
            this.username = ''
        },
        domFinished(dom) {
            this.$store.commit('signal/setExportDom', dom)
            // console.log('dom', dom);
        },
        async pushUrl(username, list) {
            this.$store.commit('signal/setExportDom', null)
            this.username = username
            const blob = await this.$store.dispatch('signal/getReportBlob')
            list.push({
                username,
                blob,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.export {
    min-height: 300px;
    .export-report {
        position: absolute;
        transform: translateX(9999px);
    }
    .member-list {
        width: 100%;
    }
    .button {
        display: block;
        margin-top: 20px;
    }
}
</style>
