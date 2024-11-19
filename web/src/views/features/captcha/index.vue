<template>
  <page-header-wrapper>
    <a-row :gutter="[20, 20]">
      <!-- 图形验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('generaCaptcha')">
          <a-row type="flex" justify="center">
            <a-space direction="vertical" align="center">
              <genera-captcha
                ref="generaCaptcha"
                :content-height="40"
                :content-width="160"
                :background-color-min="0"
                :background-color-max="255"
              />
              <a-input-search
                v-model="generaCode"
                :placeholder="I18nEntry(I18nCaptcha('generaCaptcha'))"
                :enter-button="I18nCaptcha('verify')"
                @search="validateGeneraCode"
              />
            </a-space>
          </a-row>
        </a-card>
      </a-col>
      <!-- 运算验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('operationCaptcha')">
          <a-row type="flex" justify="center">
            <a-space direction="vertical" align="center">
              <operation-captcha ref="operationCaptcha" :height="40" :width="160" />
              <a-input-search
                v-model="operationCode"
                :placeholder="I18nEntry(I18nCaptcha('operationCaptcha'))"
                :enter-button="I18nCaptcha('verify')"
                @search="validateOperationCode"
              />
            </a-space>
          </a-row>
        </a-card>
      </a-col>
      <!-- 滑块验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('dragCaptcha')">
          <a-row type="flex" justify="center">
            <drag-captcha ref="dragCaptcha" :width="300" @passcallback="onDragSuccess" />
            <a-button type="primary" block @click="onResetDrag" style="margin-top: 8px">{{
              $t(I18nGlobal.Reset)
            }}</a-button>
          </a-row>
        </a-card>
      </a-col>
      <!-- 图片旋转验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('rotateCaptcha')">
          <a-row type="flex" justify="center">
            <rotate-captcha ref="rotateCaptcha" :width="250" :img-src="rotateImgSrc" @success="onRotateSuccess" />
            <a-button type="primary" block @click="onResetRotate" style="margin-top: 8px">{{
              $t(I18nGlobal.Reset)
            }}</a-button>
          </a-row>
        </a-card>
      </a-col>
      <!-- 拼图验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('puzzleCaptcha')">
          <a
            slot="extra"
            type="link"
            href="https://github.com/javaLuo/vue-puzzle-vcode"
            target="_blank"
            rel="noopener noreferrer"
          >
            vue-puzzle-vcode
          </a>
          <a-row type="flex" justify="center">
            <puzzle-captcha
              ref="puzzleCaptcha"
              show
              :imgs="getRandomImg(20)"
              :slider-size="40"
              :canvas-width="300"
              :canvas-height="230"
              @success="onPuzzleSuccess"
            />
            <a-button type="primary" block @click="onResetPuzzle" style="margin-top: 8px">{{
              $t(I18nGlobal.Reset)
            }}</a-button>
          </a-row>
        </a-card>
      </a-col>
      <!-- 点选验证码 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :bordered="false" :title="I18nCaptcha('pointsCaptcha')">
          <a-row type="flex" justify="center">
            <points-captcha
              ref="pointsCaptcha"
              :imgs="getRandomImg(20)"
              :width="300"
              :height="230"
              @callback="onPointsSuccess"
            />
            <a-button type="primary" block @click="onResetPoints" style="margin-top: 8px">{{
              $t(I18nGlobal.Reset)
            }}</a-button>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>
<script>
import { toLower, toString } from 'lodash-es'

import { I18nCaptcha, I18nEntry, I18nGlobal } from '@/constant/i18n'
import { getRandomImg } from '@/utils'

import DragCaptcha from './components/drag-captcha' // 滑块验证码
import GeneraCaptcha from './components/genera-captcha' // 图形验证码
import OperationCaptcha from './components/operation-captcha' // 运算验证码
import PointsCaptcha from './components/points-captcha' // 点选验证码
import PuzzleCaptcha from './components/puzzle-captcha' // 拼图验证码
import RotateCaptcha from './components/rotate-captcha' // 图片旋转验证码
export default {
  name: 'Captcha',
  components: {
    GeneraCaptcha,
    OperationCaptcha,
    DragCaptcha,
    RotateCaptcha,
    PointsCaptcha,
    PuzzleCaptcha
  },
  data() {
    return {
      I18nCaptcha,
      I18nEntry,
      I18nGlobal,
      generaCode: '',
      operationCode: '',
      getRandomImg,
      rotateImgSrc: getRandomImg()
    }
  },
  methods: {
    // 图形验证码验证
    validateGeneraCode() {
      if (!this.generaCode) {
        this.$message.warning(I18nEntry(I18nCaptcha('generaCaptcha')))
      } else if (toLower(this.generaCode) !== toLower(this.$refs.generaCaptcha.result)) {
        this.$message.error(I18nCaptcha('error'))
      } else {
        this.$message.success(I18nCaptcha('success'))
      }
    },
    // 运算验证码验证
    validateOperationCode() {
      if (!this.operationCode) {
        this.$message.warning(I18nEntry(I18nCaptcha('operationCaptcha')))
      } else if (toString(this.operationCode) !== toString(this.$refs.operationCaptcha.result)) {
        this.$message.error(I18nCaptcha('error'))
      } else {
        this.$message.success(I18nCaptcha('success'))
      }
    },
    // 重置拖拽验证码
    onResetDrag() {
      this.$refs.dragCaptcha.reset()
    },
    // 拖拽成功回调
    onDragSuccess(seconds) {
      this.$message.success(this.$t('views.features.captcha.successSeconds', { seconds }))
    },
    // 重置图片旋转验证码
    onResetRotate() {
      this.rotateImgSrc = getRandomImg()
      this.$refs.rotateCaptcha.reset()
    },
    // 图片旋转成功回调
    onRotateSuccess(seconds) {
      this.$message.success(this.$t('views.features.captcha.successSeconds', { seconds }))
    },
    // 重置拼图验证码
    onResetPuzzle() {
      this.$refs.puzzleCaptcha.reset()
    },
    // 拼图验证成功回调
    onPuzzleSuccess() {
      this.$message.success(I18nCaptcha('success'))
    },
    // 重置点选验证码
    onResetPoints() {
      this.$refs.pointsCaptcha.refresh()
    },
    // 点选验证码回调
    onPointsSuccess(passing) {
      if (passing) {
        this.$message.success(I18nCaptcha('success'))
      } else {
        this.$message.error(I18nCaptcha('error'))
      }
    }
  }
}
</script>
