<template>
    <div class="login-container">
        <particles-bg type="random" :bg="true" :config="config" />
        <a-card :bordered="false">
            <div class="top">
                <div class="header">
                    <img :src="logoSvg" class="logo" alt="logo" />
                    <span class="title">vue-admin-xmw-pro</span>
                </div>
                <div class="desc">真正的大师永远怀着一颗学徒的心。</div>
            </div>
            <p class="welcome_login">欢迎登陆<em>后台管理系统</em></p>
            <a-form
                id="formLogin"
                class="user-layout-login"
                ref="formLogin"
                :form="form"
                @submit="handleSubmit"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
            >
                <a-alert
                    v-if="isLoginError.state"
                    :type="isLoginError.error"
                    showIcon
                    style="margin-bottom: 24px"
                    :message="isLoginError.message"
                />
                <a-form-item label="用户名">
                    <a-input
                        size="large"
                        type="text"
                        placeholder="请输入用户名"
                        v-decorator="[
                            'username',
                            { rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change' },
                        ]"
                    >
                        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input>
                </a-form-item>

                <a-form-item label="密码">
                    <a-input-password
                        size="large"
                        placeholder="请输入密码"
                        v-decorator="[
                            'password',
                            { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
                        ]"
                    >
                        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input-password>
                </a-form-item>
                <a-form-item label="智能验证">
                    <div
                        id="aliyunVerify"
                        v-decorator="[
                            'aliyunVerify',
                            { rules: [{ required: true, message: '请完成智能验证' }], validateTrigger: 'blur' },
                        ]"
                    ></div>
                    <remote-js src="//g.alicdn.com/sd/nvc/1.1.112/guide.js" @loaded="initCaptcha"></remote-js>
                </a-form-item>
                <a-form-item
                    style="margin-top: 24px"
                    :wrapper-col="{ span: this.screenWidth <= 575 ? 24 : 19, offset: this.screenWidth <= 575 ? 0 : 5 }"
                >
                    <a-button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        class="login-button"
                        :loading="loginState"
                        :disabled="loginState"
                        >登录</a-button
                    >
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapActions } from 'vuex'
import { crypto_key, crypto_iv, timeFix } from '@/utils/util'
import { ParticlesBg } from 'particles-bg-vue'
export default {
    name: 'Login',
    components: {
        'remote-js': {
            render(createElement) {
                const self = this
                return createElement('script', {
                    attrs: { type: 'text/javascript', src: this.src },
                    on: {
                        load() {
                            self.$emit('loaded')
                        },
                    },
                })
            },
            props: {
                src: { type: String, required: true },
            },
        },
        ParticlesBg,
    },
    data() {
        return {
            logoSvg: require('@/assets/logo.svg'),
            form: this.$form.createForm(this),
            loginState: false,
            isLoginError: {
                state: false,
                error: 'error',
                message: '账户或密码错误',
            },
            screenWidth: document.body.clientWidth,
            config: {
                num: [4, 7],
                rps: 0.1,
                radius: [5, 40],
                life: [1.5, 3],
                v: [2, 3],
                tha: [-30, 30],
                alpha: [0.6, 0],
                scale: [0.1, 0.4],
                position: 'all',
                cross: 'dead',
                random: 15,
            },
        }
    },
    created() {
        window.NVC_Opt = {
            //应用类型标识。它和使用场景标识（scene字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
            appkey: 'FFFF0N000000000098FA',
            //使用场景标识。它和应用类型标识（appkey字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
            scene: 'ic_login',
            //声明二次验证需要渲染的目标元素ID。
            renderTo: '#captcha',
            //业务键字段，可为空。该参数可用于上线前测试，请按照代码集成后测试部分中的方法配置该字段值。
            trans: { key1: 'code0', nvcCode: 200 },
            //当唤醒刮刮卡验证作为二次验证时，配置需要刮出的两个elements的图片资源。
            elements: [
                '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
                '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
            ],
            //当唤醒刮刮卡验证作为二次验证时，配置刮动时的背景图像（自动应用平铺填充的方式）。
            bg_back_prepared: '//img.alicdn.com/tps/TB1skE5SFXXXXb3XXXXXXXXXXXX-100-80.png',
            //当唤醒刮刮卡验证作为二次验证时，配置刮动时的前景图像（仅支持base64数据流）。
            bg_front:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
            //当唤醒刮刮卡验证作为二次验证时，配置验证通过时显示的图标资源。
            obj_ok: '//img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
            //当唤醒刮刮卡验证作为二次验证时，配置验证通过时显示的背景图像（自动应用平铺填充的方式）。
            bg_back_pass: '//img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
            //当唤醒刮刮卡验证作为二次验证时，配置验证失败或异常时显示的图标资源。
            obj_error: '//img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
            //当唤醒刮刮卡验证作为二次验证时，配置验证失败或异常时显示的背景图像（自动应用平铺填充的方式）。
            bg_back_fail: '//img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
            //当唤醒刮刮卡验证作为二次验证时，用于自定义文案。详细配置方法请参见自定义文案文档。
            upLang: {
                cn: {
                    _ggk_guide: '请摁住鼠标左键，刮出两面盾牌',
                    _ggk_success: '恭喜您成功刮出盾牌<br/>继续下一步操作吧',
                    _ggk_loading: '加载中',
                    _ggk_fail: [
                        '呀，盾牌不见了<br/>请',
                        'javascript:noCaptcha.reset()',
                        '再来一次',
                        '或',
                        'http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN',
                        '反馈问题',
                    ],
                    _ggk_action_timeout: [
                        '我等得太久啦<br/>请',
                        'javascript:noCaptcha.reset()',
                        '再来一次',
                        '或',
                        'http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN',
                        '反馈问题',
                    ],
                    _ggk_net_err: [
                        '网络实在不给力<br/>请',
                        'javascript:noCaptcha.reset()',
                        '再来一次',
                        '或',
                        'http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN',
                        '反馈问题',
                    ],
                    _ggk_too_fast: [
                        '您刮得太快啦<br/>请',
                        'javascript:noCaptcha.reset()',
                        '再来一次',
                        '或',
                        'http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN',
                        '反馈问题',
                    ],
                },
            },
        }
    },
    methods: {
        ...mapActions(['Login']),
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
                Login,
            } = _this
            _this.loginState = true
            const validateFieldsKey = ['username', 'password', 'aliyunVerify']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const loginParams = { ...values }
                    /*
                     * 对密码进行加密，传输给后台进行验证
                     * */
                    // Encrypt 加密
                    loginParams.password = CryptoJS.AES.encrypt(loginParams.password, crypto_key, {
                        iv: crypto_iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7,
                    }).toString()
                    Login(loginParams)
                        .then((res) => {
                            _this.isLoginError.message = res.msg
                            if (res.state == 1) {
                                _this.isLoginError.error = 'success'
                                _this.$router.push({ path: '/' })
                                // 延迟 1 秒显示欢迎信息
                                // setTimeout(() => {
                                //     _this.$notification.success({
                                //         message: '欢迎',
                                //         description: `${timeFix()}，欢迎回来`,
                                //     })
                                // }, 1000)
                            } else {
                                _this.isLoginError.error = 'error'
                            }
                        })
                        .catch((err) => {
                            _this.isLoginError.message = '登录失败,请联系管理员!'
                        })
                        .finally(() => {
                            _this.isLoginError.state = true
                            setTimeout(() => {
                                _this.loginState = false
                            }, 600)
                        })
                } else {
                    setTimeout(() => {
                        _this.loginState = false
                    }, 600)
                }
            })
        },
        initCaptcha() {
            let _this = this
            var ic = new smartCaptcha({
                //声明智能验证需要渲染的目标元素ID。
                renderTo: '#aliyunVerify',
                //智能验证组件的宽度。
                width: this.screenWidth <= 575 ? 402 : 318.23,
                //智能验证组件的高度。
                height: 40,
                //智能验证组件初始状态文案。
                default_txt: '点击按钮开始智能验证',
                //智能验证组件验证通过状态文案。
                success_txt: '验证成功',
                //智能验证组件验证失败（拦截）状态文案。
                fail_txt: '验证失败，请在此点击按钮刷新',
                //智能验证组件验证中状态文案。
                scaning_txt: '智能检测中',
                //前端智能验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
                success: function (data) {
                    _this.form.setFieldsValue({ aliyunVerify: true })
                },
                fail: function () {
                    _this.form.setFieldsValue({ aliyunVerify: undefined })
                },
            })
            ic.init()
        },
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.screenWidth = document.body.clientWidth
            })()
        }
    },
    destroyed() {
        window.onresize = null
    },
}
</script>

<style lang="less" scoped>
.login-container {
    // float: right;
    width: 450px;
    margin: 0 auto;
    .top {
        text-align: center;
        .header {
            height: 44px;
            line-height: 44px;
            .logo {
                height: 44px;
                vertical-align: top;
                margin-right: 16px;
                border-style: none;
            }
            .title {
                font-size: 33px;
                color: rgba(0, 0, 0, 0.85);
                font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
                font-weight: 600;
                position: relative;
                top: 2px;
            }
        }
        .desc {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.45);
            margin-top: 12px;
            margin-bottom: 20px;
        }
    }
    .ant-card {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .welcome_login {
            text-align: center;
            font-size: 22px;
            font-family: SimSun;
            margin-bottom: 15px;
            em {
                color: #47a7fb;
            }
        }
    }
    .user-layout-login {
        label {
            font-size: 14px;
        }
        button.login-button {
            padding: 0 15px;
            font-size: 16px;
            height: 40px;
            width: 100%;
        }
        @media (max-width: 575px) {
            /deep/ .ant-form-item-label,
            .ant-form-item-control-wrapper {
                width: auto;
            }
        }
    }
    #aliyunVerify {
        /deep/ .sm-txt {
            vertical-align: initial;
        }
    }
}
</style>
