<template>
    <el-dialog title="数据权限" :close-on-click-modal="false" v-model="isDialogShow" class="myDialog">
        <h3>角色名称-{{ roleName }}</h3>
        <div style="max-height: 53vh; overflow: auto;">
            <div v-for="(item,index) in topicList" :key="index">
                <h4 @click="controlShow(index)">
                    <span class="el-icon-document" />
                    {{ item.topic }}
                </h4>
                <el-tree
                    v-show="!item.hide"
                    :ref="item.ref"
                    :data="item.orgTree"
                    :props="{
                        label: 'privilegeIdentityName',
                        children: 'children'
                    }"
                    node-key="id"
                    :default-expand-all="false"
                    :render-after-expand="false"
                    show-checkbox
                    children="list"
                    style="margin-left: 20px;"
                />
            </div>
        </div>
        <template #footer>
          <span  class="dialog-footer">
              <el-button @click="isDialogShow = false">取消</el-button>
              <el-button type="primary" @click="submitDataForm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import { treeDataTranslateOfNormal, MenuBbjV2 } from '@/utils'
import { SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY, SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID, SYS_PERMISSION_ATTRIBUTE_SAVE } from '@/api/api'

interface DataObject{
  changed: string;
  changer: string;
  created: string;
  creator: string;
  id: string;
  remark: string;
  roleCode: string;
  roleName: string;
  tempFlag: string;
}

interface OrgTreeList{
  id: string;
  parentId: string;
  privilegeCode: string;
  privilegeIdentity: string;
  privilegeIdentityName: string;
  privilegeName: string;
  _level: number;
  children: [];

}

interface TopicList{
  topic: string;
  hide: boolean;
  ref: string;
  orgTree: MenuBbjV2[];

}

interface Obj{
  privilegeId:string;
}

interface DataTemp{
  propertyCode:string;
  propertyName:string;
  list: OrgTreeList[];
}

export default defineComponent({
  name: 'DepartmentManage',
  components: {},
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proxy = ctx.proxy as any
    const roleID = ref('')
    const roleName = ref('')
    const isDialogShow = ref(false)
    const topicList = ref<TopicList[]>([])
    const refList = ref<HTMLFormElement[]>([])

    const deptListTree1Ref = ref()
    // const deptListTree2Ref = ref()

    // 获取组织结构树
    const init = (row:DataObject) => {
      console.log('row')
      console.log(row)
      roleID.value = row.id
      roleName.value = row.roleName
      topicList.value = []

      SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY({
      }).then(({ data }) => {
        const dataTemp: DataTemp[] = JSON.parse(JSON.stringify(data.data))
        console.log('dataTemp')
        console.log(dataTemp)

        dataTemp.forEach((item, index) => {
          topicList.value.push({
            topic: item.propertyName,
            orgTree: treeDataTranslateOfNormal(item.list),
            // orgTree: item.list,
            hide: true,
            ref: `deptListTree${index + 1}Ref`
          })
          refList.value.push(deptListTree1Ref.value)
        })
        console.log('refList')
        console.log(refList)
        isDialogShow.value = true
      }).then(() => {
        SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID({
          roleId: roleID.value
        }).then(({ data: res }) => {
          nextTick(() => {
            console.log('res4444444444444')
            console.log(res)
            for (let i = 1; i <= topicList.value.length; i++) {
              // refList.value[0].setCheckedKeys(res.data)
              // [refList[i].value[0].setCheckedKeys(res.data)
              deptListTree1Ref.value.setCheckedKeys(res.data)
              // deptListTree2Ref.value.setCheckedKeys(res.data)
            }

            // deptListTree1Ref.value.setCheckedKeys(res.data)
          })
        })
      })
    }

    // 提交
    const submitDataForm = () => {
      let checkList:string[] = []
      // for (let i = 1; i <= topicList.value.length; i++) {
      //   checkList = checkList.concat(this.$refs[`deptListTree${i}`][0].getCheckedKeys()).concat(this.$refs[`deptListTree${i}`][0].getHalfCheckedKeys())
      // }
      checkList = checkList.concat(deptListTree1Ref.value.getCheckedKeys()).concat(deptListTree1Ref.value.getHalfCheckedKeys())

      const listTemp: Obj[] = []

      checkList.forEach(item => {
        listTemp.push({
          privilegeId: item
          // privilegeIdentity: 1
        })
      })

      SYS_PERMISSION_ATTRIBUTE_SAVE({
        // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        roleId: roleID.value,
        list: listTemp
      }).then(() => {
        proxy.$successToast('设置成功')
        emit('refreshDataList')
        isDialogShow.value = false
      })
    }

    const controlShow = (index:number) => {
      topicList.value[index].hide = !topicList.value[index].hide
    }

    const setItemRef = () => {
      // refList.value.push(ref)
      // console.log('refList.value')
      // console.log(refList.value)
    }

    return {
      init,
      roleName,
      submitDataForm,
      topicList,
      isDialogShow,
      controlShow,
      setItemRef,
      deptListTree1Ref
      // deptListTree2Ref
    }
  }

})
</script>

<style lang="scss" scoped>
.el-tree-node__expand-icon {
    display: none;
}

    h3 {
        position: relative;
        margin: 5px 10px 15px;
    }
    h3::before {
        position: absolute;
        top: 2px;
        bottom: 0;
        left: -9px;
        width: 4px;
        height: 12px;
        background: #487bff;
        border-radius: 2px;
        content: "";
    }
    h4 {
        position: relative;
        margin: 5px 20px 10px;
    }

    // h4::before {
    //     position: absolute;
    //     top: 4px;
    //     bottom: 0;
    //     left: -11px;
    //     width: 0;
    //     height: 0;
    //     border-color: transparent transparent transparent #454545;
    //     border-style: solid;
    //     border-width: 4px 0 4px 6px;
    //     content: "";
    // }

</style>
