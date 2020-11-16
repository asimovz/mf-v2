<template>
  <div class="aw-aside" @mouseenter="enterAside" @mouseleave="leaveAside">
    <div class="aw-aside_brand">
      <div class="aw-aside_brand-logo">
        <!-- <img src="/static/images/logo.png" style="width: 50px; margin-right:10px"> -->
        <span>短信保镖</span>
      </div>
      <div class="aw-aside_brand-tools">
        <div class="aw-aside_brand-tools-toggler" @click="toggleAside">
          <span></span>
        </div>
      </div>
    </div>
    <div class="aw-aside-menu-wrapper" @mouseenter="setMenuScroll" @mouseleave="getMenuScroll">
      <pageMenu></pageMenu>
    </div>
    <div class="aw-aside_footer"></div>
  </div>
</template>
<script>
import pageMenu from "../menuNav/index.js"
export default {
  name: 'm-page-aside',
  components: {
    pageMenu
  },
  data() {
    return {
      menuData: [],
      classObj: null,
      scrollTop: 0
    }
  },
  mounted() {
    this.classObj = document.body.classList
    // , "aw-header--fixed"
    this.classObj.add("aw-aside--fixed", "aw-header--fixed")
  },
  methods: {
    setMenuScroll(evt) {
      let el = evt.target
      el.scrollTop = this.scrollTop
    },
    getMenuScroll(evt) {
      let el = evt.target
      this.scrollTop = el.scrollTop
    },
    toggleAside() {
      this.classObj.toggle("aw-aside--fixed")
      if (!this.classObj.contains("aw-aside--fixed")) {
        this.classObj.add("aw-aside--minimize")
      } else {
        this.classObj.remove("aw-aside--hover")
      }
    },
    enterAside() {
      // console.log("进入")
      if (!this.classObj.contains("aw-aside--fixed")) {
        this.classObj.add("aw-aside--hover")
        this.classObj.remove("aw-aside--minimize")
      }

    },
    leaveAside() {
      // console.log("离开")
      if (!this.classObj.contains("aw-aside--fixed")) {
        this.classObj.remove("aw-aside--hover")
        this.classObj.add("aw-aside--minimize")
      }

    }
  }
}

</script>