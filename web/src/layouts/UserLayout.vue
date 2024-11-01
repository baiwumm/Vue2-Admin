<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="user-layout-lang">
        <select-lang class="select-lang-trigger" />
      </div>
      <div class="user-layout-content">
        <router-view />

        <div class="footer">
          <div class="links">
            <a title="Vue3 Admin" href="https://github.com/baiwumm/Vue3-Admin/" target="_blank">Vue3 Admin</a>
            <a title="github" href="https://github.com/baiwumm/Vue2-Admin/" target="_blank"><a-icon type="github" /></a
            ><a title="Xmw Admin" href="https://github.com/baiwumm/Xmw-Admin/" target="_blank">Xmw Admin</a>
          </div>
          <div class="copyright">
            Copyright © 2021 Vue2 Admin by
            <a
              href="https://baiwumm.com/"
              target="_blank"
              style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
            >
              白雾茫茫丶
            </a>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
            >
              粤ICP备2023007649号
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectLang from '@/components/SelectLang'
import { deviceMixin } from '@/store/device-mixin'

export default {
  name: 'UserLayout',
  components: {
    SelectLang
  },
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background-size: 100%;
    //padding: 50px 0 84px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .user-layout-lang {
      position: absolute;
      top: 20px;
      right: 20px;

      .select-lang-trigger {
        cursor: pointer;
        line-height: 1;
      }
    }

    .user-layout-content {
      padding: 32px 0 24px;

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        // position: absolute;
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

    a {
      text-decoration: none;
    }
  }
}
</style>
