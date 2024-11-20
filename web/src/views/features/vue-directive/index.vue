<template>
  <page-header-wrapper :content="I18nVueDirective('content')">
    <a-row :gutter="[20, 20]">
      <!-- 复制粘贴指令 v-copy -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-copy')">
          <a-input-search :placeholder="I18nEntry()" v-model="copyText">
            <a-button slot="enterButton" type="primary" v-copy="copyText">
              {{ I18nVueDirective('v-copy.text') }}
            </a-button>
          </a-input-search>
        </a-card>
      </a-col>
      <!-- 长按指令 v-longpress -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-longpress')">
          <a-button type="primary" v-longpress="{ callback: longpress, time: longpressTime }" block>
            {{ $t('views.features.vue-directive.v-longpress.text', { time: longpressTime / 1000 }) }}
          </a-button>
        </a-card>
      </a-col>
      <!-- 防抖指令 v-debounce -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-debounce')">
          <a-button type="primary" v-debounce="{ callback: debounceClick, time: debounceTime }" block>
            {{ $t('views.features.vue-directive.v-debounce.text', { time: debounceTime / 1000 }) }}
          </a-button>
        </a-card>
      </a-col>
      <!-- 节流指令 v-throllte -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-throllte')">
          <a-button type="primary" v-throllte="{ callback: throllteClick, time: throllteTime }" block>
            {{ $t('views.features.vue-directive.v-throllte.text', { time: throllteTime / 1000 }) }}
          </a-button>
        </a-card>
      </a-col>
      <!-- 禁止表情及特殊字符 v-emoji -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-emoji')">
          <a-input :placeholder="I18nVueDirective('v-emoji.text')" v-emoji />
        </a-card>
      </a-col>
      <!-- 图片懒加载 v-LazyLoad -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-LazyLoad')">
          <router-link to="/features/lazyload">
            <a-button type="primary" block> {{ I18nVueDirective('v-LazyLoad.text') }} </a-button>
          </router-link>
        </a-card>
      </a-col>
      <!-- 波纹指令 v-wave -->
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-wave')">
          <div class="wrapper" v-wave>
            <a-button type="primary" block> {{ I18nVueDirective('v-wave.text') }} </a-button>
          </div>
        </a-card>
      </a-col>
      <!-- 实现页面水印 v-waterMarker -->
      <a-col :span="24">
        <a-card :bordered="false" hoverable :title="I18nVueDirective('v-waterMarker')">
          <div
            style="height: 200px"
            v-waterMarker="{ text: defaultSettings.title, textColor: 'rgba(180, 180, 180, 0.4)' }"
          ></div>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>
<script>
import defaultSettings from '@/config/defaultSettings'
import { I18nEntry, I18nGlobal, I18nVueDirective } from '@/constant/i18n'
export default {
  name: 'VueDirective',
  data() {
    return {
      I18nEntry,
      I18nVueDirective,
      defaultSettings,
      copyText: defaultSettings.title, // 复制内容
      longpressTime: 1000, // 长按指令间隔时间,默认1s
      debounceTime: 1000, // 防抖指令间隔时间,默认1s
      throllteTime: 1000 // 节流指令间隔时间,默认1s
    }
  },
  methods: {
    // 长按指令回调
    longpress() {
      this.$message.success(this.$t(I18nGlobal.Good))
    },
    // 防抖指令回调
    debounceClick() {
      this.$message.success(this.$t(I18nGlobal.Good))
    },
    // 节流指令回调
    throllteClick() {
      this.$message.success(this.$t(I18nGlobal.Good))
    }
  }
}
</script>
<style>
.wave-ripple {
  position: absolute;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  background-clip: padding-box;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
  opacity: 1;
}

.wave-ripple.z-active {
  opacity: 0;
  -webkit-transform: scale(2);
  -ms-transform: scale(2);
  transform: scale(2);
  -webkit-transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out, -webkit-transform 0.6s ease-out;
}
</style>
