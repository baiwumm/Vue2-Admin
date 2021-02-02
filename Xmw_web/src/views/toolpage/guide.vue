<template>
    <page-header-wrapper content="引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能">
        <a-alert showIcon>
            <div slot="message" style="font-size: 18px">
                本项目基于 <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
            </div>
        </a-alert>
        <a-button type="primary" size="large" style="margin-top: 10px" @click.prevent.stop="guide">
            打开引导页
        </a-button>
    </page-header-wrapper>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
export default {
    name: 'guide',
    data() {
        return {
            driver: null,
            // 步骤
            steps: [
                {
                    element: '#menu-logo',
                    popover: {
                        title: 'logo标题',
                        description: '这里是该项目的logo和标题',
                        position: 'bottom',
                    },
                },
                {
                    element: '#header-search',
                    popover: {
                        title: '页面搜索',
                        description: '页面搜索，快速定位导航',
                        position: 'left',
                    },
                },
                {
                    element: '#lockScreen',
                    popover: {
                        title: '锁屏',
                        description: '当你长时间不操作时，你可以进行锁屏操作',
                        position: 'left',
                    },
                },
                {
                    element: '#AnnouncementList',
                    popover: {
                        title: '公告列表',
                        description: '你可以在这里看到管理员发布的公告',
                        position: 'left',
                    },
                },
                {
                    element: '#ant-pro-multi-tab',
                    popover: {
                        title: '多标签页',
                        description: '这里是你访问过的页面的历史',
                        position: 'bottom',
                    },
                },
            ],
        }
    },
    mounted() {
        this.driver = new Driver({
            className: 'scoped-class',
            animate: true,
            opacity: 0.75,
            padding: 0,
            allowClose: true,
            overlayClickNext: false,
            doneBtnText: '完成',
            closeBtnText: '关闭',
            nextBtnText: '下一步',
            prevBtnText: '上一步',
        })
    },
    methods: {
        guide() {
            this.driver.defineSteps(this.steps)
            this.driver.start()
        },
    },
}
</script>
<style>
div#driver-highlighted-element-stage,
div#driver-page-overlay {
    background: transparent !important;
    outline: 5000px solid rgba(0, 0, 0, 0.75);
}
</style>

