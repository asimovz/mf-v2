<template>
  <Drawer
    :styles="styles"
    :id="id"
    :title="menuTitle"
    :width="width"
    :url="url"
    v-model="visible"
    :mask-closable="false"
    :closable="menuPlacement!=='sider'"
    :placement="placement"
    @on-visible-change="changeVisible"
  > 
    <div v-if="showSider && menuPlacement ==='sider'" :class="['sider', placement === 'right'?'sider-right':'sider-left']">
      <div class="close" @click="close">
        <Icon color="#2d8cf0" type="close-round" size="19" />
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
    <!-- <component v-if="showSider" :is="curComponent"></component> -->
    <slot v-if="isDynamic == false"></slot>
    <component v-else :is="curComponent"></component>
  </Drawer>
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
    styles() {
      if (this.showSider && this.menuPlacement === 'sider') {
        return { position: "static" }
      }
      if (this.showSider && this.menuPlacement === 'top') {
        return { paddingTop: 0 }
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
      // 第一次进入侧边栏获取导航栏的index和url缓存
      firstIndex: null,
      firstUrl: "",
      curUrl: "",
      curComponent: mLoad,
    };
  },

  watch: {
    url:{
      handler(val) {
        this.url = val
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
        this.activeIndex = this.firstIndex
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
    this.$root.eventBus.$on("drawer_visible_change_" + this.id, result => {
      this.visible = !this.visible;
    });
    //如果是动态抽屉内容
    // if (this.isDynamic) {
    //   this.$root.addContainer(this.id, this);
    // }
  },

  methods: {
    getSubscreens: function() {
      this.$http.get("/menuData" + this.url).then(response => {
        this.firstUrl = this.url
        this.subscreens = response.data[this.pathIndex].subscreens
        this.showSider = this.subscreens.length > 0
        this.getActiveData(this.subscreens, true)
      })
      if (!this.subscreens || !this.subscreens.subscreens) {
        this.subscreens = []
      }
    },
    getActiveData: function(data, flag=false) {
      let index
      let activeData = data.find((item, i)=>{
        if(item.active === "true") {
          index = i
          if(flag) this.firstIndex = index
          return true
        }
        return false
      })
      this.tabClick(activeData, index)
    },
    close: function () {
      this.changeVisible(false)
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
    
    reload: function() {
      if (this.visible) {
        this.hide();
        this.load();
      }
    },
    load: function(url) {
      this.curUrl = url;
    },
    hide: function() {
      this.visible = false;
    },
    changeVisible(newval) {
      this.$emit("on-change", newval);
    }
  },

  beforeDestroy: function() {
    this.$root.eventBus.$off("drawer_visible_change_" + this.id);
  }
};
</script>
<style lang="scss" scoped>
.sider {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 55px;
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
  left: -55px;
}

.sider-left {
  right: -55px;
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
