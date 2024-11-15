<template>
  <div>
    <input ref="colorPickerInput" type="color" />
  </div>
</template>

<script>
import '@simonwep/pickr/dist/themes/classic.min.css'
import '@simonwep/pickr/dist/themes/monolith.min.css'
import '@simonwep/pickr/dist/themes/nano.min.css'

import Pickr from '@simonwep/pickr'

export default {
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: '#000'
    },
    theme: {
      type: String,
      default: 'classic'
    }
  },
  data() {
    return {
      pickr: null
    }
  },
  mounted() {
    this.createColorPicker()
  },
  methods: {
    createColorPicker() {
      this.pickr = new Pickr({
        el: this.$refs.colorPickerInput,
        theme: this.theme, // or 'nano' for another style
        swatches: [
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 0.95)',
          'rgba(156, 39, 176, 0.9)',
          'rgba(103, 58, 183, 0.85)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(33, 150, 243, 0.75)',
          'rgba(3, 169, 244, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(0, 150, 136, 0.75)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(139, 195, 74, 0.85)',
          'rgba(205, 220, 57, 0.9)',
          'rgba(255, 235, 59, 0.95)',
          'rgba(255, 193, 7, 1)'
        ],
        default: this.value, // The default color
        components: {
          preview: true,
          opacity: true,
          hue: true,

          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true
          }
        },
        i18n: {
          'btn:save': '保存',
          'btn:clear': '清空'
        },
        onChange: (color) => {
          // 当颜色改变时的回调函数
          console.log(color)
        }
      })
      this.pickr.on('save', (color) => {
        let hexa = '#000'
        if (color) {
          hexa = color.toHEXA().toString()
        }
        this.$emit('change', hexa)
      })
    }
  },
  beforeDestroy() {
    if (this.pickr) {
      this.pickr.destroy()
    }
  }
}
</script>
