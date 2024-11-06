<template>
  <div class="page-header-content">
    <div class="avatar">
      <a-avatar size="large" :src="userInfo.avatar" />
    </div>
    <div class="content">
      <div class="content-title">
        {{ timeFix() }}，{{ userInfo.cnName }}<span class="welcome-text">，{{ welcome() }}</span>
      </div>
      <div>{{ hitokotoText }}</div>
    </div>
  </div>
</template>
<script>
import { sample } from 'lodash-es'
export default {
  name: 'HeaderContent',
  data() {
    return {
      hitokotoText: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    timeFix() {
      const time = new Date()
      const hour = time.getHours()
      return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '夜深了'
    },
    welcome() {
      return sample(['休息一会儿吧', '准备吃什么呢?', '要不要打一把 LOL', '我猜你可能累了'])
    },
    // 获取一言
    async getHitokoto() {
      const response = await fetch('https://v1.hitokoto.cn')
      const { hitokoto } = await response.json()
      this.hitokotoText = hitokoto
    }
  },
  mounted() {
    this.getHitokoto()
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
.page-header-content {
  display: flex;

  .avatar {
    flex: 0 1 72px;

    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
    }
  }

  .content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    color: @text-color-secondary;
    line-height: 22px;

    .content-title {
      margin-bottom: 12px;
      color: @heading-color;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
