<template>
  <div class="drag-verify-container">
    <div :style="dragVerifyImgStyle">
      <img
        ref="checkImg"
        :src="imgSrc"
        class="check-img"
        :class="{ goOrigin: isOk }"
        :style="imgStyle"
        @load="checkimgLoaded"
      />
      <div v-if="showTips && isPassing" class="tips success">{{ successTip }}</div>
      <div v-if="showTips && !isPassing && showErrorTip" class="tips danger">{{ failTip }}</div>
    </div>
    <div
      ref="dragVerify"
      class="drag_verify"
      :style="dragVerifyStyle"
      @mousemove="dragMoving"
      @mouseup="dragFinish"
      @mouseleave="dragFinish"
      @touchmove="dragMoving"
      @touchend="dragFinish"
    >
      <div ref="progressBar" class="dv_progress_bar" :class="{ goFirst2: isOk }" :style="progressBarStyle">
        {{ successMessage }}
      </div>
      <div ref="message" class="dv_text" :style="textStyle">
        {{ messageTip }}
      </div>

      <div
        ref="handler"
        class="dv_handler dv_handler_bg flex items-center justify-center"
        :class="{ goFirst: isOk }"
        :style="handlerStyle"
        @mousedown="dragStart"
        @touchstart="dragStart"
      >
        <a-icon
          :type="isPassing ? successIcon : handlerIcon"
          :style="{ color: isPassing ? completedBg : undefined, fontSize: '14px' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { divide, round, subtract } from 'lodash-es'
