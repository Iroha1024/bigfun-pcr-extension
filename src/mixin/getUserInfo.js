const getUserInfoMixin = {
    props: ['active'],
    watch: {
        active(val) {
            if (val) {
                this.$store.dispatch('user/getUserInfoList')
            }
        },
    },
}

export { getUserInfoMixin }
