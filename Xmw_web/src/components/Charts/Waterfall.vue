<template>
    <div id="Waterfall"></div>
</template>

<script>
import { Waterfall } from '@antv/g2plot'
export default {
    name: 'Waterfall',
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
        this.initG2Plot()
    },
    methods: {
        initG2Plot() {
            const waterfallPlot = new Waterfall('Waterfall', {
                data: this.value,
                height: this.Height,
                xField: 'type',
                yField: 'money',
                appendPadding: [15, 0, 0, 0],
                meta: {
                    type: {
                        alias: '类别',
                    },
                    money: {
                        alias: '收支',
                        formatter: (v) => `${v} 元`,
                    },
                },
                label: {
                    style: { fontSize: 10, fill: 'rgba(0,0,0,0.65)' },
                    layout: [{ type: 'interval-adjust-position' }],
                },
                total: {
                    label: '总支出',
                    style: {
                        fill: '#96a6a6',
                    },
                },
            })
            waterfallPlot.render()
        },
    },
}
</script>
