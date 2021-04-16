<template>
    <el-dialog :title="dataForm.id ? '修改权限属性' : '新增权限属性'" :close-on-click-modal="false" v-model="isDialogShow">
        <el-form ref="dataFormRef" :model="dataForm" label-width="170px" :rules="checkRules">
            <el-form-item label="属性编码：" prop="propertyCode">
                <el-input v-model="dataForm.propertyCode" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="属性名称：" prop="propertyName">
                <el-input v-model="dataForm.propertyName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="属性所在表名：" prop="propertyTable">
                <el-input v-model="dataForm.propertyTable" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="属性表结构类型：" prop="propertyType">
                <el-select v-model="dataForm.propertyType" placeholder="请输入">
                    <el-option
                        label="树结构"
                        value="T"
                    />
                    <el-option
                        label="平铺结构"
                        value="P"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="属性表主键字段：" prop="propertyKey">
                <el-input v-model="dataForm.propertyKey" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item v-if="dataForm.propertyType==='T'" label="属性表父节点字段：" prop="propertyParentKey">
                <el-input v-model="dataForm.propertyParentKey" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="属性表权限标识字段：" prop="privilegeIdentity">
                <el-input v-model="dataForm.privilegeIdentity" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="属性表权限标识名称：" prop="privilegeIdentityName">
                <el-input v-model="dataForm.privilegeIdentityName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="请输入" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <span  class="dialog-footer">
                <el-button class="j_closeBtn" @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submitDataForm">确定</el-button>
            </span>
        </template>

    </el-dialog>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { PROPERTY_UPDATE, PROPERTY_DATA_INSERT } from '@/api/api'


    type TargetInfoList = {
      id:string,
      propertyCode:string,
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
        name: 'PermissionAddAndUpdate',
        emits: ['refreshDataList'],
        setup(props, { emit }) {
            // const targetID = ref('')
            const isDialogShow = ref(false)
            const dataForm = ref({
                      id: '',
                      propertyCode: '',
                      propertyName: '',
                      propertyTable: '',
                      propertyType: '',
                      propertyKey: '',
                      propertyParentKey: '',
                      privilegeIdentity: '',
                      privilegeIdentityName: '',
                      remark: ''
                    })
            const dataFormRef = ref()
            const checkRules = {
                    propertyCode: [
                        { required: true, message: '请输入属性编码', trigger: 'blur' }
                    ],
                    propertyName: [
                        { required: true, message: '请输入属性名称', trigger: 'blur' }
                    ],
                    propertyTable: [
                        { required: true, message: '请输入属性所在表名', trigger: 'blur' }
                    ],
                    propertyType: [
                        { required: true, message: '请输入属性表结构类型', trigger: 'blur' }
                    ],
                    propertyKey: [
                        { required: true, message: '请输入属性表主键字段', trigger: 'blur' }
                    ],
                    propertyParentKey: [
                        { required: true, message: '请输入属性表父节点字段', trigger: 'blur' }
                    ],
                    privilegeIdentity: [
                        { required: true, message: '请输入属性表权限标识字段', trigger: 'blur' }
                    ],
                    privilegeIdentityName: [
                        { required: true, message: '请输入属性表权限标识名称', trigger: 'blur' }
                    ]
                }

            const init = (obj:TargetInfoList) => {
                if (obj) {
                    // targetID.value = obj.id;
                    dataForm.value = JSON.parse(JSON.stringify(obj))
                } else {
                    // targetID.value = '';
                    dataForm.value = {
                      id: '',
                      propertyCode: '',
                      propertyName: '',
                      propertyTable: '',
                      propertyType: '',
                      propertyKey: '',
                      propertyParentKey: '',
                      privilegeIdentity: '',
                      privilegeIdentityName: '',
                      remark: ''
                    };
                }
                isDialogShow.value = true;
            }


            const submitDataForm = () => {
                dataFormRef.value.validate((valid:boolean) => {
                    if (valid) {
                      const http = dataForm.value.id !== '' ? PROPERTY_UPDATE : PROPERTY_DATA_INSERT
                      http(dataForm.value).then(() => {
                        emit('refreshDataList')
                        isDialogShow.value = false
                      })
                    }
                });
            }

            // 重置
            const closeDialog = () => {
                // document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                dataFormRef.value.resetFields();
                isDialogShow.value = false
            }


            return {
              init,
              dataFormRef,
              closeDialog,
              isDialogShow,
              submitDataForm,
              checkRules,
              dataForm
            }
        }


    });
</script>

<style scoped></style>
