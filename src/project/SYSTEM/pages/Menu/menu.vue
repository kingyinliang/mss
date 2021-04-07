<template>
  <MdsCard
    title="菜单列表"
    name="menu"
    :pack-up="false"
    style="background: #fff;"
  >
    <template #titleBtn>
      <el-button type="primary" style="float: right; margin-bottom: 12px;" size="small" @click="addOrUpdateHandle()">
        新增
      </el-button>
    </template>
    <el-table header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" style="width: 100%;">
      <table-tree-column prop="menuName" header-align="left" min-width="150" :show-overflow-tooltip="true" label="名称" @updateData="data => dataList = data"/>
      <el-table-column prop="parentName" header-align="left" align="left" min-width="100" :show-overflow-tooltip="true" label="上级菜单" />
      <el-table-column header-align="left" align="left" width="100" :show-overflow-tooltip="true" label="图标">
        <template #default="scope">
          <em class="iconfont" :class="scope.row.menuIcon" />
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="left" align="left" min-width="100" :show-overflow-tooltip="true" label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 'C'" size="small">
            目录
          </el-tag>
          <el-tag v-else-if="scope.row.menuType === 'M'" size="small" type="success">
            菜单
          </el-tag>
          <el-tag v-else-if="scope.row.menuType === 'B'" size="small" type="info">
            按钮
          </el-tag>
          <el-tag v-else-if="scope.row.menuType === 'P'" size="small" type="success">
            三级页面
          </el-tag>
          <el-tag v-else-if="scope.row.menuType === 'D'" size="small" type="success">
            看板
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="menuOrder" header-align="left" align="left" width="80" :show-overflow-tooltip="true" label="排序号" />
      <el-table-column prop="menuUrl" header-align="left" align="left" min-width="200" :show-overflow-tooltip="true" label="菜单URL" />
      <el-table-column prop="permission" header-align="left" align="left" width="180" :show-overflow-tooltip="true" label="授权标识" />
      <el-table-column prop="remark" header-align="left" align="left" min-width="100" :show-overflow-tooltip="true" label="备注" />
      <el-table-column fixed="right" header-align="left" align="left" width="88" label="操作">
        <template #default="scope">
          <el-button v-if="isAuth('menuEdit')" style="padding: 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row)">
            修改
          </el-button>
          <el-button v-if="isAuth('menuDel')" style="padding: 0;" type="text" size="small" @click="deleteHandle(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </MdsCard>
  <MenuAdd ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="getDataList"/>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance, nextTick,
  onMounted,
  ref
} from 'vue'
import { MENU_LIST, MENU_DEL } from '@/api/api'
import { treeDataTranslate, MenuBbj } from '@/utils'
import MenuAdd from './MenuAdd.vue'

export default defineComponent({
  name: 'MenuPage',
  components: {
    MenuAdd
  },
  setup () {
    const dataList = ref([] as MenuBbj[])
    const addOrUpdate = ref()
    const addOrUpdateVisible = ref(false)
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line
    const proxy = ctx.proxy as any

    // 获取数据列表
    const getDataList = () => {
      if (!proxy.isAuth('menuQuery')) {
        proxy.$warningToast('无权限')
        return false
      }
      MENU_LIST({
        factory: 'common'
      }).then(({ data }) => {
        dataList.value = treeDataTranslate(data.data)
        addOrUpdateVisible.value = false
      })
    }

    const addOrUpdateHandle = async (row?: MenuBbj) => {
      addOrUpdateVisible.value = true
      await nextTick()
      addOrUpdate.value.init(row)
    }

    const deleteHandle = (id: string) => {
      proxy.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        MENU_DEL({
          id
        }).then(() => {
          proxy.$successToast('操作成功')
          getDataList()
        })
      })
    }

    onMounted(() => {
      getDataList()
    })
    return {
      addOrUpdateVisible,
      addOrUpdate,
      dataList,
      getDataList,
      deleteHandle,
      addOrUpdateHandle
    }
  }
})
</script>

<style scoped>

</style>
