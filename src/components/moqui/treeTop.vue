<template>
    <ul :id="id" class="tree-list">
        <tree-item v-for="model in itemList" :key="model.id" :model="model" :top="top"/>
    </ul>
</template>
<style>
</style>
<script>
  export default{
    name: 'tree-top',
    props: {
      id: {
        type: String, required: true
      },
      items: {
        type: [String, Array], required: true
      },
      openPath: String,
      parameters: Object
    },
    data: function () {
      return {
        urlItems: null, currentPath: null, top: this
      }
    },
    computed: {
      itemList: function () {
        if (this.urlItems) {
          return this.urlItems
        }
        return moqui.isArray(this.items) ? this.items : []
      }
    },
    methods: {},
    mounted: function () {
      if (moqui.isString(this.items)) {
        this.currentPath = this.openPath
        var allParms = $.extend({
          moquiSessionToken: this.$root.moquiSessionToken,
          treeNodeId: '#',
          treeOpenPath: this.openPath
        }, this.parameters)
        var vm = this
        $.ajax({
          type: 'POST', dataType: 'json', url: this.items, headers: {Accept: 'application/json'}, data: allParms,
          error: moqui.handleAjaxError, success: function (resp) {
            vm.urlItems = resp
                /*console.info('tree-top response ' + JSON.stringify(resp))*/
          }
        })
      }
    }
  }
</script>

