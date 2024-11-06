<template>
  <chart-card :loading="loading" :title="$t('views.dashboard.saleCard')">
    <countTo
      slot="total"
      :startVal="0"
      :endVal="getRandom(100000, 1000000)"
      :duration="getRandom(3000, 4000)"
      :decimals="2"
      prefix="¥"
    />
    <a-icon type="redo" slot="action" @click="fetchData" />
    <div>
      <trend flag="up" style="margin-right: 16px">
        <span slot="term">{{ $t('views.dashboard.saleCard.week') }}</span>
        <countTo :startVal="0" :endVal="getRandom()" :duration="3000" suffix="%" />
      </trend>
      <trend flag="down">
        <span slot="term">{{ $t('views.dashboard.saleCard.day') }}</span>
        <countTo :startVal="0" :endVal="getRandom()" :duration="3000" suffix="%" />
      </trend>
    </div>
    <template slot="footer">
      <span>{{ $t('views.dashboard.saleCard.average') }}</span>
      <countTo :startVal="0" :endVal="getRandom(1000, 10000)" :duration="3000" :decimals="2" prefix="¥" />
    </template>
  </chart-card>
</template>

<script>
import { random } from 'lodash-es'
import countTo from 'vue-count-to'

import { ChartCard, Trend } from '@/components'
export default {
  name: 'SaleCard',
  components: { countTo, ChartCard, Trend },
  data() {
    return {
      loading: false
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
