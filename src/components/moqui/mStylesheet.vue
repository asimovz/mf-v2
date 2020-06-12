<template>
    <div :type="type" style="display:none;"></div>
</template>
<style>
</style>
<script>
  import moqui from 'assets/js/moquiLibs'
  export default{
    name: 'm-stylesheet',
    data(){
      return {}
    },
    props: {
      href: {
        type: String,
        required: true
      },
      rel: {
        type: String,
        'default': 'stylesheet'
      },
      type: {
        type: String,
        'default': 'text/css'
      }
    },
    created: function () {
      moqui.loadStylesheet(this.href, this.rel, this.type);
    }
  }
</script>

