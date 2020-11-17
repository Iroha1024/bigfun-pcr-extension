<template>
    <div id="bigfun-pcr-extension">
        <img :src="url" alt="extension button" class="button" @click="toggleModal" />
        <Home v-if="isLogined" :isVisible="isVisible" :toggleModal="toggleModal"></Home>
    </div>
</template>

<script>
import Home from './views/Home'

import { mapState } from 'vuex'

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
    computed: {
        ...mapState({
            user: (state) => state.user,
        }),
        isLogined() {
            return this.user.username
        },
    },
    async created() {
        await this.login()
    },
    methods: {
        async login() {
            if (!this.isLogined) {
                try {
                    await this.$store.dispatch('user/getUserName')
                } catch (error) {
                    await this.$message(error)
                }
            }
        },
        async toggleModal() {
            await this.login()
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
