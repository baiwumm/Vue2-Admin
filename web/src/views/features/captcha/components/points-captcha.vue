<template>
  <div :style="{ width: `${width}px`, position: 'relative', margin: '0 auto' }">
    <a-space direction="vertical" :size="20">
      <a-spin :spinning="loading">
        <div
          :style="{
            width: width,
            height: height,
            backgroundSize: width + ' ' + height,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `4px`
          }"
        >
          <div
            style="cursor: pointer; position: absolute; top: 10px; right: 10px; font-size: 16px; color: #fff"
            @click="refresh"
          >
            <a-icon type="reload" :spin="loading" />
          </div>
          <canvas
            ref="canvas"
            :width="width"
            :height="height"
            @click="result ? undefined : canvasClick($event)"
          ></canvas>

          <div
            v-for="(point, index) in checkPoints"
            :key="index"
            :style="{
              position: 'absolute',
              zIndex: 50,
              top: `${point.y}px`,
              left: `${point.x}px`
            }"
          >
            <a-button type="primary" shape="circle">{{ index + 1 }}</a-button>
          </div>
        </div>
      </a-spin>
      <!-- 画布下方提示 -->
      <a-alert :message="text" :type="showTip ? (result ? 'success' : 'error') : 'info'" />
    </a-space>
  </div>
</template>
<script>
import { difference, every, join, map, random, sample, shuffle } from 'lodash-es'

