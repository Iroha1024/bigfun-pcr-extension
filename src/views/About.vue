<template>
    <div class="about">
        <div class="changelog" v-if="changelog">
            <h2>更新日志</h2>
            <div class="markdown-body" v-html="changelog"></div>
        </div>
        <div class="version">
            <p>当前版本：{{ version }}</p>
            <p>最新版本：{{ latestVersion }}</p>
            <a-button type="primary" icon="download" :disabled="disabled" @click="download">
                下载
            </a-button>
        </div>
        <div class="icon">
            <a href="https://github.com/Iroha1024/bigfun-pcr-extension" target="_blank">
                <a-icon type="github" />
            </a>
        </div>
    </div>
</template>

<script>
import { getLatestRelease, getChangelog } from '../api/'
import pkg from '../../package'

import { saveAs } from 'file-saver'
import 'github-markdown-css'

export default {
    data() {
        return {
            latestVersion: '0.0.0',
            downloadUrl: '',
            assetName: '',
            changelog: '',
        }
    },
    async created() {
        try {
            const { tag_name, assets } = await getLatestRelease()
            const { browser_download_url, name } = assets[0]
            this.latestVersion = tag_name
            this.downloadUrl = browser_download_url
            this.assetName = name
            const data = await getChangelog()
            this.changelog = data
        } catch {
            this.$message({ type: 'warning', msg: '获取github信息失败，请稍后刷新重试' })
        }
    },
    computed: {
        version() {
            return `v${pkg.version}`
        },
        disabled() {
            return !this.downloadUrl || this.version == this.latestVersion
        },
    },
    methods: {
        download() {
            saveAs(this.downloadUrl, this.assetName)
        },
    },
}
</script>

<style lang="scss" scoped>
.about {
    position: relative;
    min-height: 300px;
    .changelog {
        .markdown-body {
            max-width: 900px;
            max-height: 300px;
            margin: 20px 0 40px;
            overflow-y: scroll;
        }
    }
    .version {
        p {
            font-size: 18px;
            font-weight: bold;
        }
    }
    .icon {
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        font-size: 30px;
        a {
            color: #000;
        }
    }
}
</style>
