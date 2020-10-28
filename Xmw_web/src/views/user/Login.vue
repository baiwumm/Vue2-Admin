<template>
    <div class="main">
        <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
            <a-alert
                v-if="isLoginError.state"
                :type="isLoginError.error"
                showIcon
                style="margin-bottom: 24px"
                :message="isLoginError.message"
            />
            <a-form-item>
                <a-input
                    size="large"
                    type="text"
                    placeholder="请输入帐户名"
                    v-decorator="[
                        'username',
                        { rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'change' },
                    ]"
                >
                    <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
            </a-form-item>

            <a-form-item>
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
            <a-form-item>
                <div id="aliyunVerify"></div>
                <remote-js src="//g.alicdn.com/sd/nvc/1.1.112/guide.js" @loaded="initCaptcha"></remote-js>
            </a-form-item>
            <a-form-item style="margin-top: 24px">
                <a-button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    class="login-button"
                    :loading="loginState"
                    :disabled="loginState"
                    >确定</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import storage from 'store'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
export default {
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
    },
    data() {
        return {
            form: this.$form.createForm(this),
            loginState: false,
            isLoginError: {
                state: false,
                error: 'error',
                message: '账户或密码错误',
            },
            key: CryptoJS.enc.Utf8.parse('ABCDEF0123456789'), //十六位十六进制数作为密钥
            iv: CryptoJS.enc.Utf8.parse('ABCDEF0123456789'), //十六位十六进制数作为密钥偏移量
            aliyun_icLogin: false,
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
            const validateFieldsKey = ['username', 'password']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    if (!_this.aliyun_icLogin) {
                        _this.isLoginError.state = true
                        _this.isLoginError.message = '请完成智能验证!'
                        setTimeout(() => {
                            _this.loginState = false
                        }, 600)
                        return
                    }
                    const loginParams = { ...values }
                    /*
                     * 对密码进行加密，传输给后台进行验证
                     * */
                    // Encrypt 加密
                    loginParams.password = CryptoJS.AES.encrypt(loginParams.password, _this.key, {
                        iv: _this.iv,
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
                                setTimeout(() => {
                                    _this.$notification.success({
                                        message: '欢迎',
                                        description: `${timeFix()}，欢迎回来`,
                                    })
                                }, 1000)
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
                width: 368,
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
                    _this.aliyun_icLogin = true
                },
                fail: function () {
                    _this.aliyun_icLogin = false
                },
            })
            ic.init()
        },
    },
    mounted() {},
}
</script>

<style lang="less" scoped>
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
}
#aliyunVerify {
    /deep/ .sm-txt {
        vertical-align: initial;
    }
}
</style>
