<template>
    <div>
        <div class="loading" v-if="loading" :style="bodyStyle">
            <div class="container">
                <component :is="name"></component>
            </div>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script>
import { Plane, RotateSquare, Origami, Socket } from 'vue-loading-spinner'

export default {
    props: {
        loading: Boolean,
        bodyStyle: {
            type: Object,
            default: () => ({
                width: '900px',
                height: '500px',
            }),
        },
    },
    computed: {
        name() {
            const components = [Plane, RotateSquare, Origami, Socket]
            const len = components.length
            const index = ~~(Math.random() * len)
            console.log(index)
            return components[index]
        },
    },
}
</script>

<style lang="scss" scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .container {
        transform: scale(2);
    }
}
</style>
