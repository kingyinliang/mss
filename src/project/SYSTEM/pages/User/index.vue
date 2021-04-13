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
      <el-table-column width="80" label="操作">
        <template #default="scope">
          <el-button v-if="isAuth('userReset')" style="padding: 0;" type="text" @click="PasswordReset(scope.row.id)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="dataForm.current" :page-sizes="[10, 20, 50]" :page-size="dataForm.size" layout="total, sizes, prev, pager, next, jumper" :total="dataForm.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </mds-card>
  <el-dialog v-model="visible" :title="`${selctUser.realName}（${selctUser.workNum}）角色选择`" :close-on-click-modal="false" width="740px">
    <div class="uaer-detail">
      <el-transfer
        v-model="selctRoleId"
        filterable
        :titles="['未分配角色', '已分配角色']"
        :filter-method="filterMethod"
        filter-placeholder="请输入角色名称"
        :data="RoleList"
        :props="{key: 'id',label: 'roleName'}"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="visible = false">取消</el-button>
        <el-button type="primary" size="small" @click="UpdateUserRole">确定</el-button>
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
import { USER_LIST, USER_PASSWORD_RESET, USER_ROLE_DROPDOWN, USER_ROLE_UPDATE } from '@/api/api'

interface Role{
  id: string
  roleName: string
}
interface User{
  id: string
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
    const selctUser = ref({} as User)
    const RoleList = ref([])
    const selctRoleId = ref([] as string[])
    const visible = ref(false)

    const GetList = () => {
      USER_LIST(dataForm).then(({ data }) => {
        UserList.value = data.data.records
        dataForm.current = data.data.current
        dataForm.size = data.data.size
        dataForm.totalCount = data.data.total
      })
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
    const updateRole = (row:User) => {
      selctUser.value = row
      selctRoleId.value = []
      row.roles.forEach(item => {
        selctRoleId.value.push(item.id)
      })
      visible.value = true
    }
    const UpdateUserRole = () => {
      USER_ROLE_UPDATE({
        userId: selctUser.value.id,
        roleId: selctRoleId.value
      }).then(({ data }) => {
        proxy.$successToast(data.msg)
        visible.value = false
        GetList()
      })
    }
    const filterMethod = (query:string, item:Role) => {
      return item.roleName.indexOf(query) > -1
    }
    const indexMethod = (index:number) => {
      return index + 1 + (dataForm.current - 1) * (Number(dataForm.size))
    }
    const handleSizeChange = (val:number) => {
      dataForm.size = val
      GetList()
    }
    const handleCurrentChange = (val:number) => {
      dataForm.current = val
      GetList()
    }

    onMounted(() => {
      GetList()
      getRoleList()
    })
    return {
      dataForm,
      UserList,
      visible,
      selctUser,
      RoleList,
      selctRoleId,
      filterMethod,
      PasswordReset,
      updateRole,
      GetList,
      UpdateUserRole,
      indexMethod,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>

</style>
