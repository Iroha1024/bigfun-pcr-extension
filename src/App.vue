<template>
    <div id="bigfun-pcr-extension">
        <img :src="url" alt="extension button" class="button" @click="toggleModal" />
        <main-interface :isVisible="isVisible" :toggleModal="toggleModal"></main-interface>
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
            isVisible: false,
        }
    },
    computed: {
        url() {
            return browser.runtime.getURL('icons/kyaru.png')
        },
    },
    methods: {
        toggleModal() {
            this.isVisible = !this.isVisible
        },
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
