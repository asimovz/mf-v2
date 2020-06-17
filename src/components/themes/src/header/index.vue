<template>
  <div class="aw-header">
    <div class="theme-header">
      <div class="aw-header_breadcrumbs">
        <!-- <Icon type="android-home" size="18" class="breadcrumbs-home"></Icon> -->
        <template v-for=" (item,index) in currentCrumb">
          <span :key="index">{{item==null?"首页":item}}<i class="spacer">/</i></span>
          <!-- <m-link :href="path[index]"></m-link> -->
        </template>
      </div>
      <div class="aw-header_topbar">
        <slot name="tools"></slot>
        <ul class="topbar-menus">
          <!-- <li class="tool" :title="isFullscreen ? '退出全屏' : '全屏'" @click="toggleFullscreen">
            <i class="el-icon-refresh-right" style="font-size:20px"></i>
          </li> -->
          <li class="tool" title="刷新" @click="refresh">
            <i class="el-icon-refresh-right" style="font-size:20px"></i>
            <!-- <Icon type="md-refresh" size="22" /> -->
            <!-- <Icon type="android-refresh" size="22"></Icon> -->
          </li>
          <li class="tool" title="清除缓存" v-if="isBuffer" @click="clearBuffer">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="aw-svg-icon">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect id="bound" x="0" y="0" width="24" height="24" />
                <path d="M10.5278225,22.5278225 L8.79765312,20.7976531 L9.99546268,18.4463973 L7.35584531,19.3558453 L5.04895282,17.0489528 L8.15438502,11.6366281 L2.74206034,14.7420603 L1.30025253,13.3002525 L9.26548692,8.03126375 C11.3411817,6.65819522 14.1285885,7.15099488 15.6076701,9.15253022 C17.1660799,11.2614147 17.1219524,14.1519817 15.4998952,16.212313 L10.5278225,22.5278225 Z" fill="#b4b8ce" opacity="0.6" />
                <path d="M22.4246212,4.91054166 L18.4071175,8.92804534 C17.6260689,9.70909393 16.359739,9.70909393 15.5786904,8.92804534 C14.7976418,8.14699676 14.7976418,6.8806668 15.5786904,6.09961822 L19.6029298,2.0753788 C19.7817428,2.41498256 19.9878937,2.74436937 20.2214305,3.06039796 C20.8190224,3.86907629 21.5791361,4.49033747 22.4246212,4.91054166 Z" id="Combined-Shape" fill="#b4b8ce" transform="translate(18.708763, 5.794605) rotate(-180.000000) translate(-18.708763, -5.794605) " />
              </g>
            </svg>
          </li>
        </ul>
        <div class="topbar-user">
          <m-popover @on-hide="changeGroupHidden=true">
            <div class="topbar-user_name">
              <img class="face" src="/static/images/user.png" alt="">
              <span>{{userFullName}}</span>
            </div>
            <ul class="topbar-user_setting" slot="content">
              <li @click="showPwdModal">
                <!-- <Icon type="gear-a" size="18"></Icon> --> <span>账号设置</span>
              </li>
              <li @click="changeGroupHidden=!changeGroupHidden" v-if="currentUserGroup!=''">
                <!-- <Icon type="android-people" size="18"></Icon>  --><span>切换用户组</span>
              </li>
              <div v-if="currentUserGroup!=''" :class="['change-user-group',{'change-user-group--hidden':changeGroupHidden}]">
                <li v-for="group in userGroup" :key="group.userGroupId" @click="changeGroupMenu(group.userGroupId)">
                  <!-- <Icon v-show="currentUserGroup == group.userGroupId" type="checkmark-round"></Icon> -->
                  <span>{{group.description}}</span>
                </li>
              </div>
              <li @click="logout">
                <!-- <Icon type="power" size="16"></Icon>  --><span>退出登陆</span>
              </li>
            </ul>
          </m-popover>
        </div>
      </div>
    </div>
    <m-active-header v-if="configData.isTabNav" />

  <m-modal v-model="isChangePwd" width="500" id="changePwd" title="修改密码" :footer-hide="true">
      <m-form id="changePwd" class="aw-form aw-form--dialog" :action="changePwdUrl" method="any" :form-callback="logout">
        <m-form-item label="登陆账号" span="6" align="right" content-align="left">
          <div class="aw-form-item_content">{{loginName}}</div>
          <input type="hidden" name="username" :value="loginName">
          <input type="hidden" name="moquiSessionToken" :value="moquiSessionToken">
        </m-form-item >
        <m-form-item label="旧密码" span="6" align="right" content-align="left" v-if="!isBuffer">
          <m-input id="changePwd_oldPassword" type="password" name="oldPassword" validationClasses="" fieldTitle="旧密码" :validate="{required:true}" :validate-msg="'请输入密码'"></m-input>
        </m-form-item >
        <m-form-item label="新密码" span="6" align="right" content-align="left">
          <m-input id="changePwd_newPassword" type="password" v-model="newPassword" name="newPassword" fieldTitle="新密码" :validate="'required'" :validate-msg="'请输入密码'" data-vv-name="newPassword"></m-input>
        </m-form-item >
        <m-form-item label="确认新密码" span="6" align="right" content-align="left">
          <m-input id="changePwd_newPasswordVerify" type="password" name="newPasswordVerify" fieldTitle="确认新密码" :validate="{'required':true,'is':newPassword}" :validate-msg="'两次密码不一致'" data-vv-name="newPasswordVerify"></m-input>
        </m-form-item>
        <m-form-item label="" span="0" align="right" content-align="center">
          <input type="hidden" name="oldPassword" :value="moqui" v-if="isBuffer">
          <m-button text="确定" type="primary" name="submitButton" value="submitButton" id="submitButton" size="default" toggle="linkFormForm"></m-button>
        </m-form-item >
      </m-form>
    </m-modal>

  </div>
