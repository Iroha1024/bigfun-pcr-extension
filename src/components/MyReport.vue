<template>
    <div></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            home: (state) => state.home,
            guildDailyReport: (state) => state.guildDailyReport,
        }),
    },
}
</script>

<style lang="scss" scoped></style>
