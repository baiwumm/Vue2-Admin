<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <router-view></router-view>
      <div class="footer">
        <div class="links">
          <a title="Vue3 Admin" href="https://vue3.baiwumm.com/" target="_blank">Vue3 Admin</a>
          <a
            title="github"
            href="https://github.com/baiwumm/Vue2-Admin/"
            target="_blank"
          ><a-icon type="github" /></a
          ><a title="Xmw Admin" href="https://react.baiwumm.com/" target="_blank">Xmw Admin</a>
        </div>
        <div class="copyright">
          Copyright © 2021 Vue2 Admin by 843348394@qq.com<a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
          >
            粤ICP备2023007649号-2
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'

export default {
    name: 'UserLayout',
    mixins: [deviceMixin],
    mounted() {
        document.body.classList.add('userLayout')
    },
    beforeDestroy() {
        document.body.classList.remove('userLayout')
    },
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
    height: 100%;
    .container {
        width: 100%;
        min-height: 100%;
        // background: url(~@/assets/login.png) no-repeat 50%;
        background-size: cover;
        padding: 10% 0 144px;
        position: relative;
        .footer {
            position: absolute;
            width: 100%;
            bottom: 0;
            padding: 0 16px;
            margin: 48px 0 24px;
            text-align: center;

            .links {
                margin-bottom: 8px;
                font-size: 14px;
                a {
                    color: rgba(0, 0, 0, 0.45);
                    transition: all 0.3s;
                    &:not(:last-child) {
                        margin-right: 40px;
                    }
                }
            }
            .copyright {
                color: rgba(0, 0, 0, 0.45);
                font-size: 14px;
            }
        }
    }
    .container:after {
        content: '.';
        clear: both;
        display: block;
        height: 0;
        visibility: hidden;
    }
}
</style>
