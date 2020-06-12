<template>
  <el-button-group :size="currentSize" :class="{'is-vertical': vertical}">
    <slot></slot>
  </el-button-group>
</template>

<script>
  const EL_SIZE = {
    large: 'medium',
    medium: 'small',
    small: 'mini',
  }
  export default {
    name: 'ButtonGroup',
    props: {
      size: {
        type: String,
        default: 'medium'
      },
      vertical: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currentSize(){
        if(Object.keys(EL_SIZE).includes(this.size)){
          return EL_SIZE[this.size]
        }else{
          return 'default'
        }
      }
    }
  }
</script>

<style scoped>
  .el-button-group.is-vertical > /deep/ .el-button{float: none;display: block;}
</style>