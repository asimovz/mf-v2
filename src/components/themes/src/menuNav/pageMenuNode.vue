<template>
  <m-menu-item class="mf-li" :index="menuData.path" :key="menuData.name" v-if="deepNumber>=maxDeep || !menuData.children || menuData.children.length == 0 ">
    <m-link class="mf-a" :href="menuData.path" @click.native="menuClick(menuData.path)" toggle="menu">
      <!-- <Icon type="android-remove" size="12" style="margin-right: 2px"></Icon> -->
      <!-- <i class="el-icon-document-remove"></i> -->
      <span class="menu-title">{{menuData.title}}</span>
    </m-link>
  </m-menu-item>
  <m-submenu v-else :index="menuData.path" :key="menuData.path">
    <template slot="title">
      <!-- <Icon :type="menuData.image" v-if="deepNumber == 1" size="18"></Icon>
      <Icon type="android-list" v-else size="12"></Icon> -->
      <i :class="['m-icon-nav', `m-icon-nav-${menuData.name}`]"></i>
      <span class="menu-title">{{menuData.title}}</span>
    </template>
    <m-page-menu-node :menuData="child" v-for="(child,index) in menuData.children" :key="index" :title="crumb" :deep="deepNumber"></m-page-menu-node>
  </m-submenu>
</template>
<script>
import elMenuItem from "./src/menu-item"
import elSubmenu from "./src/submenu"
export default {
  name: 'm-page-menu-node',
  props: {
    menuData: Object,
    deep: Number,
    title: String
  },
  inject: ['menuDeep', 'filterPath','setUrlPathArr'],
  components: {
    'm-menu-item': elMenuItem,
    'm-submenu': elSubmenu
  },
  data() {
    return {
      deepNumber: this.deep + 1,
      maxDeep: this.menuDeep,
      crumb: this.title + "," + this.menuData.title
    }
  },
  mounted() {
    let urlPath = this.$root.getLinkPath(window.location.pathname)
    let newPath = this.$root.getLinkPath(this.menuData.path)
    if (urlPath == newPath) {
      this.menuClick(this.menuData.path)
    }
    if(this.deepNumber >= this.maxDeep || !this.menuData.children || this.menuData.children.length == 0) {
      this.setUrlPathArr({
        crumb:this.crumb,
        path: this.menuData.path
      })
    }
  },
  methods: {
    menuClick(path) {
      let newPath = this.$root.getLinkPath(path)
      let currentCrumb = this.crumb.split(",")
      currentCrumb.shift()
      this.$root.eventBus.$emit("updateAsideMenu",false,newPath)
      this.$root.eventBus.$emit("updateCrumb", currentCrumb)
      // 动态标签页当前路径 => index
      this.$root.eventBus.$emit('active_header_nav', this.menuData)
    },
  },
}

</script>
