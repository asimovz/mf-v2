<template>    
  <el-tooltip 
    :content="title" 
    :transfer="true" 
    >
    <slot></slot>    
  </el-tooltip>
</template>

<script>
export default {
  name: 'm-tooltip',
  data () {
    return {
    }
  },
  props: {
    title: String,
    transfer: {
      type: Boolean,
      default: true
    }
  },

  mounted: function () {

  },

  beforeDestroy: function () {
  }
}
</script>
