<template>
	<Badge 
		:count="count" 
		:overflowCount="overflowCount"
		:dot="dot"
		:className="'mbadge-'+className"
	>
  <slot></slot>
	</Badge>
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
    .badge-base;
    background: @default !important;
  }

  .mbadge-primary{
    .badge-base;
    background: @primary !important;
  }

  .mbadge-info{
    .badge-base;
    background: @info !important;
  }

  .mbadge-success{
    .badge-base;
    background: @success !important;
  }

  .mbadge-warning{
    .badge-base;
    background: @warning !important;
  }

  .mbadge-danger{
    .badge-base;
    background: @danger !important;
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