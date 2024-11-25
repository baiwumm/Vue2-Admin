<template>
  <page-header-wrapper>
    <a-button slot="extra" type="primary" href="https://github.com/SortableJS/Vue.Draggable" target="_blank">
      vuedraggable
    </a-button>
    <a-card>
      <vue-draggable
        class="list-group"
        tag="div"
        v-model="list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <div class="list-group-item" v-for="element in list" :key="element">
          {{ element }}
        </div>
      </vue-draggable>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { range } from 'lodash-es'
import vueDraggable from 'vuedraggable'
export default {
  name: 'Draggable',
  components: {
    vueDraggable
  },
  data() {
    return {
      list: range(1, 31),
      drag: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.list-group {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  &-item {
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: large;
    cursor: pointer;
    user-select: none;
    border-radius: 10px;
    overflow: hidden;
    font-size: 30px;
    font-weight: bold;
    aspect-ratio: 1 / 1;
  }
}
</style>
