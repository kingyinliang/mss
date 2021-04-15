<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-03-16 15:22:39
 * @LastEditors: Telliex
 * @LastEditTime: 2021-04-15 22:23:19
-->
<template>
    <el-dialog :title="'权限标识 '+propertyTable" :close-on-click-modal="false" v-model="isDialogShow" width="80%" >
        <div class="inner-area">
            <div class="inner-area__title">
                <el-input v-model="searchString" placeholder="请输入权限标识" style="width: 200px; margin-right: 20px;" />
                <el-button v-if="isAuth('')" type="primary" size="small" @click="queryItems(searchString)">
                    查询
                </el-button>
                <el-button v-if="isAuth('')" type="primary" size="small" @click="addNewDataRow()">
                    新增
                </el-button>
            </div>
            <div class="inner-area__body">
                <div id="eagleMapContainer">
                    <div id="table-list">
                        <el-table v-loading="loading" class="newTable markStyle" :data="currentDataTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;">
                            <el-table-column width="200" :show-overflow-tooltip="true">
                                <template #header>
                                    <span class="notNull" />主键
                                </template>
                                <template #default="scope">
                                    <el-input v-model.trim="scope.row.propertyKey" size="small" placeholder="请输入主键" :disabled="!scope.row.isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template #header>
                                    <span class="notNull" />父节点
                                </template>
                                <template #default="scope">
                                    <el-input v-model.trim="scope.row.propertyParentKey" size="small" placeholder="请输入父节点" :disabled="!scope.row.isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template #header>
                                    <span class="notNull">* </span>权限标识
                                </template>
                                <template #default="scope">
                                    <el-input v-model.trim="scope.row.privilegeIdentity" size="small" placeholder="请输入权限标识" :disabled="!scope.row.isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template #header>
                                    <span class="notNull">* </span>权限标识描述
                                </template>
                                <template #default="scope">
                                    <el-input v-model.trim="scope.row.privilegeIdentityName" size="small" placeholder="请输入权限标识描述" :disabled="!scope.row.isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="100" :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <el-button type="text" size="mini" :disabled="scope.row.isRedact" @click="editFirstDataRow(scope.row)">
                                        修改
                                    </el-button>
                                    <el-button type="text" size="mini" @click="removeFirstDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button class="j_closeBtn" @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="submitDataTable">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
    import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
    import { PROPERTY_DATA_QUERY, PROPERTY_SAVE } from '@/api/api'
    import _ from 'lodash'


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

    interface CurrentDataTable{
        changed?: string;
        changer?: string;
        created?: string;
        creator?: string;
        id?: string;
        privilegeIdentity: string;
        privilegeIdentityName: string;
        propertyCode: string;
        propertyKey: string;
        propertyName: string;
        propertyParentKey: string;
        propertyTable: string;
        propertyType: string;
        remark: string;
        delFlag: number,
        isRedact: boolean
    }


    interface SaveList{
      privilegeIdentity:string;
      privilegeIdentityName:string;
      propertyKey:string;
      propertyParentKey:string;
    }

    interface SaveCom{
      deleteList:string[];
      propertyTable:string;
      saveList:SaveList[];
    }

    export default defineComponent({
        name: 'RoleaddAndUpdate',
        emits: ['refreshDataList'],
        setup(props, { emit }) {
          const ctx = getCurrentInstance() as ComponentInternalInstance
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const proxy = ctx.proxy as any
          const searchString = ref('')
          const propertyTable = ref('')
          const isDialogShow = ref(false)
          const currentDataTable = ref([] as CurrentDataTable[])
          const currentDataTableOrg = ref([])
          // const currentDataTableC = ref([])
          // const ruleForm = ref({})
          // const listPage = ref(0)
          // const list = ref(0)
          const loading = ref(true)

          const init = (obj:TargetInfoList) => {
            console.log(obj)
            loading.value = true;
            propertyTable.value = obj.propertyTable ? obj.propertyTable : '';
            queryItems('');
            isDialogShow.value = true;

          }

          // 编辑
          const queryItems = (str:string) => {
              PROPERTY_DATA_QUERY({
                  propertyTableName: propertyTable.value,
                  privilegeIdentity: str
              }).then(({ data }) => {
                  setTimeout(() => {
                      loading.value = false;
                  }, 3000);
                  currentDataTable.value = [];
                  currentDataTableOrg.value = [];
                  if (data.data.length === 0) {
                      proxy.$infoToast('暂无任何内容');
                      // totalCount = 0;
                      return false;
                  }
                  currentDataTable.value = JSON.parse(JSON.stringify(data.data));

                  currentDataTable.value.forEach(item => {
                      item.delFlag = 0
                      item.isRedact = false
                      item.id = item.propertyKey
                      // proxy.$set(item, 'delFlag', 0)
                      // proxy.$set(item, 'isRedact', false)
                      // proxy.$set(item, 'id', item.propertyKey)
                      // item.delFlag = 0;
                      // item.isRedact = false;
                  })
                  currentDataTableOrg.value = JSON.parse(JSON.stringify(currentDataTable.value));

              })
          }

          const addNewDataRow = () => {
              currentDataTable.value.unshift({
                  propertyKey: '',
                  propertyParentKey: '',
                  privilegeIdentity: '',
                  privilegeIdentityName: '',
                  propertyCode: '',
                  propertyName: '',
                  propertyType: '',
                  propertyTable: '',
                  delFlag: 0,
                  isRedact: true,
                  remark: ''
              })
          }


          // 删除
          const removeFirstDataRow = (row:CurrentDataTable) => {
                proxy.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // proxy.$set(row, 'delFlag', 1)
                    row.delFlag = 1
                    // this.$successToast('删除成功');

                });
          }

          const rowDelFlag = (row:CurrentDataTable) => {
                if (row.delFlag === 1) {
                    return 'rowDel';
                }
                return '';
          }
          const editFirstDataRow = (row:CurrentDataTable) => {
              // proxy.$set(row, 'isRedact', true)
              row.isRedact = true
              // row.isRedact = true
          }

          // 重置
          const closeDialog = () => {
              // document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
              // this.$refs.currentDataTable.resetFields();
              currentDataTable.value = [];
              currentDataTableOrg.value = [];
              isDialogShow.value = false
          }


          const submitDataTable = () => {
                const dataArr = currentDataTable.value.filter(it => it.delFlag !== 1 && it.isRedact === true)
                for (let i = 0; i < dataArr.length; i++) {
                    if (!dataArr[i].privilegeIdentity || !dataArr[i].privilegeIdentityName) {
                        proxy.$warningToast('请填写必填项');
                        return false
                    }
                }

                const dataTemp:SaveCom = {
                  deleteList: [], //
                  propertyTable: propertyTable.value, //
                  saveList: [] //
                };

                const indexTemp = currentDataTable.value.filter(subItem => !subItem.id) ? currentDataTable.value.filter(subItem => !subItem.id).length : 0;

                currentDataTable.value.forEach((item, index) => {
                    if (item.delFlag === 1) {
                        if (item.id) {
                            dataTemp.deleteList.push(item.propertyKey)
                        }
                    } else if (item.isRedact) {
                        if (item.id) {
                            const itemTemp = JSON.parse(JSON.stringify(item));
                            delete itemTemp.isRedact
                            const currentData = JSON.parse(JSON.stringify(currentDataTableOrg.value[index - indexTemp]));
                            delete currentData.isRedact
                            if (!_.isEqual(currentData, itemTemp)) {
                                dataTemp.saveList.push(item)
                            }
                        } else {
                            dataTemp.saveList.push(item)
                        }
                    }
                })

                PROPERTY_SAVE(
                    dataTemp
                ).then(() => {
                    emit('refreshDataList')
                    proxy.$successToast('保存成功');
                    isDialogShow.value = false;
                })

            }

          return {
            init,
            queryItems,
            isDialogShow,
            addNewDataRow,
            removeFirstDataRow,
            rowDelFlag,
            editFirstDataRow,
            closeDialog,
            submitDataTable,
            searchString,
            loading,
            currentDataTable,
            propertyTable
          }
        }
})
</script>

