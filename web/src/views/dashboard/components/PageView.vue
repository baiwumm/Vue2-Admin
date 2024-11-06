<template>
  <chart-card :loading="loading" :title="$t('views.dashboard.pageView')">
    <countTo slot="total" :startVal="0" :endVal="getRandom(10000, 100000)" :duration="getRandom(3000, 4000)" />
    <a-icon type="redo" slot="action" @click="fetchData" />
    <div style="margin-bottom: -10px">
      <mini-area />
    </div>
    <template slot="footer">
      <span>{{ $t('views.dashboard.pageView.day') }}</span>
      <countTo :startVal="0" :endVal="getRandom(1000, 10000)" />
    </template>
  </chart-card>
</template>

<script>
import { random } from 'lodash-es'
import countTo from 'vue-count-to'

import { ChartCard, MiniArea, Trend } from '@/components'
export default {
  name: 'PageView',
  components: { countTo, ChartCard, Trend, MiniArea },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  methods: {
    getRandom(start = 0, end = 100) {
      return random(start, end)
    },
    fetchData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$forceUpdate() // 调用 $forceUpdate 方法强制更新当前组件
      }, 1000)
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
