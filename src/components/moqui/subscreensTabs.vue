<template>
    <div :class="['aw-subscreens-tab',{'aw-subscreens-tab-header':flxed}]" v-if="subscreens.length > 0" >
        <ul class="subscreens-tab_nav" role="tablist">
            <li v-for="tab in subscreens" @click.prevent="tabClick" :class="{active:tab.active,disabled:tab.disableLink}">
                <span v-if="tab.disabled">{{tab.title}}</span>
                <m-link v-else :href="tab.pathWithParams">{{tab.title}}</m-link>
            </li>
        </ul> 
    </div>
</template>
<script>
export default {
  name: 'subscreens-tabs',
  props: {
    flxed: {
      type: Boolean,
      default: false
    }
  },
  data() { 
  	return { 
      pathIndex:-1,
      classObj: null
    }
  },
  mounted: function () {
    this.classObj = document.body.classList
    if(this.flxed) {
      this.classObj.add("aw-subscreens-tab--flxed")
    }
    this.pathIndex = this.$root.activeSubscreens.length
  },
  computed: {
    subscreens: function () {
  		if (!this.pathIndex || this.pathIndex < 0) return []
  		var navMenu = this.$root.navMenuList[this.pathIndex]
  		if (!navMenu || !navMenu.subscreens) return []
  		return navMenu.subscreens
    }
  },
  methods: {
    tabClick: function () {
      this.$root.eventBus.$emit("updateAsideMenu")
    }
  },
  destroyed() {
    this.classObj.remove("aw-subscreens-tab--flxed")
  }
}
</script>
<style>
.aw-subscreens-tab {
  margin-bottom: 10px
}
.no-tool .tab-list {
  height: 50px;
  line-height:53px;
}

.tab-list {
    width: 100%;
    height: 40px;
    line-height:43px;
    background: #FFF;
    margin-bottom: 15px;
}
.tab-list .nav {
    display:inline-block;
    justify-content: center;
}
.tab-list .nav li {
    display: inline-block;
    margin: 0 10px;
    position: relative;
    cursor: pointer;
    color:#404040;
    font-size: 14px;
}
.tab-list .nav li a {
    display: inline-block;
    color:#404040;
    padding:0;
}
.tab-list .nav li.active,
.tab-list .nav li.current,
 .tab-list .nav li.active a,
.tab-list .nav li.current a{
    color:#288bf5;
}
.tab-list .nav li.active:before,
.tab-list .nav li.current:before {
    content: "";
    border-bottom: 2px solid #288bf5;
    position: absolute;
    display: inline-block;
    width: 100%;
    bottom: 3px;
}
</style>

