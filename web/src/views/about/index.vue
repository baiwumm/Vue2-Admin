<template>
  <page-header-wrapper>
    <a-space direction="vertical" style="width: 100%">
      <a-card>
        <a-descriptions :title="I18nAbout('project-info')" bordered>
          <a-descriptions-item :label="I18nAbout('project-info.version')">
            {{ APP_VERSION }}
          </a-descriptions-item>
          <a-descriptions-item :label="I18nAbout('project-info.build-date')">
            {{ BUILD_DATE }}
          </a-descriptions-item>
          <a-descriptions-item :label="I18nAbout('project-info.github')">
            <a :href="pkg.homepage" target="_blank">
              {{ pkg.name }}
            </a>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card>
        <a-descriptions :title="I18nAbout('dependencies')" bordered>
          <a-descriptions-item :label="item" v-for="item in Object.keys(pkg.dependencies)" :key="item">
            {{ pkg.dependencies[item] }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card>
        <a-descriptions :title="I18nAbout('devDependencies')" bordered>
          <a-descriptions-item :label="item" v-for="item in Object.keys(pkg.devDependencies)" :key="item">
            {{ pkg.devDependencies[item] }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-space>
  </page-header-wrapper>
</template>
<script>
import { I18nAbout } from '@/constant/i18n'

import pkg from '../../../package.json'
export default {
  name: 'About',
  data() {
    return {
      pkg,
      // eslint-disable-next-line no-undef
      APP_VERSION,
      // eslint-disable-next-line no-undef
      BUILD_DATE,
      I18nAbout
    }
  }
}
</script>
