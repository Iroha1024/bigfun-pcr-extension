<template>
    <a-modal centered :footer="null" :visible="isVisible" width="auto" @cancel="toggleModal">
        <date-report></date-report>
    </a-modal>
</template>

<script>
import DateReport from './DateReport'

export default {
    components: {
        DateReport,
    },
    props: ['isVisible', 'toggleModal'],
}
</script>

<style lang="scss" scoped></style>
