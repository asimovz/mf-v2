<template>
  <div class="m-page-menu">
    <m-menu ref="menu"  :default-active="activeName" :default-openeds="openNames" width="auto" :accordion="true">
      <menuNode :menuData="item" v-for="item in menuData" :key="item.name" :deep="0"></menuNode>
    </m-menu>
  </div>
</template>
<script>
import elMenu from "./src/menu"
import menuNode from "./pageMenuNode"

export default {
  name: 'm-page-menu',
  props: {
    deep: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      menuData: [],
      activeName: '',
      openNames: [],
      urlPathArr: [],
    }
  },
  components: {
    menuNode,
    'm-menu': elMenu
  },
  provide: function () {
    let _self = this
    return {
      menuDeep: this.deep,
      filterPath(path, deep) {
        return _self.filterPath(path, deep)
      },
      setUrlPathArr(data) {
        _self.urlPathArr.push(data)
      }
    }
  },

  mounted() {
    this.$root.eventBus.$on("updateAsideMenu", (out = false, path) => {
      let newPath = path ? path : window.location.pathname + window.location.search
      this.activeName = newPath.replace(this.$root.linkBasePath, this.$root.basePath)
      this.updateMenu(out)
    })

    this.$root.eventBus.$on("global_menu", data => {
      this.getMenuData()
    })

    this.$once('hook:beforeDestroy', function () {
      this.$root.eventBus.$off("global_menu")
      this.$root.eventBus.$off("updateAsideMenu")
    })

    window.addEventListener('popstate', (e) => {
      let outPath = window.location.pathname + window.location.search
      this.$root.setUrl(outPath)
      this.activeName = outPath.replace(this.$root.linkBasePath, this.$root.basePath)
      this.updateMenu(true)
    })
  },

  methods: {
    getOldMenuData() {
      this.$http.get("/getMenuItems").then(response => {
        let newMenuData = response.data
        this.menuData = newMenuData[0].children
        this.open()
      })
    },
    getMenuData() {
      if (this.$root.operator.currentGroupId) {
        let groupParams = {
          params: {
            userGroupId: this.$root.operator.currentGroupId
          }
        }
        this.$http.get("/getCustomMenuItemsByUserGroup", groupParams).then(response => {
          let newMenuData = response.data
          this.menuData = newMenuData[0].children
          if(this.menuData.length == 0) this.getOldMenuData()
          this.open()
        }, err => {
          this.getOldMenuData()
        })
      } else {
        this.getOldMenuData()
      }
    },
    filterPath(path, deep) {
      return path.split("/").slice(0,deep).join("/")
    },
    open() {
      this.setOpenName()
      this.updateMenu()
    },
    setOpenName() {
      let newPath = this.activeName == "" ?  window.location.pathname + window.location.search : this.activeName
      let urlpath = newPath.replace(this.$root.linkBasePath, this.$root.basePath)
      let names = urlpath.split("/")
      names.shift()
      let openArr = []
      for (var i = 1; i <= names.length; i++) {
        let item = names.slice(0, i)
        openArr.push("/" + item.join("/"))
      }
      this.openNames = openArr
    },
    getDeep() {
      return this.deep
    },
    updateMenu(isOut) {
      this.activeName = this.filterPath(this.activeName, this.deep + 1)
      this.activeName = this.activeName.split("?")[0]
      let menu = this.$refs.menu
      if (this.activeName != "/") {
        isOut && this.setOpenName()
        if (isOut) {
          let currentCrumb = this.urlPathArr.find(item => {
            return item.path == this.activeName
          })
          if(currentCrumb) {
            let crumb = currentCrumb.crumb.split(",")
            crumb.shift()
            this.$root.eventBus.$emit("updateCrumb", crumb)

            let _title =  currentCrumb.crumb.split(",").slice(-1)
            this.$root.eventBus.$emit('active_header_nav',{
              title: typeof _title === 'string' ? _title : _title.join(),
              path:currentCrumb.path
            })
          }
        }
      } else {
        this.$root.eventBus.$emit("updateCrumb", ['首页'])
      }
    }
  },
}

</script>