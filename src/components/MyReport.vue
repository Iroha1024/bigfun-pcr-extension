<template>
    <div>
        <p>尊敬的{{ user.username }}</p>
        <p>
            以下为您于{{ guild.month }}月{{ guild.constellationName }}会战中，在{{
                guild.guildName
            }}公会中的总结。众人拾柴火焰高，您的公会在本期会战中取得了第{{ guild.rank }}名的成绩
        </p>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            user: (state) => state.user,
            guild: (state) => state.guild,
        }),
    },
}
</script>

<style lang="scss" scoped></style>
