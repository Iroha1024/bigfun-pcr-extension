<template>
    <div ref="chart" :class="[type]"></div>
</template>

<script>
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
        this.watchFinished()
        this.watch()
    },
    methods: {
        setOption(options) {
            this.chart.setOption(options)
            this.chart.hideLoading()
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
                    // console.log('echarts')
                    this.chart.clear()
                    this.setOption(options)
                },
                {
                    immediate: Boolean(this.options),
                }
            )
        },
        watchFinished() {
            this.chart.on('finished', () => {
                this.$emit('chart-finished')
            })
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
    width: 600px;
    height: 400px;
}
</style>
