<template>
  <div class="login_bg"></div>
  <div class="form_login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" status-icon label-width="100px" class="loginForm_ui2" @keyup.enter="submit">
      <p class="login_title1">
        欢迎使用
      </p>
      <p class="login_title2">
        RDM研发管理系统
      </p>
      <el-form-item prop="userName" style="margin-bottom: 24px;">
        <el-input v-model="loginForm.userName" auto-complete="off" placeholder="账户/工号">
          <template #prefix>
            <i class="iconfont factory-zhanghaodenglu" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
          <template #prefix>
            <i class="iconfont factory-mima" />
          </template>
        </el-input>
        <el-button type="text" class="reset" @click="clearForm">
          <i class="iconfont factory-sys-login-reset" style="font-size: 12px;" />重置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="submit">
          登  录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import loginTs from '../login'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'RdmLogin',
  setup () {
    const { loginFormRef, loginForm, clearForm, submit, loginRules } = loginTs()

    return {
      loginFormRef,
      loginForm,
      clearForm,
      loginRules,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
  .login_bg{
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/login/login_bg_rdm.jpg") no-repeat;
    background-size: cover;
  }
  .form_login {
    position: absolute;
    top: 109px;
    right: 54px;
    width: 374px;
    height: 415px;
    background: rgba(255, 255, 255, 0.84);
    border-radius: 6px;
  }
  .loginForm_ui2 {
    width: 300px;
    margin: auto;
    margin-top: 46px;
    p {
      color: #333;
    }

    .login_title1 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
      font-weight: 500;
      font-size: 24px;
      line-height: 26px;
    }

    .login_title2 {
      margin-top: 0;
      margin-bottom: 30px;
      color: #333;
      font-weight: 500;
      font-size: 32px;
      line-height: 40px;
    }
    .loginBtn {
      width: 100%;
      margin-top: 40px;
      background: #f94630 !important;
      border-color: #f94630;
    }

    label {
      color: white !important;
    }

    input {
      background: #fff !important;
    }

    ::v-deep .el-form-item__content {/* stylelint-disable-line */
      margin-left: 0 !important;
    }

    ::v-deep .el-input__prefix {/* stylelint-disable-line */
      margin-left: 6px;
    }

    .reset {
      position: absolute;
      right: 0;
      bottom: -22px;
      float: right;
      padding: 0;
      color: #487bff;
      font-size: 12px;
    }
  }
</style>
