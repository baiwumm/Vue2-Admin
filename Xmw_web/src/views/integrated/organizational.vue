<template>
    <page-header-wrapper
        content="组织架构模块基于vue-org-tree，用来展示企业内部部门或上下级的树结构可视化架构图，支持水平垂直展示、子节点展开收缩、子节点右键编辑、自定义主题等。"
    >
        <div class="architecture">
            <a-card>
                <a-tabs default-active-key="department">
                    <a-tab-pane key="department" tab="组织管理">
                        <department></department>
                    </a-tab-pane>
                    <a-tab-pane key="architecture" tab="组织架构">
                        <architecture></architecture>
                    </a-tab-pane>
                </a-tabs>
            </a-card>
        </div>
    </page-header-wrapper>
</template>

<script>
import architecture from './components/architecture'
import department from './components/department'
export default {
    name: 'organizational',
    components: {
        architecture,
        department,
    },
}
</script>

<style>
</style>