<template>
  <div class="login-container">
    <div class="solgan">
      数化空间
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          账户登录
          <small>ACCOUNT LOGIN</small>
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span> -->
      </el-form-item>

      <el-form-item prop="verifyCode">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input
          ref="verifyCode"
          v-model="loginForm.verifyCode"
          placeholder="验证码"
          name="verifyCode"
          type="text"
          maxlength="6"
        />
        <span class="show-pwd" @click="getVerifyCode">
          <img :src="verifyCode" style="width: 100px">
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">登 录</el-button>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        uuid: '',
        verifyCode: '',
        username: '企业测试账户',
        password: '1234qwer'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      verifyCode: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getVerifyCode()
  },
  methods: {
    getVerifyCode() {
      this.loginForm.uuid = (new Date()).getTime()
      this.verifyCode = `${process.env.VUE_APP_CUSTOM_API}/images/captcha?uuid=${this.loginForm.uuid}`
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.solgan {
  position: absolute; top: 12%; left: 22%; font-size: 38px; color: #5b7efd;
  display: none;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 8px 5px 6px 12px;
      color: #333; font-size: 16px;
      height: 36px;

      &:-webkit-autofill {
        background: transparent;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url('../../assets/images/login-bg.jpg');
  background-repeat: no-repeat;
  background-position:left center;
  background-size: auto 100%;
  background-color: #f1f2f7;

  .login-form {
    position: absolute;
    top: 25%; right: 12%; width: 350px; padding: 50px;
    border-radius: 3px;
    background: #FFF; box-shadow: 2px 2px 30px rgba(0,0,0,0.2);
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 0 0 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: #666;
      margin: 0px auto 20px;
      text-align: left;
      small {display: block; padding: 10px 0 0; font-size: 12px; letter-spacing: .2em; color: #DDD; font-weight: normal;}
      position: relative;
      &::before {
        position: absolute; left: -50px; top: 0; bottom: 2px; width: 4px;
        background: #5b7efd;
        content: '';
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
/deep/ .el-button {margin-top: 20px;}
/deep/ .el-form-item { border-width: 0; border-bottom-width: 1px; margin-bottom: 10px;}
/deep/ .el-form-item__content {font-size: 16px; background: #FFF; color: #333;}

</style>
