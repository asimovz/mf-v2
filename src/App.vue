<template>
  <div v-if="loading" class="init">
    <div class="logo"><img src="/static/images/logo_white.png" alt=""></div>
    <div class="ball-beat">
      <div class="a"></div>
      <div class="b"></div>
      <div class="c"></div>
    </div>
  </div>
  <component v-else v-bind:is="currentView" @updateView="updateView"></component>
</template>
<script>
import index from "./index";
import login from "./login";
import store from "./assets/js/localStorage";

export default {
  name: "App",
  data() {
    return {
      currentView: "login",
      loading: true
    };
  },
  components: {
    login: login,
    index: index,
  },
  methods: {
    updateView() {
      if (this.$root.moquiSessionToken) {
        this.currentView = "index";
        //重新登录之后，需要把当前的路径缓存清空，否则不能完全重新加载界面
        this.$root.currentPathList = [];
        this.getWebParam();
      } else {
        this.$root.notificationClient = null;
      }
    },
    getWebParam() {
      let vm = this.$root;
      vm.$http.get("/getWebRootInitParameters").then(
        response => {
          var moquiData = response.data;
          // vm.moquiSessionToken = moquiData.confMoquiSessionToken
          vm.appHost = moquiData.confAppHost;
          vm.appRootPath = moquiData.confAppRootPath;
          vm.basePath = moquiData.confBasePath;
          vm.linkBasePath = moquiData.confLinkBasePath;
          vm.userId = moquiData.confUserId;
          vm.locale = moquiData.confLocale;
          vm.LCODE = moquiData.identificationCode;
          vm.changePwdUrl = moquiData.changePwdUrl;
          if (vm.localeMap[vm.locale]) {
            vm.locale = vm.localeMap[vm.locale];
          }
          let ran = Math.floor(Math.random() * 4);
          let memberColor = ["#ADCE74", "#AEC0FB", "#87B8FB", "#EFE456"];
          vm.operator = {
            uid: moquiData.confUserPartyId,
            name: moquiData.userFullName,
            userId: moquiData.confUserId,
            userName: moquiData.username,
            background: memberColor[ran]
          };
          //获取用户组信息
          if(moquiData.confUserGroups) {
            let userGroup = []
            moquiData.confUserGroups.map(item => {
              if(item.userGroupId != "" && item.userGroupId != "ALL_USERS") {
                userGroup.push({
                  userGroupId:item.userGroupId,
                  description: item.description
                })
              }
            })
            vm.operator = Object.assign(vm.operator,{
              userGroup:userGroup,
              currentGroupId:userGroup.length > 0 ? userGroup[0].userGroupId : ""
            })
          }
          vm.eventBus.$emit("global_menu")
          vm.eventBus.$emit("page_refresh")
          vm.setUrl(window.location.pathname + window.location.search);

          //初始化和注册监听websocket消息通知
          setTimeout(() => {
            if(this.$root.notificationClient == null) {
              this.$root.notificationClient = new this.$root.moqui.NotificationClient(
                (location.protocol === "https:" ? "wss://" : "ws://") + this.$root.appHost + this.$root.appRootPath + "/notws"
              );
              this.$root.notificationClient.registerListener("ALL");
            }
            // request Notification permission on load if not already granted or denied
            if (
              window.Notification &&
              Notification.permission !== "granted" &&
              Notification.permission !== "denied"
            ) {
              Notification.requestPermission((status) => {
                if (status === "granted") {
                  this.$root.moqui.notifyMessages(
                    "开启浏览器通知, 如果不想启动浏览器通知，请在浏览器设置中禁用！"
                  );
                } else if (status === "denied") {
                  this.$root.moqui.notifyMessages(
                    "屏蔽浏览器通知, 如果想启动浏览器通知，请在浏览器设置中启用！"
                  );
                }
              });
            }
          }, 0);
        },
        response => {
          // error callback
        }
      );
    },

    getThemeType() {
      return this.$http.get('/getCoappsThemeId').then(res => {
        let data = res.data
        let type = data.coappsThemeId
        if(type != "skin_one") {
          this.$root.themeConfig.theme = 'imos'
          this.$root.themeConfig.isTabNav = true
          // this.$root.themeConfig.theme = type.split("-")[1]
          // this.$root.themeConfig.isTabNav = this.$themeList[this.$root.themeConfig.theme]
        }
      }).catch(err => {
        console.log(err);
      })
    },
  },

  created: async function() {
    await this.getThemeType()
    this.loading = false
    let sessionToken = store.get("moquiSessionToken");
    if (sessionToken != null) {
      this.currentView = "index";
      this.$root.moquiSessionToken = sessionToken;
      this.getWebParam();
    }

    // else { with loading component
    //   this.currentView = 'login'
    // }

    this.$root.eventBus.$on("global_logout", () => {
      let vm = this.$root;
      vm.$http.get("/Login/logout").then(
        response => {
          let type = store.get('theme-type') || 'theme-dark'
          store.clearAll();
          store.set('theme-type', type)
          this.currentView = "login";
          this.$root.activeSubscreens = [];
          window.history.pushState(null,'','/');
        },
        response => {
          let type = store.get('theme-type') || 'theme-dark'
          store.clearAll();
          store.set('theme-type', type)

          this.currentView = "login";
          this.$root.activeSubscreens = [];
        }
      );
    });
    this.$root.eventBus.$on("clear_all_caches", () => {
      let vm = this.$root;
      vm.$http.get("/apps/system/Cache/CacheList/frontClearAllCaches").then(
        response => {
          store.clearCaches();
          this.handleNotice('success','清空缓存成功！')
        },
        response => {
          store.clearCaches();
          this.handleNotice('danger','清空缓存失败！')
        }
      );
    });
  },

  beforeDestroy: function() {
    this.$root.eventBus.$off("global_logout");
  }
};

</script>
