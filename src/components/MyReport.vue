<template>
    <Report :username="user.username"></Report>
</template>

<script>
import Report from './Report'

import { mapState } from 'vuex'

export default {
    components: {
        Report,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
        }),
    },
}
</script>
