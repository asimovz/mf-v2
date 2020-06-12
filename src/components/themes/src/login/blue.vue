<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" style="display: flex;align-items: center;justify-content: center;">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div class="page-login--content" style="display: flex;flex-direction: column;">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            时间是一切财富中最宝贵的财富
          </p>
        </div>
        <div class="page-login--content-main" style="flex: 1;display: flex;align-items: center;flex-direction: column;justify-content: center;">
          <!-- logo -->
          <img class="page-login--logo" :src="loginLogo">
          <!-- form -->
          <div class="page-login--form">
            <form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default" @submit.prevent="submit">
              <div class="form-item" prop="username">
                <span><i class="el-icon-user" style="font-size: 16px" /></span>
                <div>
                  <input class="form-item-input" required="required" name="username" v-model="formLogin.username" placeholder="用户名">
                  <!-- <Input size="large" type="text" name="username" v-model="formLogin.username" placeholder="用户名"> -->
                  </Input>
                </div>
              </div class="form-item">
              <div class="form-item" prop="password">
                <span><i class="el-icon-lock" style="font-size: 16px" /></span>
                <div>
                  <input class="form-item-input" required="required" type="password" name="password" v-model="formLogin.password" placeholder="密码">
                  <!-- <Input size="large" type="password" name="password" v-model="formLogin.password" placeholder="密码"> -->
                  </Input>
                </div>
              </div class="form-item">
              <button type="submit" class="button-login">
                登录
              </button>
            </form>
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-copyright">
            © 2020 珠海市小源科技有限公司
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from 'assets/js/localStorage'
import loginLogo from 'assets/logo@2x.png'

const formRules = {
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }],
  code: [{
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  }]
}

function autoTwo(num) {
  return +num < 10 ? '0' + num : num
}
export default {
  name: 'theme-login-blue',
  data() {
    return {
      loginLogo,
      timeInterval: null,
      time: this.refreshTime(),
      // 表单
      formLogin: {
        username: '',
        password: '',
      },
      // 表单校验
      rules: formRules
    }
  },
  created() {

  },
  mounted() {

    // this.refreshTime()

    localStorage.removeItem("moquiSessionToken")

    this.timeInterval = setInterval(() => {
      this.time = this.refreshTime()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  },
  methods: {
    refreshTime() {
      let _date = new Date()
      let _time = autoTwo(_date.getHours()) + ':' + autoTwo(_date.getMinutes()) + ':' + autoTwo(_date.getSeconds())

      return _time
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit(event) {
      let data = new FormData(event ? event.target : this.$refs.loginForm.$el)
      this.$root.$http.post('/Login/signLogin', data).then(response => {
        var moquiData = response.data
        this.$root.moquiSessionToken = moquiData.confMoquiSessionToken
        store.set("moquiSessionToken", moquiData.confMoquiSessionToken)
        this.$emit("updateView")
      }, err => {
        this.handleMessage('error', err.errorMessage + ' ' + err.errors)
      })
    }
  }
}

</script>

<style lang="less">
  @background_color: #f0f2f5;
  @colorTextNormal: #606266;
  @colorTextMain: #303133;


  .page-login {
    // ---
    background-color: @background_color;
    height: 100%;
    position: relative;

    // 层
    &--layer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto
    }

    &--layer-area {
      overflow: hidden
    }

    // 时间
    &--layer-time {
      font-size: 24em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.03);
      overflow: hidden
    }

    // 登陆页面控件的容器
    &--content {
      height: 100%;
      min-height: 500px
    }

    // header
    &--content-header {
      padding: 1em 0;

      &-motto {
        margin: 0px;
        padding: 0px;
        color: @colorTextNormal;
        text-align: center;
        font-size: 12px
      }

    }

    // main
    &--logo {
      width: 240px;
      margin-bottom: 2em;
      margin-top: -2em
    }

    // 登录表单
    &--form {
      width: 280px;
      padding: 20px;
      background-color: #fff;

      // 卡片
      .ivu-card {
        margin-bottom: 15px
      }

      // 登录按钮
      .button-login {
        width: 100%;
        padding: 6px 15px;
        background-color: #2d8cf0;
        border: 1px solid #2d8cf0;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        transition: all .2s linear;
        cursor: pointer;
        outline: none;

        &:hover {
          background: #57a3f3;
          border-color: #57a3f3;
        }

        &:focus {
          box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
        }

      }

      // 输入框左边的图表区域缩窄
      .ivu-input-group-prepend {
        width: 40px
      }

      .form-item {
        display: flex;
        align-items: center;
        margin-bottom: 24px;

        &-input {
          display: inline-block;
          width: 100%;
          height: 36px;
          padding: 6px 7px;
          border: 1px solid #dcdee2;
          border-radius: 0 4px 4px 0;
          transition: all .2s ease-in-out;
          outline: none;

          &:hover {
            border-color: #57a3f3;
          }

          &:focus {
            box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
          }

        }

        &>span {
          width: 40px;
          height: 36px;
          background: #f8f8f9;
          border: 1px solid #dcdee2;
          border-right: none;
          border-radius: 4px 0 0 4px;
          line-height: 36px;
          text-align: center;
        }

        &>div {
          flex: 1
        }

        .ivu-input {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

      }

    }

    // footer
    &--content-footer {
      padding: 1em 0;

      &-locales {
        padding: 0px;
        margin: 0px;
        margin-bottom: 15px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        color: @colorTextNormal;

        a {
          color: @colorTextNormal;
          margin: 0 .5em;

          &:hover {
            color: @colorTextMain
          }

        }

      }

      &-copyright {
        padding: 0px;
        margin: 0px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        color: @colorTextNormal;

        a {
          color: @colorTextNormal
        }

      }

    }

    // 背景
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin: 0px;
      padding: 0px;

      li {
        position: absolute;
        display: block;
        list-style: none;
        width: 20px;
        height: 20px;
        background: #FFF;
        animation: animate 25s linear infinite;
        bottom: -200px;

        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0
          }

          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%
          }

        }

        &:nth-child(1) {
          left: 15%;
          width: 80px;
          height: 80px;
          animation-delay: 0s
        }

        &:nth-child(2) {
          left: 5%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s
        }

        &:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s
        }

        &:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s
        }

        &:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s
        }

        &:nth-child(6) {
          left: 75%;
          width: 150px;
          height: 150px;
          animation-delay: 3s
        }

        &:nth-child(7) {
          left: 35%;
          width: 200px;
          height: 200px;
          animation-delay: 7s
        }

        &:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s
        }

        &:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s
        }

        &:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s
        }

      }

    }

  }


</style>