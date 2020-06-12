<template>
  <theme-body :config="config"></theme-body>
</template>
<script>
export default {
  name: "new-index",
  data() {
    return {
      config: {
        theme: this.$root.themeConfig.theme,
        isTabNav: this.$root.themeConfig.isTabNav && this.$root.themeConfig.component!="iview"
      }
    };
  }
};
</script>
