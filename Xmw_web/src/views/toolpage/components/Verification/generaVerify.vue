<template>
    <div class="s-canvas">
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
    </div>
</template>
<script>
import { randomNum, randomColor } from '@/utils/util'
export default {
    name: 'generaVerify',
    props: {
        identifyCode: {
            //默认注册码
            type: String,
            default: '1234',
        },
        fontSizeMin: {
            // 字体最小值
            type: Number,
            default: 25,
        },
        fontSizeMax: {
            // 字体最大值
            type: Number,
            default: 35,
        },
        backgroundColorMin: {
            // 验证码图片背景色最小值
            type: Number,
            default: 200,
        },
        backgroundColorMax: {
            // 验证码图片背景色最大值
            type: Number,
            default: 220,
        },
        dotColorMin: {
            // 背景干扰点最小值
            type: Number,
            default: 60,
        },
        dotColorMax: {
            // 背景干扰点最大值
            type: Number,
            default: 120,
        },
        contentWidth: {
            //容器宽度
            type: Number,
            default: 116,
        },
        contentHeight: {
            //容器高度
            type: Number,
            default: 38,
        },
    },
    methods: {
        drawPic() {
            let canvas = document.getElementById('s-canvas')
            let ctx = canvas.getContext('2d')
            ctx.textBaseline = 'bottom'
            // 绘制背景
            ctx.fillStyle = randomColor(this.backgroundColorMin, this.backgroundColorMax)
            ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
            // 绘制文字
            for (let i = 0; i < this.identifyCode.length; i++) {
                this.drawText(ctx, this.identifyCode[i], i)
            }
            this.drawLine(ctx)
            this.drawDot(ctx)
        },
        drawText(ctx, txt, i) {
            ctx.fillStyle = randomColor(0, 255) //随机生成字体颜色
            ctx.font = randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei' //随机生成字体大小
            let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
            let y = randomNum(this.fontSizeMax, this.contentHeight - 5)
            var deg = randomNum(-30, 30)
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
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = randomColor(100, 200)
                ctx.beginPath()
                ctx.moveTo(randomNum(0, this.contentWidth), randomNum(0, this.contentHeight))
                ctx.lineTo(randomNum(0, this.contentWidth), randomNum(0, this.contentHeight))
                ctx.stroke()
            }
        },
        drawDot(ctx) {
            // 绘制干扰点
            for (let i = 0; i < 30; i++) {
                ctx.fillStyle = randomColor(0, 255)
                ctx.beginPath()
                ctx.arc(randomNum(0, this.contentWidth), randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
                ctx.fill()
            }
        },
    },
    watch: {
        identifyCode() {
            this.drawPic()
        },
    },
    mounted() {
        this.drawPic()
    },
}
</script>