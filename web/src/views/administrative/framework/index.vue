<template>
  <page-header-wrapper>
    <a-space direction="vertical" style="width: 100%">
      <a-card>
        <a-form layout="inline">
          <a-form-item label="纵向">
            <a-switch v-model="horizontal" />
          </a-form-item>
          <a-form-item label="可收起">
            <a-switch v-model="collapsable" />
          </a-form-item>
          <a-form-item label="背景色">
            <a-select v-model="labelStyle.background" style="width: 120px" size="small" @change="handleChange">
              <a-select-option :value="item.value" v-for="(item, index) in labelClassNameOptions" :key="index">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="文字颜色">
            <color-picker :value="labelStyle.color" @change="changeColor" />
          </a-form-item>
        </a-form>
      </a-card>
      <a-card>
        <a-spin :spinning="loading">
          <div :style="{ height: '600px' }">
            <zm-tree-org
              v-if="!loading"
              :data="dataSource"
              :horizontal="horizontal"
              :collapsable="collapsable"
              :label-style="labelStyle"
              label-class-name="framework-org-node"
              :props="{ id: 'id', label: 'name', pid: 'parentId', children: 'children' }"
            />
          </div>
        </a-spin>
      </a-card>
    </a-space>
  </page-header-wrapper>
</template>

<script>
import { get } from 'lodash-es'

import { getOrgList } from '@/api/administrative/organization'
import ColorPicker from '@/components/ColorPicker'
import defaultSettings from '@/config/defaultSettings'
import { RequestCode } from '@/constant'
export default {
  name: 'Framework',
  components: {
    ColorPicker
  },
  data() {
    return {
      labelClassNameOptions: [
        { value: this.$store.getters.color, label: '主题色' },
        { value: '#fff', label: '洁白无瑕' },
        { value: '#FFA500', label: '金橙' },
        { value: '#FFD700', label: '金光灿灿' },
        { value: '#808080', label: '珊瑚灰' },
        { value: '#FFB6C1', label: '姹紫嫣红' },
        { value: '#D2691E', label: '黑朱古力' },
        { value: '#FF6347', label: '红彤彤' }
      ],
      dataSource: {
        id: '1',
        name: defaultSettings.title
      },
      loading: false,
      horizontal: false,
      collapsable: false, // 节点是否可被展开
      labelStyle: {
        background: this.$store.getters.color,
        color: '#000'
      },
      keyword: ''
    }
  },
  methods: {
    handleChange(value) {
      this.labelClassName = value
    },
    changeColor(color) {
      this.labelStyle.color = color
    },
    // 获取组织列表
    async fetchOrgList() {
      this.loading = true
      const { data, code } = await getOrgList({})
      if (code === RequestCode.Success) {
        this.dataSource.children = get(data, 'records', [])
      }
      this.loading = false
    }
  },
  mounted() {
    this.fetchOrgList()
  }
}
</script>
<style lang="less">
@import '~@/components/index.less';
.bg-primary {
  background-color: @primary-color;
}
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
}
.bg-tomato {
  background-color: tomato;
}
.framework-org-node {
  transition: all 0.3s;
}
</style>
