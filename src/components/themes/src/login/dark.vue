<template>
  <div :class="['login-wrap',{'login-wrap-bg':!animation}]">
    <div class="login-wave">
      <div class="banner login-box">
        <div :class="['rotate-box',{'no-bg':!animation}]">
          <div class="logo"><img src="/static/images/login_logo.png" alt=""></div>
          <form method="post" ref="form" class="form-signin b" @submit.prevent="submitForm" id="TestLoginLink">
            <input class="b" type="text" name="username" placeholder="请输入账号" required="required" value="">
            <input class="b" placeholder="请输入密码" type="password" name="password" value="">
            <button class="subbtn" type="submit" id="TestLoginLink_button">登录</button>
          </form>
        </div>
      </div>
      <div class="copyright">© {{currentYear}} 珠海市小源科技有限公司</div>
    </div>
    <div class="stars"></div>
  </div>
</template>
<script>
import store from 'assets/js/localStorage'
let $S = require('assets/js/script.js')
const jsArr = [
  "/static/js/stopExecutionOnTimeout.js",
  "/static/js/prefixfree.min.js",
]

export default {
  name: 'theme-login-dark',
  props: {
    animation: {
      type: Boolean,
      default: true
    }
  },
  created: function () {
    if (this.animation) {
      $S(jsArr, 'loginAnimation')
    }
  },
  computed: {
    currentYear: function () {
      return new Date().getFullYear()
    }
  },
  mounted() {
    document.body.style.overflow = "hidden"
    store.remove("moquiSessionToken")
    if (this.animation) {
      $S.ready('loginAnimation', () => {
        this.bgStars()
        // this.rotateBox()
      })
    }

  },
  destroyed: function () {
    document.body.style.overflow = "unset"
  },
  methods: {
    submitForm(event) {
      let vm = this.$root
      var data = new FormData(event.target)
      vm.$http.post('/Login/signLogin', data).then(response => {
        var moquiData = response.data

        this.$root.moquiSessionToken = moquiData.confMoquiSessionToken
        store.set("moquiSessionToken", moquiData.confMoquiSessionToken)
        store.set("userFullName", moquiData.userFullName)
        store.set("username", moquiData.username)
        this.$emit("updateView")
      }, err => {
        // error callback
        this.handleMessage(err.errorMessage,'error')
      })
    },
    bgStars() {
      $(document).ready(function () {
        var stars = 1200;
        var $stars = $('.stars');
        var r = 1200;
        for (var i = 0; i < stars; i++) {
          if (window.CP.shouldStopExecution(1)) {
            break;
          }
          var $star = $('<div/>').addClass('star');
          $stars.append($star);
        }
        window.CP.exitedLoop(1);
        $('.star').each(function () {
          var cur = $(this);
          var s = 0.2 + Math.random() * 1;
          var curR = r + Math.random() * 300;
          cur.css({
            transformOrigin: '0 0 ' + curR + 'px',
            transform: ' translate3d(0,0,-' + curR + 'px) rotateY(' + Math.random() * 360 + 'deg) rotateX(' + Math.random() * -50 + 'deg) scale(' + s + ',' + s + ')'
          });
        });
      });
    },
    rotateBox() {
      $(function () {
        $(".rotate-box").mouseenter(function () {
          var thisPX = $(this).offset().left;
          var thisPY = $(this).offset().top;
          var boxWidth = $(this).outerWidth();
          var boxHeight = $(this).outerHeight();
          $(this).addClass("threeD");
          $(".threeD").mousemove(function (event) {
            var mouseX = event.pageX - thisPX;
            var mouseY = event.pageY - thisPY;
            var X;
            var Y;
            if (mouseX > boxWidth / 2) {
              X = mouseX - boxWidth / 2;
            } else {
              X = mouseX - boxWidth / 2;
            }
            if (mouseY > boxHeight / 2) {
              Y = boxHeight / 2 - mouseY;
            } else {
              Y = boxHeight / 2 - mouseY;
            }
            $(".threeD").css({
              "-webkit-transform": "rotateY(" + X / 20 + "deg) " + "rotateX(" + Y / 20 + "deg)"
            });
            // console.log(X + "," + Y);
          });
        });
        $(".rotate-box").mouseleave(function () {
          $(this).removeClass("threeD");
          $(this).css({
            "-webkit-transform": "rotateY(0deg) rotateX(0deg)"
          });
        });
      });
    }
  }
}

</script>

<style lang="less">

.theme-dark {
  @keyframes rotate {
    0% {
      transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
    }

    100% {
      transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
    }

  }

  .login-wrap .stars {
    transform: perspective(500px);
    transform-style: preserve-3d;
    position: absolute;
    bottom: 0;
    perspective-origin: 50% 100%;
    left: 50%;
    animation: rotate 90s infinite linear;
    z-index: 0;
  }

  .login-wrap .star {
    width: 2px;
    height: 2px;
    background: #F7F7B6;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0 -300px;
    transform: translate3d(0, 0, -300px);
    backface-visibility: hidden;
    z-index: 0
  }

  .login-wrap {
    width: 100%;
    height: 100%;
    background: #0C0725;    /*url(/static/images/login_bg.jpg) top center no-repeat*/
    overflow: hidden;
  }

  .login-wrap-bg {
    background: url(/static/images/login_bg.jpg) top center no-repeat #0C0725;
  }

  .login-wrap * {
    -webkit-transition: all .3s;
    transition-timing-function: linear;
    -webkit-transition-timing-function: linear;
  }

  .login-wrap .login-wave {
    width: 100%;
    height: 100%;
    background: url(/static/images/login_bg_wave.png) bottom center no-repeat;
    background-size: 100% 35%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10
  }

  .login-wrap .copyright {
    position: fixed;
    bottom: 30px;
  }

  .login-box {
    perspective: 800px;
    display: inline-block;
    position: fixed;
  }

  .login-box .rotate-box {
    position: relative;
    // background: rgba(148, 147, 147, .08);
    transform-style: preserve-3d;
    -webkit-transform-origin: 50% 50%;
    -webkit-transform: rotateY(0deg) rotateX(0deg);
    text-align: center;
    padding: 80px 50px 60px;
  }

  .login-box .no-bg {
    background: none
  }

  .login-box .logo {
    transform: translateZ(60px);
  }

  .login-box .form-signin {
    width: 320px;
    margin: 50px auto 0;
    transform: translateZ(10px);
  }

  .login-box .form-signin input {
    display: block;
    border: none;
    outline: none;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    border-radius: 20px;
    margin-bottom: 20px;
    background: #f3f3f3;
  }

  .login-box .form-signin .subbtn {
    display: block;
    border: none;
    outline: none;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    background: #6789ED;
    color: #FFF;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 10px;
    cursor: pointer;
  }

  .login-box .auth-login {

    /* display: flex; */
    display: none;
  }

  .login-box .auth-login a {
    display: block;
    color: #FFF;
    margin: 30px 30px 0;
    text-align: center;
  }

  .login-box .auth-login img, .login-box .auth-login span {
    display: block;
    margin: 6px 0 10px
  }

  .login-box .rotate-box {
    background: none
  }

  .login-wrap .login-wave {
    background-image: url(/static/images/login_bg_wave.png);
  }
}
</style>