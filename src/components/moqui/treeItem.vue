<template>
    <li :id="model.id">
        <i v-if="isFolder" @click="toggle" class="glyphicon" :class="{'glyphicon-chevron-right':!open, 'glyphicon-chevron-down':open}"></i>
        <i v-else class="glyphicon glyphicon-unchecked"></i>
        <span @click="setSelected">
    <m-link v-if="model.a_attr" :href="model.a_attr.urlText" :load-id="model.a_attr.loadId" :class="{'text-success':selected}">{{model.text}}</m-link>
    <span v-if="!model.a_attr" :class="{'text-success':selected}">{{model.text}}</span>
    </span>
        <ul v-show="open" v-if="hasChildren">
            <tree-item v-for="model in model.children" :key="model.id" :model="model" :top="top"/>
        </ul>
    </li>
</template>
<style>
</style>
<script>
  export default{
    name: 'tree-item',
    template: '',
    props: {
      model: Object, top: Object
    },
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      isFolder: function () {
        var children = this.model.children
        if (!children) {
          return false
        }
        if (moqui.isArray(children)) {
          return children.length > 0
        }
        return true
      },
      hasChildren: function () {
        var children = this.model.children
        return moqui.isArray(children) && children.length > 0
      },
      selected: function () {
        return this.top.currentPath === this.model.id
      }
    },
    watch: {
      open: function (newVal) {
        if (newVal) {
          var children = this.model.children
          var url = this.top.items
          if (this.open && children && moqui.isBoolean(children) && moqui.isString(url)) {
            var li_attr = this.model.li_attr
            var allParms = $.extend({
              moquiSessionToken: this.$root.moquiSessionToken,
              treeNodeId: this.model.id,
              treeNodeName: (li_attr && li_attr.treeNodeName ? li_attr.treeNodeName : ''),
              treeOpenPath: this.top.currentPath
            }, this.top.parameters)
            var vm = this
            $.ajax({
              type: 'POST', dataType: 'json', url: url, headers: {Accept: 'application/json'}, data: allParms,
              error: moqui.handleAjaxError, success: function (resp) {
                vm.model.children = resp
              }
            })
          }
        }
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      setSelected: function () {
        this.top.currentPath = this.model.id
        this.open = true
      }
    },
    mounted: function () {
      if (this.model.state && this.model.state.opened) {
        this.open = true
      }
    }
  }
</script>

