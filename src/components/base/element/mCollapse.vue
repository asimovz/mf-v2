<template>
  <el-collapse ref="collapse"  v-model="openName" :class="classs">
    <slot></slot>
  </el-collapse>
</template>
<script>
export default {
  name: "m-collapse",
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String]
    },
    type: { 
      type: String,
      default: 'default'
    },
    simple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      openName: this.value,
      classs: `aw-collapse aw-collapse-${this.type}`
    }
  }
};
</script>
<style lang="less">

@default: #FAFAFA;
@default-border: #D9D9D9;
@primary: #e2f1f9;
@primary-border: #b8d9ec;
.aw-collapse {
  margin-bottom: 10px;
  border-top: none;
  .el-collapse-item__header{padding: 15px;}
  .el-collapse-item__content{padding: 15px 25px 25px;}
}
.aw-collapse-default {
  border-color: @default-border;
  background-color: @default;
  .el-collapse-item__header{
    background-color: @default;
  }
}

.aw-collapse-primary {
  border-color: @primary-border;
  background-color: @primary;
  .el-collapse-item__header{
    background-color: @primary;
  }
}


</style>