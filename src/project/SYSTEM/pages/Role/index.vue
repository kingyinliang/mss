<template>
  <mds-card title="角色信息列表" name="role" :pack-up="false" style="background: #fff;">
    <template #titleBtn>
      <div style="float: right; height: 32px; margin-bottom: 10px;">
        <el-input v-model="roleName" placeholder="角色名称" size="small" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList()" />
        <el-button v-if="isAuth('roleQuery')" type="primary" size="small" :disabled="roleName.trim()===''" @click="()=>{currPage = 1;getItemsList()}">
          查询
        </el-button>
        <el-button v-if="isAuth('roleInsert')" type="primary" size="small" @click="addOrUpdateItem()">
          新增
        </el-button>
      </div>
    </template>
    <el-table :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;">
      <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
      <el-table-column prop="roleName" label="角色名称" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column prop="creator" label="创建人" :show-overflow-tooltip="true" width="150" />
      <el-table-column prop="created" label="创建时间" :show-overflow-tooltip="true" width="140" />
      <el-table-column prop="changer" label="修改人" :show-overflow-tooltip="true" width="140" />
      <el-table-column prop="changed" label="修改时间" width="180" />
      <el-table-column label="操作" min-width="430" fixed="right">
        <template #default="scope">
          <el-button v-if="isAuth('roleDeptCfg')" type="text" class="role__btn" @click="manageDepartment(scope.row.id)">
            部门分配
          </el-button>
          <el-button v-if="isAuth('roleMenuCfg')" type="text" class="role__btn" @click="manageFunction(scope.row.id)">
            功能分配
          </el-button>
          <el-button v-if="isAuth('roleUserCfg')" type="text" class="role__btn" @click="manageUser(scope.row.id)">
            人员管理
          </el-button>
          <el-button v-if="isAuth('')" type="text" class="role__btn" @click="manageDataAuthority(scope.row)">
            数据权限
          </el-button>
          <el-button v-if="isAuth('roleEdit')" type="text" class="role__btn" @click="addOrUpdateItem(scope.row)">
            修改角色
          </el-button>
          <el-button v-if="isAuth('roleDel')" type="text" class="role__btn" @click="removeItems(scope.row.id)">
            删除角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </mds-card>
  <RoleAddAndUpdate ref="addOrUpdateItemRef" v-if="isRoleAddOrUpdateShow" @refreshDataList="getItemsList" />
  <DepartmentManage ref="manageDepartmentRef" v-if="isDepartmentManageShow" @refreshDataList="getItemsList" />
  <UserManage ref="manageUserRef" v-if="isUserManageShow" @refreshDataList="getItemsList" />
  <FunctionManage ref="functionManageRef" v-if="isFunctionManageShow" @refreshDataList="getItemsList" />
  <DataAuthorityManage ref="manageataAuthorityRef" v-if="isDataAuthorityManageShow" @refreshDataList="getItemsList" />

</template>

<script lang="ts">
import {
  onMounted,
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  nextTick,
  ref
} from 'vue'
import { ROLE_LIST, ROLE_REMOVE } from '@/api/api'
import RoleAddAndUpdate from './RoleAddAndUpdate.vue'
import UserManage from './UserManage.vue'
import DepartmentManage from './DepartmentManage.vue'
import FunctionManage from './FunctionManage.vue'
import DataAuthorityManage from './DataAuthorityManage.vue'

// interface DataObject{
//     changed: string;
//     changer: string;
//     created: string;
//     creator: string;
//     id: string;
//     remark: string;
//     roleCode: string;
//     roleName: string;
//     tempFlag: string;
// }
export default defineComponent({
  name: 'RolePage',
  components: {
    RoleAddAndUpdate,
    UserManage,
    DepartmentManage,
    FunctionManage,
    DataAuthorityManage
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line
    const proxy = ctx.proxy as any
    const roleName = ref('')
    const targetInfoList = ref([])
    const currPage = ref(1)
    const pageSize = ref(10)
    const totalCount = ref(0)
    const isFunctionManageShow = ref(false)
    const functionManageRef = ref()
    const isUserManageShow = ref(false)
    const manageUserRef = ref()
    const isDepartmentManageShow = ref(false)
    const manageDepartmentRef = ref()
    const isRoleAddOrUpdateShow = ref(false)
    const addOrUpdateItemRef = ref()
    const isDataAuthorityManageShow = ref(false)
    const manageataAuthorityRef = ref()

    const indexMethod = (index: number) => {
      return index + 1 + (Number(currPage.value) - 1) * Number(pageSize.value)
    }
    const getItemsList = () => {
      ROLE_LIST({
        current: currPage.value,
        size: pageSize.value,
        roleName: roleName.value
      }).then(({ data }) => {
        targetInfoList.value = data.data.records
        currPage.value = data.data.current
        pageSize.value = data.data.size
        totalCount.value = data.data.total
        isFunctionManageShow.value = false
        isUserManageShow.value = false
        isDepartmentManageShow.value = false
        isRoleAddOrUpdateShow.value = false
      })
    //  a
    }
    // 人员管理
    const manageUser = async (id?: string) => {
      isUserManageShow.value = true
      await nextTick()
      manageUserRef.value.init(id)
    }
    // 功能管理
    const manageFunction = async (id?: string) => {
      isFunctionManageShow.value = true
      await nextTick()
      functionManageRef.value.init(id)
    }
    // 数据权限管理 test
    const manageDataAuthority = async (obj?: string) => {
      isDataAuthorityManageShow.value = true
      await nextTick()
      manageataAuthorityRef.value.init(obj)
    }
    // 部门管理
    const manageDepartment = async (id?: string) => {
      isDepartmentManageShow.value = true
      await nextTick()
      manageDepartmentRef.value.init(id)
    }
    // 新增或修改
    const addOrUpdateItem = async (obj?: string) => {
      isRoleAddOrUpdateShow.value = true
      await nextTick()
      addOrUpdateItemRef.value.init(obj)
    }
    // 删除角色
    const removeItems = (id: string) => {
      proxy.$confirm('确认删除该角色, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ROLE_REMOVE({ id: id }).then(() => {
          getItemsList()
        })
      })
    }
    // 改变每页条数
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      getItemsList()
    }
    // 跳转页数
    const handleCurrentChange = (val: number) => {
      currPage.value = val
      getItemsList()
    }

    onMounted(() => {
      getItemsList()
    })
    return {
      roleName,
      targetInfoList,
      currPage,
      pageSize,
      totalCount,
      isFunctionManageShow,
      isUserManageShow,
      isDepartmentManageShow,
      isRoleAddOrUpdateShow,
      isDataAuthorityManageShow,
      addOrUpdateItemRef,
      manageDepartmentRef,
      manageUserRef,
      functionManageRef,
      manageataAuthorityRef,
      indexMethod,
      getItemsList,
      manageUser,
      manageFunction,
      manageDataAuthority,
      manageDepartment,
      addOrUpdateItem,
      removeItems,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>

</style>
