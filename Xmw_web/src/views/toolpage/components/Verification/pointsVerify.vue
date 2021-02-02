<template>
    <div
        class="points-verify"
        :style="{ width: setSize.imgWidth + 'px' }"
        @mouseover="mode === 'pop' ? (showImage = true) : undefined"
        @mouseout="mode === 'pop' ? (showImage = false) : undefined"
    >
        <div
            class="verify-img-out"
            v-show="showImage"
            @mouseover="mode === 'pop' ? (showImage = true) : undefined"
            @mouseout="mode === 'pop' ? (showImage = false) : undefined"
            :style="
                mode === 'pop'
                    ? {
                          display: 'none',
                          position: 'absolute',
                          bottom: '42px',
                          height: parseInt(setSize.imgHeight) + 'px',
                      }
                    : { position: 'relative', height: parseInt(setSize.imgHeight) + 'px' }
            "
        >
            <div
                class="verify-img-panel"
                :style="{
                    width: setSize.imgWidth,
                    height: setSize.imgHeight,
                    'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
                }"
            >
                <div class="verify-refresh" style="z-index: 3" @click="refresh">
                    <a-icon type="reload" class="icon-refresh" />
                </div>
                <canvas
                    :width="setSize.imgWidth"
                    :height="setSize.imgHeight"
                    ref="canvas"
                    @click="bindingClick ? canvasClick($event) : undefined"
                ></canvas>
                <div
                    v-for="(tempPoint, index) in tempPoints"
                    :key="index"
                    class="point-area"
                    :style="{
                        'background-color': '#1abd6c',
                        color: '#fff',
                        'z-index': 9999,
                        width: '30px',
                        height: '30px',
                        'text-align': 'center',
                        'line-height': '30px',
                        'border-radius': '50%',
                        position: 'absolute',
                        top: parseInt(tempPoint.y - 10) + 'px',
                        left: parseInt(tempPoint.x - 10) + 'px',
                    }"
                >
                    {{ index + 1 }}
                </div>
            </div>
        </div>
        <div
            class="verify-bar-area"
            :style="{
                width: this.barSize.width,
                height: this.barSize.height,
                color: this.barAreaColor,
                'border-color': this.barAreaBorderColor,
                'line-height': this.barSize.height,
            }"
        >
            <span class="verify-msg">{{ text }}</span>
        </div>
    </div>
</template>
<script type="text/babel">
/**
 * VerifyPoints
 * @description 点选
 * */

import { randomColor } from '@/utils/util'

function getOffset(Node, offset = { top: 0, left: 0 }) {
    if (Node == document.body) {
        //当该节点为body节点时，结束递归
        return offset
    }

    offset.top += Node.offsetTop
    offset.left += Node.offsetLeft

    return getOffset(Node.parentNode, offset) //向上累加offset里的值
}

