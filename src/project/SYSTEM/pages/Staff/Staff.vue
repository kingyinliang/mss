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
        <el-table-column v-if="targetInfoList.length!==0" label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button v-if="isAuth('userEdit')" style="padding: 0;" type="text" @click="addOrUpdateItem(scope.row.id)">
              编辑
            </el-button>
            <el-button v-if="isAuth('userEdit')" style="padding: 0;" type="text" @click="updateTenant(scope.row)">
              分配租户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </template>
  </OrgView>
  <StaffAddOrUpdate ref="addOrUpdateItemRef" v-model="isDialogShow" :org-tree="orgTree" @refreshDataList="getItemsList"/>
  <el-dialog v-model="tenantVisible" :title="`${selectUser.realName}（${selectUser.workNum}）租户选择`" :close-on-click-modal="false" width="736px">
    <div class="uaer-detail">
      <el-transfer
        v-model="selectTenantId"
        filterable
        :titles="['未分配租户', '已分配租户']"
        :filter-method="filterMethodTenant"
        filter-placeholder="请输入租户名称"
        :data="tenantList"
        :props="{key: 'systemCode',label: 'systemName'}"
      >
        <template #default="{option}">
          <el-tooltip class="item" effect="dark" :content="option.systemName" placement="top-end">
            <span>{{ option.systemName }}</span>
          </el-tooltip>
        </template>
      </el-transfer>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="tenantVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="UpdateUserTenant">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
  defineComponent,
  getCurrentInstance,
  ref,
  nextTick,
  onMounted
} from 'vue'
import {
  USER_LIST,
  USER_DELETE,
  GET_TENANT_BY_USER_ID,
  TENANT_BY_USER_SAVE,
  GET_SELECT_TENANT_BY_USER_ID
} from '@/api/api'
import StaffAddOrUpdate from './StaffAddOrUpdate.vue'

interface DeptObject {
  id: string;
  deptName: string;
  factory: string;
  children: DeptObject[];
}
interface User{
  id: string
  deptId: string
  roleName: string
}
interface Tenant{
  id: string
  systemCode: string
  systemName: string
}
export default defineComponent({
  name: 'Staff',
  components: {
    StaffAddOrUpdate
  },
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
    const addOrUpdateItemRef = ref()
    const isDialogShow = ref(false)
    const orgTree = ref([] as DeptObject[])

    const tenantList = ref([])
    const selectUser = ref({} as User)
    const selectTenantId = ref([] as string[])
    const tenantVisible = ref(false)

    // 获取人员
    const showOrgDetail = (data: DeptObject) => {
      deptID.value = data.id
      deptName.value = data.deptName
      getItemsList()
    }
    // 设置组织架构
    const setDeptId = (data: DeptObject[]) => {
      orgTree.value = data
      deptID.value = data[0].id
      deptName.value = data[0].deptName
      factory.value = data[0].factory
      getItemsList()
    }
    // 获取人员
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
    // 新增修改
    const addOrUpdateItem = async (id:string) => {
      if (deptID.value) {
        isDialogShow.value = true
        await nextTick()
        addOrUpdateItemRef.value.init(deptID.value, deptName.value, factory.value, id)
      } else {
        proxy.$errorToast('请先选择部门')
      }
    }
    // 批量删除
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
    // 分页
    const handleSizeChange = (val:number) => {
      pageSize.value = val
      getItemsList()
    }
    // 分页
    const handleCurrentChange = (val:number) => {
      currPage.value = val
      getItemsList()
    }
    // 穿梭框过滤
    const filterMethodTenant = (query:string, item:Tenant) => {
      return item.systemName.indexOf(query) > -1
    }
    // 分配租户
    const updateTenant = async (row:User) => {
      selectUser.value = row
      const res = await GET_SELECT_TENANT_BY_USER_ID({ userId: row.id })
      selectTenantId.value = res.data.data
      tenantVisible.value = true
    }
    // 分配租户确定
    const UpdateUserTenant = async () => {
      await TENANT_BY_USER_SAVE({
        deptId: selectUser.value.deptId,
        userId: selectUser.value.id,
        tenantList: selectTenantId.value
      })
      proxy.$successToast('操作成功')
      tenantVisible.value = false
      getItemsList()
    }

    onMounted(async () => {
      const userInfo: User = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
      const res = await GET_TENANT_BY_USER_ID({ userId: userInfo.id })
      tenantList.value = res.data.data
    })

    return {
      orgTree,
      isDialogShow,
      search,
      totalCount,
      currPage,
      pageSize,
      targetInfoList,
      multipleSelection,
      addOrUpdateItemRef,
      selectTenantId,
      tenantList,
      selectUser,
      tenantVisible,
      filterMethodTenant,
      updateTenant,
      UpdateUserTenant,
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
