<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-21 13:57:11
 * @LastEditors: Telliex
 * @LastEditTime: 2021-04-20 15:50:44
-->

<template>
    <div class="header_main">
        <mds-card title="数据集" :name="'dataSet'" :pack-up="false" style="margin-bottom: 0; background: #fff;" class="view-area">
            <template #titleBtn>
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="controllableForm.owner" placeholder="所有人" size="small" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList" />
                    <el-button type="primary" size="small" :disabled="controllableForm.owner.trim()===''" @click="getItemsList(true,controllableForm.owner)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="addItem">
                        新增
                    </el-button>
                    <el-button v-if="false" type="primary" size="small" @click="exportData">
                        导出
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead"  :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
                <el-table-column prop="groupCode" label="数据集编码" :show-overflow-tooltip="true" min-width="200" />
                <el-table-column prop="remark" label="数据集描述" :show-overflow-tooltip="true" min-width="180" />
                <el-table-column prop="realName" label="拥有人" width="160">
                    <template #default="scope">
                        {{ scope.row.realName }} {{ scope.row.workNum }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="modifiedTime" label="修改时间" width="160" />
                <el-table-column prop="changer" label="修改人" width="160">
                    <template #default="scope">
                        {{ scope.row.modifierName }} {{ scope.row.modifierId }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="scope">
                        <el-button type="text" class="role__btn" @click="editItem(scope.row)">
                            编辑
                        </el-button>
                        |
                        <el-button type="text" class="role__btn" @click="duplicationItem(scope.row)">
                            复制
                        </el-button>
                        |
                        <el-button type="text" class="role__btn" @click="removeItems(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <edit-data-set-item v-if="isEditDataSetItemShow" ref="editDataSetItemRef" :owner-list="ownerList" :permission-item-list="{projectArray:projectArray,taskArray:taskArray,standardArray:standardArray,formulaArray:formulaArray,blueprintArray:blueprintArray}" @refreshDataList="getItemsList(true)" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import { PERMISSION_LIST_PERMISSIONCODE_API, PERMISSION_GROUP_QUERY_API, PERMISSION_REMOVE_API, USER_LIST } from '@/api/api'

import EditDataSetItem from './AddAndUpdateDataSetItem.vue'

interface Options{
  label:string;
  value:string;
}

interface TargetInfoList{
  id:string;
  groupCode:string;
  remark:string;
  realName:string;
  workNum:string;
  createTime:string;
  modifiedTime:string;
}

export default defineComponent({
  name: 'DataSetManages',
  components: {
    EditDataSetItem
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proxy = ctx.proxy as any
    // const factoryID =  sessionStorage.getItem('factory').id
    const controllableForm = ref({
      owner: ''
    })
    const currPage = ref(1)
    const pageSize = ref(10)
    const totalCount = ref(1)
    const targetInfoList = ref([])
    // const currentComponent =ref('')
    const isEditDataSetItemShow = ref(true)
    const ownerList = ref<Options[]>([]) // 拥有人清单
    // const searchString= ref('')
    const projectArray = ref([])
    const taskArray = ref([])
    const standardArray = ref([])
    const formulaArray = ref([])
    const blueprintArray = ref([])
    const editDataSetItemRef = ref()

    // 序号
    const indexMethod = (index:number) => {
      return index + 1 + (Number(currPage.value) - 1) * Number(pageSize.value)
    }

    // 获取数据集列表
    const getItemsList = (haveParas = false, who = '') => {
      if (haveParas) {
        currPage.value = 1
      }
      PERMISSION_GROUP_QUERY_API({
        current: currPage.value,
        size: pageSize.value,
        owner: who
      }).then(({ data }) => {
        if (haveParas && data.data.records.length === 0) {
          proxy.$infoToast('暂无任何内容')
        }
        targetInfoList.value = data.data.records
        currPage.value = data.data.current
        pageSize.value = data.data.size
        totalCount.value = data.data.total
      })
    }

    // [BTN:新增] 新增数据集 item
    const addItem = async (obj:TargetInfoList) => {
      await nextTick()
      editDataSetItemRef.value.init(obj, '新增数据集')
    }

    // [BTN:编辑] 编辑数据集 item
    const editItem = async (obj:TargetInfoList) => {
      console.log(obj)
      await nextTick()
      editDataSetItemRef.value.init(obj, '编辑数据集')
    }

    // [BTN:复制]:复制数据集 item
    const duplicationItem = async (obj:TargetInfoList) => {
      await nextTick()
      editDataSetItemRef.value.init(obj, '复制数据集')
    }

    // [BTN:删除]:删除数据集 item
    const removeItems = (item:TargetInfoList) => {
      proxy.$confirm('确认删除该数据集, 是否继续?', '删除数据集', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(item)
          PERMISSION_REMOVE_API({ groupId: item.id }).then(() => {
            proxy.$successToast('删除成功')
            getItemsList()
          }).catch(() => {
            //
          })
        })
    }
    // 改变每页条数
    const handleSizeChange = (val:number) => {
      pageSize.value = val
      getItemsList()
    }

    // 跳转页数
    const handleCurrentChange = (val:number) => {
      currPage.value = val
      getItemsList()
    }

    // 导出
    const exportData = () => {
      // export to do
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
        const dataTemp:TargetInfoList[] = data.data.records
        dataTemp.forEach(item => {
          ownerList.value.push({ value: item.realName + ' ' + item.workNum, label: item.realName + ' ' + item.workNum })
        })
      })

      // 呼叫属性选项
      PERMISSION_LIST_PERMISSIONCODE_API({
      }).then(({ data }) => {
        projectArray.value = data.data.project
        taskArray.value = data.data.task
        standardArray.value = data.data.productsAndStrands
        formulaArray.value = data.data.recipe
        blueprintArray.value = data.data.blueprint
      })
    })

    return {
      controllableForm,
      targetInfoList,
      indexMethod,
      currPage,
      pageSize,
      getItemsList,
      addItem, // 新增数据集 item
      editDataSetItemRef,
      exportData,
      handleCurrentChange,
      removeItems,
      editItem,
      duplicationItem,
      totalCount,
      handleSizeChange,
      isEditDataSetItemShow,
      ownerList,
      projectArray,
      taskArray,
      standardArray,
      formulaArray,
      blueprintArray
    }
  }

})
</script>

<style lang="scss" scoped>
.dataSetBox .el-button + .el-button {
    margin-left: 0;
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
