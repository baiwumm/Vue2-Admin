<template>
  <chart-card :loading="loading" :title="$t('views.dashboard.operationEffect')">
    <countTo slot="total" :startVal="0" :endVal="total" :duration="getRandom(3000, 4000)" suffix="%" />
    <a-icon type="redo" slot="action" @click="fetchData" />
    <div style="margin-bottom: -10px">
      <mini-progress color="rgb(19, 194, 194)" :target="100" :percentage="total" height="10px" />
    </div>
    <template slot="footer">
      <trend flag="down" style="margin-right: 16px">
        <span slot="term">{{ $t('views.dashboard.operationEffect.week') }}</span>
        <countTo :startVal="0" :endVal="getRandom()" :duration="3000" suffix="%" />
      </trend>
      <trend flag="up">
        <span slot="term">{{ $t('views.dashboard.operationEffect.day') }}</span>
        <countTo :startVal="0" :endVal="getRandom()" :duration="3000" suffix="%" />
      </trend>
    </template>
  </chart-card>
</template>

<script>
import { random } from 'lodash-es'
import countTo from 'vue-count-to'

import { ChartCard, MiniProgress, Trend } from '@/components'
export default {
  name: 'OperationEffect',
  components: { countTo, ChartCard, Trend, MiniProgress },
  data() {
    return {
      loading: false,
      data: [],
      total: 0
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
    },
    getTotal() {
      this.total = this.getRandom()
    }
  },
  mounted() {
    this.fetchData()
    this.getTotal()
  }
}
</script>
