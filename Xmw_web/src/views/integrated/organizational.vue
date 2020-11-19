<template>
    <div class="architecture">
        <a-card>
            <a-tabs default-active-key="architecture">
                <a-tab-pane key="department" tab="部门管理">
                    <department></department>
                </a-tab-pane>
                <a-tab-pane key="architecture" tab="组织架构">
                    <architecture></architecture>
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<script>
import architecture from './components/architecture'
import department from './components/department'
export default {
    components: {
        architecture,
        department,
    },
}
</script>

<style>
</style>