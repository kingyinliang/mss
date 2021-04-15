<template>
  <el-dialog v-model="dialogFormVisible" :title="dataForm.id ? '修改租户' : '新增租户'" width="400px" >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="120px" size="small">
      <el-form-item label="租户名称：" prop="systemName">
        <el-input v-model="dataForm.systemName" :placeholder="'租户名称'" />
      </el-form-item>
      <el-form-item label="租户编码：" prop="systemCode">
        <el-input v-model="dataForm.systemCode" :placeholder="'租户编码'" />
      </el-form-item>
      <el-form-item label="背景图：">
        <div v-if="bgImg" class="org-img-upload el-upload-list el-upload-list--picture-card">
          <div class="el-upload-list__item is-success avatar">
            <img class="flex-img__image avatar" :src="bgImg">
            <label class="el-upload-list__item-status-label">
              <em class="el-icon-upload-success el-icon-check" />
            </label>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                  <em class="el-icon-delete" @click.stop="removeFile('bg')" />
              </span>
            </span>
          </div>
        </div>
        <el-upload v-show="!bgImg" ref="bgImgRef" class="org-img-upload" :show-file-list="false" :action="FILE_API" :limit="1" :http-request="(options)=>{httpRequest(options, 'bg')}" :on-success="addFile">
          <em class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="logo：">
        <div v-if="logoImg" class="org-img-upload el-upload-list el-upload-list--picture-card">
          <div class="el-upload-list__item is-success avatar">
            <img class="flex-img__image avatar" :src="logoImg">
            <label class="el-upload-list__item-status-label">
              <em class="el-icon-upload-success el-icon-check" />
            </label>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                  <em class="el-icon-delete" @click.stop="removeFile('logo')" />
              </span>
            </span>
          </div>
        </div>
        <el-upload v-show="!logoImg" ref="logoImgRef" class="org-img-upload" :show-file-list="false" :action="FILE_API" :limit="1" :http-request="(options)=>{httpRequest(options, 'logo')}" :on-success="addFile">
          <em class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="dataFormSubmit()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TENANT_ADD, TENANT_UPDATE, UPLOAD_FILE } from '@/api/api'
import axios from 'axios'

type System = {
  id: string
  backgroundImg?: string
  logoImg?: string
}
export default defineComponent({
  name: 'SystemAddOrUpdate',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const dialogFormVisible = ref(false)
    const dataForm = ref({} as System)
    const dataFormRef = ref()
    const logoImg = ref('')
    const bgImg = ref('')
    const logoImgRef = ref()
    const bgImgRef = ref()
    const FILE_API = ref('')
    const dataRule = {
      systemName: [
        {
          required: true,
          message: '租户名称不能为空',
          trigger: 'blur'
        }
      ],
      systemCode: [
        {
          required: true,
          message: '租户编码不能为空',
          trigger: 'blur'
        }
      ]
    }

    const init = (row:System) => {
      if (row) {
        dataForm.value = JSON.parse(JSON.stringify(row))
      } else {
        dataForm.value = { id: '' }
      }
      dialogFormVisible.value = true
    }
    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          const net = dataForm.value.id ? TENANT_UPDATE : TENANT_ADD
          net(dataForm.value).then(() => {
            emit('refreshDataList')
          })
        }
      })
    }
    // eslint-disable-next-line
    const httpRequest = (options: any, str: string) => {
      UPLOAD_FILE({
        name: options.file.name
      }).then(({ data }) => {
        FILE_API.value = data.data.url
        axios.put(data.data.url, options.file).then(res => {
          if (res.status === 200) {
            options.onSuccess(data.data.key, options, str)
          }
        })
      })
    }
    // eslint-disable-next-line
    const addFile = (key: string, options: any, str: string) => {
      if (str === 'bg') {
        dataForm.value.backgroundImg = key
        bgImg.value = URL.createObjectURL(options.raw)
      } else {
        dataForm.value.logoImg = key
        logoImg.value = URL.createObjectURL(options.raw)
      }
    }
    const removeFile = (str: string) => {
      if (str === 'bg') {
        bgImgRef.value.clearFiles()
        bgImg.value = ''
        dataForm.value.backgroundImg = ''
      } else {
        logoImgRef.value.clearFiles()
        logoImg.value = ''
        dataForm.value.logoImg = ''
      }
    }

    return {
      FILE_API,
      init,
      dataFormSubmit,
      httpRequest,
      addFile,
      removeFile,
      logoImg,
      bgImg,
      logoImgRef,
      bgImgRef,
      dataRule,
      dataForm,
      dataFormRef,
      dialogFormVisible
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>