export default {
  name: 'RotateCaptcha',
  props: {
    imgSrc: {
      type: String,
      default: '' // 图片地址
    },
    width: {
      type: Number,
      default: 250 // 宽度
    },
    height: {
      type: Number,
      default: 40 // 高度
    },
    text: {
      type: String,
      default: '请按住滑块拖动' // 验证码文本
    },
    successText: {
      type: String,
      default: '验证通过' // 验证通过文字
    },
    background: {
      type: String,
      default: '#eee' // 背景色
    },
    progressBarBg: {
      type: String,
      default: '#76c61d' // 滑块背景色
    },
    completedBg: {
      type: String,
      default: '#76c61d' // 验证成功背景色
    },
    circle: {
      type: Boolean,
      default: false // 是否为圆形
    },
    radius: {
      type: String,
      default: '4px' // 圆角
    },
    handlerIcon: {
      type: String,
      default: 'double-right' // 滑块图标
    },
    successIcon: {
      type: String,
      default: 'check-circle' // 验证通过图标
    },
    handlerBg: {
      type: String,
      default: '#fff' // 滑块背景色
    },
    textSize: {
      type: String,
      default: '14px' // 文字大小
    },
    textColor: {
      type: String,
      default: '#333' // 文字颜色
    },
    showTips: {
      type: Boolean,
      default: true // 是否显示底部提示
    },
    successTip: {
      type: String,
      default: '验证通过' // 验证通过提示
    },
    failTip: {
      type: String,
      default: '验证失败' // 验证失败提示
    },
    diffDegree: {
      type: Number,
      default: 10 // 在此范围内松开计算验证成功(单位°)
    },
    minDegree: {
      type: Number,
      default: 90 // 最小旋转角度
    },
    maxDegree: {
      type: Number,
      default: 200 // 最大旋转角度
    }
  },
  data() {
    return {
      isPassing: false,
      isMoving: false,
      x: 0,
      isOk: false,
      showBar: false,
      showErrorTip: false,
      ranRotate: 0,
      cRotate: 0,
      imgStyle: {},
      startTime: 0,
      endTime: 0
    }
  },
  computed: {
    // 滑块样式
    handlerStyle() {
      return {
        width: `${this.height}px`,
        height: `${this.height}px`,
        background: this.handlerBg
      }
    },
    // 提示语
    messageTip() {
      return this.isPassing ? '' : this.text
    },
    // 成功提示语
    successMessage() {
      return this.isPassing ? this.successText : ''
    },
    // 拖拽样式
    dragVerifyStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        lineHeight: `${this.height}px`,
        background: this.background,
        borderRadius: this.circle ? `${this.height / 2}px` : this.radius
      }
    },
    // 拖拽图片样式
    dragVerifyImgStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.width}px`,
        position: 'relative',
        overflow: 'hidden',
        'border-radius': '50%'
      }
    },
    // 拖动时的样式
    progressBarStyle() {
      return {
        background: this.progressBarBg,
        height: `${this.height}px`,
        borderRadius: this.circle ? `${this.height / 2}px 0 0 ${this.height / 2}px` : this.radius
      }
    },
    // 文字样式
    textStyle() {
      return {
        height: `${this.height}px`,
        width: `${this.width}px`,
        fontSize: this.textSize
      }
    },
    // 避免指定旋转角度时一直拖动到最右侧才验证通过
    factor() {
      if (this.minDegree === this.maxDegree) {
        return Math.floor(1 + Math.random() * 6) / 10 + 1
      }
      return 1
    }
  },
  methods: {
    checkimgLoaded() {
      this.ranRotate = Math.floor(this.minDegree + Math.random() * (this.maxDegree - this.minDegree)) // 生成随机角度
      this.imgStyle = {
        transform: `rotateZ(${this.ranRotate}deg)`
      }
    },
    // 拖拽开始回调
    dragStart(e) {
      if (!this.isPassing) {
        // 记录开始时间
        this.startTime = dayjs().valueOf()
        this.isMoving = true
        this.x = e.pageX || e.touches[0].pageX
      }
      this.showBar = true
      this.showErrorTip = false
      this.$emit('move')
    },
    // 拖拽移动回调
    dragMoving(e) {
      if (this.isMoving && !this.isPassing) {
        const diffX = (e.pageX || e.touches[0].pageX) - this.x
        this.$refs.handler.style.left = `${diffX}px`
        this.$refs.progressBar.style.width = `${diffX + this.height / 2}px`
        const cRotate = Math.ceil((diffX / (this.width - this.height)) * this.maxDegree * this.factor)
        this.cRotate = cRotate
        const rotate = this.ranRotate - cRotate
        this.imgStyle = {
          transform: `rotateZ(${rotate}deg)`
        }
      }
    },
    // 拖拽结束回调
    dragFinish(e) {
      if (this.isMoving && !this.isPassing) {
        if (Math.abs(this.ranRotate - this.cRotate) > this.diffDegree) {
          this.isOk = true
          this.imgStyle = {
            transform: `rotateZ(${this.ranRotate}deg)`
          }
          setTimeout(() => {
            this.$refs.handler.style.left = '0'
            this.$refs.progressBar.style.width = '0'
            this.isOk = false
          }, 500)
          this.showErrorTip = true
          // 失败回调
          this.$emit('fail')
        } else {
          // 验证通过回调
          this.passVerify()
        }
        this.isMoving = false
      }
    },
    // 验证通过回调
    passVerify() {
      this.endTime = dayjs().valueOf()
      this.isPassing = true
      this.isMoving = false
      this.$refs.progressBar.style.background = this.completedBg
      this.$refs.message.style['-webkit-text-fill-color'] = 'unset'
      this.$refs.message.style.animation = 'slidetounlock2 3s infinite'
      this.$refs.progressBar.style.color = '#fff'
      this.$refs.progressBar.style.fontSize = this.textSize
      this.$emit('success', round(divide(subtract(this.endTime, this.startTime), 1000), 2))
    },
    // 重置图片
    reImg() {
      // 使用 $options.data 创建一个新的数据对象，这将会是组件初始化时 data 的状态
      const initialData = this.$options.data.call(this)

      // 使用 Object.assign 或者展开运算符（...）来替换现有 data 中的属性
      // Object.assign 方法会覆盖现有属性值为初始值
      Object.assign(this.$data, initialData)

      this.$refs.handler.style.left = '0'
      this.$refs.progressBar.style.width = '0'
      this.$refs.message.style['-webkit-text-fill-color'] = 'transparent'
      this.$refs.message.style.animation = 'slidetounlock 3s infinite'
      this.$refs.message.style.color = this.background
    },
    // 重置状态
    reset() {
      this.reImg()
      this.checkimgLoaded()
    }
  },
  mounted() {
    this.$refs.dragVerify.style.setProperty('--textColor', this.textColor)
    this.$refs.dragVerify.style.setProperty('--width', `${Math.floor(this.width / 2)}px`)
    this.$refs.dragVerify.style.setProperty('--pwidth', `${-Math.floor(this.width / 2)}px`)
  }
}
</script>

<style lang="less" scoped>
.drag_verify {
  position: relative;
  background-color: #e8e8e8;
  text-align: center;
  overflow: hidden;
}
.drag_verify .dv_handler {
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: move;
}
.drag_verify .dv_handler i {
  color: #666;
  padding-left: 0;
  font-size: 16px;
}
.drag_verify .dv_handler .el-icon-circle-check {
  color: #6c6;
  margin-top: 9px;
}
.drag_verify .dv_progress_bar {
  position: absolute;
  height: 34px;
  width: 0px;
}
.drag_verify .dv_text {
  position: absolute;
  top: 0px;
  color: transparent;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, var(--textColor)),
    color-stop(0.4, var(--textColor)),
    color-stop(0.5, #fff),
    color-stop(0.6, var(--textColor)),
    color-stop(1, var(--textColor))
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-size-adjust: none;
  animation: slidetounlock 3s infinite;
}
.drag_verify .dv_text * {
  -webkit-text-fill-color: var(--textColor);
}
.goFirst {
  left: 0px !important;
  transition: left 0.5s;
}
.goOrigin {
  transition: transform 0.5s;
}
.goKeep {
  transition: left 0.2s;
}
.goFirst2 {
  width: 0px !important;
  transition: width 0.5s;
}
.drag-verify-container {
  position: relative;
  line-height: 0;
  border-radius: 50%;
}
.move-bar {
  position: absolute;
  z-index: 100;
}
.clip-bar {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
}
.refresh {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  font-size: 20px;
  z-index: 200;
}
.tips {
  position: absolute;
  bottom: 25px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  font-size: 12px;
  z-index: 200;
}
.tips.success {
  background: rgba(255, 255, 255, 0.6);
  color: green;
}
.tips.danger {
  background: rgba(0, 0, 0, 0.6);
  color: yellow;
}
.check-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>

<style>
@keyframes slidetounlock {
  0% {
    background-position: var(--pwidth) 0;
  }
  100% {
    background-position: var(--width) 0;
  }
}
@keyframes slidetounlock2 {
  0% {
    background-position: var(--pwidth) 0;
  }
  100% {
    background-position: var(--pwidth) 0;
  }
}
</style>
