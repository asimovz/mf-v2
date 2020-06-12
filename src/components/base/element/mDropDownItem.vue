<template>
  <el-dropdown-item :disabled="disabled" :divided="divided" :command="command"><slot></slot></el-dropdown-item>
</template>

<script>
  export default {
    name: 'm-dropdown-item',
    props: {
      command: {
        type: [String, Number, Object],
      },
      disabled: {
        type: Boolean,
        default: false
      },
      divided: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
</style>