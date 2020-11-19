
<template>
    <div id="initRadarPlot" :style="getHeight()"></div>
</template>

<script>
import { Radar } from '@antv/g2plot'
import { DataSet } from '@antv/data-set'
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
            const { DataView } = DataSet
            const dv = new DataView().source(this.value)
            dv.transform({
                type: 'fold',
                fields: ['a', 'b'], // 展开字段集
                key: 'user', // key字段
                value: 'score', // value字段
            })
            const radarPlot = new Radar('initRadarPlot', {
                data: dv.rows,
                xField: 'item',
                yField: 'score',
                seriesField: 'user',
                meta: {
                    score: {
                        alias: '分数',
                        min: 0,
                        max: 80,
                    },
                },
                xAxis: {
                    line: null,
                    tickLine: null,
                    grid: {
                        line: {
                            style: {
                                lineDash: null,
                            },
                        },
                    },
                },
                yAxis: {
                    line: null,
                    tickLine: null,
                    grid: {
                        line: {
                            type: 'line',
                            style: {
                                lineDash: null,
                            },
                        },
                        alternateColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
                // 开启面积
                area: {},
                // 开启辅助点
                point: {},
            })

            radarPlot.render()
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