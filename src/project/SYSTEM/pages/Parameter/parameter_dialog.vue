<template>
  <el-dialog
    :title="isParasType ? isAddParas ? '新增类型':'修改类型' : isAddParas ? '新增参数':'修改参数'"
    v-model="isDialogShow"
  >
    <div style="height: 360px; overflow: auto;">
      <el-form ref="dataFormRef" :model="dataForm" label-width="125px" :rules="checkRules">
        <el-form-item label="工厂：" prop="factory">
          <span v-if="!isParasType">{{ dataForm.factoryName }}</span>
          <el-select v-if="isParasType" v-model="factory" @change="changeFactory">
            <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数类型编码：" prop="dictType">
          <span v-if="!isParasType">{{ dataForm.dictType }}</span>
          <el-input v-if="isParasType" v-model.trim="dataForm.dictType" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item label="参数类型名称：" prop="dictName">
          <span v-if="!isParasType">{{ dataForm.dictName }}</span>
          <el-input v-if="isParasType" v-model.trim="dataForm.dictName" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item v-if="!isParasType" label="参数编码：" prop="dictCode">
          <el-input v-model.trim="dataForm.dictCode" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item v-if="!isParasType" label="参数名称：" prop="dictValue">
          <el-input v-model.trim="dataForm.dictValue" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item v-if="!isParasType" label="排序标识：">
          <el-input v-model.number="dataForm.dictOrder" placeholder="手动输入" clearable />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="j_closeBtn" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitDataForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { DICT_ITEM_ADD, DICT_ITEM_UPDATE, DICT_ADD, DICT_UPDATE } from '@/api/api'

export default defineComponent({
  name: 'ParameterDialog',
  emits: ['refreshParentDataList', 'refreshChildDataList'],
  props: {
    factoryList: Array
  },
  setup (props, { emit }) {
    const isAddParas = ref(false)
    const isParasType = ref(false)
    const isDialogShow = ref(false)
    const dataFormRef = ref()
    const factory = ref('')
    const dataForm = ref({
      factoryName: '',
      dictType: '',
      dictName: '',
      dictCode: '',
      dictValue: '',
      dictOrder: '',
      parentId: '',
      dictId: ''
    })
    const checkRules = {
      factoryName: [{
        required: true,
        message: '请选择工厂',
        trigger: 'blur'
      }],
      dictType: [{
        required: true,
        message: '请输入参数类型编码',
        trigger: 'blur'
      }, {
        pattern: /^[A-Z_0-9]+$/,
        message: '需为大写字母',
        trigger: 'blur'
      }],
      dictName: [{
        required: true,
        message: '请输入参数类型名称',
        trigger: 'blur'
      }],
      dictCode: [{
        required: true,
        message: '请输入参数编码',
        trigger: 'blur'
      }],
      dictValue: [{
        required: true,
        message: '请输入参数名称',
        trigger: 'blur'
      }]
    }

    const init = (parasLevel, temRow, row) => {
      if (parasLevel === 'type') {
        isParasType.value = true
        if (temRow) {
          props.factoryList.forEach((item) => {
            if (item.deptName === temRow.factoryName) {
              factory.value = item.id
            }
          })
          isAddParas.value = false
          dataForm.value = JSON.parse(JSON.stringify(temRow))
        } else {
          isAddParas.value = true
          dataForm.value = {
            factoryName: '',
            dictType: '',
            dictName: '',
            dictCode: '',
            dictValue: '',
            dictOrder: '',
            parentId: ''
          }
          console.log(dataForm)
        }
      } else {
        isParasType.value = false
        if (row) {
          isAddParas.value = false
          dataForm.value = JSON.parse(JSON.stringify(row))
          dataForm.value.parentId = temRow.id
          dataForm.value.dictType = temRow.dictType
          dataForm.value.dictName = temRow.dictName
        } else {
          isAddParas.value = true
          dataForm.value = {
            factoryName: temRow.factoryName,
            dictType: temRow.dictType,
            dictName: temRow.dictName,
            dictCode: '',
            dictOrder: '',
            dictValue: '',
            parentId: temRow.id
          }
        }
      }
      isDialogShow.value = true
    }

    const closeDialog = () => {
      isDialogShow.value = false
    }

    const submitDataForm = () => {
      dataFormRef.value.validate(valid => {
        if (valid) {
          let http, data
          if (isParasType.value && isAddParas.value) {
            http = DICT_ADD
            data = {
              factory: factory.value,
              dictName: dataForm.value.dictName,
              dictType: dataForm.value.dictType
            }
          } else if (isParasType.value && !isAddParas.value) {
            http = DICT_UPDATE
            data = {
              factory: factory.value,
              dictName: dataForm.value.dictName,
              dictType: dataForm.value.dictType,
              id: dataForm.value.id
            }
          } else if (!isParasType.value && isAddParas.value) {
            http = DICT_ITEM_ADD
            data = {
              factory: factory.value,
              dictCode: dataForm.value.dictCode,
              dictOrder: dataForm.value.dictOrder,
              dictValue: dataForm.value.dictValue,
              dictId: dataForm.value.parentId
            }
          } else if (!isParasType.value && !isAddParas.value) {
            http = DICT_ITEM_UPDATE
            data = {
              factory: factory.value,
              dictCode: dataForm.value.dictCode,
              dictOrder: dataForm.value.dictOrder,
              dictValue: dataForm.value.dictValue,
              dictId: dataForm.value.parentId,
              id: dataForm.value.id
            }
          }
          http(data).then(() => {
            closeDialog()
            if (isParasType.value) {
              emit('refreshParentDataList')
            } else {
              emit('refreshChildDataList')
            }
          })
        }
      })
    }

    const changeFactory = (value) => {
      const factory = this.factoryList.find((item) => {
        return item.id === value
      })
      if (factory) {
        dataForm.value.factoryName = factory.deptName
      }
    }

    return {
      dataFormRef,
      factory,
      isDialogShow,
      isAddParas,
      isParasType,
      dataForm,
      checkRules,
      init,
      changeFactory,
      closeDialog,
      submitDataForm
    }
  }
})
</script>

<style scoped>

</style>