import { generateRandomHanziArray, randomColor } from '@/utils'
export default {
  name: 'PointsCaptcha',
  props: {
    width: {
      type: Number,
      default: 200 // 宽度
    },
    height: {
      type: Number,
      default: 300 // 高度
    },
    defaultNum: {
      type: Number,
      default: 4 // 默认的文字数量
    },
    checkNum: {
      type: Number,
      default: 3 // 校对的文字数量
    },
    imgs: {
      type: Array,
      default: () => [] // 图片数组，如果不传，则随机背景色
    },
    disturbLine: {
      type: Number,
      default: 5 // 干扰线数量，0为不绘制
    },
    disturbPoint: {
      type: Number,
      default: 20 // 干扰点数量，0为不绘制
    },
    fontSizeMin: {
      type: Number,
      default: 25 // 字体最小值
    },
    fontSizeMax: {
      type: Number,
      default: 35 // 字体最大值
    },
    range: {
      type: Number,
      default: 40 // 校验的容错范围，数值越大，越容易校验通过
    },
    successText: {
      type: String,
      default: '验证通过' // 校验通过显示的文字
    },
    errorText: {
      type: String,
      default: '验证失败' // 校验失败显示的文字
    }
  },
  data() {
    return {
      canvasPoints: [], // 画布生成的坐标信息
      checkPoints: [], // 用户点击的坐标
      text: '刷新中...', // 按钮显示的文字
      result: false, // 校验结果
      showTip: false, // 是否显示结果提示
      loading: false // 是否加载中
    }
  },
  methods: {
    drawLine(ctx) {
      // 绘制干扰线
      for (let i = 0; i < this.disturbLine; i += 1) {
        ctx.strokeStyle = randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(random(0, this.width), random(0, this.height))
        ctx.lineTo(random(0, this.width), random(0, this.height))
        ctx.stroke()
      }
    },
    drawPoint(ctx) {
      for (let i = 0; i < this.disturbPoint; i += 1) {
        ctx.fillStyle = randomColor()
        ctx.beginPath()
        ctx.arc(random(0, this.width), random(0, this.height), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    // 画布点选回调
    canvasClick(e) {
      // 判断用户点击的坐标是否大于校对的数量
      if (this.checkPoints.length < this.checkNum) {
        // 记录用户点击的坐标
        this.checkPoints.push(this.getMousePos(e))
      }
      // 如果校对数量相同，则校验结果
      if (this.checkPoints.length === this.checkNum) {
        setTimeout(() => {
          // 校验结果
          const result = this.comparePoints(this.canvasPoints, this.checkPoints)
          if (!result) {
            // 验证失败
            this.text = this.errorText
            this.result = false
            this.showTip = true
            this.$emit('callback', result)
            setTimeout(() => {
              this.refresh()
            }, 400)
          } else {
            // 验证成功
            this.text = this.successText
            this.result = true
            this.showTip = true
            this.$emit('callback', result)
          }
        }, 400)
      }
    },
    // 绘制合成的图片
    drawImg(img) {
      // 准备canvas环境
      const ctx = this.$refs.canvas.getContext('2d')

      if (img) {
        // 确保图片不变形
        const canvasWidth = this.width
        const canvasHeight = this.height
        const imgWidth = img.width
        const imgHeight = img.height

        // 计算宽高比
        const imageAspectRatio = imgWidth / imgHeight
        const canvasAspectRatio = canvasWidth / canvasHeight

        let sx = 0
        let sy = 0
        let sw = imgWidth
        let sh = imgHeight
        const dx = 0
        const dy = 0
        const dw = canvasWidth
        const dh = canvasHeight

        // 如果图片的宽高比大于画布的宽高比，则需要裁剪宽度
        if (imageAspectRatio > canvasAspectRatio) {
          sw = imgHeight * canvasAspectRatio
          sx = (imgWidth - sw) / 2
        } else {
          // 否则需要裁剪高度
          sh = imgWidth / canvasAspectRatio
          sy = (imgHeight - sh) / 2
        }
        // 绘制图片
        // ctx.drawImage(img, 0, 0, this.width, this.height);
        // 使用计算后的尺寸和位置绘制图片
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
      } else {
        // 绘制背景
        ctx.fillStyle = randomColor()
        ctx.fillRect(0, 0, this.width, this.height)
      }

      // 是否绘制干扰线
      if (this.disturbLine) {
        this.drawLine(ctx)
      }

      // 是否绘制干扰点
      if (this.disturbPoint) {
        this.drawPoint(ctx)
      }

      const fontStr = generateRandomHanziArray(this.defaultNum) // 不重复的汉字

      // 需要绘制的文字
      const fontChars = []

      // 开始绘制文字
      for (let i = 1; i <= this.defaultNum; i += 1) {
        // 加入不重复的文字
        fontChars[i - 1] = sample(difference(fontStr, fontChars))

        ctx.font = `${random(this.fontSizeMin, this.fontSizeMax)}px SimHei` // 随机生成字体大小
        ctx.fillStyle = randomColor()

        // 计算 x 坐标
        const margin = 20 // 容器边缘留白
        const textWidth = ctx.measureText(fontChars[i - 1]).width
        const x = Math.floor(this.width / this.defaultNum) * i - textWidth - margin
        const y = random(margin + textWidth, this.height - margin)

        ctx.fillText(fontChars[i - 1], x, y)
        this.canvasPoints[i - 1] = { char: fontChars[i - 1], x, y }
      }

      for (let i = 0; i < this.defaultNum - this.checkNum; i += 1) {
        this.canvasPoints = this.shuffleAndPopArray(this.canvasPoints)
      }

      // 设置提示语
      this.text = `请顺序点击【${join(map(this.canvasPoints, 'char'), ',')}】`

      return this.canvasPoints
    },
    // 打乱数组，并删除最后一个元素
    shuffleAndPopArray(arr) {
      // 使用 _.shuffle 方法打乱数组
      const shuffledArray = shuffle(arr)
      // 删除最后一个元素
      shuffledArray.pop()
      return shuffledArray
    },
    // 获取坐标
    getMousePos(e) {
      const x = e.offsetX - 5
      const y = e.offsetY - 5
      return { x, y }
    },
    // 判断点选结果
    comparePoints(canvasPoints, checkPoints) {
      const range = this.range
      function isWithinRange(point, checkPoint) {
        const dx = Math.abs(point.x - checkPoint.x)
        const dy = Math.abs(point.y - checkPoint.y)
        return dx <= range && dy <= range
      }
      return every(canvasPoints, (point, index) => isWithinRange(point, checkPoints[index]))
    },
    // 刷新状态
    refresh() {
      // 使用 $options.data 创建一个新的数据对象，这将会是组件初始化时 data 的状态
      const initialData = this.$options.data.call(this)

      // 使用 Object.assign 或者展开运算符（...）来替换现有 data 中的属性
      // Object.assign 方法会覆盖现有属性值为初始值
      Object.assign(this.$data, initialData)

      // 判断是否有传图片
      if (this.imgs.length) {
        const img = new Image()
        // 获取随机一张图片
        img.src = sample(this.imgs)
        // 加载完成开始绘制
        this.loading = true
        img.onload = async () => {
          this.$nextTick(() => {
            this.canvasPoints = this.drawImg(img)
            this.loading = false
          })
        }
      } else {
        this.canvasPoints = this.drawImg()
      }
    }
  },
  mounted() {
    this.refresh()
  }
}
</script>
