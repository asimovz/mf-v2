<template>
  <div class="aw-page-root">
    <awAside></awAside>
    <awMain>
      <slot slot="header" name="header"></slot>
    </awMain>
  </div>
</template>
<script>
import awAside from "./pageAside"
import awMain from "./pageMain"
export default {
  name: 'theme-skin',
  props:{
    config:{
      type: Object,
      default() {
        return {
          theme: "dark",
          isTabNav: false
        }
      }
    }
  },
  components: {
    awAside,
    awMain
  },
  data() {
    return {
      themeClass: `theme-${this.config.theme}`
    }
  },
  provide() {
    return {
      configData: this.config
    }
  },
  created() {
    document.body.classList.add(this.themeClass)
  },
}

</script>
