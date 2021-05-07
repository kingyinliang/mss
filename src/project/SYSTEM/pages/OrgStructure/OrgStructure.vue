<template>
  <OrgView
    ref="orgViewRef"
    :title="'组织架构'"
    :right-title="'组织详细信息'"
    :type="'table'"
    @treeNodeClick="setDetail"
    @treeNodeContextMenu="showMenu"
  >
    <template #view style="padding-top: 16px;">
      <div class="detail-main clearfix">
        <div class="detail-main-form">
          <el-form :model="OrgDetail" size="small" :inline="true" label-width="98px" class="org-detail-form">
            <el-form-item label="部门编码：">
              <el-input v-model="OrgDetail.deptCode" :disabled="true" auto-complete="off" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="部门名称：">
              <el-input v-model="OrgDetail.deptName" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="上级部门：">
              <el-input v-model="OrgDetail.parentName" :disabled="true" auto-complete="off" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="部门简称：">
              <el-input v-model="OrgDetail.deptShort" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="生产调度员：">
              <el-input v-model="OrgDetail.dispatchMan" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="部门类型：">
              <el-select v-model="OrgDetail.deptType" :disabled="isRedact" style="width: 250px;">
                <el-option v-for="(item, index) in dictList" :key="index" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="产线属性：">
              <el-select v-model="OrgDetail.properties" placeholder="请选择部门类型" :disabled="isRedact" style="width: 250px;">
                <el-option label="普通产线" value="普通产线" />
                <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="成本中心：">
              <el-input v-model="OrgDetail.costCenter" auto-complete="off" :disabled="isRedact" style="width: 250px;" />
            </el-form-item>
            <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="产线图片：">
              <div v-if="detailImgFile" class="org-img-upload el-upload-list el-upload-list--picture-card" style="display: block; width: 250px;">
                <div class="el-upload-list__item is-success avatar">
                  <img class="flex-img__image avatar" :src="detailImgFile">
                  <label class="el-upload-list__item-status-label">
                    <em class="el-icon-upload-success el-icon-check" />
                  </label>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete">
                        <em class="el-icon-delete" @click.stop="() => { if (!isRedact) { removeFile() } }" />
                    </span>
                  </span>
                </div>
              </div>
              <el-upload v-show="!detailImgFile" ref="orgImgUploadRef" class="org-img-upload" :show-file-list="false" :action="FILE_API" :disabled="isRedact" :limit="1" :http-request="httpRequest" :on-success="addFile">
                <em class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input v-model="OrgDetail.lxr" :disabled="isRedact" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="OrgDetail.phone" :disabled="isRedact" style="width: 250px;" />
            </el-form-item>
            <el-form-item label="备注：">
              <el-input v-model="OrgDetail.remark" type="textarea" :disabled="isRedact" style="width: 590px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="org-detail-btn">
          <el-button v-if="isAuth('deptEdit')" type="primary" size="small" @click="setRedact">
            {{ isRedact? '编辑' : '取消' }}
          </el-button>
          <el-button v-if="!isRedact && isAuth('deptEdit')" type="primary" size="small" @click="saveDetail">
            保存
          </el-button>
          <el-button v-if="!isRedact && isAuth('deptDel')" type="danger" size="small" @click="deleteDetail">
            删除
          </el-button>
        </div>
      </div>
    </template>
  </OrgView>
  <el-dialog v-model="dialogFormVisible1" :title="sibling ? '新增同级' : '新增下级'" width="400px" >
    <el-form ref="dataFormRef" :model="addDep" :rules="dataRule" size="small" label-position="left" label-width="100px">
      <el-form-item label="部门编号：" prop="deptCode">
        <el-input v-model="addDep.deptCode" auto-complete="off" />
      </el-form-item>
      <el-form-item label="部门名称：" prop="deptName">
        <el-input v-model="addDep.deptName" auto-complete="off" />
      </el-form-item>
      <el-form-item label="部门简称：">
        <el-input v-model="addDep.deptShort" auto-complete="off" />
      </el-form-item>
      <el-form-item label="上级部门：">
        <el-input v-model="addDep.parentName" disabled />
      </el-form-item>
      <el-form-item label="生产调度员：">
        <el-input v-model="addDep.dispatchMan" />
      </el-form-item>
      <el-form-item label="部门类型：" prop="deptType">
        <el-select v-model="addDep.deptType" placeholder="请选择部门类型" style="width: 100%;">
          <el-option v-for="(item, index) in dictList" :key="index" :label="item.dictValue" :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="产线属性：">
        <el-select v-model="addDep.properties" placeholder="请选择产线属性" style="width: 100%;">
          <el-option label="普通产线" value="普通产线" />
          <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="成本中心：">
        <el-input v-model="addDep.costCenter" auto-complete="off" />
      </el-form-item>
      <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="产线图片：">
        <div v-if="addImgFile" class="org-img-upload el-upload-list el-upload-list--picture-card">
          <div class="el-upload-list__item is-success avatar">
            <img class="flex-img__image avatar" :src="addImgFile">
            <label class="el-upload-list__item-status-label">
              <em class="el-icon-upload-success el-icon-check" />
            </label>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                  <em class="el-icon-delete" @click.stop="removeFile()" />
              </span>
            </span>
          </div>
        </div>
        <el-upload v-show="!addImgFile" ref="orgImgUploadRef" class="org-img-upload" :show-file-list="false" :action="FILE_API" :limit="1" :http-request="httpRequest" :on-success="addFile">
          <em class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input v-model="addDep.lxr" auto-complete="off" />
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model="addDep.phone" auto-complete="off" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="addDep.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible1 = false">
          取消
        </el-button>
        <el-button type="primary" size="small" @click="addOrg">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <ul v-show="menuVisible" id="menu">
    <li v-if="isAuth('deptInsert')" class="menuli" @click="menuClick(true, clickTreeNode.parentName, clickTreeNode.parentId)">
      新增同级
    </li>
    <li v-if="isAuth('deptInsert')" class="menuli" @click="menuClick(false, clickTreeNode.deptName, clickTreeNode.id)">
      新增下级
    </li>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'
