<template>
  <m-modal
    class="msgCardPreview"
    id="msgCardPreview"
    v-model="dialogVisible"
    >
    <div class="scroll-wrap">
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
      <span>这是一段信息</span><br>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogVisible = false">关闭</el-button>
    </div>
  </m-modal>
</template>
<script>
export default {
  name: 'msgCardPreview',
  data () {
    return {
      dialogVisible: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {

  },
  watch: {
    value (v) {
      this.dialogVisible = v
    },
    dialogVisible (v) {
      this.$emit('input', v)
    }
  },
  created () {

  },
  methods: {
    async getData () {
      try {
        const { data } = await this.$root.$http.get(this.transition, {...this.params})
        this.items = data
      } catch (err) {
        console.log('request err', err)
      }
    }
  },
  beforeDestroy () {

  }
}
</script>
<style lang='less'>
.msgCardPreview {
  .el-dialog__header{
    display: none;
  }
  .dialog-footer{
    text-align: center;
    padding:10px;
  }
  .el-dialog{
    background: none;
    box-shadow: none;
    width:260px!important;
  }
  .el-dialog__body{
    height:520px;
    padding:35px 15px;
    max-height: none!important;
    background:url('./phone-bg.png') 0 0 no-repeat;
    background-size: cover;
  }
  .scroll-wrap{
    width:100%;
    height:100%;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 0 2px #dedede;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
  }
}
</style>