<template>
    <page-header-wrapper
        content="登录页调用了阿里云的智能验证,验证码是一种比较常见的区分用户是计算机还是人的手段,主要是为了保证项目的安全,单纯前端的验证是不安全的，因为可以直接通过接口请求"
    >
        <a-row :gutter="20">
            <!-- 常规验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="常规验证码">
                    <a-row type="flex" justify="center" align="middle" :gutter="10">
                        <a-col flex="60px">验证码:</a-col>
                        <a-col flex="auto"><a-input v-model="generaCode" placeholder="请输入验证码"> </a-input></a-col>
                        <a-col flex="120px">
                            <div @click="refreshCode">
                                <genera-verify
                                    :identifyCode="identifyCode"
                                    :contentHeight="40"
                                    :backgroundColorMin="0"
                                    :backgroundColorMax="255"
                                ></genera-verify>
                            </div>
                        </a-col>
                        <a-col :span="24" style="margin-top: 10px">
                            <a-button type="primary" block @click="validateGeneraCode('generaVerify')">验证</a-button>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
            <!-- 运算验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="运算验证码">
                    <operation-verify height="40px" ref="operationVerify"></operation-verify>
                    <a-button
                        type="primary"
                        block
                        @click="validateGeneraCode('operationVerify')"
                        style="margin-top: 10px"
                        >验证</a-button
                    >
                </a-card>
            </a-col>
            <!-- 滑块验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="滑块验证码">
                    <slide-verify ref="slideVerify"></slide-verify>
                    <a-button type="primary" block @click="validateGeneraCode('slideVerify')" style="margin-top: 10px"
                        >验证</a-button
                    >
                </a-card>
            </a-col>
            <!-- 图形验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="图形验证码">
                    <graphics-verify
                        ref="graphicsVerify"
                        :l="42"
                        :r="10"
                        :w="310"
                        :h="155"
                        :imgs="imgList"
                        slider-text="向右滑动"
                        @success="graphicsSuccess"
                        @fail="graphicsFail"
                        @again="graphicsAgain"
                    ></graphics-verify>
                    <a-button
                        type="primary"
                        block
                        @click="validateGeneraCode('graphicsVerify')"
                        style="margin-top: 10px"
                        >验证</a-button
                    >
                </a-card>
            </a-col>
            <!-- 文字点选验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="文字点选验证码">
                    <points-verify
                        @callback="validateGeneraCode('pointsVerify', arguments)"
                        :imgArr="imgList"
                    ></points-verify>
                </a-card>
            </a-col>
            <!-- 模拟手机发送验证码 -->
            <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="模拟手机发送验证码">
                    <phone-verify ref="phoneVerify"></phone-verify>
                    <a-button type="primary" block @click="validateGeneraCode('phoneVerify')" style="margin-top: 10px"
                        >验证</a-button
                    >
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import { _code_chars, randomNum } from '@/utils/util'
import generaVerify from './components/Verification/generaVerify' // 常规验证码
import operationVerify from './components/Verification/operationVerify' // 运算验证码
import slideVerify from './components/Verification/slideVerify' // 滑块验证码
import graphicsVerify from './components/Verification/graphicsVerify' // 图形验证码
import pointsVerify from './components/Verification/pointsVerify' // 文字点选验证码
import phoneVerify from './components/Verification/phoneVerify' // 模拟手机发送验证码
export default {
    name: 'verify',
    components: { generaVerify, operationVerify, slideVerify, graphicsVerify, pointsVerify, phoneVerify },
    data() {
        return {
            // 常规验证码
            identifyCode: '',
            generaCode: '',
            imgList: [
                require('@/assets/images/studio_0001.jpg'),
                require('@/assets/images/studio_0002.jpg'),
                require('@/assets/images/studio_0003.jpg'),
                require('@/assets/images/studio_0004.jpg'),
                require('@/assets/images/studio_0005.jpg'),
                require('@/assets/images/studio_0006.jpg'),
            ],
            graphicsMsg: '',
        }
    },
    methods: {
        refreshCode() {
            this.identifyCode = ''
            this.makeCode(_code_chars, 4)
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += _code_chars[randomNum(0, _code_chars.length)]
            }
        },
        // 图形验证码成功回调
        graphicsSuccess(times) {
            this.graphicsMsg = `验证成功, 耗时${(times / 1000).toFixed(1)}s`
        },
        // 图形验证码失败回调
        graphicsFail() {
            this.graphicsMsg = ''
        },
        graphicsAgain() {
            this.$message.warning('检测到非人为操作!')
            this.$refs.graphicsVerify.reset()
        },
        // 验证码验证
        validateGeneraCode(code, vals) {
            let _this = this
            switch (code) {
                // 常规验证码
                case 'generaVerify':
                    if (!_this.generaCode) _this.$message.warning('请输入验证码!')
                    else if (_this.generaCode.toUpperCase() != _this.identifyCode.toUpperCase())
                        _this.$message.error('验证码错误!')
                    else _this.$message.success('验证成功!')
                    _this.refreshCode()
                    break
                // 运算验证码
                case 'operationVerify':
                    this.$refs.operationVerify.checkCode()
                    break
                // 滑块验证码
                case 'slideVerify':
                    this.$refs.slideVerify.checkCode()
                    break
                // 图像验证码
                case 'graphicsVerify':
                    if (!this.graphicsMsg) _this.$message.error('验证失败!')
                    else _this.$message.success(this.graphicsMsg)
                    _this.$refs.graphicsVerify.reset()
                    break
                // 文字点选验证
                case 'pointsVerify':
                    if (vals) {
                        if (vals[0]) _this.$message.success(vals[1])
                        else _this.$message.error(vals[1])
                    } else {
                        _this.$message.warning('请完成选字验证')
                    }
                    break
                // 模拟手机发送验证码
                case 'phoneVerify':
                    this.$refs.phoneVerify.checkCode()
                    break
            }
        },
    },
    mounted() {
        this.refreshCode()
    },
}
</script>

<style lang="less" scoped>
.ant-card /deep/ .ant-card-body {
    margin-bottom: 20px;
}
</style>