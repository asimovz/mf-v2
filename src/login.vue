<template>
  <component :is="`theme-login-${type}`" @updateView="updateView" />
</template>
<script>
export default {
  name: 'new-login',
  data() {
    return {
      type: this.$root.themeConfig.theme
    }
  },
  methods: {
    updateView() {
      this.$emit('updateView')
    }
  },
  created() {

  }
}

</script>

