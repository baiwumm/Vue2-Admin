Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@FollowTrend 
vueComponent
/
ant-design-vue-pro
231
6.8k2.1k
Code
Issues
67
Pull requests
1
Actions
Projects
1
Wiki
Security
Insights
ant-design-vue-pro/src/components/Charts/ChartCard.vue
@sendya
sendya reactor: v2
Latest commit 3d67e5d on 22 Mar 2019
 History
 1 contributor
120 lines (110 sloc)  2.2 KB
  
<template>
    <a-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false">
        <div class="chart-card-header">
            <div class="meta">
                <span class="chart-card-title">
                    <slot name="title">
                        {{ title }}
                    </slot>
                </span>
                <span class="chart-card-action">
                    <slot name="action"></slot>
                </span>
            </div>
            <div class="total">
                <slot name="total">
                    <span>{{ (typeof total === 'function' && total()) || total }}</span>
                </slot>
            </div>
        </div>
        <div class="chart-card-content">
            <div class="content-fix">
                <slot></slot>
            </div>
        </div>
        <div class="chart-card-footer">
            <div class="field">
                <slot name="footer"></slot>
            </div>
        </div>
    </a-card>
</template>

<script>
export default {
    name: 'ChartCard',
    props: {
        title: {
            type: String,
            default: '',
        },
        total: {
            type: [Function, Number, String],
            required: false,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="less" scoped>
.chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    .meta {
        position: relative;
        overflow: hidden;
        width: 100%;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
    }
}
.chart-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
}
.chart-card-footer {
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;
    > * {
        position: relative;
    }
    .field {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }
}
.chart-card-content {
    margin-bottom: 12px;
    position: relative;
    height: 46px;
    width: 100%;
    .content-fix {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }
}
.total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
}
</style>
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
