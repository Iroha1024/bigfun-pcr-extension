<template>
    <a-select v-model="id" style="width: 120px">
        <a-select-option :value="battle.id" v-for="battle of guild.battleList" :key="battle.id">
            {{ battle.name }}
        </a-select-option>
    </a-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            guild: (state) => state.guild,
        }),
        id: {
            get() {
                return this.guild.currentBattleId
            },
            set(value) {
                this.$store.commit('guild/setCurrentBattleId', value)
            },
        },
    },
}
</script>

<style lang="scss" scoped></style>
