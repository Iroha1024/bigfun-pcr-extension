<template>
    <div id="bigfun-pcr-extension">
        <img :src="url" alt="extension button" class="button" @click="toggleModal" />
        <Home :isVisible="isVisible" :toggleModal="toggleModal"></Home>
    </div>
</template>

<script>
import Home from './views/Home'

export default {
    components: {
        Home,
    },
    data() {
        return {
            isVisible: false,
            url: browser.runtime.getURL('icons/kyaru.png'),
        }
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
