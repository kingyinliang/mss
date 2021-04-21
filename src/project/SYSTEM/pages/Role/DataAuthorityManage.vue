<template>
    <el-dialog title="数据权限" :close-on-click-modal="false" v-model="isDialogShow">
        <h3>角色名称-{{ roleName }}</h3>
        <div style="max-height: 53vh; overflow: auto;">
            <div v-for="(item,index) in topicList" :key="index">
                <h4 @click="controlShow(index)">
                    <span class="el-icon-document" />
                    {{ item.topic }}
                </h4>
                <el-tree
                    v-show="!item.hide"
                    :ref="setItemRef"
                    :data="item.orgTree"
                    :props="{
                        label: 'privilegeIdentityName',
                        children: 'children'
                    }"
                    node-key="id"
                    :default-expand-all="false"
                    :render-after-expand="false"
                    show-checkbox
                    style="margin-left: 20px;"
                />
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
              <el-button @click="isDialogShow = false">取消</el-button>
              <el-button type="primary" @click="submitDataForm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance, nextTick, onBeforeUpdate, onUpdated } from 'vue'
import { treeDataTranslateOfNormal, TreeDataBbj } from '@/utils'
import { SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY, SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID, SYS_PERMISSION_ATTRIBUTE_SAVE } from '@/api/api'
import { ElTree } from 'element-plus'

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
  orgTree: TreeDataBbj[];

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
    // must know ref type
    let itemRefs:typeof ElTree[] = []
    // const deptListTree1Ref = ref()
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
            hide: true,
            ref: `deptListTree${index + 1}Ref`
          })
        })
        console.log('topicList')
        console.log(topicList.value)
        isDialogShow.value = true
      }).then(() => {
        SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID({
          roleId: roleID.value
        }).then(({ data: res }) => {
          nextTick(() => {
            for (let i = 1; i <= topicList.value.length; i++) {
              itemRefs[i - 1].setCheckedKeys(res.data)
            }
          })
        })
      })
    }

    onBeforeUpdate(() => {
      itemRefs = []
    })

    onUpdated(() => {
      console.log('ref update')
      console.log(itemRefs)
    })

    // 提交
    const submitDataForm = () => {
      let checkList:string[] = []
      for (let i = 1; i <= topicList.value.length; i++) {
        checkList = checkList.concat(itemRefs[i - 1].getCheckedKeys()).concat(itemRefs[i - 1].getHalfCheckedKeys())
      }
      const listTemp: {privilegeId:string}[] = []

      checkList.forEach(item => {
        listTemp.push({
          privilegeId: item
        })
      })

      SYS_PERMISSION_ATTRIBUTE_SAVE({
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

    const setItemRef = (el:typeof ElTree) => {
      console.log('el-tree ref getting')
      console.log(typeof el)
      console.log(el)
      itemRefs.push(el)
    }

    return {
      init,
      roleName,
      submitDataForm,
      topicList,
      isDialogShow,
      controlShow,
      setItemRef,
      ...itemRefs.map(item => { return item })
      // deptListTree1Ref
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
