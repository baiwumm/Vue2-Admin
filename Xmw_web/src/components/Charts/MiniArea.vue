<template>
    <div id="MiniArea"></div>
</template>

<script>
import { Area } from '@antv/g2plot'
export default {
    name: 'MiniArea',
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
            const area = new Area('MiniArea', {
                data: this.value,
                height: this.Height,
                xField: 'time',
                yField: 'total',
                label: null,
                smooth: true,
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
                        alias: '访问量',
                    },
                },
            })
            area.render()
        },
    },
}
</script>
