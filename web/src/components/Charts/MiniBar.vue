<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { random, times } from 'lodash-es'

export default {
  name: 'MiniBar',
  data() {
    return {
      data: {},
      height: 100
    }
  },
  methods: {
    getData() {
      const now = dayjs() // 获取当前日期
      const data = times(10, (index) => {
        const date = now.subtract(index, 'day') // 减去天数
        return {
          x: date.format('YYYY-MM-DD'), // 格式化日期
          y: random(100, 1000) // 生成1000到10000之间的随机数
        }
      })
      this.data = data
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
@import 'chart';
</style>
