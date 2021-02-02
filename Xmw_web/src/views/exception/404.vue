<template>
    <a-result status="404" title="404" sub-title="抱歉，你的页面丢失了!.">
        <template #extra>
            <a-button type="primary" @click="toHome"> 返回首页 </a-button>
        </template>
    </a-result>
</template>

<script>
export default {
    name: 'Exception404',
    methods: {
        toHome() {
            this.$router.push({ path: '/' })
        },
    },
}
</script>
