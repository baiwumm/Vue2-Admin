<template>
  <div class="login-container">
    <particles-bg type="random" :bg="true" :config="config" />
    <a-card :bordered="false">
      <div class="top">
        <div class="header">
          <img :src="logoSvg" class="logo" alt="logo" />
          <span class="title">{{ defaultSettings.title }}</span>
        </div>
        <div class="desc">{{ I18nLogin('desc') }}</div>
      </div>
      <p class="welcome_login">
        {{ I18nLogin('welcome') }}
        <em>{{ I18nLogin('name') }}</em>
      </p>
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
        <a-form-item :label="I18nLogin('userName')">
          <a-input
            size="large"
            type="text"
            :placeholder="I18nEntry(I18nLogin('userName'))"
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: I18nEntry(I18nLogin('userName')) }], validateTrigger: 'change' }
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item :label="I18nLogin('password')">
          <a-input-password
            size="large"
            :placeholder="I18nEntry(I18nLogin('password'))"
            v-decorator="[
              'password',
              { rules: [{ required: true, message: I18nEntry(I18nLogin('password')) }], validateTrigger: 'blur' }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>

        <a-form-item :label="I18nLogin('captchaCode')">
          <a-input-group>
            <a-input
              size="large"
              style="width: calc(100% - 132px)"
              v-decorator="[
                'captchaCode',
                { rules: [{ required: true, message: I18nEntry(I18nLogin('captchaCode')) }], validateTrigger: 'change' }
              ]"
            />
            <div id="svgTemplate" v-html="svgCaptcha" v-debounce="{ callback: createSvgCaptcha, time: 150 }"></div>
          </a-input-group>
        </a-form-item>

        <a-form-item style="margin-top: 24px" :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginState"
            :disabled="loginState"
            >{{ I18nLogin() }}</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { ParticlesBg } from 'particles-bg-vue'
import { mapActions } from 'vuex'

import { generateVerifCode } from '@/api/auth'
import defaultSettings from '@/config/defaultSettings'
import { I18nEntry, I18nLogin } from '@/constant/i18n'
export default {
  name: 'Login',
  components: {
    ParticlesBg
  },
  data() {
    return {
      logoSvg: require('@/assets/logo.svg'),
      form: this.$form.createForm(this),
      loginState: false,
      isLoginError: {
        state: false,
        error: 'error',
        message: I18nLogin('fail')
      },
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
        random: 15
      },
      svgCaptcha: '',
      I18nLogin,
      I18nEntry,
      defaultSettings
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit(e) {
      const _this = this
      e.preventDefault()
      const {
        form: { validateFields },
        Login
      } = _this
      _this.loginState = true
      const validateFieldsKey = ['userName', 'password', 'captchaCode']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          Login(loginParams)
            .then((res) => {
              _this.isLoginError.message = res.msg
              if (res.code === 200) {
                _this.isLoginError.error = 'success'
                _this.$router.push({ path: '/' })
              } else {
                this.createSvgCaptcha()
                _this.isLoginError.error = 'error'
              }
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
    async createSvgCaptcha() {
      const { data } = await generateVerifCode()
      this.svgCaptcha = data
    }
  },
  mounted() {
    this.form.setFieldsValue({ userName: 'Admin', password: 'abc123456' })
    this.createSvgCaptcha()
  }
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
}
#svgTemplate {
  cursor: pointer;
  margin-left: 20px;
}
</style>