<style scoped>
#eagleMapContainer {
    min-height: 150px;
    max-height: 300px;
    margin-top: 10px;
    overflow-y: auto;
}
#eagleMapContainer::-webkit-scrollbar {
    width: 6px; /* 对垂直流动条有效 */
    height: 6px;
}
#eagleMapContainer::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
}
#eagleMapContainer::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

/* 定义右下角汇合处的样式 */
#eagleMapContainer::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0.2);
}

</style>

<style lang="scss" scoped>
    .el-form-item {
        margin-bottom: 0;
    }
    .inner-area {
        padding: 10px 5px;
        .inner-area__title {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
            h3 {
                font-weight: bold;
                font-size: 14px !important;
                line-height: 32px;
                .title-icon {
                    display: inline-block;
                    width: 4px;
                    height: 12px;
                    margin-top: 10px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 2px;
                }
                .point-icon {
                    width: 5px;
                    height: 5px;
                    margin-top: 13px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 3px;
                }
            }
        }
        .inner-area__body {
            .table-style-light {
                .el-table__header {
                    th {
                        color: white;
                        text-align: center;
                        background: #e8e8e8;
                        background-color: #e8e8e8 !important;
                        border-top: none;
                        border-right: none;
                        border-bottom: none;
                        border-left: none;
                    }
                }
                .el-table__body {
                    td {
                        padding: 0;
                    }
                }
                tr:nth-child(even) {
                    background-color: #f7f7f7;
                }
                .el-table__row {
                    td:first-child {
                        border-left: 2px solid transparent;
                    }
                }
                .hover-row {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }
                .el-table__row:hover {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }

                .el-input.is-disabled .el-input__inner {
                    width: 100%;
                    overflow: hidden;
                    color: #666 !important;
                    background: none;
                    border: none;
                }
            }
        }
    }

    .default {
        display: block;
        padding: 2px 20px;
        background: #f5f5f5;
        border-radius: 4px;
    }


    .dialog-footer {
        margin-top: 10px;
        text-align: right;
    }


</style>
