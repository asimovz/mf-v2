<template>
  <Col 
    :span="Number(respoSpan)"
    :offset="Number(offset)"
    :class-name="className"
    >
    <slot></slot>
  </Col>
</template>

<style>
.col-content-left {
  text-align: left;
}

.col-content-middle {
  text-align: middle;
}

.col-content-right {
  text-align: right;
}
</style>

<script>
export default {
  name: "m-col",

  props: {
    span: {
      type: String
    },
    offset: {
      type: String
    },
    xs: {
      type: Number | Object
    },
    sm: {
      type: Number | Object
    },
    md: {
      type: Number | Object
    },
    lg: {
      type: Number | Object
    },
    className: {
      type: String
    }
  },

  data() {
    return {
      respoSpan: this.span ? this.span : (this.md || this.lg || this.sm || this.xs)
    }
  },
};
</script>