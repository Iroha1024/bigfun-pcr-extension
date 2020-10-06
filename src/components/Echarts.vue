<template>
    <div ref="chart" :class="[type]"></div>
</template>

<script>
import bus from '../event-bus'

export default {
    props: ['options', 'type'],
    data() {
        return {
            chart: null,
        }
    },
    mounted() {
        this.chart = this.$echarts.init(this.$refs.chart)
        this.showLoading()
        this.watch()
    },
    methods: {
        setOption(options) {
            this.chart.setOption(options)
            this.chart.hideLoading()
            setTimeout(() => {
                bus.$emit('echart-ready')
            }, 500)
        },
        showLoading() {
            this.chart.showLoading('default', {
                text: 'loading',
                color: '#c23531',
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
                fontSize: 0,
                showSpinner: true,
                spinnerRadius: 15,
                lineWidth: 5,
            })
        },
        watch() {
            this.$watch(
                'options',
                (options) => {
                    this.setOption(options)
                },
                {
                    immediate: Boolean(this.options),
                }
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.chart {
    width: 900px;
    height: 500px;
}
.mini-chart {
    width: 540px;
    height: 360px;
}
</style>