import axios from 'axios'
import { ORG_DETAIL, DOWNLOAD_FILE, DICT_QUERY, ORG_UPDATE, ORG_DELETE, UPLOAD_FILE, ORG_ADD } from '@/api/api'

interface OrgData{
  id: string
  deptCode?: string
  imgUrl?: string
  parentName?: string
  parentId?: string
  factory?: string
}
export default defineComponent({
  name: 'OrgStructure',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    // eslint-disable-next-line
    const proxy = ctx.proxy as any
    const isRedact = ref(true)
    const OrgDetail = ref({} as OrgData)
    const clickTreeNode = ref({} as OrgData)
    const addDep = ref({} as OrgData)
    const dictList = ref([])
    const FILE_API = ref('')
    const dataFormRef = ref()
    const orgViewRef = ref()
    const orgImgUploadRef = ref()
    const sibling = ref(false)
    const menuVisible = ref(false)
    const dialogFormVisible1 = ref(false)
    const addImgFile = ref('')
    const detailImgFile = ref('')
    const extendId = ref('')
    const dataRule = {
      deptCode: [
        {
          required: true,
          message: '部门编号不能为空',
          trigger: 'blur'
        }
      ],
      deptName: [
        {
          required: true,
          message: '部门名称不能为空',
          trigger: 'blur'
        }
      ],
      deptType: [
        {
          required: true,
          message: '部门类型不能为空',
          trigger: 'blur'
        }
      ]
    }

    const setRedact = () => {
      if (!isRedact.value) {
        setDetail({ id: OrgDetail.value.id })
      }
      isRedact.value = !isRedact.value
    }
    const setDetail = (row: OrgData) => {
      ORG_DETAIL({
        id: row.id || 1
      }).then(({ data }) => {
        if (data.code === 200) {
          OrgDetail.value = data.data
          if (OrgDetail.value.imgUrl) {
            orgImgUploadRef.value.clearFiles()
            DOWNLOAD_FILE({
              key: OrgDetail.value.imgUrl
            }).then((res) => {
              detailImgFile.value = res.data.data.url
            })
          } else {
            detailImgFile.value = ''
          }
        }
      })
    }
    const getDictList = () => {
      DICT_QUERY({
        dictType: 'COMMON_DEPT_TYPE'
      }).then(({ data }) => {
        dictList.value = data.data
      })
    }
    const showMenu = (event: MouseEvent, object: OrgData) => {
      clickTreeNode.value = object
      menuVisible.value = true
      const menu = document.querySelector('#menu') as HTMLDivElement
      menu.style.left = event.clientX + 'px'
      menu.style.top = event.clientY + 'px'
    }
    const menuClick = (sibling1:boolean, parentName:string, parentId:string) => {
      dialogFormVisible1.value = true
      setTimeout(() => {
        addDep.value = { id: '' }
        addImgFile.value = ''
        sibling.value = sibling1
        addDep.value.parentName = parentName
        addDep.value.parentId = parentId
        extendId.value = parentId
      }, 100)
    }
    const saveDetail = () => {
      proxy.$confirm('确认修改部门, 是否继续?', '修改部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ORG_UPDATE(OrgDetail.value).then(() => {
          proxy.$successToast('操作成功')
          detailImgFile.value = ''
          isRedact.value = true
          setDetail({ id: OrgDetail.value.id })
        })
      })
    }
    const addOrg = () => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          addDep.value.factory = clickTreeNode.value.factory
          ORG_ADD(addDep.value).then(({ data }) => {
            if (data.code === 200) {
              proxy.$successToast('操作成功')
              orgViewRef.value.getTree(false, extendId.value)
              addDep.value = { id: '' }
              dialogFormVisible1.value = false
            }
          })
        }
      })
    }
    const deleteDetail = () => {
      proxy.$confirm('确认删除部门, 是否继续?', '删除部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ORG_DELETE({
          id: OrgDetail.value.id
        }).then(() => {
          proxy.$successToast('操作成功')
          orgViewRef.value.getTree()
          OrgDetail.value = { id: '' }
        })
      })
    }
    // eslint-disable-next-line
    const httpRequest = (options: any) => {
      UPLOAD_FILE({
        name: options.file.name
      }).then(({ data }) => {
        FILE_API.value = data.data.url
        axios.put(data.data.url, options.file).then(res => {
          if (res.status === 200) {
            options.onSuccess(data.data.key, options)
          }
        })
      })
    }
    // eslint-disable-next-line
    const addFile = (key: string, options: any) => {
      if (dialogFormVisible1.value) {
        addDep.value.imgUrl = key
        addImgFile.value = URL.createObjectURL(options.raw)
      } else {
        OrgDetail.value.imgUrl = key
        detailImgFile.value = URL.createObjectURL(options.raw)
      }
    }
    const removeFile = () => {
      orgImgUploadRef.value.clearFiles()
      detailImgFile.value = ''
      addImgFile.value = ''
      OrgDetail.value.imgUrl = ''
      addDep.value.imgUrl = ''
    }

    onMounted(() => {
      getDictList()
      document.addEventListener('click', e => {
        const target = e.target as Element
        if (target.className !== 'menuli') menuVisible.value = false
      })
    })
    return {
      dataFormRef,
      dialogFormVisible1,
      orgViewRef,
      menuVisible,
      sibling,
      isRedact,
      dataRule,
      dictList,
      OrgDetail,
      addDep,
      FILE_API,
      orgImgUploadRef,
      detailImgFile,
      addImgFile,
      clickTreeNode,
      menuClick,
      httpRequest,
      addFile,
      addOrg,
      removeFile,
      showMenu,
      setDetail,
      setRedact,
      deleteDetail,
      saveDetail
    }
  }
})
</script>

