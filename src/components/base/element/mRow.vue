<template>
  <el-row 
    :id="id"
    :class-name="className"
    :gutter="Number(gutter)"
    :style="rowStyle"
    >
    <slot></slot>
  </el-row>
</template>
<script>
export default {
  name: "m-row",
  props: {
    id: {
      type: String
    },
    gutter: {
      type: String
    },
    className: {
      type: String
    },
    top: {
      type: String,
      default: '0'
    },
    bottom: {
      type: String,
      default: '0'
    }
  },

  data() {
    return {
      rowStyle: `margin-top:${Number(this.top)}px;margin-bottom:${Number(this.bottom)}px;background-color:#fff`
    }
  },

  methods: {}
};
</script>