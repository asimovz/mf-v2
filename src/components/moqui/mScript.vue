<template>
    <div :type="type" style="display:none;">
        <slot></slot>
    </div>
</template>
<style>
</style>
<script>
  import moqui from 'assets/js/moquiLibs'

  export default{
    name: 'm-script',
    data(){
      return {}
    },
    props: {
      src: String,
      type: {
        type: String,
        'default': 'text/javascript'
      }},
    created: function () {
      if (this.src && this.src.length > 0) {
        this.$root.moqui.loadScript(this.src);
      }
    },
    mounted: function () {
      var innerText = this.$el.innerText;
      if (innerText && innerText.trim().length > 0) {
        // console.info('running: ' + innerText);
        this.$root.moqui.retryInlineScript(innerText, 1);
          /* these don't work on initial load (with script elements that have @src followed by inline script)
           // eval(innerText);
           var parent = this.$el.parentElement; var s = document.createElement('script');
           s.appendChild(document.createTextNode(this.$el.innerText)); parent.appendChild(s);
           */
      }
      // maybe better not to, nice to see in dom: $(this.$el).remove();
    }
  }
</script>

