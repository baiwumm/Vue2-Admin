<template>
  <canvas id="operation-canvas" :width="width" :height="height" @click="drawCanvas" style="cursor: pointer" />
</template>
<script>
import { add, multiply, random, subtract } from 'lodash-es'

import { randomColor } from '@/utils'
export default {
  name: 'OperationCaptcha',
  props: {
    figure: {
      type: Number,
      default: 100 // 默认是100以内的数字，即两位数
    },
    arith: {
      type: Number,
      validator: function (value) {
        return [0, 1, 2, 3].includes(value) // 只允许0, 1, 2, 3
      },
      default: 0 // 0为随机切换
    },
    width: {
      type: Number,
      default: 320 // 容器宽度
    },
    height: {
      type: Number,
      default: 60 // 容器高度
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
      const canvas = document.getElementById('operation-canvas')
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = randomColor(180, 240)
      ctx.fillRect(0, 0, this.width, this.height)

      // 绘制干扰线
      this.drawLine(ctx)
      // 绘制干扰点
      this.drawDot(ctx)

      // 算法验证码
      let num1 = Math.floor(Math.random() * this.figure)
      let num2 = Math.floor(Math.random() * this.figure)

      let codeShow = ''
      // 算法运算符
      const tmparith = this.arith === 0 ? Math.floor(Math.random() * 3) : this.arith

      switch (tmparith) {
        case 1:
          this.result = add(num1, num2)
          codeShow = `${num1} + ${num2} = ?`
          break
        case 2:
          if (num1 < num2) {
            const tmpnum = num1
            num1 = num2
            num2 = tmpnum
          }
          this.result = subtract(num1, num2)
          codeShow = `${num1} - ${num2} = ?`
          break
        default:
          this.result = multiply(num1, num2)
          codeShow = `${num1} × ${num2} = ?`
          break
      }

      for (let i = 0; i < codeShow.length; i += 1) {
        // 随机生成字体颜色
        ctx.fillStyle = randomColor(50, 160)
        // 随机生成字体大小(0.5 - 0.75)高的范围
        ctx.font = `${random((this.height * 2) / 4, (this.height * 3) / 4)}px SimHei`
        // 字体对齐位置
        ctx.textBaseline = 'top'
        const x = i * ((this.width - 10) / codeShow.length)
        const y = random(5, this.height / 4)
        ctx.fillText(codeShow[i], x + 5, y)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawCanvas()
    })
  }
}
</script>
