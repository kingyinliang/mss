<template>
    <div class="header_main">
        <mds-card title="属性字典" :name="'dictionary'" :pack-up="false" style="margin-bottom: 0; background: #fff;" class="view-area">
            <template #titleBtn>
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-button v-if="false" type="primary" size="small" @click="exportData">
                        导出
                    </el-button>
                    <el-button type="primary" size="small" @click="addItem">
                        新增
                    </el-button>
                    <el-button type="primary" size="small" :disabled="!canSave" @click="saveDictionaryModify">
                        保存
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoListRef" class="newTable" header-row-class-name="tableHead"  :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
                <el-table-column prop="dictionaryCode" label="属性编码" :show-overflow-tooltip="true" min-width="200">
                    <template #default="scope">
                        <el-input v-model="scope.row.dictionaryCode" size="small" placeholder="请输入属性编码" :disabled="!scope.row.isRedact" @blur="checkInput(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryOwner" label="属性归属人" width="200">
                    <template #default="scope">
                        <el-select v-model="scope.row.dictionaryOwner" placeholder="请选择" size="small" :disabled="!scope.row.isRedact" @change="checkSelected(scope.row)">
                            <el-option
                                v-for="item in ownerList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="propertyList" label="数据集描述" :show-overflow-tooltip="true" min-width="500">
                    <template #default="scope">
                        <!-- <el-checkbox-group v-model="scope.row.propertyList" :disabled="!scope.row.isRedact"> -->
                        <el-checkbox v-model="scope.row.project" label="项目属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.task" label="任务属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.formula" label="配方属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.blueprint" label="图纸属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.standard" label="产品&标准" :disabled="!scope.row.isRedact" />
                        <!-- </el-checkbox-group> -->
                    </template>
                </el-table-column>
                <el-table-column prop="created" label="创建日期" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="changed" label="修改时间" width="160" />
                <el-table-column prop="changer" label="操作人" width="160" />
                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="scope">
                        <el-button type="text" class="role__btn" :disabled="scope.row.isRedact" @click="editItem(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { PERMISSION_QUERY_API, PERMISSION_SAVE_API, USER_LIST } from '@/api/api'

import { dateFormat } from '@/utils'

interface TargetInfoList{
    id: string;
    dictionaryCode: string;
    dictionaryOwner: string;
    propertyList: [],
    created: string;
    changed: string;
    changer: string;
    blueprint: boolean;
    standard: boolean;
    project: boolean;
    formula: boolean;
    task: boolean;
    isRedact: boolean;
}

interface Options{
  label:string;
  value:string;
}

