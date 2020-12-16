
<template>
    <div id="columnPlot" :style="getHeight()"></div>
</template>

<script>
import { Column } from '@antv/g2plot'
export default {
    props: {
        value: {
            type: Array,
            default() {
                return []
            },
        },
        Height: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            radarPlot: null,
        }
    },
    mounted() {
        this.initRadarPlot()
    },
    methods: {
        initRadarPlot() {
            const columnPlot = new Column('columnPlot', {
                data: this.value,
                xField: 'language',
                yField: 'Ratings',
                label: {
                    position: 'top',
                    content: (originData) => {
                        return originData.Ratings + '%'
                    },
                    style: {
                        fill: '#000',
                    },
                },
                tooltip: {
                    formatter: (originData) => {
                        return { name: '占比', value: originData.Ratings + '%' }
                    },
                },
                xAxis: {
                    label: {
                        autoHide: true,
                        autoRotate: false,
                    },
                },
                yAxis: {
                    min: 0,
                    max: 20,
                    label: {
                        formatter: (originData) => `${originData}%`,
                    },
                },
                meta: {
                    language: {
                        alias: '编程语言',
                    },
                    Ratings: {
                        alias: '占比',
                    },
                },
            })

            columnPlot.render()
        },
        // 图表高度
        getHeight() {
            let height = parseInt(this.Height)
            return { height: height + 'px' }
        },
    },
}
</script>

<style>
</style>