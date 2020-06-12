<template>
  <div id="screen-document-dialog" class="modal dynamic-dialog" aria-hidden="true" style="display: none;" tabindex="-1">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  <h4 class="modal-title">{{title}}</h4>
              </div>
              <div class="modal-body" id="screen-document-dialog-body">
                  <div class="spinner"><div>Loading…</div></div>
              </div>
              <div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">{{closeText}}</button></div>
          </div>
      </div>
  </div>
</template>
<style>
</style>
<script>
export default{
  name: 'screen-dialog',
  data () {
    return {
      title: 'Documentation',
      closeText: '关闭'
    }
  }
}
</script>

