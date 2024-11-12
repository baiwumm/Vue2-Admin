<template>
  <div class="user-tags">
    <template v-for="tag in value">
      <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
        <a-tag :key="tag" closable @close="() => handleClose(tag)">
          {{ `${tag.slice(0, 20)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else :key="tag" closable @close="() => handleClose(tag)">
        {{ tag }}
      </a-tag>
    </template>
    <a-input
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else :style="{ background: '#fff', borderStyle: 'dashed' }" @click="showInput">
      <a-icon type="plus" /> New Tag
    </a-tag>
  </div>
</template>
<script>
export default {
  name: 'UserTags',
  props: ['value'],
  data() {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(removedTag) {
      const tags = this.value.filter((tag) => tag !== removedTag)
      this.$emit('change', tags)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange(e) {
      this.inputValue = e.target.value
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      let tags = this.value
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
        this.$emit('change', tags)
      }
      Object.assign(this, {
        inputVisible: false,
        inputValue: ''
      })
    }
  }
}
</script>
<style lang="less" scoped>
.user-tags .ant-tag {
  margin-bottom: 8px;
}
</style>
