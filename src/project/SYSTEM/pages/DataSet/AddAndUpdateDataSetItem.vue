<template>
    <div class="wrapper">
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" v-model="isDialogShow">
            <el-form ref="dataFormRef" :model="dataForm" label-width="120px" :rules="checkRules" style="max-height: 400px; overflow-y: auto;">
                <div class="form-item-group">
                    <el-form-item v-if="dialogTitle === '编辑数据集'" label="数据集编码：" prop="dataSetCode" style="margin-right: 30px;">
                        {{ dataForm.dataSetCode }}
                    </el-form-item>
                    <el-form-item label="数据集描述：" prop="dataSetDescribe">
                        <el-input v-model="dataForm.dataSetDescribe" placeholder="手动输入" clearable />
                    </el-form-item>
                    <el-form-item label="拥有人：" prop="dataSetOwner">
                        <el-select v-model="dataForm.dataSetOwner" placeholder="请选择">
                            <el-option
                                v-for="item in ownerList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="项目属性：" prop="dataSetProject" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetProjectSelectAll" :indeterminate="isProjectIndeterminate" @change="handleCheckAllProjectChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.project" @change="handleCheckedProjectChange">
                        <el-checkbox v-for="item in permissionItemList.projectArray" :key="'projectArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="任务属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetTaskSelectAll" :indeterminate="isTaskIndeterminate" @change="handleCheckAllTaskChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.task" @change="handleCheckedTaskChange">
                        <el-checkbox v-for="item in permissionItemList.taskArray" :key="'taskArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标准属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetStandardSelectAll" :indeterminate="isStandardIndeterminate" @change="handleCheckAllStandardChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.standard" @change="handleCheckedStandardChange">
                        <el-checkbox v-for="item in permissionItemList.standardArray" :key="'standardArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="配方属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetFormulaSelectAll" :indeterminate="isFormulaIndeterminate" @change="handleCheckAllFormulaChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.formula" @change="handleCheckedFormulaChange">
                        <el-checkbox v-for="item in permissionItemList.formulaArray" :key="'formulaArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="图纸属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetBlueprintSelectAll" :indeterminate="isBlueprintIndeterminate" @change="handleCheckAllBlueprintChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.bluePrint" @change="handleCheckedBlueprintChange">
                        <el-checkbox v-for="item in permissionItemList.blueprintArray" :key="'blueprintArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                  <el-button class="j_closeBtn" @click="closeDialog">
                      取消
                  </el-button>
                  <el-button type="primary" :disabled="dataForm.dataSetDescribe===''||dataForm.dataSetOwner===''" @click="submitDataForm">
                      确定
                  </el-button>
              </div>
            </template>

        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { PERMISSION_QUERY_ITEMLIST_API, PERMISSION_DATASET_SAVE_API } from '@/api/api'

interface TargetInfoList{
  id:string;
  groupCode:string;
  remark:string;
  realName:string;
  workNum:string;
  createTime:string;
  modifiedTime:string;
}

interface PermossionIitmsList{
    bizType: string;
    groupCode: string;
    id: string;
    permissionCode: string;
    permissionType: string;
}

interface DataForm{
    dataSetCode: string;
    dataSetDescribe: string;
    dataSetOwner: string;
    dataSetProjectSelectAll: boolean;
    dataSetTaskSelectAll: boolean;
    dataSetStandardSelectAll: boolean;
    dataSetFormulaSelectAll: boolean;
    dataSetBlueprintSelectAll: boolean;
    project: string[];
    task: string[];
    standard: string[];
    formula: string[];
    bluePrint: string[];
    id: string;
}
// interface PermissionItemList{
//     projectArray:string[];
//     taskArray:string[];
//     standardArray:string[];
//     formulaArray:string[];
//     blueprintArray:string[];
// }

