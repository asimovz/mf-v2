<template>
  <div v-html="value"></div>
</template>
<script>
// 单元格使用此组件，在属性上必须加上autoHeight，已使行自适应内容高度
export default {
  name: 'ag-html',
  data() {
      return {
        value: null,
      };
    },
  beforeMount(){
    this.value = this.params.value
    this.parent = this.params.context
  },
  methods:{

  }
}
</script>