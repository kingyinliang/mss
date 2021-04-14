<template>
  <el-dialog title="部门分配" :close-on-click-modal="false" v-model="isDialogShow">
    <div style="max-height: 53vh; overflow: auto;">
      <el-tree
        ref="orgTreeRef"
        :data="orgTree"
        :props="{label: 'deptName'}"
        node-key="id"
        :default-expand-all="true"
        show-checkbox
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
          <el-button class="j_closeBtn" @click="isDialogShow = false">取消</el-button>
          <el-button type="primary" @click="submitDataForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DEPT_ALL, ROLE_DEPT, ROLE_DEPT_ADD } from '@/api/api'

export default defineComponent({
  name: 'DepartmentManage',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const roleId = ref('')
    const isDialogShow = ref(false)
    const orgTree = ref([])
    const orgTreeRef = ref()

    const init = (id: string) => {
      roleId.value = id
      DEPT_ALL({ factory: 'common' }).then(({ data }) => {
        orgTree.value = data.data
        isDialogShow.value = true
      }).then(() => {
        ROLE_DEPT({
          roleId: id
        }).then(({ data }) => {
          orgTreeRef.value.setCheckedKeys(data.data)
        })
      })
    }
    const submitDataForm = () => {
      ROLE_DEPT_ADD({
        roleId: roleId.value,
        deptId: [].concat(orgTreeRef.value.getCheckedKeys()).concat(orgTreeRef.value.getHalfCheckedKeys())
      }).then(() => {
        emit('refreshDataList')
        isDialogShow.value = false
      })
    }

    return {
      isDialogShow,
      orgTree,
      orgTreeRef,
      init,
      submitDataForm
    }
  }
})
</script>

<style scoped>

</style>
