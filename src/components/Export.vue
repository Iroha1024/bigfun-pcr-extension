<template>
    <div class="export">
        <a-checkbox-group v-model="checkedList" :options="checkBoxList"></a-checkbox-group>
        <a-button
            icon="export"
            :loading="loading"
            type="primary"
            class="button"
            @click="exportReport"
        >
            导出
        </a-button>
    </div>
</template>

<script>
import bus from '../event-bus'

import domtoimage from 'dom-to-image'

export default {
    data() {
        return {
            checkBoxList: ['个人总结'],
            checkedList: ['个人总结'],
            loading: false,
        }
    },
    methods: {
        exportReport() {
            for (const name of this.checkedList) {
                if (name == '个人总结') {
                    let report = document.getElementById('myReport')
                    if (report) {
                        this.exportMyReport(report)
                    } else {
                        bus.$once('echart-ready', () => {
                            report = document.getElementById('myReport')
                            this.exportMyReport(report)
                        })
                        this.$emit('export', name)
                    }
                }
            }
        },
        download(url, name) {
            const a = document.createElement('a')
            a.href = url
            a.download = name
            a.click()
        },
        exportMyReport(report) {
            this.loading = true
            const node = report.parentNode
            node.style.display = 'block'
            node.style.position = 'absolute'
            domtoimage
                .toPng(report)
                .then((url) => {
                    this.loading = false
                    node.style.display = 'none'
                    node.style.position = 'static'
                    this.download(url, 'report.png')
                })
                .catch(() => {
                    this.loading = false
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.export {
    height: 300px;
    .button {
        display: block;
        margin-top: 20px;
    }
}
</style>
