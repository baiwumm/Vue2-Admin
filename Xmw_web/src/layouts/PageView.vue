
<template>
  <page-header-wrapper>
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view>
      </transition>
  </page-header-wrapper>
</template>

<script>

export default {
  name: 'PageView'
}
</script>
