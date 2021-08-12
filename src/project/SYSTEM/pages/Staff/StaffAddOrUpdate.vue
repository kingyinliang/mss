<template>
  <div>
    <el-dialog :title="targetID ? '修改人员信息' : '新增人员'" :close-on-click-modal="false" v-model="isDialogShow">
      <el-form ref="dataFormRef" :model="dataForm" status-icon :rules="checkRules" size="small" label-width="100px">
        <el-form-item label="所属部门：">
          <span v-if="targetID" style="margin-right: 10px;">{{ dataForm.deptName }}</span>
          <span v-if="!targetID" style="margin-right: 10px;">{{ deptName }}</span>
          <el-button v-if="targetID" type="text" size="small" @click="isOrgTreeShow = true">
            请选择
          </el-button>
        </el-form-item>
        <el-form-item label="人员工号：" prop="workNum">
          <el-input v-model="dataForm.workNum" placeholder="手动输入" clearable @change="setTempFlag" />
        </el-form-item>
        <el-form-item label="人员姓名：" prop="realName">
          <el-input v-model="dataForm.realName" placeholder="手动输入" auto-complete="off" clearable />
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="dataForm.sex" placeholder="请选择" style="width: 100%;">
            <el-option label="男" value="M" />
            <el-option label="女" value="F" />
          </el-select>
        </el-form-item>
        <el-form-item label="停用启用：">
          <el-select v-model="dataForm.status" placeholder="请选择" style="width: 100%;">
            <el-option label="启用" value="A" />
            <el-option label="停用" value="F" />
          </el-select>
        </el-form-item>
        <el-form-item label="职务：">
          <el-select v-model="dataForm.postType" size="small" style="width: 100%;" filterable clearable>
            <el-option v-for="(item) in postOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="职务描述：">
          <el-input v-model="dataForm.postName" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item label="工种：">
          <el-select v-model="dataForm.tempFlag" placeholder="请选择" style="width: 100%;">
            <el-option label="临时工" value="Y" />
            <el-option label="正式工" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="dataForm.email" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="dataForm.phone" placeholder="手动输入" clearable />
        </el-form-item>
        <el-form-item label="有效期：">
          <el-date-picker
            v-model="dataForm.effectiveDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选选择日期"
            style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" class="j_closeBtn" @click="isDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" size="small" @click="submitDataForm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="选择组织架构" :close-on-click-modal="false" v-model="isOrgTreeShow">
      <p style="margin-bottom: 10px;">
        右击组织架构选择该部门
      </p>
      <el-tree :data="orgTree" node-key="id" :expand-on-click-node="false" :props="{label:'deptName',children:'children'}" @node-contextmenu="setDepartment" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { USER_BATCH_QUERY, DICT_QUERY, USER_INSERT, USER_UPDATE } from '@/api/api'

interface DataForm{
  id?: string
  deptId?: string
  deptName?: string
  userName?: string
  realName?: string
  workNum: string
  factory?: string
  tempFlag?: string
  sex?: string
  postType?: string
  postName?: string
  email?: string
  phone?: string
  status?: string
  effectiveDate?: string
}
export default defineComponent({
  name: 'StaffAddOrUpdate',
  emits: ['refreshDataList'],
  props: {
    orgTree: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const isDialogShow = ref(false)
    const isOrgTreeShow = ref(false)
    const targetID = ref('' as string)
    const deptID = ref('' as string)
    const deptName = ref('' as string)
    const factory = ref('' as string)
    const dataForm = ref({} as DataForm)
    const dataFormRef = ref()
    const postOptions = ref([])

    // eslint-disable-next-line
    const checkWorkNum = (rule:string, value:string, callback:any) => {
      const patt = new RegExp('^[A-Z]')
      let tempStr = ''
      if (patt.test(dataForm.value.workNum.toUpperCase().substr(0, 1))) {
        tempStr = dataForm.value.workNum.toUpperCase().substr(1)
      } else {
        tempStr = dataForm.value.workNum.toUpperCase()
      }

      if (tempStr.length > 10) {
        return callback(new Error('请输入10个数字工号'))
      }
      callback()
    }
    const checkRules = {
      workNum: [
        {
          required: true,
          message: '工号不能为空',
          trigger: 'blur'
        },
        { validator: checkWorkNum, trigger: 'blur' }
      ],
      realName: [
        {
          required: true,
          message: '人员姓名不能为空',
          trigger: 'blur'
        }
      ]
    }
    const setDepartment = (event:EventTarget, data:DataForm) => {
      dataForm.value.deptId = data.id
      dataForm.value.deptName = data.deptName
      dataForm.value.factory = data.factory
      isOrgTreeShow.value = false
    }
    const init = (dID:string, dName:string, f:string, id:string) => {
      deptID.value = dID
      deptName.value = dName
      factory.value = f
      if (id) {
        targetID.value = id
        USER_BATCH_QUERY({
          ids: [id]
        }).then(({ data }) => {
          dataForm.value = data.data[0]
        })
      } else {
        targetID.value = ''
        dataForm.value = {
          id: '',
          factory: f,
          workNum: '',
          deptId: dID,
          deptName: dName,
          userName: '',
          realName: '',
          tempFlag: '',
          sex: '',
          postType: '',
          postName: '',
          email: '',
          phone: '',
          status: 'A',
          effectiveDate: '2099-01-01'
        }
      }
      isDialogShow.value = true
    }
    const getPostOptions = () => {
      DICT_QUERY({ dictType: 'COMMON_POST' }).then(({ data }) => {
        postOptions.value = data.data
      })
    }
    const setTempFlag = () => {
      const patt = new RegExp('^[A-Z]')
      if (patt.test(dataForm.value.workNum)) {
        dataForm.value.tempFlag = 'Y'
      } else {
        dataForm.value.tempFlag = 'N'
      }
    }
    const submitDataForm = () => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          const net = dataForm.value.id ? USER_UPDATE : USER_INSERT
          net(dataForm.value).then(() => {
            emit('refreshDataList')
            isDialogShow.value = false
          })
        }
      })
    }
    onMounted(() => {
      getPostOptions()
    })

    return {
      dataFormRef,
      postOptions,
      isDialogShow,
      isOrgTreeShow,
      targetID,
      deptID,
      deptName,
      factory,
      dataForm,
      checkRules,
      init,
      setTempFlag,
      submitDataForm,
      setDepartment
    }
  }
})
</script>

<style scoped>

</style>
