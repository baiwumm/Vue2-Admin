<template>
  <a-card :title="$t('views.dashboard.projectNews')" :bordered="false">
    <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer" slot="extra">
      {{ $t('views.dashboard.projectNews.moreNews') }}
    </a>
    <a-timeline>
      <a-timeline-item v-for="item in commitList" :key="item.node_id">
        <a-space direction="vertical">
          <a class="text-primary" :href="item.html_url" target="_blank" rel="noopener noreferrer">
            {{ item.commit.message }}
          </a>
          <p>
            {{ dayjs(item.commit.author.date).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </a-space>
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>
<script>
import dayjs from 'dayjs'

import pkg from '../../../../package.json'
export default {
  name: 'ProjectNews',
  data() {
    return {
      pkg,
      loading: false,
      commitList: [],
      dayjs
    }
  },
  methods: {
    async fetchGithubLog() {
      this.loading = true
      const response = await fetch('https://api.github.com/repos/baiwumm/Vue2-Admin/commits?page=1&per_page=10')
      if (response.status === 200) {
        this.commitList = await response.json()
      }
      this.loading = false
    }
  },
  mounted() {
    this.fetchGithubLog()
  }
}
</script>
