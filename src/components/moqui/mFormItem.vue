<template>
  <div class="aw-form-item">
    <label class="aw-form-item_label" :style="{'text-align':align,'width':labelWidth}" v-if="span !== '0'">{{label}}</label>
    <div class="aw-form-item_content" :style="{'justify-content':contentAlign,'width':contentWidth}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "m-form-item",
  props: {
    label: {
      type: String
    },
    align: {
      type: String,
      default: 'right'
    },
    span: {
      type: String,
      default: '8'
    },
    contentAlign: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      labelWidth: (this.span/24).toFixed(3)*100+'%',
      contentWidth: ((24 - this.span)/24).toFixed(3)*100+'%'
    }
  },
  created() {
    this.$parent.isOnlySubmit = false
  }
}
</script>