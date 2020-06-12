<template class="customDrawer">
  <el-drawer
    :custom-class="styles"
    :id="id"
    :title="menuTitle"
    :with-header="false"
    :size="width + 'px'"
    :url="url"
    :visible.sync="visible"
    :wrapperClosable="false"
    :show-close="menuPlacement!=='sider'"
    :direction="elDirection"
    @open="dynamicUrlChange"
    @close="dynamicUrlChange"
  >
    <div class="m-drawer-custom__title">{{menuTitle}}</div>
    <div v-if="showSider && menuPlacement ==='sider'" :class="['sider', placement === 'right'?'sider-right':'sider-left']">
      <div class="close" @click="close">
        <i class="el-icon-close" style="font-size:25px;color: #2d8cf0;font-weight: bold;"/>
      </div>
      <div class="menu">
          <div v-for="(tab, i) in subscreens" :key="tab.name" @click.prevent="tabClick(tab, i)" class="menuItem">
            <span :class="i === activeIndex?'blue':'pointer'">{{tab.title}}</span>
          </div>
      </div>
    </div>
    <div v-if="showSider && menuPlacement ==='top'" class="topMenu">
      <div class="menu">
        <div v-for="(tab, i) in subscreens" :key="tab.name" @click.prevent="tabClick(tab, i)" :class="['menuItem', i === activeIndex?'blue':'pointer']">
          <span>{{tab.title}}</span>
        </div>
      </div>
    </div>
    <slot v-if="isDynamic == false"></slot>
    <component v-else :is="curComponent"></component>
  </el-drawer>
</template>

<script>
import mLoad from "./mLoad";

