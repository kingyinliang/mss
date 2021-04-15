<template>
    <el-dialog :title="targetID ? '修改权限属性' : '新增权限属性'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <el-form ref="dataForm" :model="dataForm" label-width="170px" :rules="checkRules">
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
        <span slot="footer" class="dialog-footer">
            <el-button class="j_closeBtn" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { SYSTEM_API } from 'common/api/api';
    export default {
        name: 'RoleaddAndUpdate',
        data() {
            return {
                targetID: '',
                isDialogShow: false,
                dataForm: {
                },
                checkRules: {
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
            };
        },
        methods: {
            init(obj) {
                if (obj) {
                    this.targetID = obj.id;
                    this.dataForm = obj
                } else {
                    this.targetID = '';
                    this.dataForm = {};
                }
                this.isDialogShow = true;
            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        if (this.targetID) {
                            // 修改
                            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_UPDATE_API(
                             this.dataForm
                            ).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        } else {
                            // 新增
                            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_INSERT_API(this.dataForm).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        }
                    }
                });
            },
            // 重置
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                this.$refs.dataForm.resetFields();
                this.isDialogShow = false
            }
        }
    };
</script>

<style scoped></style>
