<template>
  <el-form ref="form" :model="systemForm" size="small" label-width="150px">
    <el-form-item
      v-for="(item, index) in systemForm"
      :key="index"
      :label="item.label"
    >
      <el-color-picker v-model="item.val"  @change="colorChange(item)"/>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, reactive, onMounted } from 'vue'

export default defineComponent({
  name: 'system',
  setup () {
    const systemForm = reactive([
      {
        val: '#17b3a3',
        label: '系统主色',
        scssVar: '$--color-primary'
      },
      {
        val: '#00152B',
        label: '侧边栏背景色',
        scssVar: '--sidebar-bg-color'
      },
      {
        val: '#8a979e',
        label: '侧边栏字体色',
        scssVar: '--sidebar-text-color'
      },
      {
        val: '#1890ff',
        label: '侧边栏选中背景色',
        scssVar: '--sidebar-active-bg-color'
      },
      {
        val: '#00152B',
        label: '侧边栏选中字体色',
        scssVar: '--sidebar-active-text-color'
      }
    ])

    const colorChange = (item) => {
      document.getElementsByTagName('body')[0].style.setProperty(item.scssVar, item.val)
    }

    onMounted(() => {
      const colourBlend = (c1, c2, ratio) => {
        ratio = Math.max(Math.min(Number(ratio), 1), 0)
        const r1 = parseInt(c1.substring(1, 3), 16)
        const g1 = parseInt(c1.substring(3, 5), 16)
        const b1 = parseInt(c1.substring(5, 7), 16)
        const r2 = parseInt(c2.substring(1, 3), 16)
        const g2 = parseInt(c2.substring(3, 5), 16)
        const b2 = parseInt(c2.substring(5, 7), 16)
        console.log(r1)
        let r = Math.round(r1 * (1 - ratio) + r2 * ratio)
        let g = Math.round(g1 * (1 - ratio) + g2 * ratio)
        let b = Math.round(b1 * (1 - ratio) + b2 * ratio)
        r = ('0' + (r || 0).toString(16)).slice(-2)
        g = ('0' + (g || 0).toString(16)).slice(-2)
        b = ('0' + (b || 0).toString(16)).slice(-2)
        return '#' + r + g + b
      }
      console.log(colourBlend('#ff0000', '#3333ff', 0.3))
    })

    return {
      systemForm,
      colorChange
    }
  }
})
</script>

<style scoped>

</style>
