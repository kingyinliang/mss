<template>
  <OrgView
    ref="orgView"
    title="人员管理"
    :right-title="'人员'"
    :type="'table'"
    @treeNodeClick="showOrgDetail"
    @getTreeSuccess="setDeptId"
  >
    <template #view style="padding-top: 16px;">
      <div style="float: right">
        <el-input v-model="search" placeholder="工号/姓名" size="small" suffix-icon="el-icon-search" clearable style="width: 180px; margin-right: 16px;" />
        <el-button v-if="isAuth('userQuery')" type="primary" size="small" @click="()=>{currPage=1;getItemsList()}">
          查询
        </el-button>
        <el-button v-if="isAuth('userDel')" type="danger" size="small" :disabled="targetInfoList.length===0" @click="removeItems()">
          批量删除
        </el-button>
        <el-button v-if="isAuth('userInsert')" type="primary" size="small" @click="addOrUpdateItem()">
          增加
        </el-button>
      </div>
      <el-table :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;" @selection-change="(val)=>{multipleSelection = val}">
        <el-table-column type="selection" width="50" fixed align="center" />
        <el-table-column type="index" label="序号" :index="(index) => index + 1 + (Number(currPage) - 1) * (Number(pageSize))" width="50" fixed />
        <el-table-column prop="workNum" label="人员工号" width="120" />
        <el-table-column prop="realName" label="人员姓名" width="100" />
        <el-table-column prop="deptName" label="所属部门" width="180" :show-overflow-tooltip="true" />
        <el-table-column prop="sex" label="性别" :show-overflow-tooltip="true" width="60">
          <template #default="scope">
            {{ scope.row.sex === 'M'? '男' : scope.row.sex === 'F'? '女' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="postName" label="职务" :show-overflow-tooltip="true" width="160" />
        <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" width="260" />
        <el-table-column prop="phone" label="手机号" :show-overflow-tooltip="true" width="120" />
        <el-table-column prop="created" label="创建日期" width="180" />
        <el-table-column v-if="targetInfoList.length!==0" label="操作" fixed="right" width="65">
          <template #default="scope">
            <el-button v-if="isAuth('userEdit')" style="padding: 0;" type="text" @click="addOrUpdateItem(scope.row.id)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </template>
  </OrgView>
</template>

<script lang="ts">
import { ComponentInternalInstance, ComponentPublicInstance, defineComponent, getCurrentInstance, ref } from 'vue'
import { USER_LIST, USER_DELETE } from '@/api/api'

interface DeptObject {
  id: string;
  deptName: string;
  factory: string;
  children: DeptObject[];
}
export default defineComponent({
  name: 'Staff',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as ComponentPublicInstance
    const search = ref('')
    const totalCount = ref(0)
    const currPage = ref(1)
    const pageSize = ref(10)
    const multipleSelection = ref([] as DeptObject[])
    const targetInfoList = ref([])
    const deptID = ref('')
    const deptName = ref('')
    const factory = ref('')
    const isDialogShow = ref(false)

    const showOrgDetail = (data: DeptObject) => {
      deptID.value = data.id
      deptName.value = data.deptName
      getItemsList()
    }
    const setDeptId = (data: DeptObject[]) => {
      deptID.value = data[0].id
      deptName.value = data[0].deptName
      factory.value = data[0].factory
      getItemsList()
    }
    const getItemsList = () => {
      if (!deptID.value) {
        proxy.$errorToast('请选择组织层级')
        return
      }
      USER_LIST({
        deptId: deptID.value,
        workNum: search.value,
        current: currPage.value,
        size: pageSize.value
      }).then(({ data }) => {
        multipleSelection.value = []
        targetInfoList.value = data.data.records
        currPage.value = data.data.current
        pageSize.value = data.data.size
        totalCount.value = data.data.total
        isDialogShow.value = false
      })
    }
    const addOrUpdateItem = () => {
      console.log(1)
    }
    const removeItems = () => {
      const idList: string[] = []
      multipleSelection.value.forEach(item => {
        idList.push(item.id)
      })
      if (idList.length === 0) {
        proxy.$warningToast('请选择要删除的用户')
      } else {
        USER_DELETE({
          ids: idList
        }).then(() => {
          proxy.$successToast('操作成功')
          multipleSelection.value = []
          getItemsList()
        })
      }
    }
    const handleSizeChange = (val:number) => {
      pageSize.value = val
      getItemsList()
    }
    const handleCurrentChange = (val:number) => {
      currPage.value = val
      getItemsList()
    }

    return {
      search,
      totalCount,
      currPage,
      pageSize,
      targetInfoList,
      multipleSelection,
      removeItems,
      addOrUpdateItem,
      getItemsList,
      showOrgDetail,
      setDeptId,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>

</style>
