<template>
  <OrgView
    ref="orgView"
    :title="'组织架构'"
    :right-title="'组织详细信息'"
    :type="'table'"
    @treeNodeClick="setdetail"
    @treeNodeContextMenu="showMenu"
  >
    <template #view style="padding-top: 16px;">
      <div class="detail-main clearfix">
        <div class="detail-main-form">
          <el-form :model="OrgDetail" size="small" :inline="true" label-width="90px" class="org-detail-form">
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
              <el-upload v-show="!detailImgFile" ref="orgImgUpload" class="org-img-upload" :show-file-list="false" :action="FILE_API" :disabled="isRedact" :limit="1" :http-request="httpRequest" :on-success="addfile">
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
          <el-button v-if="!isRedact && isAuth('deptEdit')" type="primary" size="small" @click="savedatail">
            保存
          </el-button>
          <el-button v-if="!isRedact && isAuth('deptDel')" type="danger" size="small" @click="deleteorg">
            删除
          </el-button>
        </div>
      </div>
    </template>
  </OrgView>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { USER_LIST, USER_DELETE } from '@/api/api'
export default defineComponent({
  name: 'OrgStructure',
  setup () {
    const isRedact = ref(false)
    const OrgDetail = ref({})
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
    const setDetail = (id: string) => {
      console.log(id)
    }

    return {
      isRedact,
      dataRule,
      OrgDetail,
      setRedact
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
