<template>
  <mds-card title="用户列表" name="user" :pack-up="false" style="background: #fff;">
    <template #titleBtn>
      <el-form :model="dataForm" size="small" label-width="110px" style="float: right; height: 32px; margin-bottom: 10px;" @keyup.enter="() => {dataForm.current = 1; GetList()}">
        <el-form-item>
          <el-input v-model="dataForm.workNum" placeholder="用户名" class="input-with-select" size="small" style="width: 280px; margin-right: 16px;">
            <template #prepend>
              <el-select v-model="dataForm.authorized" placeholder="请选择" style="width: 90px;">
                <el-option label="有权限" :value="1" />
                <el-option label="无权限" :value="0" />
              </el-select>
            </template>
          </el-input>
          <el-button v-if="isAuth('userQuery')" type="primary" size="small" @click="() => {dataForm.current = 1; GetList()}">
            查询
          </el-button>
          <el-button type="primary" size="small" @click="exportUser">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table ref="table1" class="newTable" border header-row-class-name="tableHead" :data="UserList" tooltip-effect="dark">
      <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
      <el-table-column label="用户名" width="200" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ `${scope.row.realName}（${scope.row.workNum}）` }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button style="padding: 0;" type="text" @click="updateRole(scope.row)">
            <span v-for="(item, index) in scope.row.roles" :key="index">{{ item.roleName + ' ' }}</span>
            <span v-if="scope.row.roles.length === 0">点击分配角色</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="120" label="操作">
        <template #default="scope">
          <el-button v-if="isAuth('userReset')" style="padding: 0;" type="text" @click="PasswordReset(scope.row.id)">
            重置密码
          </el-button>
          <el-button style="padding: 0;" type="text" @click="Unlock(scope.row.workNum)">
            解锁
          </el-button>
          <!--<el-button style="padding: 0;" type="text" @click="updateTenant(scope.row)">
            分配租户
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="dataForm.current" :page-sizes="[10, 20, 50]" :page-size="dataForm.size" layout="total, sizes, prev, pager, next, jumper" :total="dataForm.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </mds-card>
  <el-dialog v-model="visible" :title="`${selectUser.realName}（${selectUser.workNum}）角色选择`" :close-on-click-modal="false" width="736px">
    <div class="uaer-detail">
      <el-transfer
        v-model="selectRoleId"
        filterable
        :titles="['未分配角色', '已分配角色']"
        :filter-method="filterMethod"
        filter-placeholder="请输入角色名称"
        :data="RoleList"
        :props="{key: 'id',label: 'roleName'}"
      >
        <template #default="{option}">
          <el-tooltip class="item" effect="dark" :content="option.roleName" placement="top-end">
            <span>{{ option.roleName }}</span>
          </el-tooltip>
        </template>
      </el-transfer>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="visible = false">取消</el-button>
        <el-button type="primary" size="small" @click="UpdateUserRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
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
  onMounted,
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  ref,
  reactive
} from 'vue'
import {
  USER_LIST,
  USER_PASSWORD_RESET,
  USER_ROLE_DROPDOWN,
  USER_ROLE_UPDATE,
  USER_UNLOCK,
  USER_EXPORT,
  GET_TENANT_BY_USER_ID,
  TENANT_BY_USER_SAVE,
  GET_SELECT_TENANT_BY_USER_ID
} from '@/api/api'

interface Role{
  id: string
  roleName: string
}
interface Tenant{
  id: string
  systemCode: string
  systemName: string
}
interface User{
  id: string
  deptId: string
  roleName: string
  roles: Role[]
}
export default defineComponent({
  name: 'UserPage',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line
    const proxy = ctx.proxy as any
    const dataForm = reactive({
      factory: 'common',
      workNum: '',
      authorized: 1,
      current: 1,
      size: 10,
      totalCount: 0
    })
    const UserList = ref([] as User[])
    const selectUser = ref({} as User)
    const RoleList = ref([])
    const tenantList = ref([])
    const selectRoleId = ref([] as string[])
    const selectTenantId = ref([] as string[])
    const visible = ref(false)
    const tenantVisible = ref(false)

    // 查询
    const GetList = () => {
      USER_LIST(dataForm).then(({ data }) => {
        UserList.value = data.data.records
        dataForm.current = data.data.current
        dataForm.size = data.data.size
        dataForm.totalCount = data.data.total
      })
    }
    // 导出
    const exportUser = async () => {
      const res = await USER_EXPORT()
      const elink = document.createElement('a')
      elink.download = '用户管理导出.xls'
      elink.style.display = 'none'
      elink.href = res.data.data.url
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }
    // 获取角色列表
    const getRoleList = () => {
      USER_ROLE_DROPDOWN({}).then(({ data }) => {
        RoleList.value = data.data
      })
    }
    // 重置密码
    const PasswordReset = (id:string) => {
      proxy.$confirm('确认重置密码, 是否继续?', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        USER_PASSWORD_RESET({
          id: id
        }).then(({ data }) => {
          proxy.$successToast(data.msg)
        })
      })
    }
    // 修改用户角色
    const updateRole = (row:User) => {
      selectUser.value = row
      selectRoleId.value = []
      row.roles.forEach(item => {
        selectRoleId.value.push(item.id)
      })
      visible.value = true
    }
    // 修改用户角色确定
    const UpdateUserRole = () => {
      USER_ROLE_UPDATE({
        userId: selectUser.value.id,
        roleId: selectRoleId.value
      }).then(({ data }) => {
        proxy.$successToast(data.msg)
        visible.value = false
        GetList()
      })
    }
    // 穿梭框过滤
    const filterMethod = (query:string, item:Role) => {
      return item.roleName.indexOf(query) > -1
    }
    const filterMethodTenant = (query:string, item:Tenant) => {
      return item.systemName.indexOf(query) > -1
    }
    // table index
    const indexMethod = (index:number) => {
      return index + 1 + (dataForm.current - 1) * (Number(dataForm.size))
    }
    // 分页
    const handleSizeChange = (val:number) => {
      dataForm.size = val
      GetList()
    }
    // 分页
    const handleCurrentChange = (val:number) => {
      dataForm.current = val
      GetList()
    }
    // 解锁
    const Unlock = (workNum:string) => {
      proxy.$confirm('确认解锁, 是否继续?', '解锁', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await USER_UNLOCK({ workNum })
        proxy.$successToast(res.data.msg)
      })
    }
    // 分配租户
    const updateTenant = async (row:User) => {
      selectUser.value = row
      const res = await GET_SELECT_TENANT_BY_USER_ID({ userId: row.id })
      selectTenantId.value = res.data.data.map((it:Tenant) => it.systemCode)
      tenantVisible.value = true
    }
    // 分配租户确定
    const UpdateUserTenant = async () => {
      await TENANT_BY_USER_SAVE({
        deptId: selectUser.value.deptId,
        userId: selectUser.value.id,
        tenantList: selectTenantId.value
      })
    }

    onMounted(async () => {
      GetList()
      getRoleList()
      const userInfo: User = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
      const res = await GET_TENANT_BY_USER_ID({ userId: userInfo.id })
      tenantList.value = res.data.data
    })
    return {
      dataForm,
      UserList,
      tenantList,
      visible,
      tenantVisible,
      selectUser,
      RoleList,
      selectRoleId,
      selectTenantId,
      updateTenant,
      exportUser,
      Unlock,
      filterMethod,
      filterMethodTenant,
      PasswordReset,
      updateRole,
      GetList,
      UpdateUserRole,
      UpdateUserTenant,
      indexMethod,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.uaer-detail{
  /deep/.el-transfer-panel{
    width: 300px;
  }
}
</style>
