
<script>
export default {
  name: 'mCard',
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
  .m-card__header{
    position: relative;
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
