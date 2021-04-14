<template>
  <el-dialog title="功能分配" width="540px" :close-on-click-modal="false" v-model="isDialogShow">
    <div>
      <el-tree
        ref="menuListTreeRef"
        :data="menuList"
        :props="{label: 'menuName',children: 'children'}"
        node-key="id"
        :default-expand-all="false"
        :expand-on-click-node="false"
        show-checkbox
      />
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
import { ROLE_MENU_LIST, ROLE_MENU_ADD, ROLE_MENU } from '@/api/api'

interface MenuData{
  id: string
  _level: number;
  parentId: string
  menuName: string
  remark: string
  children: MenuData[]
}
interface Temp {
  [key:string]: MenuData
}
export default defineComponent({
  name: 'FunctionManage',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const roleId = ref('')
    const isDialogShow = ref(false)
    const menuList = ref([] as MenuData[])
    const menuListTreeRef = ref()

    const init = (id: string) => {
      roleId.value = id
      ROLE_MENU_LIST({
        roleId: id
      }).then(({ data }) => {
        const maenData = (data.data as MenuData[]).filter(item => item.id !== '0')
        maenData.forEach(item => {
          item.menuName = item.menuName + ' ' + item.remark
        })
        menuList.value = translateTreeData(maenData)
      }).then(() => {
        isDialogShow.value = true
      }).then(() => {
        ROLE_MENU({
          roleId: id
        }).then((res) => {
          menuListTreeRef.value.setCheckedKeys(res.data.data)
        })
      })
    }
    const translateTreeData = (data: MenuData[]): MenuData[] => {
      const res = []
      const temp:Temp = {}
      for (let i = 0; i < data.length; i++) {
        temp[data[i].id] = data[i]
      }
      for (let k = 0; k < data.length; k++) {
        if (temp[data[k].parentId] && data[k].id !== data[k].parentId) {
          if (!temp[data[k].parentId].children) {
            temp[data[k].parentId].children = []
          }
          if (!temp[data[k].parentId]._level) {
            temp[data[k].parentId]._level = 1
          }
          data[k]._level = temp[data[k].parentId]._level + 1
          temp[data[k].parentId].children.push(data[k])
        } else {
          res.push(data[k])
        }
      }
      return res
    }
    const submitDataForm = () => {
      ROLE_MENU_ADD({
        roleId: roleId.value,
        menuId: [].concat(menuListTreeRef.value.getCheckedKeys()).concat(menuListTreeRef.value.getHalfCheckedKeys())
      }).then(() => {
        isDialogShow.value = false
        emit('refreshDataList')
      })
    }

    return {
      menuListTreeRef,
      isDialogShow,
      menuList,
      init,
      submitDataForm
    }
  }
})
</script>

<style scoped>

</style>
