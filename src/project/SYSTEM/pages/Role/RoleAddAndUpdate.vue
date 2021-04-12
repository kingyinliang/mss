<template>
  <el-dialog :title="dataForm.id ? '修改角色信息' : '新增角色'" :close-on-click-modal="false" v-model="isDialogShow">
    <el-form ref="dataFormRef" :model="dataForm" label-width="100px" :rules="checkRules">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="手动输入" clearable />
      </el-form-item>
      <el-form-item label="角色编码：" prop="roleCode">
        <el-input v-model="dataForm.roleCode" placeholder="手动输入" clearable />
      </el-form-item>
      <el-form-item label="描述：" prop="roleDescribe">
        <el-input v-model="dataForm.remark" placeholder="手动输入" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
          <el-button class="j_closeBtn" @click="isDialogShow = false">取消</el-button>
          <el-button type="primary" @click="submitDataForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { ROLE_ADD, ROLE_UPDATE } from '@/api/api'

export default defineComponent({
  name: 'RoleAddAndUpdate',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const checkRules = {
      roleName: [
        { required: true, message: '角色名称', trigger: 'blur' },
        { max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
      ],
      roleCode: [
        { required: true, message: '角色编码', trigger: 'blur' },
        { max: 30, message: '长度在 30 个字符内', trigger: 'blur' }
      ],
      roleDescribe: [
      ]
    }
    const isDialogShow = ref(false)
    const dataForm = ref({
      id: '',
      roleName: '',
      roleCode: '',
      remark: ''
    })
    const dataFormRef = ref()

    const init = (data) => {
      if (data) {
        dataForm.value.id = data.id
        dataForm.value.roleName = data.roleName
        dataForm.value.roleCode = data.roleCode
        dataForm.value.remark = data.remark
      } else {
        dataForm.value = {
          id: '',
          roleName: '',
          roleCode: '',
          remark: ''
        }
      }
      isDialogShow.value = true
    }
    const submitDataForm = () => {
      dataFormRef.value.validate(valid => {
        if (valid) {
          const http = dataForm.value.id ? ROLE_UPDATE : ROLE_ADD
          http(dataForm.value).then(() => {
            emit('refreshDataList')
            isDialogShow.value = false
          })
        }
      })
    }

    return {
      isDialogShow,
      dataForm,
      dataFormRef,
      checkRules,
      init,
      submitDataForm
    }
  }
})
</script>

<style scoped>

</style>
