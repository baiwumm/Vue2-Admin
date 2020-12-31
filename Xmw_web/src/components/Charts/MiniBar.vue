<template>
    <div id="MiniBar"></div>
</template>

<script>
import { Column } from '@antv/g2plot'
export default {
    name: 'MiniBar',
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
            const columnPlot = new Column('MiniBar', {
                data: this.value,
                height: this.Height,
                xField: 'time',
                yField: 'total',
                label: null,
                xAxis: {
                    label: null,
                    grid: null,
                },
                yAxis: {
                    label: null,
                    grid: null,
                },
                meta: {
                    time: {
                        alias: '类别',
                    },
                    total: {
                        alias: '支付笔数',
                    },
                },
            })

            columnPlot.render()
        },
    },
}
</script>
