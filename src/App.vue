<template>
    <div id="bigfun-pcr-extension">
        <img :src="url" alt="extension button" class="button" @click="" />
        <main-interface></main-interface>
    </div>
</template>

<script>
import MainInterface from './components/MainInterface'

export default {
    components: {
        MainInterface,
    },
    data() {
        return {
            isShow: false
        }
    },
    computed: {
        url() {
            return browser.runtime.getURL('icons/kyaru.png')
        },
    },
    methods: {
        toggle() {
            this.isShow = !this.isShow
        }
    },
}
</script>

<style lang="scss" scoped>
#bigfun-pcr-extension {
    position: fixed;
    top: 72px;
    right: 24px;
    .button {
        width: 64px;
        height: 64px;
        cursor: pointer;
    }
}
</style>
