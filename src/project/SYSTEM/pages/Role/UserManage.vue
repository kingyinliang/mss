<template>
  <el-dialog title="人员管理" width="540px" :close-on-click-modal="false" v-model="isDialogShow">
    <div>
      <el-transfer
        v-model="selectedUserID"
        filterable
        :titles="['未分配人员', '已分配人员']"
        :filter-method="filterMethod"
        filter-placeholder="请输入用户名称"
        :data="userList" />
    </div>
    <template #footer>
      <span class="dialog-footer">
          <el-button class="j_closeBtn" @click="isDialogShow = false">取消</el-button>
          <el-button type="primary" @click="submitDataForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ROLE_USER, ROLE_USER_ADD } from '@/api/api'
interface DataList{
  selection: string
  userName: string
  workNum: string
  userId: string
}
interface UserList{
  label: string;
  key: string;
  screncon: string;
}
interface ReturnData{
  res: UserList[],
  selectedID: string[]
}
export default defineComponent({
  name: 'UserManage',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const roleId = ref('')
    const isDialogShow = ref(false)
    const userList = ref([] as UserList[])
    const selectedUserID = ref([] as string[])

    const filterMethod = (query: string, item: UserList) => {
      return item.screncon.indexOf(query) > -1
    }
    const transfer = (data: DataList[]): ReturnData => {
      const res: UserList[] = []
      const selectedID: string[] = []
      data.forEach(item => {
        if (item.selection === '1') {
          selectedID.push(item.userId)
        }
        res.push({
          label: item.userName + '(' + item.workNum + ')',
          key: item.userId,
          screncon: item.userName + ' ' + item.workNum
        })
      })
      return {
        res: res,
        selectedID: selectedID
      }
    }
    const init = (id: string) => {
      roleId.value = id
      ROLE_USER({ roleId: id }).then(({ data }) => {
        const finalData = transfer(data.data)
        userList.value = finalData.res
        selectedUserID.value = finalData.selectedID
        isDialogShow.value = true
      })
    }
    const submitDataForm = () => {
      ROLE_USER_ADD({
        roleId: roleId.value,
        userId: selectedUserID.value
      }).then(() => {
        emit('refreshDataList')
        isDialogShow.value = false
      })
    }

    return {
      isDialogShow,
      userList,
      selectedUserID,
      filterMethod,
      init,
      submitDataForm
    }
  }
})
</script>

<style scoped>

</style>
