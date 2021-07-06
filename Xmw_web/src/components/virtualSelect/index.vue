<template>
    <jh-virtual-select
        :data="list"
        v-model="value"
        clearable
        multiple
        filterable
        placeholder="F12查看DOM渲染效果"
        :render="render"
    />
</template>

<script>
import Vue from 'vue'
import JhVirtualSelect from 'jh-virtual-select'
Vue.use(JhVirtualSelect)
export default {
    data() {
        return {
            list: [],
            value: '',
        }
    },
    methods: {
        render(data) {
            const div = document.createElement('div')
            div.textContent = `${data.label}-自定义`
            return div
        },
    },
    mounted() {
        for (let i = 1; i < 10000; i++) {
            this.list.push({
                value: i,
                label: '用户' + i,
            })
        }
    },
}
</script>

<style lang="less" scoped>
/deep/ .handler {
    width: 100%;
    .jh-virtual-select {
        width: 100%;
    }
}
</style>