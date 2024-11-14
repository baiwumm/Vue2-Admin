<template>
  <page-header-wrapper>
    <a-row :gutter="[16, 16]">
      <a-col :lg="24" :xl="10" :xxl="8">
        <person-info />
      </a-col>
      <a-col :lg="24" :xl="14" :xxl="16">
        <person-setting />
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>
<script>
import PersonInfo from './components/PersonInfo'
import PersonSetting from './components/PersonSetting'
export default {
  name: 'UserCenter',
  components: {
    PersonInfo,
    PersonSetting
  }
}
</script>
