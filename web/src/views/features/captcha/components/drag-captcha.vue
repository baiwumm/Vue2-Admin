<template>
  <div
    ref="dragVerify"
    class="drag_verify"
    :style="dragVerifyStyle"
    @mousemove="dragMoving"
    @mouseup="dragFinish"
    @mouseleave="dragFinish"
  >
    <div ref="progressBar" class="dv_progress_bar" :class="{ goFirst2: isOk }" :style="progressBarStyle"></div>
    <div ref="message" class="dv_text" :style="textStyle">
      <div
        class="dv_text_box"
        :style="{
          color: isPassing ? '#fff' : textColor
        }"
      >
        <a-icon :type="isPassing ? 'unlock' : 'lock'" />
        {{ messageTip }}
      </div>
    </div>

    <div ref="handler" class="dv_handler" :class="{ goFirst: isOk }" :style="handlerStyle" @mousedown="dragStart">
      <a-icon
        :type="isPassing ? successIcon : handlerIcon"
        :style="{ color: isPassing ? completedBg : undefined, fontSize: '14px' }"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { divide, round, subtract } from 'lodash-es'
export default {
  name: 'DragCaptcha',
  props: {
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
    }
  },
  data() {
    return {
      isPassing: false,
      isMoving: false, // 是否处于拖动状态
      x: 0, // 鼠标当前位置
      isOk: false, // 是否验证成功
      startTime: 0, // 开始时间
      endTime: 0 // 结束时间
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
      return this.isPassing ? this.successText : this.text
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
    // 拖动时的样式
    progressBarStyle() {
      return {
        background: this.progressBarBg,
        height: `${this.height}px`,
        borderRadius: this.circle ? `${this.height / 2}px 0 0 ${this.height / 2}px` : this.radius,
        backgroundColor: this.completedBg
      }
    },
    // 文字样式
    textStyle() {
      return {
        height: `${this.height}px`,
        width: `${this.width}px`,
        fontSize: this.textSize
      }
    }
  },
  methods: {
    // 拖拽开始回调
    dragStart(e) {
      if (!this.isPassing) {
        // 记录开始时间
        this.startTime = dayjs().valueOf()
        this.isMoving = true
        this.x = e.pageX
      }
      this.$emit('handlerMove')
    },
    // 拖拽移动回调
    dragMoving(e) {
      if (this.isMoving && !this.isPassing) {
        const diffX = e.pageX - this.x
        if (diffX > 0 && diffX <= this.width - this.height) {
          this.$refs.handler.style.left = `${diffX}px`
          this.$refs.progressBar.style.width = `${diffX + this.height / 2}px`
        } else if (diffX > this.width - this.height) {
          this.$refs.handler.style.left = `${this.width - this.height}px`
          this.$refs.progressBar.style.width = `${this.width - this.height / 2}px`
          this.passVerify()
        }
      }
    },
    // 拖拽结束回调
    dragFinish(e) {
      if (this.isMoving && !this.isPassing) {
        const diffX = e.pageX - this.x
        if (diffX < this.width - this.height) {
          this.isOk = true
          setTimeout(() => {
            this.$refs.handler.style.left = '0'
            this.$refs.progressBar.style.width = '0'
            this.isOk = false
          }, 500)
          this.$emit('passfail')
        } else {
          this.$refs.handler.style.left = `${this.width - this.height}px`
          this.$refs.progressBar.style.width = `${this.width - this.height / 2}px`
          this.passVerify()
        }
        this.isMoving = false
      }
    },
    // 验证通过回调
    passVerify() {
      this.isPassing = true
      this.endTime = dayjs().valueOf()
      this.isMoving = false
      this.$refs.message.style['-webkit-text-fill-color'] = 'unset'
      this.$refs.message.style.animation = 'slidetounlock2 3s infinite'
      this.$refs.dragVerify.style.setProperty('--textColor', '#fff')
      this.$emit('passcallback', round(divide(subtract(this.endTime, this.startTime), 1000), 2))
    },
    // 重置状态
    reset() {
      this.isPassing = false
      this.isMoving = false
      this.x = 0
      this.isOk = false
      this.$refs.handler.style.left = '0'
      this.$refs.progressBar.style.width = '0'
      this.$refs.dragVerify.style.setProperty('--textColor', this.textColor)
      this.$refs.message.style['-webkit-text-fill-color'] = 'transparent'
      this.$refs.message.style.animation = 'slidetounlock 3s infinite'
      this.$refs.message.style.color = this.background
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
  text-align: center;
  overflow: hidden;
  user-select: none;
  background-color: rgb(203 213 225);
  .dv_progress_bar {
    position: absolute;
    width: 0;
    height: 0;
  }
  .dv_text {
    position: absolute;
    top: 0;
    user-select: none;
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
    &_box {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
    }
  }
  .dv_handler {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: move;
  }
}
.goFirst {
  left: 0px !important;
  transition: left 0.5s;
}
.goFirst2 {
  width: 0px !important;
  transition: width 0.5s;
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
