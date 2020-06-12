<template>
	<el-badge 
		:value="count" 
		:max="overflowCount"
		:is-dot="dot"
		:class="'mbadge-'+className"
	>
  <slot></slot>
	</el-badge>
</template>
<style lang='less'>
  @default: #495060;
  @primary: #2b85e4;
  @info: #5cadff;
  @success: #19be6b;
  @warning: #ff9900;
  @danger: #ed3f14;

  .badge-base{
    display: inline-block;
    border-radius: 8px;
  }

  .mbadge-default{
    .el-badge__content{
      .badge-base;
      background: @default !important;
    }
  }

  .mbadge-primary{
    .el-badge__content{
      .badge-base;
      background: @primary !important;
    }
    
  }

  .mbadge-info{
    .el-badge__content{
      .badge-base;
      background: @info !important;
    }
  }

  .mbadge-success{
    .el-badge__content{
      .badge-base;
      background: @success !important;
    }
  }

  .mbadge-warning{
    .el-badge__content{
      .badge-base;
      background: @warning !important;
    }
  }

  .mbadge-danger{
    .el-badge__content{
      .badge-base;
      background: @danger !important;
    }
  }

</style>
<script>
export default {
  name: "m-badge",

  props: {
    count: [Number, String],
    dot: {
      type: Boolean,
      default: false
    },
    overflowCount: {
      type: [Number, String],
      default: 99
    },
    className: String
  }
};
</script>