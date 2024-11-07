<template>
  <a-card :title="$t('views.dashboard.blogLog')" :bordered="false">
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="articleList" :loading="loading">
      <a-list-item slot="renderItem" :key="item.article_id" slot-scope="item">
        <a-list-item-meta>
          <div slot="description">
            <a-tag v-for="tag in item.tags" :key="tag.tag_name">{{ tag.tag_name }}</a-tag>
          </div>
          <a slot="title" :href="`https://juejin.cn/post/${item.article_id}`" target="_blank" rel="noopener noreferrer">
            {{ item.article_info.title }}
          </a>
          <a-avatar slot="avatar" size="large" :src="item.author_user_info.avatar_large" />
        </a-list-item-meta>
        {{ item.article_info.brief_content }}
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import { get, take, toString } from 'lodash-es'

import { getJuejinList } from '@/api/auth'
export default {
  name: 'BlogLog',
  data() {
    return {
      loading: false,
      articleList: [],
      pagination: {
        total: 0,
        onChange: (page, pageSize) => {
          this.fetchJuejinList(toString(pageSize * (page - 1)))
        },
        pageSize: 5
      }
    }
  },
  methods: {
    async fetchJuejinList(cursor = '0') {
      this.loading = true
      const { data, error } = await getJuejinList({
        sort_type: 2,
        user_id: '1917147257534279',
        cursor
      })
      if (!error) {
        this.pagination.total = get(data, 'total', 0)
        this.articleList = take(get(data, 'list', []), 5)
      }
      this.loading = false
    }
  },
  mounted() {
    this.fetchJuejinList()
  }
}
</script>