export default {
    name: 'pointsVerify',
    props: {
        //弹出式pop，固定fixed
        mode: {
            type: String,
            default: 'fixed',
        },
        //默认的文字数量
        defaultNum: {
            type: Number,
            default: 4,
        },
        //校对的文字数量
        checkNum: {
            type: Number,
            default: 3,
        },
        imgArr: {
            type: Array,
            default() {
                return [require('@/assets/images/studio_0001.jpg')]
            },
        },
        imgSize: {
            type: Object,
            default() {
                return {
                    width: '400px',
                    height: '200px',
                }
            },
        },
        barSize: {
            type: Object,
            default() {
                return {
                    width: '300px',
                    height: '40px',
                }
            },
        },
        setSize: {
            type: Object,
            default() {
                return {
                    imgHeight: 200,
                    imgWidth: 300,
                }
            },
        },
    },
    data() {
        return {
            fontPos: [], // 选中的坐标信息
            checkPosArr: [], //用户点击的坐标
            num: 1, //点击的记数
            imgRand: 0, // //随机的背景图片
            showImage: true,
            tempPoints: [],
            text: '',
            barAreaColor: undefined,
            barAreaBorderColor: undefined,
            bindingClick: true,
        }
    },
    methods: {
        init() {
            //加载页面
            this.fontPos.splice(0, this.fontPos.length)
            this.checkPosArr.splice(0, this.checkPosArr.length)
            this.num = 1
            this.imgRand = Math.floor(Math.random() * this.imgArr.length)

            this.$nextTick(() => {
                this.setSize = this.resetSize(this) //重新设置宽度高度
                this.refresh()
                this.$parent.$emit('ready', this)
            })
        },
        canvasClick(e) {
            this.checkPosArr.push(this.getMousePos(this.$refs.canvas, e))
            if (this.num == this.checkNum) {
                this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
                setTimeout(() => {
                    var flag = this.comparePos(this.fontPos, this.checkPosArr)
                    if (flag == false) {
                        //验证失败
                        this.barAreaColor = '#d9534f'
                        this.barAreaBorderColor = '#d9534f'
                        this.text = '验证失败'
                        this.$emit('callback', flag, this.text)
                        setTimeout(() => {
                            this.refresh()
                        }, 400)
                    } else {
                        //验证成功
                        this.barAreaColor = '#4cae4c'
                        this.barAreaBorderColor = '#5cb85c'
                        this.text = '验证成功'
                        this.bindingClick = false
                        this.$emit('callback', flag, this.text)
                    }
                }, 400)
            }

            if (this.num < this.checkNum) {
                this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
            }
        },
        //绘制合成的图片
        drawImg: function (obj, img) {
            //准备canvas环境
            var canvas = this.$refs.canvas
            var ctx = canvas.getContext('2d')

            // 绘制图片
            ctx.drawImage(img, 0, 0, parseInt(this.setSize.imgWidth), parseInt(this.setSize.imgHeight))

            // 绘制水印
            var fontSizeArr = [
                'italic small-caps bold 20px microsoft yahei',
                'small-caps normal 25px arial',
                '34px microsoft yahei',
            ]
            var fontStr =
                '天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩体率宾归王' //不重复的汉字

            var fontChars = []

            var avg = Math.floor(parseInt(this.setSize.imgWidth) / (parseInt(this.defaultNum) + 1))
            var tmp_index = ''

            for (var i = 1; i <= this.defaultNum; i++) {
                fontChars[i - 1] = this.getChars(fontStr, fontChars)

                tmp_index = Math.floor(Math.random() * 3)
                ctx.font = fontSizeArr[tmp_index]
                ctx.fillStyle = randomColor(0, 255)

                if (Math.floor(Math.random() * 2) == 1) {
                    var tmp_y = Math.floor(parseInt(this.setSize.imgHeight) / 2) + tmp_index * 20 + 20
                } else {
                    var tmp_y = Math.floor(parseInt(this.setSize.imgHeight) / 2) - tmp_index * 20
                }

                ctx.fillText(fontChars[i - 1], avg * i, tmp_y)
                this.fontPos[i - 1] = { char: fontChars[i - 1], x: avg * i, y: tmp_y }
            }

            for (var i = 0; i < this.defaultNum - this.checkNum; i++) {
                this.shuffle(this.fontPos).pop()
            }

            var msgStr = ''
            for (var i = 0; i < this.fontPos.length; i++) {
                msgStr += this.fontPos[i].char + ','
            }

            this.text = '请顺序点击【' + msgStr.substring(0, msgStr.length - 1) + '】'

            return this.fontPos
        },
        //获取坐标
        getMousePos: function (obj, e) {
            var x = e.offsetX - 5
            var y = e.offsetY - 5

            return { x, y }
        },
        //递归去重
        getChars: function (fontStr, fontChars) {
            var tmp_rand = parseInt(Math.floor(Math.random() * fontStr.length))
            if (tmp_rand > 0) {
                tmp_rand = tmp_rand - 1
            }

            var tmp_char = fontStr.charAt(tmp_rand)
            if (fontChars.indexOf(tmp_char) == -1) {
                return tmp_char
            } else {
                return this.getChars(fontStr, fontChars)
            }
        },
        //洗牌数组
        shuffle: function (arr) {
            var m = arr.length,
                i
            var tmpF
            while (m) {
                i = (Math.random() * m--) >>> 0
                tmpF = arr[m]
                arr[m] = arr[i]
                arr[i] = tmpF
                //[arr[m], arr[i]] = [arr[i], arr[m]];	//低版本浏览器不支持此写法
            }
            return arr
        },
        //创建坐标点
        createPoint: function (pos) {
            this.tempPoints.push(Object.assign({}, pos))
            return ++this.num
        },
        comparePos: function (fontPos, checkPosArr) {
            var flag = true
            for (var i = 0; i < fontPos.length; i++) {
                if (
                    !(
                        parseInt(checkPosArr[i].x) + 40 > fontPos[i].x &&
                        parseInt(checkPosArr[i].x) - 40 < fontPos[i].x &&
                        parseInt(checkPosArr[i].y) + 40 > fontPos[i].y &&
                        parseInt(checkPosArr[i].y) - 40 < fontPos[i].y
                    )
                ) {
                    flag = false
                    break
                }
            }

            return flag
        },
        refresh: function () {
            this.tempPoints.splice(0, this.tempPoints.length)
            this.barAreaColor = '#000'
            this.barAreaBorderColor = '#ddd'
            this.bindingClick = true

            this.fontPos.splice(0, this.fontPos.length)
            this.checkPosArr.splice(0, this.checkPosArr.length)
            this.num = 1

            this.imgRand = Math.floor(Math.random() * this.imgArr.length) //随机的背景图片
            var img = new Image()
            img.src = this.imgArr[this.imgRand]
            // 加载完成开始绘制
            var _this = this
            img.onload = function (e) {
                _this.$nextTick(() => {
                    _this.fontPos = _this.drawImg(_this.$el, this)
                })
            }
            this.text = '验证失败'
        },
        resetSize(vm) {
            var img_width, img_height, bar_width, bar_height //图片的宽度、高度，移动条的宽度、高度

            var parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth
            var parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight

            if (vm.imgSize.width.indexOf('%') != -1) {
                img_width = (parseInt(this.imgSize.width) / 100) * parentWidth + 'px'
            } else {
                img_width = this.imgSize.width
            }

            if (vm.imgSize.height.indexOf('%') != -1) {
                img_height = (parseInt(this.imgSize.height) / 100) * parentHeight + 'px'
            } else {
                img_height = this.imgSize.height
            }

            if (vm.barSize.width.indexOf('%') != -1) {
                bar_width = (parseInt(this.barSize.width) / 100) * parentWidth + 'px'
            } else {
                bar_width = this.barSize.width
            }

            if (vm.barSize.height.indexOf('%') != -1) {
                bar_height = (parseInt(this.barSize.height) / 100) * parentHeight + 'px'
            } else {
                bar_height = this.barSize.height
            }

            return { imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height }
        },
    },
    mounted() {
        this.refresh()
    },
}
</script>
<style lang="less" scoped>
.points-verify {
    position: relative;
    margin: 0 auto;
    /*滑动验证码*/
    .verify-bar-area {
        position: relative;
        margin-top: 10px;
        background: #ffffff;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .verify-img-panel {
        border: 1px solid #ddd;
        border-radius: 3px;
        position: relative;
    }
    .verify-img-panel .verify-refresh {
        width: 25px;
        height: 25px;
        text-align: center;
        padding: 5px;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
    }
    .verify-img-panel .icon-refresh {
        font-size: 20px;
    }
}
</style>