export default defineComponent({
  name: 'RoleaddAndUpdate',
  props: {
    ownerList: {
      type: Array,
      default: () => {
        return []
      }
    },
    permissionItemList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['refreshDataList'],

  setup (props, { emit }) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proxy = ctx.proxy as any
    const dialogTitle = ref('')
    const isDialogShow = ref(false)
    const isProjectIndeterminate = ref(false)
    const isTaskIndeterminate = ref(false)
    const isStandardIndeterminate = ref(false)
    const isFormulaIndeterminate = ref(false)
    const isBlueprintIndeterminate = ref(false)
    const dataFormRef = ref()
    const dataForm = ref<DataForm>({
      dataSetCode: '',
      dataSetDescribe: '',
      dataSetOwner: '',
      dataSetProjectSelectAll: false,
      dataSetTaskSelectAll: false,
      dataSetStandardSelectAll: false,
      dataSetFormulaSelectAll: false,
      dataSetBlueprintSelectAll: false,
      project: [],
      task: [],
      standard: [],
      formula: [],
      bluePrint: [],
      id: ''
    })
    const checkRules = ref({
      dataSetDescribe: [
        { required: true, message: '数据集描述', trigger: 'blur' }
      ],
      dataSetOwner: [
        { required: true, message: '请选择拥有人', trigger: 'select' }
      ]
    })

    const init = (obj:TargetInfoList, title:string) => {
      if (title === '复制数据集') {
        dialogTitle.value = title + '(' + obj.groupCode + ')'
      } else {
        dialogTitle.value = title
      }

      if (title === '新增数据集') {
        initForm()
        // add
      } else {
        initForm()
        // edit
        PERMISSION_QUERY_ITEMLIST_API({
          groupCode: obj.groupCode
        }).then(({ data }) => {
          if (title === '编辑数据集') {
            dataForm.value.dataSetCode = obj.groupCode
            dataForm.value.dataSetDescribe = obj.remark
            dataForm.value.dataSetOwner = obj.realName + ' ' + obj.workNum
            dataForm.value.id = obj.id
          } else { // 复制
            dataForm.value.dataSetCode = ''
            dataForm.value.dataSetDescribe = obj.remark
            dataForm.value.dataSetOwner = ''
            dataForm.value.id = ''
          }

          dataForm.value.project = []
          dataForm.value.task = []
          dataForm.value.standard = []
          dataForm.value.formula = []
          dataForm.value.bluePrint = []
          const dataTemp:PermossionIitmsList[] = data.data
          dataTemp.forEach(item => {
            if (item.bizType === 'task') {
              dataForm.value.task.push(item.permissionCode)
            } else if (item.bizType === 'recipe') {
              dataForm.value.formula.push(item.permissionCode)
            } else if (item.bizType === 'project') {
              dataForm.value.project.push(item.permissionCode)
            } else if (item.bizType === 'productsAndStrands') {
              dataForm.value.standard.push(item.permissionCode)
            } else if (item.bizType === 'blueprint') {
              dataForm.value.bluePrint.push(item.permissionCode)
            }
          })

          if (dataForm.value.project.length === props.permissionItemList.projectArray.length) {
            dataForm.value.dataSetProjectSelectAll = true
          } else {
            dataForm.value.dataSetProjectSelectAll = false
          }
          if (dataForm.value.task.length === props.permissionItemList.taskArray.length) {
            dataForm.value.dataSetTaskSelectAll = true
          } else {
            dataForm.value.dataSetTaskSelectAll = false
          }
          if (dataForm.value.standard.length === props.permissionItemList.standardArray.length) {
            dataForm.value.dataSetStandardSelectAll = true
          } else {
            dataForm.value.dataSetStandardSelectAll = false
          }
          if (dataForm.value.formula.length === props.permissionItemList.formulaArray.length) {
            dataForm.value.dataSetFormulaSelectAll = true
          } else {
            dataForm.value.dataSetFormulaSelectAll = false
          }
          if (dataForm.value.bluePrint.length === props.permissionItemList.blueprintArray.length) {
            dataForm.value.dataSetBlueprintSelectAll = true
          } else {
            dataForm.value.dataSetBlueprintSelectAll = false
          }
        })
      }
      isDialogShow.value = true
    }

    const initForm = () => {
      isProjectIndeterminate.value = false
      isTaskIndeterminate.value = false
      isStandardIndeterminate.value = false
      isFormulaIndeterminate.value = false
      isBlueprintIndeterminate.value = false

      dataForm.value = {
        dataSetCode: '',
        dataSetDescribe: '',
        dataSetOwner: '',
        dataSetProjectSelectAll: false,
        dataSetTaskSelectAll: false,
        dataSetStandardSelectAll: false,
        dataSetFormulaSelectAll: false,
        dataSetBlueprintSelectAll: false,
        project: [],
        task: [],
        standard: [],
        formula: [],
        bluePrint: [],
        id: ''
      }
    }

    const submitDataForm = () => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          if (dialogTitle.value === '新增数据集') {
            const tempOwner = dataForm.value.dataSetOwner.split(' ')
            // 新增
            PERMISSION_DATASET_SAVE_API({
              permissionItemList: {
                project: dataForm.value.project,
                task: dataForm.value.task,
                productsAndStrands: dataForm.value.standard,
                recipe: dataForm.value.formula,
                blueprint: dataForm.value.bluePrint
              },
              remark: dataForm.value.dataSetDescribe,
              realName: tempOwner[0],
              workNum: tempOwner[1]
            }).then(() => {
              proxy.$successToast('新增成功')
              emit('refreshDataList')
              isDialogShow.value = false
            }).catch(() => {
              //
            })
          } else if (dialogTitle.value === '编辑数据集') {
            const tempOwner = dataForm.value.dataSetOwner.split(' ')
            // 修改
            PERMISSION_DATASET_SAVE_API({
              id: dataForm.value.id,
              groupCode: dataForm.value.dataSetCode,
              permissionItemList: {
                project: dataForm.value.project,
                task: dataForm.value.task,
                productsAndStrands: dataForm.value.standard,
                recipe: dataForm.value.formula,
                blueprint: dataForm.value.bluePrint
              },
              remark: dataForm.value.dataSetDescribe,
              realName: tempOwner[0],
              workNum: tempOwner[1]
            }).then(() => {
              proxy.$successToast('编辑成功')
              emit('refreshDataList')
              isDialogShow.value = false
            }).catch(() => {
              //
            })
          } else {
            const tempOwner = dataForm.value.dataSetOwner.split(' ')
            // 复制
            PERMISSION_DATASET_SAVE_API({
              permissionItemList: {
                project: dataForm.value.project,
                task: dataForm.value.task,
                productsAndStrands: dataForm.value.standard,
                recipe: dataForm.value.formula,
                blueprint: dataForm.value.bluePrint
              },
              remark: dataForm.value.dataSetDescribe,
              realName: tempOwner[0],
              workNum: tempOwner[1]
            }).then(() => {
              proxy.$successToast('新增成功')
              emit('refreshDataList')
              isDialogShow.value = false
            }).catch(() => {
              //
            })
          }
        }
      })
    }

    // 重置
    const closeDialog = () => {
      // document.querySelectorAll('.j_closeBtn')[0].focus() // bug 优化
      dataFormRef.value.resetFields()
      isDialogShow.value = false
    }
    const handleCheckAllProjectChange = (val:string[]) => {
      dataForm.value.project = val ? props.permissionItemList.projectArray : []
      isProjectIndeterminate.value = false
    }
    const handleCheckedProjectChange = (val:string[]) => {
      const checkedCount = val.length
      dataForm.value.dataSetProjectSelectAll = checkedCount === props.permissionItemList.projectArray.length
      isProjectIndeterminate.value = checkedCount > 0 && checkedCount < props.permissionItemList.projectArray.length
    }
    const handleCheckAllTaskChange = (val:string[]) => {
      dataForm.value.task = val ? props.permissionItemList.taskArray : []
      isTaskIndeterminate.value = false
    }
    const handleCheckedTaskChange = (val:string[]) => {
      const checkedCount = val.length
      dataForm.value.dataSetTaskSelectAll = checkedCount === props.permissionItemList.taskArray.length
      isTaskIndeterminate.value = checkedCount > 0 && checkedCount < props.permissionItemList.taskArray.length
    }
    const handleCheckAllStandardChange = (val:string[]) => {
      dataForm.value.standard = val ? props.permissionItemList.standardArray : []
      isStandardIndeterminate.value = false
    }
    const handleCheckedStandardChange = (val:string[]) => {
      const checkedCount = val.length
      dataForm.value.dataSetStandardSelectAll = checkedCount === props.permissionItemList.standardArray.length
      isStandardIndeterminate.value = checkedCount > 0 && checkedCount < props.permissionItemList.standardArray.length
    }
    const handleCheckAllFormulaChange = (val:string[]) => {
      dataForm.value.formula = val ? props.permissionItemList.formulaArray : []
      isFormulaIndeterminate.value = false
    }
    const handleCheckedFormulaChange = (val:string[]) => {
      const checkedCount = val.length
      dataForm.value.dataSetFormulaSelectAll = checkedCount === props.permissionItemList.formulaArray.length
      isFormulaIndeterminate.value = checkedCount > 0 && checkedCount < props.permissionItemList.formulaArray.length
    }
    const handleCheckAllBlueprintChange = (val:string[]) => {
      dataForm.value.bluePrint = val ? props.permissionItemList.blueprintArray : []
      isBlueprintIndeterminate.value = false
    }
    const handleCheckedBlueprintChange = (val:string[]) => {
      const checkedCount = val.length
      dataForm.value.dataSetBlueprintSelectAll = checkedCount === props.permissionItemList.blueprintArray.length
      isBlueprintIndeterminate.value = checkedCount > 0 && checkedCount < props.permissionItemList.blueprintArray.length
    }

    return {
      init,
      dialogTitle,
      isDialogShow,
      isProjectIndeterminate,
      isTaskIndeterminate,
      isStandardIndeterminate,
      isFormulaIndeterminate,
      isBlueprintIndeterminate,
      dataForm,
      checkRules,
      dataFormRef,
      closeDialog,
      handleCheckAllProjectChange,
      handleCheckedProjectChange,
      handleCheckAllTaskChange,
      handleCheckedTaskChange,
      handleCheckAllStandardChange,
      handleCheckedStandardChange,
      handleCheckAllFormulaChange,
      handleCheckedFormulaChange,
      handleCheckAllBlueprintChange,
      handleCheckedBlueprintChange,
      submitDataForm
    }
  }

})
</script>
<style lang="css" scoped>
.wrapper >>> .el-dialog {
    width: 70%;
}
</style>
<style lang="scss" scoped>
.form-item-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .el-form-item {
        margin-right: 10px;
    }
}
</style>