export default {
  name: "m-drawer",

  props: {
    id: {
      type: String,
      required: true
    },
    title: String,
    width: {
      type: Number | String,
      default: 500
    },
    url: {
      type: String
    },
    openDrawer: {
      type: Boolean,
      default: false
    },
    isDynamic: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "right"
    },
    // 控制是侧边导航栏'sider'，还是顶部导航栏'top'
    menuPlacement: {
      type: String,
      default: "sider"
    },
    dynamicParams: {
      type: Object,
      default: null
    }
  },

  computed: {
    elDirection() {
      return this.placementCofig[this.placement]
    },
    styles() {
      if (this.showSider && this.menuPlacement === 'sider') {
        if(this.placement === 'right') {
          return "el-customDrawer el-siderRightDrawer"
        }
        if(this.placement === 'left') {
          return "el-customDrawer el-siderLeftDrawer"
        }
      }
      if (this.showSider && this.menuPlacement === 'top') {
        return "el-customDrawer el-topDrawer"
      }
    }
  },

  data: function() {
    return {
      activeIndex: null,
      menuTitle: '',
      pathIndex: null,
      subscreens: [],
      visible: false,
      showSider: false,
      firstUrl: "",
      curUrl: "",
      curComponent: mLoad,
      placementCofig: {
        right: 'rtl',
        left: 'ltr',
      }
    };
  },

  watch: {
    url:{
      handler(val) {
        this.curUrl = val
      },
      immediate: true
    },

    curComponent:function (val) {
      this.curComponent = val
    },

    openDrawer(val) {
      this.visible = val
      if(!val) return
      let regex = /\/(\w+)/g
      this.pathIndex = this.url.match(regex).length-2
      if(this.url != this.firstUrl) {
        this.getSubscreens()
      } else {
        this.getActiveData(this.subscreens)
      }
      this.menuTitle = this.title
    },

    curUrl: function(newUrl) {
      this.activeComponent(newUrl)
    }
  },

  mounted: function() {
    if (this.openDrawer) {
      this.visible = this.openDrawer;
    }
  },

  methods: {
    getSubscreens: function() {
      this.$http.get("/menuData" + this.url).then(response => {
        this.firstUrl = this.url
        this.subscreens = response.data[this.pathIndex].subscreens
        this.showSider = this.subscreens.length > 0
        this.getActiveData(this.subscreens)
      })
      if (!this.subscreens || !this.subscreens.subscreens) {
        this.subscreens = []
      }
    },
    getActiveData: function(data) {
      let index
      let activeData = data.find((item, i)=>{
        if(item.active === "true") {
          index = i
          return true
        }
        return false
      })
      this.tabClick(activeData, index)
    },
    close: function () {
      this.visible = false
    },
    activeComponent: function(newUrl) {
      if (!newUrl || newUrl.length === 0) {
        this.curComponent = mLoad;
        return;
      }
      var vm = this;
      if (this.$root.moqui.isPlainObject(this.dynamicParams)) {
        var dpStr = "";
        $.each(this.dynamicParams, function(key, value) {
          var dynVal = $("#" + value).val();
          if (dynVal && dynVal.length)
            dpStr = dpStr + (dpStr.length > 0 ? "&" : "") + key + "=" + dynVal;
        });
        if (dpStr.length)
          newUrl = newUrl + (newUrl.indexOf("?") > 0 ? "&" : "?") + dpStr;
      }
      this.$root.loadComponent(
        newUrl,
        function(comp) {
          comp.mounted = function() {};
          vm.curComponent = comp;
        },
        this.id
      );
    },
    tabClick: function (data, i) {
      this.activeIndex = i
      this.menuTitle = data.title
      if(this.curUrl === data.pathWithParams) return
      this.curUrl = data.pathWithParams
    },
    dynamicUrlChange: function() {
      this.$emit("on-change", this.visible);
    }
  },
};
</script>
<style lang="scss">
  .el-customDrawer {
    // 去除el 点击出现蓝色边框的bug
    outline: none;
    padding-top: 50px;


    // Fix: MacOs safari 上 el-drawer 弹出动画异常 => 不使用 el-drawer 自带的 title， 自己实现 title
    .m-drawer-custom__title{
      position: absolute;
      top: 0;
      left: 60px;
      right: 0;
      display: flex;
      align-items: center;
      height: 51px;
      padding: 16px 20px;
      border-bottom: 1px solid #e8eaec;
      color: #72767b;
    }

    .el-drawer__body {
      padding: 20px;
      overflow: auto;
    }
    .el-drawer__header {
      margin-bottom: 0;
      padding: 16px 20px;
      border-bottom: 1px solid #e8eaec;
      span {
        // 去除el 标题点击出现蓝色边框的bug
        outline: none;
      }
    }
  }

  .el-siderRightDrawer {
    padding-left: 60px;
  }

  .el-siderLeftDrawer {
    padding-right: 60px;
  }

  .el-topDrawer {
    padding-top: 0;

    .el-drawer__body {
      padding: 0 20px 20px 20px;
    }
  }
</style>

<style lang="scss" scoped>
.sider {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 100%;
  top: 0;

  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    background: #e8eaec;
    border: 1px solid #e8eaec;
    cursor: pointer;
  }

  .menu {
    flex: 1;
    background: #fff;
    border: 1px solid #e8eaec;

    .menuItem {
      width: 100%;
      padding: 10px 13px;
      display: flex;
      justify-content: center;
      align-items: center;

      .blue {
        color:#2D8CF0;
      }
      .pointer:hover {
        cursor: pointer;
      }
    }
  }
}

.sider-right {
  left: 0px;
}

.sider-left {
  right: 0px;
}

.topMenu {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  padding-bottom: 12px;
  background: #fff;
  // background: #F0F3F7;

  .menu {
    display: flex;
    padding-top: 12px;

    .menuItem {
      padding-bottom: 16px;
      margin-right: 16px;
      font-size: 14px;
    }

    .blue {
      color:#2D8CF0;
      border-bottom: 2px solid #2D8CF0;
    }
    .pointer:hover {
      cursor: pointer;
      border-bottom: 2px solid #2D8CF0;
    }
  }
}
</style>
