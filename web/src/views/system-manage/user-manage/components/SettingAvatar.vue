<template>
  <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
    <a-icon type="cloud-upload-o" class="upload-icon" />
    <div class="mask">
      <a-icon type="plus" />
    </div>
    <a-avatar :size="180" :src="value" v-if="value" />
    <a-avatar :size="180" icon="user" v-else />
    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>
<script>
import AvatarModal from './AvatarModal.vue'
export default {
  name: 'SettingAvatar',
  components: { AvatarModal },
  props: ['value'],
  methods: {
    setavatar(url) {
      this.$emit('change', url)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/components/index.less';
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    z-index: 2;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
.ant-avatar {
  position: initial;
}
</style>
