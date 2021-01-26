<template>
    <!-- 详情页 -->
    <a-modal :footer="null" width="100%" :dialog-style="{ position: 'fixed', top: '0', left: '0' }" v-model="visible">
        <div class="article-container">
            <h1>{{ articleData.title }}</h1>
            <div class="describe">
                <div>
                    作者：<a-tag color="cyan">
                        {{ articleData.CnName }}
                    </a-tag>
                </div>
                <div>发布时间：{{ articleData.createTime }}</div>
            </div>
            <div class="content" v-html="articleData.content"></div>
        </div>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            articleData: {},
        }
    },
    methods: {
        showDetails(data) {
            let _this = this
            _this.visible = true
            _this.articleData = data
        },
    },
}
</script>

<style lang="less" scoped>
.article-container {
    width: 1200px;
    margin: 0 auto;
    height: calc(100vh - 48px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    h1 {
        color: #333;
        font-weight: bold;
        text-align: center;
    }
    .describe {
        text-align: right;
        font-size: 14px;
        color: #000;
    }
    .content {
        margin-top: 10px;
    }
}
</style>