<template>
    <page-header-wrapper
        content="虚拟列表是在大数据列表中应用的一种技术，主要是为了减少不可见区域不必要的渲染从而提高性能，特别是数据量在成千上万条效果尤为明显"
    >
        <a-row :gutter="16">
            <a-col :span="12">
                <a-card hoverable title="基于vue-virtual-scroll-list的虚拟列表">
                    <a
                        slot="extra"
                        href="https://github.com/tangbc/vue-virtual-scroll-list"
                        target="_blank"
                        style="font-size: 16px"
                        >vue-virtual-scroll-list</a
                    >
                    <virtual-list
                        class="list"
                        style="height: 360px; overflow-y: auto; border: 1px solid #cccccc"
                        :data-key="'id'"
                        :keeps="20"
                        :data-sources="getData(1000)"
                        :data-component="item"
                        :estimate-size="50"
                    >
                    </virtual-list>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card hoverable title="select下拉虚拟长列表">
                    <a
                        slot="extra"
                        href="https://gitee.com/zhkumsg/jh-virtual-select"
                        target="_blank"
                        style="font-size: 16px"
                        >jh-virtual-select</a
                    >
                    <virtualSelect :showNum="20"></virtualSelect>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import virtualItem from './components/virtualItem.vue'
import virtualSelect from '@/components/virtualSelect'
export default {
    components: {
        VirtualList,
        virtualSelect,
    },
    data() {
        return {
            item: virtualItem,
        }
    },
    methods: {
        getData(count) {
            const data = []
            for (let index = 0; index < count; index++) {
                data.push({
                    id: '测试数据-' + index,
                    text: Math.random().toString(16).substr(10),
                })
            }
            return data
        },
    },
}
</script>

<style lang="less" scoped>
.virtualList {
    height: 500px;
}
</style>