<style scoped lang="scss">
  #menu {
    position: fixed;
    z-index: 99;
    margin: 0;
    padding: 10px;
    list-style: none;
    background: white;
    border-radius: 5px;
    box-shadow: 2px 2px 25px 5px rgba(213, 221, 238, 0.45);
    cursor: pointer;

    li {
      line-height: 28px;
    }
  }
  .el-upload-list {
    .avatar {
      display: block;
      width: 58px;
      height: 58px;
    }
  }

  .org-img-upload {
    width: 250px;
    height: 58px;
    text-align: left;

    ::v-deep .el-upload {/* stylelint-disable-line */
      position: relative;
      overflow: hidden;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
    }
    ::v-deep .el-upload:hover {/* stylelint-disable-line */
      border-color: #409eff;
    }
    ::v-deep .avatar-uploader-icon {/* stylelint-disable-line */
      width: 58px;
      height: 58px;
      color: #8c939d;
      font-size: 28px;
      line-height: 58px;
      text-align: center;
    }

    ::v-deep .avatar {/* stylelint-disable-line */
      display: block;
      width: 58px;
      height: 58px;
    }
    ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
      width: 60px;
      height: 60px;
      line-height: 70px;
    }

    ::v-deep .el-upload-list--picture-card .el-upload-list__item {/* stylelint-disable-line */
      width: 60px;
      height: 60px;
    }
  }

  .limit-upload {
    ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
      display: none;
    }
  }

  .org-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 500px;
    overflow: hidden;
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 4px;
    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

    ::v-deep .el-tree-node__expand-icon {/* stylelint-disable-line */
      color: #487bff;
    }

    .org-card_title {
      height: 40px;
      padding-left: 10px;
      color: white;
      line-height: 40px;
      background: rgba(72, 123, 255, 1);
    }

    .filter-input {
      padding: 6px 10px;
    }

    .tree-main {
      flex: 1;
      overflow-y: scroll;
    }

    .detail-main {
      padding-top: 20px;

      .detail-main-form {
        margin: auto;
      }

      .org-detail-form {
        display: flex;
        flex-flow: row wrap;
        min-width: 700px;
        margin: auto;
        text-align: center;
      }
    }

    .org-detail-btn {
      float: right;
      padding-bottom: 10px;
    }
    .org-detail-btn__fix {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
</style>
