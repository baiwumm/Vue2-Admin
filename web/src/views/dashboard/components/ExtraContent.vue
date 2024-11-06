<template>
  <div class="extra-content">
    <div class="stat-item">
      <a-statistic :title="$t('views.dashboard.projectNum')" :value="56">
        <countTo :startVal="0" :endVal="getRandom(1000, 10000)" :duration="3000" slot="formatter" />
      </a-statistic>
    </div>
    <div class="stat-item">
      <a-statistic :title="$t('views.dashboard.ranking')" suffix="/ 100">
        <countTo :startVal="0" :endVal="getRandom()" :duration="3000" slot="formatter" />
      </a-statistic>
    </div>
    <div class="stat-item">
      <a-statistic :title="$t('views.dashboard.visit')" :value="2223">
        <countTo :startVal="0" :endVal="getRandom(1000, 10000)" :duration="3000" slot="formatter" />
      </a-statistic>
    </div>
  </div>
</template>
<script>
import { random } from 'lodash-es'
import countTo from 'vue-count-to'
export default {
  name: 'ExtraContent',
  components: { countTo },
  methods: {
    getRandom(start = 0, end = 100) {
      return random(start, end)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.text-overflow() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}

// mixins for clearfix
// ------------------------
.clearfix() {
  zoom: 1;
  &::before,
  &::after {
    display: table;
    content: ' ';
  }
  &::after {
    clear: both;
    height: 0;
    font-size: 0;
    visibility: hidden;
  }
}

.extra-content {
  .clearfix();
  float: right;
  white-space: nowrap;

  .stat-item {
    position: relative;
    display: inline-block;
    padding: 0 32px;

    > p:first-child {
      margin-bottom: 4px;
      color: @text-color-secondary;
      font-size: @font-size-base;
      line-height: 22px;
    }

    > p {
      margin: 0;
      color: @heading-color;
      font-size: 30px;
      line-height: 38px;

      > span {
        color: @text-color-secondary;
        font-size: 20px;
      }
    }

    &::after {
      position: absolute;
      top: 8px;
      right: 0;
      width: 1px;
      height: 40px;
      background-color: @border-color-split;
      content: '';
    }

    &:last-child {
      padding-right: 0;

      &::after {
        display: none;
      }
    }
  }
}
</style>
