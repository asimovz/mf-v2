<template>
  <div class="active-tabs">
    <el-tabs class="active-tabs-content" refs="tabs" v-if="loading" type="card" v-model="elTabIndex" @tab-remove="tabRemove" @tab-click="tabClick">
      <el-tab-pane v-for="(tab, index) in tabs" :key="index" :closable="index!=0" :label="tab.title" :name="index+''"></el-tab-pane>
    </el-tabs>
    <div class="tabs-control">
      <!-- <m-tooltip transfer title="关闭全部"> -->
        <m-button size="medium" class="close" type="default" @click.native="dropClick('all')"><i class="el-icon-error"></i></m-button>
      <!-- </m-tooltip> -->
      <m-dropdown @on-command="dropClick" :options="contextmenuList">
        <m-button size="medium" type="default" style="height: 100%;" class="tabs-dropdown"><i class="el-icon-arrow-down"></i></m-button>
      </m-dropdown>
    </div>
    <ul ref="contextmenu1" v-show="contextVisible0" class="active_header el-dropdown-menu el-dropdown-menu--small" :style="contextStyle">
      <li class="el-dropdown-menu__item" @click="dropClick('all')"><i class="el-icon-error"></i> 关闭全部</li>
    </ul>
    <ul ref="contextmenu2" v-show="contextVisible != -1" class="active_header el-dropdown-menu el-dropdown-menu--small" :style="contextStyle" @click="contextmenuClick">
      <li class="el-dropdown-menu__item" :data-name="menu.value" v-for="(menu, index) in contextmenuList" :key="menu.id">{{menu.label}}</li>
    </ul>
  </div>
</template>
<script>
const defaultTabs = { path: '/', title: '首页' }

export default {
  name: 'm-active-header',
  data() {
    return {
      tabs: [defaultTabs],
      tabIndex: 0,
      currentPath: "",
      loading: true,
      contextVisible0: false, // 主页标签的操作菜单
      contextVisible: -1, // -1 为关闭， or 为点击的 n 个
      contextStyle: {
        left: '',
        top: ''
      },
      contextmenuList: [
        { id: 1, label: '关闭左侧', value: 'left', icon: 'android-arrow-back' },
        { id: 2, label: '关闭右侧', value: 'right', icon: 'android-arrow-forward' },
        { id: 3, label: '关闭其他', value: 'other', icon: 'close' },
        { id: 0, label: '关闭全部', value: 'all', icon: 'close-circled' },
      ]
    }
  },
  computed: {
    elTabIndex: {
      get() {
        return this.tabIndex + ''
      },
      set(val) {
        return val
      }
    }
  },
  inject: ['configData'],
  mounted() {
    document.body.classList.add("aw-header-tab--active")
    this.$root.eventBus.$on('active_header_nav', nav => {
      this.handlerNav(nav)
    })
    document.body.appendChild(this.$refs.contextmenu1)
    document.body.appendChild(this.$refs.contextmenu2)

    document.addEventListener('mousedown', this.contextHide)
    document.addEventListener('contextmenu', this.winContextUnbind)
  },

  destroyed() {
    this.$root.eventBus.$off('active_header').$off('active_header_nav')
    document.removeEventListener('mousedown', this.contextHide)
    document.removeEventListener('contextmenu', this.winContextUnbind)
  },

  methods: {
    winContextUnbind(evt) {
      if (document.querySelector('.el-tabs__nav').contains(evt.target)) {
        let id = evt.target.id
        let index = id.split('tab-')[1]

        this.labelClick(evt, +index)

        evt.preventDefault()
      }
    },
    contextHide(evt) {
      let target = evt.target
      if (this.$refs.contextmenu1.contains(target) || this.$refs.contextmenu2.contains(target)) return
      this.contextVisible0 = false
      this.contextVisible = -1
    },

    handlerNav(nav) {
      // if(!nav.path || nav.path === '/apps/AppList') return;
      if (!this.tabs.some(tab => tab.path === nav.path)) {
        this.tabs.push(nav)
        this.tabIndex = this.tabs.length - 1
        this.currentPath = nav.path
      } else {
        this.tabIndex = this.tabs.findIndex(tab => tab.path.includes(nav.path))
      }
    },

    labelRender(h, title, index) {
      return h('span', {
        class: 'tab-span' + (index == 0 ? ' unclosable' : ''),
        attrs: {
          index: index
        },
        on: {
          mouseup: evt => this.labelClick(evt, index)
        }
      }, title)
    },

    labelClick(evt, index) {
      if (evt.which !== 3) return false;
      let { x, y } = evt;
      this.contextStyle = {
        left: `${x}px`,
        top: `${y}px`
      }

      if (index === 0) {
        this.contextVisible0 = true
      } else {
        this.contextVisible = index
      }

      evt.preventDefault()
    },

    contextmenuClick(evt) {
      let el = evt.target
      let name = el.getAttribute('data-name')
      this.dropClick(name)
      this.contextVisible = -1
    },

    tabClick(tab) {
      let index = tab.index
      let url = this.tabs[index].path
      let title = this.tabs[index].title
      this.tabIndex = index
      if (url === this.currentPath) return
      this.currentPath = url
      this.setUrl(url, title)
    },
    setUrl(url, title) {
      if (url === undefined) {
        let tab = this.tabs[this.tabIndex]
        url = tab.path
        title = tab.title
      }
      this.$root.setUrl(url)
      let newPath = this.$root.getLinkPath(url)
      window.history.pushState(null, title, newPath)
      this.$root.eventBus.$emit('updateAsideMenu', true, newPath)

      this.currentPath = url
    },
    tabRemove(index) {

      if (+index === this.tabs.length || index <= this.tabIndex) {
        this.tabIndex--
        this.tabs.splice(index, 1)
        let url = this.tabIndex > -1 ? this.tabs[this.tabIndex].path : '/'
        if (this.tabs.length == 1) this.tabIndex = 0
        if (url === this.currentPath) return
        this.setUrl(url)
      } else {
        this.tabs.splice(index, 1)
      }

    },

    forceUpdate() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    // 右侧工具按钮事件及标签页右键菜单事件
    dropClick(name) {

      this.contextVisible0 = false

      // 主页标签页不可被关闭，且只剩主页标签页时任何操作无效
      if (this.tabs.length === 1 && this.tabs[0].path === '/') return

      let menuIndex = this.contextVisible

      let shouldRequest = menuIndex !== -1
      switch (name) {
        case 'left':
          if (shouldRequest) {
            shouldRequest = this.tabIndex < menuIndex
          }
          this.closeLeft(menuIndex);
          break;
        case 'right':
          if (shouldRequest) {
            shouldRequest = this.tabIndex > menuIndex
          }

          this.closeRight(menuIndex);
          break;
        case 'other':
          if (shouldRequest) {
            shouldRequest = this.tabIndex !== menuIndex
          }

          this.closeOther(menuIndex);
          break;
        case 'all':
          shouldRequest = true
          this.closeAll(menuIndex);
          break;
        default:
          break;
      }

      shouldRequest && this.setUrl()
    },

    /**
     * [closeLeft 关闭左侧]
     * @param  {[type]} index [ -1, 右侧下拉菜单， or 右键菜单]
     * @return {[type]}       [description]
     */
    closeLeft(index) {

      let isTool = index === -1
      this.tabs.splice(1, isTool ? this.tabIndex - 1 : index - 1)

      if (index === -1) {
        this.tabIndex = this.tabIndex === 0 ? 0 : 1
      } else if (index > this.tabIndex) {
        this.tabIndex = this.tabs.length - 1
      } else {
        this.tabIndex = this.tabIndex - index + 1
      }

    },
    closeRight(index) {


      let newIndex = index !== -1 ? index : this.tabIndex
      if (newIndex + 1 !== this.tabs.length) {
        this.tabs.splice(newIndex - this.tabs.length + 1)
      }

      if (index !== -1 && index < this.tabIndex) this.tabIndex = index
    },
    closeOther(index) {
      let nav = this.tabs[(index !== -1 ? index : this.tabIndex)]
      this.tabs = [defaultTabs, nav]
      this.tabIndex = 1
    },
    closeAll() {
      // this.tabs.splice(0)
      this.tabs = [defaultTabs]
      this.tabIndex = 0
    }
  }
}

