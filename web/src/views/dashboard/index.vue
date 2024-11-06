<template>
  <page-header-wrapper>
    <template v-slot:content>
      <header-content />
    </template>
    <template v-slot:extraContent>
      <extra-content />
    </template>
    <a-row :gutter="24">
      <!-- 总销售额 -->
      <a-col :sm="24" :md="12" :xl="6">
        <sale-card />
      </a-col>
      <!-- 访问量 -->
      <a-col :sm="24" :md="12" :xl="6">
        <page-view />
      </a-col>
      <!-- 支付笔数 -->
      <a-col :sm="24" :md="12" :xl="6">
        <payment-number />
      </a-col>
      <!-- 运营活动效果 -->
      <a-col :sm="24" :md="12" :xl="6">
        <operation-effect />
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>
<script>
import ExtraContent from './components/ExtraContent.vue'
import HeaderContent from './components/HeaderContent.vue'
import OperationEffect from './components/OperationEffect.vue' // 运营活动效果
import PageView from './components/PageView.vue' // 访问量
import PaymentNumber from './components/PaymentNumber.vue' // 支付笔数
import SaleCard from './components/SaleCard.vue' // 总销售额
export default {
  name: 'Dashboard',
  components: {
    HeaderContent,
    ExtraContent,
    SaleCard,
    PageView,
    PaymentNumber,
    OperationEffect
  }
}
</script>
