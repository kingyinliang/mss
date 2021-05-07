<template>
  <div class="login_bg" />
  <div class="login_form">
    <div class="login_form_main">
      <div class="login_form_main_icon">
        <img src="@/assets/img/login/login_icon.png" alt="Icon">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <div class="login_form_main_contain">
          <div class="login_form_main_username login_form_main_input" style="margin-bottom: 12%;">
            <p>账号:</p>
            <el-form-item prop="userName">
              <el-input v-model="loginForm.userName" auto-complete="off" placeholder="账户/工号">
                <template #prefix>
                  <i class="iconfont factory-zhanghao" />
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="login_form_main_input" style="margin-bottom: 11.5%;">
            <p>密码:</p>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" :type="eye? 'text' : 'password'" auto-complete="off" placeholder="密码" @keyup.enter="submit">
                <template #prefix>
                  <i class="iconfont factory-zu" />
                </template>
                <template #suffix>
                  <i class="iconfont factory-in_biyan_fill" @click="eye = !eye"/>
                </template>
              </el-input>
            </el-form-item>
            <div>
              <label class="login_form_main_btn" @click="clearForm">
                <em class="iconfont factory-zhongzhi" />
                重置
              </label>
            </div>
          </div>
          <div style="flex: 1;">
            <el-form-item>
              <el-button type="primary" class="login_form_main_button" @click="submit">
                登  录
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
  <SelectSystem v-model="visible"/>
</template>

<script lang="ts">
import loginTs from '../login'
import { defineComponent } from 'vue'
import SelectSystem from '@/components/layout/select-system.vue'

export default defineComponent({
  name: 'MssLogin',
  components: {
    SelectSystem
  },
  setup () {
    const { loginFormRef, eye, visible, loginForm, clearForm, submit, loginRules } = loginTs()

    return {
      loginFormRef,
      loginForm,
      eye,
      visible,
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
    background: url("~@/assets/img/login/login_bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .login_form{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    &_main{
      min-width: 450px;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 7%;
      height: 80%;
      width: 30%;
      padding: 4%;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.82);
      &_text{
        margin-top: 10px;
        font-weight: bold;
        font-size: 32px;
      }
      &_contain{
        flex: 1;
        padding-top: 15%;
      }
      &_input{
        flex: 1;
        &_prefix{
          flex: 1;
          position: relative;
          .iconfont{
            height: 100%;
            font-size: 16px;
            line-height: 50px;
            text-align: center;
            position: absolute;
            color: #5F73F0;
          }
          .iconfont--left{
            left: 14px;
          }
          .iconfont--right{
            right: 14px;
            cursor: pointer;
          }
        }
        p{
          line-height: 36px;
          font-size: 14px;
          color: #999999;
        }
      }
      &_password{
        display: flex;
        &_eye{
          cursor: pointer;
          width: 50px;
          height: 50px;
          margin-left: 8px;
          background: #F9C3D2;
          border-radius: 8px;
          text-align: center;
          .iconfont{
            color: #5F73F0;
            font-size: 16px;
            line-height: 50px;
          }

        }
      }
      &_btn{
        cursor: pointer;
        color: #999999;
        font-size: 14px;
        line-height: 34px;
        .iconfont{
          color: #5F73F0;
        }
      }
      &_button{
        cursor: pointer;
        border: none;
        width: 50%;
        height: 50px;
        font-size: 18px;
        color: white;
        background: #000000!important;
        border-radius: 8px;
      }
      ::v-deep .el-input__prefix{
        left: 14px;
        color: #5F73F0;
        line-height: 50px;
      }
      ::v-deep .el-input__suffix{
        right: 14px;
        color: #5F73F0;
        line-height: 50px;
        cursor: pointer;
      }
      .input,::v-deep .el-input__inner{
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 8px;
        border: 1px solid #5F73F0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 50px;
        line-height: 50px;
        outline: 0;
        padding: 0 40px 0 40px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
      }
      ::v-deep .el-form-item.is-error .el-input__inner{
        border-color: #F56C6C;
      }
    }
  }
</style>
