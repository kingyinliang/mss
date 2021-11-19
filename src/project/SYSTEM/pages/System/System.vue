<template>
  <mds-card title="租户管理" name="system" :pack-up="false" style="background: #fff;">
    <template #titleBtn>
      <el-button type="primary" style="float: right; margin-bottom: 12px;" size="small" @click="addOrUpdate()">
        新增
      </el-button>
    </template>
    <el-table :data="tableArr" border tooltip-effect="dark" style="width: 100%;">
      <el-table-column type="index" label="序号" width="50" align="center" fixed />
      <el-table-column prop="systemCode" label="租户编码" :show-overflow-tooltip="true" min-width="80" />
      <el-table-column prop="systemName" label="租户名称" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column prop="clientId" label="clientId" :show-overflow-tooltip="true" min-width="280" />
      <el-table-column prop="clientSecret" label="clientSecret" :show-overflow-tooltip="true" min-width="280" />
      <el-table-column prop="backgroundImg" label="背景图片" :show-overflow-tooltip="true" min-width="110" >
        <template #default="scope">
          <img :src="scope.row.backgroundImgUrl" alt="" class="img">
        </template>
      </el-table-column>
      <el-table-column prop="logoImg" label="logo" :show-overflow-tooltip="true" min-width="110" >
        <template #default="scope">
          <img :src="scope.row.logoImgUrl" alt="" class="img">
        </template>
      </el-table-column>
      <el-table-column prop="oneMoreFlag" label="多工厂标识" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="scope">
          <el-button type="text" class="role__btn" @click="addOrUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="text" class="role__btn" @click="remove(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <SystemAddOrUpdate ref="systemAddOrUpdateRef" v-if="dialogFormVisible" @refreshDataList="getSystem"/>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent, getCurrentInstance,
  onMounted,
  ref,
  nextTick
} from 'vue'
import { GET_TENANT, TENANT_DEL } from '@/api/api'
import SystemAddOrUpdate from './SystemAddOrUpdate.vue'

type System = {
  id: string
}
export default defineComponent({
  name: 'System',
  components: {
    SystemAddOrUpdate
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line
    const proxy = ctx.proxy as any
    const tableArr = ref([])
    const systemAddOrUpdateRef = ref()
    const dialogFormVisible = ref(false)

    const getSystem = () => {
      GET_TENANT({
        current: 1,
        size: 10
      }).then(({ data }) => {
        dialogFormVisible.value = false
        tableArr.value = data.data.records
      })
    }
    const addOrUpdate = async (row: System) => {
      dialogFormVisible.value = true
      await nextTick()
      systemAddOrUpdateRef.value.init(row)
    }
    const remove = (id: string) => {
      proxy.$confirm('确认删除该租户, 是否继续?', '删除租户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        TENANT_DEL({ id: id }).then(() => {
          proxy.$successToast('操作成功')
          getSystem()
        })
      })
    }

    onMounted(() => {
      getSystem()
    })

    return {
      dialogFormVisible,
      systemAddOrUpdateRef,
      tableArr,
      getSystem,
      addOrUpdate,
      remove
    }
  }
})
</script>

<style lang="scss" scoped>
.img{
  width: 80px;
  height: 80px;
}
</style>