export default defineComponent({
  name: 'DataSetManages',
  components: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proxy = ctx.proxy as any
    const controllableForm = ref({
      owner: ''
    })
    const ownerList = ref<Options[]>([])
    const currPage = ref(1)
    const pageSize = ref(10)
    const totalCount = ref(1)
    const targetInfoList = ref<TargetInfoList[]>([])

    const currentComponent = ref('')
    const isEditDataSetItemShow = ref(true)
    const hasInputError = ref(false)
    const hasSelectError = ref(false)
    const canSave = computed(() => typeof targetInfoList.value.find(item => item.isRedact === true) !== 'undefined' && hasInputError.value === false && hasSelectError.value === false)

    // 序号
    const indexMethod = (index:number) => {
      return index + 1 + (Number(currPage.value) - 1) * Number(pageSize.value)
    }

    onMounted(() => {
      getItemsList(true)
      // 呼叫拥有人清单
      USER_LIST({
        factory: 'common',
        current: 1,
        size: 9999
      }).then(({ data }) => {
        ownerList.value = []
        const dataTemp = data.data.records
        dataTemp.forEach((item:{
          realName:string,
          workNum:string
        }) => {
          ownerList.value.push({ value: item.realName + ' ' + item.workNum, label: item.realName + ' ' + item.workNum })
        })
      })
    })

    // 获取角色列表
    const getItemsList = (haveParas = false) => {
      if (haveParas) {
        currPage.value = 1
      }

      PERMISSION_QUERY_API({
        current: currPage.value,
        size: pageSize.value
      }).then(({ data }) => {
        if (data.data.records.length === 0) {
          proxy.$infoToast('暂无任何内容')
        }
        console.log('列表数据')
        console.log(data)
        // this.controllableForm.owner = '';
        targetInfoList.value = []
        data.data.records.forEach((item:{
          blueprintPermission: boolean;
          createTime: string;
          creatorId: string;
          creatorName: string;
          id: string;
          modifiedTime: string;
          modifierId: string;
          modifierName: string;
          permissionCode: string;
          productStandardPermission: boolean;
          projectPermission: boolean;
          realName: string;
          recipePermission: boolean;
          taskPermission: boolean;
          workNum: string;
        }) => {
          targetInfoList.value.push(
            {
              id: item.id,
              dictionaryCode: item.permissionCode,
              dictionaryOwner: item.realName + ' ' + item.workNum,
              propertyList: [],
              created: item.createTime,
              changed: item.modifiedTime,
              changer: item.modifierName + ' ' + item.modifierId,
              blueprint: item.blueprintPermission,
              standard: item.productStandardPermission,
              project: item.projectPermission,
              formula: item.recipePermission,
              task: item.taskPermission,
              isRedact: false
            }
          )
        })
        currPage.value = data.data.current
        pageSize.value = data.data.size
        totalCount.value = data.data.total
      })
    }

    const checkInput = (item:TargetInfoList) => {
      if (targetInfoList.value.filter(element => element.dictionaryCode === item.dictionaryCode).length >= 2) {
        proxy.$errorToast('编码重复')
        hasInputError.value = true
      } else {
        hasInputError.value = false
      }
    }

    const checkSelected = (item:TargetInfoList) => {
      if (targetInfoList.value.filter(element => element.dictionaryOwner === item.dictionaryOwner).length >= 2) {
        proxy.$errorToast('属性归属人重复')
        hasSelectError.value = true
      } else {
        hasSelectError.value = false
      }
    }

    // [BTN:新增] 新增数据集 item
    const addItem = () => {
      targetInfoList.value.unshift({
        id: '',
        dictionaryCode: '',
        dictionaryOwner: '',
        propertyList: [],
        created: dateFormat(new Date(), 'yyyy-MM-dd'),
        changed: dateFormat(new Date(), 'yyyy-MM-dd'),
        changer: sessionStorage.getItem('realName') + ' ' + sessionStorage.getItem('userName'),
        blueprint: false,
        standard: false,
        project: false,
        formula: false,
        task: false,
        isRedact: true
      })
    }

    // [BTN:编辑] 编辑数据集 item
    const editItem = (obj:TargetInfoList) => {
      console.log(obj)
      obj.isRedact = true
      obj.changed = dateFormat(new Date(), 'yyyy-MM-dd')
    }

    // 改变每页条数
    const handleSizeChange = (val:number) => {
      if (canSave.value === false) {
        pageSize.value = val
        getItemsList()
      } else {
        proxy.$errorToast('请先保存')
      }
    }
    // 跳转页数
    const handleCurrentChange = (val:number) => {
      if (canSave.value === false) {
        currPage.value = val
        getItemsList()
      } else {
        proxy.$errorToast('请先保存')
      }
    }

    const saveDictionaryModify = () => {
      let hasEmpty = false
      targetInfoList.value.forEach(item => {
        if (item.dictionaryCode === '' || item.dictionaryOwner === '') {
          proxy.$errorToast('有漏填栏位')
          hasEmpty = true
        }
      })

      if (hasInputError.value === false && hasSelectError.value === false && hasEmpty === false) {
        const temp:{
            id:string
            permissionCode: string
            realName: string
            workNum: string
            projectPermission: boolean
            taskPermission: boolean
            recipePermission: boolean
            blueprintPermission: boolean
            productStandardPermission: boolean
            createTime: string
            modifiedTime: string
            modifierId: string | null
            modifierName: string | null
        }[] = []

        console.log('this.targetInfoList')
        console.log(targetInfoList.value)
        targetInfoList.value.forEach(item => {
          const tempDictionaryOwner = item.dictionaryOwner.split(' ')
          const tempChanger = item.changer.split(' ')
          temp.push({
            id: item.id,
            permissionCode: item.dictionaryCode,
            realName: tempDictionaryOwner[0],
            workNum: tempDictionaryOwner[1],
            projectPermission: item.project,
            taskPermission: item.task,
            recipePermission: item.formula,
            blueprintPermission: item.blueprint,
            productStandardPermission: item.standard,
            createTime: item.created,
            modifiedTime: item.changed,
            modifierId: tempChanger[1] === 'null' ? null : tempChanger[1],
            modifierName: tempChanger[0] === 'null' ? null : tempChanger[0]
          })
          item.isRedact = false
        })

        console.log('temp')
        console.log(temp)
        PERMISSION_SAVE_API(temp).then(({ data }) => {
          proxy.$successToast('保存成功')
          console.log('data')
          console.log(data)
        })
      }
    }
    // 导出
    const exportData = () => {
      // export to do
    }

    return {
      indexMethod,
      controllableForm,
      ownerList,
      currPage,
      pageSize,
      totalCount,
      targetInfoList,
      currentComponent,
      isEditDataSetItemShow,
      hasInputError,
      hasSelectError,
      exportData,
      addItem,
      saveDictionaryModify,
      editItem,
      handleSizeChange,
      handleCurrentChange,
      checkSelected,
      checkInput
    }
  }

})
</script>

<style lang="scss" scoped>
.dictionaryBox .el-checkbox {
    margin-right: 10px;
}

.view-area {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .newTable {
        flex-grow: 1;
    }
}
</style>
