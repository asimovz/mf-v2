<template>
  <ol class="nest-tree-group" v-if="data && data.length > 0">
    <li v-for="item in data" class="nest-tree-item clearfix" :key="item.id">
      <div class="nest-handle nest-tree-move-hand"></div>
      <div class="nest-tree-content" v-custom-data="item">
        <slot name="treeItem" :item="item">
          {{ item.title }}
        </slot>
      </div>
      <tree-node v-if="item.children && item.children.length" :data="item.children" :template="template">
        <template slot-scope="{item}" slot="treeItem" v-if="template">
          <slot :item="item" name="treeItem"></slot>
        </template>
      </tree-node>
    </li>
  </ol>
</template>
<script>
export default {
  name: 'treeNode',
  props: {
    data: Array,
    template: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  },
  directives: {
    //自定义属性data-
    customData: {
      bind: function(el, binding) {
        let v = binding.value
        for (let key in v) {
          if (key !== "children")
            el.setAttribute("data-" + key, v[key])
        }
      },
    }
  }
}

</script>
<style>
</style>