</script>
<style lang="less">
.active-tabs {
  position: relative;
  padding: 0 10px 0 0;

  .active-tabs-content {
    margin-right: 71px;
  }

  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 40px;
    width: 20px;
    text-align: center;
  }

  .el-tabs__nav {
    border-color: #cfd7e5 !important;
  }

  .el-tabs__header {
    margin-bottom: 0;
    border-color: #cfd7e5;
  }

  .is-active {
    background-color: #fff !important;
  }

  .el-tabs__header .el-tabs__item {
    border-left-color: #cfd7e5!important;
    background-color: rgba(0, 0, 0, .03);
    user-select: none;
  }

  .el-tabs__item:first-child {
    border-left: none;
    border-top-left-radius: 4px;
  }

  .el-tabs__item:last-child {
    border-top-right-radius: 4px;
  }

  .tabs-control {
    position: absolute;
    top: 1px;
    bottom: 0;
    right: 10px;
    display: inline-flex;

    .close {
      width: 46px;
      flex: 1;
      position: relative;
      z-index: 1;
      margin-right: -1px;
      border-radius: 4px 0 0 0;
      padding: 12px;

      &:hover {
        z-index: 2
      }
    }

    .tabs-dropdown {
      position: relative;
      z-index: 1;
      width: 26px;
      height: 100%;
      padding-left: 0;
      padding-right: 0;
      border-radius: 0 4px 0 0;
      border-left: none;

      &:before {
        content: "";
        position: absolute;
        display: block;
        width: 1px;
        top: 5px;
        bottom: 5px;
        left: 0;
        background: rgba(220, 223, 230, .5)
      }

      &:hover:before {
        top: 0;
        bottom: 0;
        background-color: #c6e2ff
      }
    }

  }
}

.active_header {
  z-index: 999
}

</style>
