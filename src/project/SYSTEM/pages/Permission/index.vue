<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-04-14 10:31:04
 * @LastEditors: Telliex
 * @LastEditTime: 2021-04-15 18:19:43
-->
<template>
    <div class="header_main">
        <mds-card title="权限属性" :name="'role'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template v-slot:titleBtn>
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-button v-if="isAuth('')" type="primary" size="small" @click="getItemsList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('')" type="primary" size="small" @click="addOrUpdateItem()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead" :data="targetInfoList.slice((currPage - 1) * pageSize, (currPage - 1) * pageSize + pageSize)" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" align="center" fixed />
                <el-table-column prop="propertyName" label="属性名称" :show-overflow-tooltip="true" min-width="150" />
                <el-table-column prop="propertyTable" label="属性所在表表名" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="propertyType" label="属性表结构类型" :formatter="formatter" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="propertyKey" label="属性表主键字段" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="propertyParentKey" label="属性表父节点字段" :show-overflow-tooltip="true" width="180" />
                <el-table-column prop="privilegeIdentity" label="属性表权限标识字段" :show-overflow-tooltip="true" width="180" />
                <el-table-column prop="privilegeIdentityName" label="属性表权限标识名称字段" :show-overflow-tooltip="true" width="180" />
                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" width="150" />
                <el-table-column label="操作" width="160" fixed="right">
                    <template v-slot="scope">
                        <el-button v-if="isAuth('')" type="text" class="role__btn" @click="addOrUpdateItem(scope.row)">
                            修改
                        </el-button>
                        <el-button v-if="isAuth('')" type="text" class="role__btn" @click="removeItems(scope.row.id)">
                            删除
                        </el-button>
                        <el-button v-if="isAuth('')" type="text" class="role__btn" @click="dataItems(scope.row)">
                            数据
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <permission-add-or-update v-if="isPermissionAddOrUpdateShow" ref="addOrUpdateItemRef" @refreshDataList="getItemsList(true)" />
        <permission-data-info v-if="isPermissionDataInfoShow" ref="dataInfoRef" @refreshDataList="getItemsList(true)" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick, getCurrentInstance, ComponentInternalInstance } from 'vue'
import PermissionAddOrUpdate from './PermissionAddAndUpdate.vue'
import PermissionDataInfo from './PermissionDataInfo.vue'
import { PROPERTY_QUERY, PROPERTY_DELETE } from '@/api/api'

// import { SYSTEMSETUP_API } from '@/api/api';

type TargetInfoList = {
  propertyName:string,
  propertyTable:string,
  propertyType:string,
  propertyKey:string,
  propertyParentKey:string,
  privilegeIdentity:string,
  privilegeIdentityName:string,
  remark:string,
}


export default defineComponent({
    name: 'PermissionManages',
    components: {
      PermissionAddOrUpdate,
      PermissionDataInfo
    },
    setup() {
        const ctx = getCurrentInstance() as ComponentInternalInstance
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const proxy = ctx.proxy as any
        // const factoryID = sessionStorage.getItem('factory').id // 工厂名称
        const isPermissionAddOrUpdateShow = ref(false)
        const isPermissionDataInfoShow = ref(false)

        // const controllableForm = ref({
        //   username: ''
        // })
        // const menuList = ref([])
        const currPage = ref(1)
        const pageSize = ref(10)
        const totalCount = ref(1)
        const targetInfoList = ref([])
        // const currentComponent = ref('')
        const addOrUpdateItemRef = ref()
        const dataInfoRef = ref()


        // 序号
        const indexMethod = (index: number) => {
          return index + 1 + (Number(currPage.value) - 1) * Number(pageSize.value)
        }
        // 获取角色列表
        const getItemsList = (st: boolean) => {
          if (st) {
            currPage.value = 1
            pageSize.value = 10
          }
          PROPERTY_QUERY({
          }).then(({ data }) => {
            targetInfoList.value = []
            if (data.data.length === 0) {
              proxy.$infoToast('暂无任何内容')
              totalCount.value = 0
              return false
            }
            targetInfoList.value = data.data
            totalCount.value = data.data.length
          })
        }
        // 新增或修改
        const addOrUpdateItem = async(obj?: TargetInfoList) => {
          isPermissionAddOrUpdateShow.value = true
          await nextTick()
          addOrUpdateItemRef.value.init(obj)
        }

        // 删除角色
        const removeItems = (id: string) => {
          proxy.$confirm('确认删除该角色, 是否继续?', '删除角色', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              PROPERTY_DELETE([id]).then(() => {
                proxy.$successToast('删除成功')
                getItemsList(true)
              })
            })
            .catch(() => {
              //
            })
        }
      // 数据
      const dataItems = async(obj?: TargetInfoList) => {
        isPermissionDataInfoShow.value = true
        await nextTick()
        dataInfoRef.value.init(obj)

      }
      // 改变每页条数
      const handleSizeChange = (val: number) => {
        pageSize.value = val
        // getItemsList();
      }
      // 跳转页数
      const handleCurrentChange = (val: number) => {
        currPage.value = val
        // getItemsList();
      }

      const formatter = (row:TargetInfoList) => {
        let propertyTypeName = ''
        if (row.propertyType === 'P') {
          propertyTypeName = '平铺结构'
        } else {
          propertyTypeName = '树结构'
        }
        return propertyTypeName
      }

      onMounted(() => {
        getItemsList(true)
      })

      return {
        indexMethod,
        getItemsList,
        currPage,
        pageSize,
        isPermissionAddOrUpdateShow,
        isPermissionDataInfoShow,
        addOrUpdateItemRef,
        dataInfoRef,
        addOrUpdateItem,
        removeItems,
        dataItems,
        handleSizeChange,
        handleCurrentChange,
        formatter
      }
    }
})

// export default {

//   data() {
//     return {
//       factoryID: sessionStorage.getItem('factory').id, // 工厂名称
//       isPermissionAddOrUpdateShow: false,
//       isPermissionDataInfoShow: false,

//       controllableForm: {
//         username: ''
//       },
//       menuList: [],
//       currPage: 1,
//       pageSize: 10,
//       totalCount: 1,
//       targetInfoList: [],
//       currentComponent: ''
//     }
//   },
//   computed: {
//     mainClientHeight() {
//       return this.$store.state.common.mainClientHeight
//     }
//   },

//  ,
//   methods: {

//   }
// }
</script>

<style scoped>

</style>
