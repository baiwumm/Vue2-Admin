<template>
  <canvas
    id="genera-captcha"
    :width="contentWidth"
    :height="contentHeight"
    style="cursor: pointer"
    @click="drawCanvas"
  />
</template>
<script>
import { join, random, times } from 'lodash-es'

import { codeChars, randomColor } from '@/utils'
export default {
  name: 'GeneraCaptcha',
  props: {
    fontSizeMin: {
      type: Number,
      default: 25 // 字体最小值
    },
    fontSizeMax: {
      type: Number,
      default: 35 // 字体最大值
    },
    backgroundColorMin: {
      type: Number,
      default: 200 // 验证码图片背景色最小值
    },
    backgroundColorMax: {
      type: Number,
      default: 229 // 验证码图片背景色最大值
    },
    contentWidth: {
      type: Number,
      default: 116 // 容器宽度
    },
    contentHeight: {
      type: Number,
      default: 38 // 容器高度
    },
    disturbLine: {
      type: Number,
      default: 4 // 干扰线数量，0为不绘制
    },
    disturbPoint: {
      type: Number,
      default: 30 // 干扰点数量，0为不绘制
    }
  },
  data() {
    return {
      result: ''
    }
  },
  methods: {
    drawText(ctx, txt, i) {
      ctx.fillStyle = randomColor() // 随机生成字体颜色
      ctx.font = `${random(this.fontSizeMin, this.fontSizeMax)}px SimHei` // 随机生成字体大小
      const x = (i + 1) * (this.contentWidth / (this.result.length + 1))
      const y = random(this.fontSizeMax, this.contentHeight - 5)
      const deg = random(-30, 30)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    },
    drawLine(ctx) {
      // 绘制干扰线
      for (let i = 0; i < this.disturbLine; i += 1) {
        ctx.strokeStyle = randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(random(0, this.contentWidth), random(0, this.contentHeight))
        ctx.lineTo(random(0, this.contentWidth), random(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot(ctx) {
      for (let i = 0; i < this.disturbPoint; i += 1) {
        ctx.fillStyle = randomColor()
        ctx.beginPath()
        ctx.arc(random(0, this.contentWidth), random(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    drawCanvas() {
      const canvas = document.getElementById('genera-captcha')
      const ctx = canvas.getContext('2d')
      this.result = join(
        times(4, () => codeChars[random(0, codeChars.length)]),
        ''
      )
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.result.length; i += 1) {
        this.drawText(ctx, this.result[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    }
  },
  mounted() {
    this.drawCanvas()
  }
}
</script>
