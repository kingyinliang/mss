<template>
  <div class="login_bg">
    <div class="loginRightBg">
      <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="loginRules" label-width="100px" class="loginForm" @keyup.enter="submit">
        <p class="login_title1">
          你好，欢迎登录
        </p>
        <p class="login_title2">
          编码系统
        </p>
        <el-form-item prop="userName">
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
  </div>
</template>

<script>
import loginTs from '../login'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CdmLogin',
  setup () {
    const { loginFormRef, loginForm, clearForm, submit, loginRules } = loginTs()

    return {
      loginFormRef,
      loginForm,
      clearForm,
      submit,
      loginRules
    }
  }
})
</script>

<style lang="scss" scoped>
  .login_bg{
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/login/login_bg_cdm.jpg") no-repeat;
    background-size: cover;
  }
  .loginRightBg {
    position: relative;
    top: 50%;
    float: right;
    width: 334px;
    height: 360px;
    margin-right: 80px;
    background: rgba(0, 0, 0, 0.34);
    border-radius: 6px;
    transform: translateY(-50%);
  }

  .loginForm {
    width: 300px;
    margin: auto;
    p {
      color: #fff;
    }
    .login_title1 {
      display: inline-block;
      width: 100%;
      height: 28px;
      margin-top: 28px;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 16px;
      line-height: 28px;
    }
    .login_title2 {
      height: 28px;
      margin-top: 0;
      margin-bottom: 30px;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }
    .loginBtn {
      width: 100%;
      margin-top: 30px;
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
      bottom: -25px;
      float: right;
      padding: 0;
      color: #f94630;
      font-size: 12px;
    }
  }
</style>
