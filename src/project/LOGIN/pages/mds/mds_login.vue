<template>
  <el-row class="login_box">
    <el-col :span="16">
      <div class="canvas_box">
        <div id="canvas_box_main" class="canvas_box_main">
          <canvas id="loginAnimation" />
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <img src="@/assets/img/login/MDSlogo.png" alt="" class="login_icon">
      <el-form :model="loginForm" status-icon label-width="100px" class="loginForm_ui" @keyup.enter="submit">
        <p class="login_title1">
          欢迎使用
        </p>
        <p class="login_title2">
          MDS制造管理系统
        </p>
        <el-form-item prop="user">
          <el-input v-model="loginForm.userName" auto-complete="off" placeholder="账户/工号">
            <template #prefix>
              <em class="iconfont factory-zhanghaodenglu" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
            <template #prefix>
              <em class="iconfont factory-mima" />
            </template>
          </el-input>
          <el-button type="text" class="reset" @click="clearForm">
            <em class="iconfont factory-zhongzhi" style="font-size: 12px;" />重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="loginBtn" @click="submit">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import loginTs from '../login'
import { defineComponent, onMounted } from 'vue'
import { LoginAnimation } from './loginCanvas'

export default defineComponent({
  name: 'MdsLogin',
  setup () {
    const { loginForm, clearForm, submit } = loginTs()

    onMounted((): void => {
      const canvas = new LoginAnimation()
      canvas.init()
    })

    return {
      loginForm,
      clearForm,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
  .login_box {
    width: 100%;
    height: 100%;

    ::v-deep .el-col {/* stylelint-disable-line */
      height: 100%;
      overflow: hidden;
    }

    .login_icon {
      width: 300px;
      margin-top: 20px;
      margin-bottom: 84px;
      margin-left: 20px;
    }

    .canvas_box {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #070f6e 0%, #141bb7 51%, #1582ff 100%);

      &_main {
        width: 100%;

        canvas {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .loginForm_ui {
    width: 300px;
    margin: auto;
    padding-top: 20px;

    p {
      color: #333;
    }

    .login_title1 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 22px;
      line-height: 26px;
    }

    .login_title2 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 28px;
      line-height: 40px;
    }

    .loginBtn {
      width: 100%;
      margin-top: 20px;
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
  @media (min-width: 1600px) {
    .loginForm_ui {
      width: 360px;
      padding-top: 60px;

      .login_title1 {
        font-weight: bold;
        font-size: 26px;
      }

      .login_title2 {
        font-weight: bold;
        font-size: 32px;
      }

      .loginBtn {
        margin-top: 40px;
      }
    }
  }
</style>
