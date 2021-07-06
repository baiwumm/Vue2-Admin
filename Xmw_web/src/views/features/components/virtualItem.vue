<template>
    <div class="virtualItem">
        <div class="id">{{ source.id }} - {{ source.text }}</div>
    </div>
</template>

<script>
export default {
    name: 'virtualItem',
    props: {
        source: {
            type: Object,
            default() {
                return {}
            },
        },
    },
}
</script>

<style scoped>
.virtualItem {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid lightgrey;
    padding: 1em;
}
</style>