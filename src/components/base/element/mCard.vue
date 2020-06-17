
<script>
export default {
  name: 'm-card',
  render (h) {
    return h('el-card', {
      props: this.$attrs,
      class: 'm-el-card'
    }, [
      this.$slots.header || this.$attrs.header ? h('div', {
        slot: 'header',
        class: 'm-card__header'
      }, [
        h('div', {
          class: 'title'
        }, [
          this.$slots.header || h('span', this.$attrs.header)
        ]),
        h('div', {
          class: 'extra'
        }, [
          this.$slots.extra
        ])
      ]) : '',
      this.$slots.default
    ])
  }
}
</script>
<style lang="scss">
.m-el-card {
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.12)!important;
  .el-card__header{
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    position: relative;
    background: #f3f6fe;
  }
  .extra{
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 0;
    .aw-form{
      padding:0;
      margin: 0;
      .aw-form-item{
        vertical-align: bottom;
        width: auto;
        margin:0;
        .aw-form-item_content{
          padding:0;
        }
      }
      
    }
  }
}
</style>
