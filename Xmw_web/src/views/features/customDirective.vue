<template>
    <page-header-wrapper content="自定义一些实用的Vue指令，系统的按钮权限就是用了自定义的指令v-action控制。">
        <a-row :gutter="20">
            <!-- 复制粘贴指令 v-copy -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="复制粘贴指令 v-copy">
                    <a-input-search placeholder="请输入内容" v-model="copyText">
                        <a-button slot="enterButton" type="primary" v-copy="copyText"> 复制 </a-button>
                    </a-input-search>
                </a-card>
            </a-col>
            <!-- 长按指令 v-longpress -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="长按指令 v-longpress">
                    <a-button type="primary" v-longpress="{ callback: longpress, time: longpressTime }" block>
                        长按此按钮
                    </a-button>
                </a-card>
            </a-col>
            <!-- 防抖指令 v-debounce -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="输入框防抖指令 v-debounce">
                    <a-button type="primary" v-debounce="{ callback: debounceClick, time: debounceTime }" block>
                        防抖
                    </a-button>
                </a-card>
            </a-col>
            <!-- 节流指令 v-throllte -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="节流指令 v-throllte">
                    <a-button type="primary" v-throllte="{ callback: throllteClick, time: throllteTime }" block>
                        节流
                    </a-button>
                </a-card>
            </a-col>
            <!-- 禁止表情及特殊字符 v-emoji -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="禁止表情及特殊字符 v-emoji">
                    <a-input placeholder="尝试输入表情及特殊字符" v-emoji />
                </a-card>
            </a-col>
            <!-- 图片懒加载 v-LazyLoad -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="图片懒加载 v-LazyLoad">
                    <router-link to="/features/lazyLoad">
                        <a-button type="primary" block> 前往查看 </a-button>
                    </router-link>
                </a-card>
            </a-col>
            <!-- 权限校验指令 v-premission -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="权限校验指令 v-premission">
                    <a-button v-permission="'1'" type="primary" block>权限按钮1,权限按钮2已隐藏</a-button>
                    <a-button v-permission="'10'" type="primary">权限按钮2</a-button>
                </a-card>
            </a-col>
            <!-- 拖拽指令 v-draggable -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="拖拽指令 v-draggable" v-draggable>
                    <a-button type="primary" block> 拖拽 </a-button>
                </a-card>
            </a-col>
            <!-- 波纹指令 v-wave -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="波纹指令 v-wave">
                    <div class="wrapper" v-wave><a-button type="primary" block> 波纹 </a-button></div>
                </a-card>
            </a-col>
            <!-- 实现页面水印 v-waterMarker -->
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card :bordered="false" hoverable title="实现页面水印 v-waterMarker">
                    <div
                        style="height: 65px"
                        v-waterMarker="{ text: 'XmwPro版权所有', textColor: 'rgba(180, 180, 180, 0.4)' }"
                    ></div>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
export default {
    name: 'customDirective',
    data() {
        return {
            copyText: 'Vue XmwPro',
            longpressTime: 1000, //长按指令间隔时间,默认1s
            debounceTime: 1000, // 防抖指令间隔时间,默认1s
            throllteTime: 1000, // 节流指令间隔时间,默认1s
        }
    },
    methods: {
        longpress() {
            this.$message.success(`长按指令${this.longpressTime / 1000}s生效`)
        },
        debounceClick() {
            this.$message.success(`最后一次点击延迟${this.debounceTime / 1000}s后触发`)
        },
        throllteClick() {
            this.$message.success(`首次点击${this.throllteTime / 1000}s内只触发一次`)
        },
    },
}
</script>

<style lang="less" scoped>
.ant-card /deep/ .ant-card-body {
    margin-bottom: 20px;
}
</style>
<style>
.wave-ripple {
    position: absolute;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    background-clip: padding-box;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
    opacity: 1;
}

.wave-ripple.z-active {
    opacity: 0;
    -webkit-transform: scale(2);
    -ms-transform: scale(2);
    transform: scale(2);
    -webkit-transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, transform 0.6s ease-out, -webkit-transform 0.6s ease-out;
}
</style>