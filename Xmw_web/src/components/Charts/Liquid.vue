<template>
    <div id="Liquid"></div>
</template>

<script>
import { Liquid } from '@antv/g2plot'
export default {
    name: 'Liquid',
    props: {
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
            const liquidPlot = new Liquid('Liquid', {
                height: this.Height,
                percent: 0.25,
                outline: {
                    border: 4,
                    distance: 8,
                },
                wave: {
                    length: 128,
                },
            })
            liquidPlot.render()
        },
    },
}
</script>
