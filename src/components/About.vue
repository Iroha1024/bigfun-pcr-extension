<template>
    <div class="about">
        <p>当前版本：{{ version }}</p>
        <p>最新版本：{{ latestVer }}</p>
        <a-button
            type="primary"
            icon="download"
            :disabled="disabled"
            @click="download(downloadUrl, assetName)"
        >
            下载
        </a-button>
        <div class="icon">
            <a href="https://github.com/Iroha1024/bigfun-pcr-extension" target="_blank">
                <a-icon type="github" />
            </a>
        </div>
    </div>
</template>

<script>
import { getLatestRelease } from '../api/'
import pkg from '../../package'
import { download } from '../utils/'

export default {
    data() {
        return {
            latestVer: '0.0.0',
            downloadUrl: '',
            assetName: '',
        }
    },
    async created() {
        const {
            data: { tag_name, assets },
        } = await getLatestRelease()
        const { browser_download_url, name } = assets[0]
        this.latestVer = tag_name
        this.downloadUrl = browser_download_url
        this.assetName = name
    },
    computed: {
        version() {
            return `v${pkg.version}`
        },
        disabled() {
            return !this.downloadUrl || this.version == this.latestVer
        },
    },
}
</script>

<style lang="scss" scoped>
.about {
    position: relative;
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
