<template>
    <div id="linechart" :style="getHeight()"></div>
</template>

<script>
import { Line } from '@antv/g2plot'
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
    mounted() {
        this.showLine()
    },
    methods: {
        showLine() {
            let data = this.value
            this.linePlot = new Line('linechart', {
                data,
                xField: 'year',
                yField: 'value',
                // 自定义折线颜色
                color: '#FE740C',
                // 更改辅助数据点大小及样式
                point: {
                    size: 5,
                    shape: 'diamond',
                    style: {
                        stroke: '#FE740C',
                        lineWidth: 2,
                        fillOpacity: 0.6,
                    },
                },
                yAxis: {
                    // 格式化 y 轴标签加单位，自定义 labal 样式
                    label: {
                        formatter: (v) => {
                            return v + 'k'
                        },
                        style: {
                            fill: '#FE740C',
                        },
                    },
                },
                // 添加label
                label: {
                    fill: '#FE740C',
                },
                // 添加辅助文本、辅助线
                annotations: [
                    {
                        type: 'text',
                        position: ['min', 'median'],
                        content: '辅助标记',
                        offsetY: -4,
                        style: {
                            textBaseline: 'bottom',
                        },
                    },
                    {
                        type: 'line',
                        start: ['min', 'median'],
                        end: ['max', 'median'],
                        style: {
                            stroke: 'red',
                            lineDash: [2, 2],
                        },
                    },
                ],
            })

            this.linePlot.render()
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