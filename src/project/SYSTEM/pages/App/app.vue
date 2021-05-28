<template>
  <mds-card
    title="apk管理"
    name="apk"
    :pack-up="false"
    style="margin-bottom: 0; background: white;"
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="120px" size="small" style="width: 550px;">
      <el-form-item label="当前版本号：">
        {{ version }}
        <a :href="downUrl" download>下载</a>
      </el-form-item>
      <el-form-item label="版本号：" prop="appVersion">
        <el-input v-model="dataForm.appVersion" placeholder="请输入版本号：" style="width: 400px;" />
      </el-form-item>
      <el-form-item label="上传apk：" prop="appName">
        <el-upload
          class="upload-demo"
          drag
          :action="FILE_API"
          multiple
          :http-request="httpRequest"
          :on-success="addfile"
        >
          <em class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
        <el-progress v-if="uploadP !==0 " :percentage="uploadP" />
      </el-form-item>
      <el-form-item label="更新内容：" prop="versionInfo">
        <el-input v-model="dataForm.versionInfo" type="textarea" :rows="7" placeholder="请输入更新内容：" style="width: 400px;" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="dataFormSubmit()">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </mds-card>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref
} from 'vue'
import axios from 'axios'
import { APP_SAVE, UPLOAD_APK, APP_VERSION } from '@/api/api'
export default defineComponent({
  name: 'AppPage',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as ComponentPublicInstance
    const FILE_API = ref('')
    const dataFormRef = ref()
    const dataForm = ref({
      appName: '',
      forceFlag: '1', // 强制升级 0:非强制，1：强制, 默认非强制 0
      appVersion: '',
      versionInfo: ''
    })
    const dataRule = {
      appName: [
        {
          required: true,
          message: '上传apk',
          trigger: 'blur'
        }
      ],
      appVersion: [
        {
          required: true,
          message: '版本号不能为空',
          trigger: 'blur'
        }
      ],
      versionInfo: [
        {
          required: true,
          message: '更新内容不能为空',
          trigger: 'blur'
        }
      ]
    }
    const downUrl = ref('')
    const version = ref('')
    const uploadP = ref(0)

    // eslint-disable-next-line
    const httpRequest = (options:any):void => {
      UPLOAD_APK({
        appVersion: process.env.VUE_APP_ENV + dataForm.value.appVersion
      }).then(({ data }) => {
        FILE_API.value = data.data.url
        axios.put(data.data.url, options.file, {
          onUploadProgress: progressEvent => {
            uploadP.value = (progressEvent.loaded / progressEvent.total * 100 | 0)
          }
        }).then(res => {
          if (res.status === 200) {
            options.onSuccess(data.data.key)
          }
        })
      })
    }
    const addfile = (key: string):void => {
      dataForm.value.appName = key
    }
    const dataFormSubmit = ():void => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          APP_SAVE(dataForm.value).then(() => {
            proxy.$successToast('操作成功')
          })
        }
      })
    }

    onMounted(() => {
      APP_VERSION().then(({ data }) => {
        version.value = data.data.appVersion
        downUrl.value = data.data.downLoadUrl
      })
    })

    return {
      version,
      downUrl,
      dataFormRef,
      dataForm,
      dataRule,
      FILE_API,
      uploadP,
      addfile,
      httpRequest,
      dataFormSubmit
    }
  }
})
</script>

<style scoped>

</style>
