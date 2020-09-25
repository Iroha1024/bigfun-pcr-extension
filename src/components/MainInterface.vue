<template>
    <a-modal centered :footer="null" :visible="isVisible" width="auto" @cancel="toggleModal">
        <boss-data-chart></boss-data-chart>
    </a-modal>
</template>

<script>
import BossDataChart from './BossDataChart'

export default {
    components: {
        BossDataChart,
    },
    props: ['isVisible', 'toggleModal'],
}
</script>

<style lang="scss" scoped></style>