</template>
<script>
import store from "assets/js/localStorage";
import mActiveHeader from './activeHeader'

// 进入全屏
function fullScreen() {
  let docEle = document.documentElement
  if (docEle.requestFullscreen) {
    fullScreen = () => docEle.requestFullscreen();
  } else if (docEle.mozRequestFullScreen) {
    fullScreen = () => docEle.mozRequestFullScreen();
  } else if (docEle.webkitRequestFullScreen) {
    fullScreen = () => docEle.webkitRequestFullScreen();
  } else if (docEle.msRequestFullscreen) {
    fullScreen = () => document.body.msRequestFullscreen();
  }
  return fullScreen()
}
// 退出全屏
function exitScreen() {
  if (document.exitFullscreen) {
    exitScreen = () => document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    exitScreen = () => document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    exitScreen = () => document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    exitScreen = () => document.webkitCancelFullScreen();
  } else {
    exitScreen = () => window.parent.showTopBottom();
  }

  return exitScreen()
}

export default {
  name: 'm-header',
  components: {
    mActiveHeader
  },
  inject:['configData'],
  data() {
    return {
      loginName: "",
      userFullName: "",
      moquiSessionToken: "",
      currentCrumb: ['首页'],
      isChangePwd: false,
      newPassword: "",
      isBuffer: false,
      changePwdUrl: "",
      changeGroupHidden: true,
      userGroup: [],
      currentUserGroup:'',

      isFullscreen: false,
    }
  },

  mounted() {
    this.$root.eventBus.$on("updateCrumb", data => {
      this.currentCrumb = data
    })

    this.$root.eventBus.$on("page_refresh", () => {
      this.loginName = this.$root.operator.userName
      this.userFullName = this.$root.operator.name
      this.moquiSessionToken = this.$root.moquiSessionToken
      this.changePwdUrl = this.$root.changePwdUrl
      this.isBuffer = this.loginName == "admin" || this.loginName == "john.doe"
      this.userGroup = this.$root.operator.userGroup,
      this.currentUserGroup = this.$root.operator.currentGroupId

    })
  },

  methods: {
    changeGroupMenu(val) {
      if(this.currentUserGroup == val) return
      this.$root.operator.currentGroupId = val
      this.currentUserGroup = val
      this.$root.eventBus.$emit("global_menu")
    },
    showPwdModal() {
      this.isChangePwd = true
    },
    refresh() {
      this.$root.setUrl(window.location.pathname + window.location.search);
    },
    logout() {
      this.$root.eventBus.$emit("global_logout")
    },
    clearBuffer() {
      let vm = this.$root;
      vm.$http.get("/apps/system/Cache/CacheList/frontClearAllCaches").then(resp => {
        store.clearCaches()
        this.handleNotice('清空缓存成功！', 'success');
      }, error => {
        this.handleNotice('清空缓存失败！', 'danger');
      })
    },
    toggleFullscreen(){
      if(!document.fullscreen){
        fullScreen()
      }else{
        exitScreen()
      }
      this.isFullscreen = !document.fullscreen
    },
  },

  beforeDestroy() {
    this.$root.eventBus.$off("updateCrumb")
  }
}

</script>

