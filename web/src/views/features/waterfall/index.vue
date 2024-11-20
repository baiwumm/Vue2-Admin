<template>
  <page-header-wrapper>
    <a-space slot="extra">
      <a-button type="primary" @click="shuffle">{{ $t('views.features.waterfall.shuffle') }}</a-button>
      <a-button type="primary" @click="addItems">{{ $t('views.features.waterfall.add', { total: 30 }) }}</a-button>
      <a-button type="primary" @click="deleteItem">{{
        $t('views.features.waterfall.delete', { total: '一' })
      }}</a-button>
    </a-space>
    <waterfall
      align="center"
      :line-gap="200"
      :min-line-gap="100"
      :max-line-gap="220"
      :single-max-width="300"
      :watch="items"
      @reflowed="reflowed"
      ref="waterfall"
    >
      <waterfall-slot
        v-for="(item, index) in items"
        :width="item.width"
        :height="item.height"
        :order="index"
        :key="item.id"
        move-class="item-move"
      >
        <div class="item" :style="{ width: item.width, height: item.height }" :index="item.index">
          <img :src="item.url" />
        </div>
      </waterfall-slot>
    </waterfall>
  </page-header-wrapper>
</template>

<script>
import { random, shuffle, times } from 'lodash-es'
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

import { getRandomImg } from '@/utils'
export default {
  components: {
    Waterfall,
    WaterfallSlot
  },
  data() {
    return {
      items: [],
      isBusy: false,
      random
    }
  },
  methods: {
    // 生成随机 id
    generateUniqueID() {
      const timestamp = Date.now().toString(36) // 将时间戳转换为 36 进制字符串
      const randomness = random(0, 999999).toString(36) // 生成一个六位的随机数并转为 36 进制
      return `${timestamp}-${randomness}`
    },
    addItems() {
      if (!this.isBusy && this.items.length < 500) {
        const getList = (pageSize = 30) =>
          times(pageSize, () => ({
            id: this.generateUniqueID(),
            url: getRandomImg(),
            width: random(200, 300),
            height: random(300, 200)
          }))
        this.isBusy = true
        this.items = [...getList(), ...this.items]
      }
    },
    shuffle() {
      this.items = shuffle(this.items)
    },
    reflowed() {
      this.isBusy = false
    },
    // 随机删除一条数据
    deleteItem() {
      this.items.splice(random(0, this.items.length - 1), 1)
    }
  },
  mounted() {
    this.addItems()
  }
}
</script>
<style lang="less" scoped>
.item-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  font-size: 1.2em;
  color: rgb(0, 158, 107);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
}
.item:after {
  content: attr(index);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.wf-transition {
  transition: opacity 0.3s ease;
  -webkit-transition: opacity 0.3s ease;
}
.wf-enter {
  opacity: 0;
}
</style>
