<template>
    <a-row type="flex" justify="center" align="middle" :gutter="10">
        <a-col flex="60px">验证码:</a-col>
        <a-col :flex="width">
            <div
                class="verify-code"
                @click="setCode"
                :style="{
                    width: width,
                    height: height,
                    'line-height': height,
                    'font-size': fontSize,
                    'background-color': containerBackgroundColor,
                    color: containerColor,
                }"
            >
                <span :style="code.style" v-for="(code, i) in codeShow" :key="i">
                    {{ code.char || code }}
                </span>
            </div>
        </a-col>
        <a-col flex="auto">
            <a-input v-model="inputValue" placeholder="请输入验证码"> </a-input>
        </a-col>
    </a-row>
</template>
<script type="text/babel">
/**
 * Code
 * @description 常规的图片文字识别或者数字计算
 * */
import { _code_chars, randomColor } from '@/utils/util'

export default {
    name: 'operationVerify',
    props: {
        //运算验证码的位数,默认是100以内的数字，即两位数。如果是要设置三位数，则设置figure:1000。
        figure: {
            type: Number,
            default: 100,
        },
        //算法选择，支持加、减、乘。设置为1至3分别代表加减乘，0为随机切换。
        arith: {
            type: Number,
            default: 0,
        },
        // 	运算验证码的宽,支持百分比形式设置，如：width:100%
        width: {
            type: String,
            default: '150px',
        },
        // 运算验证码的高,支持百分比形式设置，如：height:10%
        height: {
            type: String,
            default: '60px',
        },
        // 运算验证码中的数字的字体大小，默认为30px
        fontSize: {
            type: String,
            default: '30px',
        },
        codeLength: {
            type: Number,
            default: 6,
        },
    },
    data() {
        return {
            // 输入的值
            inputValue: '',
            // 颜色
            containerBackgroundColor: '#fff',
            containerColor: '#fff',
            codeChose: '', // 应该输入的code
            codeShow: [], // 显示用的
        }
    },
    methods: {
        /**
         * setCode
         * @description 设置验证码
         * */
        setCode() {
            this.containerBackgroundColor = randomColor(0, 255)
            this.containerColor = randomColor(0, 255)
            this.inputValue = ''
            this.codeShow = []
            this.codeChose = ''
            // 算法验证码
            var num1 = Math.floor(Math.random() * this.figure)
            var num2 = Math.floor(Math.random() * this.figure)

            let codeShow = ''

            if (this.arith == 0) {
                var tmparith = Math.floor(Math.random() * 3)
            }

            switch (tmparith) {
                case 1:
                    this.codeChose = parseInt(num1) + parseInt(num2)
                    codeShow = num1 + ' + ' + num2 + ' = ?'
                    break
                case 2:
                    if (parseInt(num1) < parseInt(num2)) {
                        var tmpnum = num1
                        num1 = num2
                        num2 = tmpnum
                    }
                    this.codeChose = parseInt(num1) - parseInt(num2)
                    codeShow = num1 + ' - ' + num2 + ' = ?'
                    break
                default:
                    this.codeChose = parseInt(num1) * parseInt(num2)
                    codeShow = num1 + ' × ' + num2 + ' = ?'
                    break
            }

            this.codeShow = codeShow.split('') // 转数组
        },
        /**
         * checkCode
         * @description 验证验证码
         * */
        checkCode() {
            let _this = this
            if (!_this.inputValue) _this.$message.warning('请输入验证码!')
            else if (_this.inputValue != _this.codeChose) _this.$message.error('验证错误!')
            else _this.$message.success('验证成功!')
            _this.setCode()
        },
    },
    mounted() {
        this.setCode()
    },
}
</script>