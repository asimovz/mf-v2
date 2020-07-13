<template>
  <draggable :list="data.list" v-bind="dragOptions" @end="end">
    <render-comp v-for="(item, index) in data.list" :data="item" :key="item.id" :list-index="index" :isGroup="isGroup" :select-widget-id="selectWidgetId"  @del="handleDel(index)">
    </render-comp>
  </draggable>
</template>
<script>
import Draggable from './draggableJs'
import renderComp from '../render/render'
export default {
  name: "editor-draggable",
  props: {
    id: String,
    data: {
      type: Object,
      default: () => {}
    },
    options:Object,
    selectWidgetId:[String,Number],
    isGroup: {
      type: Boolean,
      default: false
    },
    group: {
      type: Number
    }
  },
  components: { Draggable,renderComp },
  inject:['delGroup','delWidget'],
  data() {
    return {
      dataList: this.data,
      dragOptions: Object.assign({
        group: {
          name:"dragBox",
          pull: true,
        },
        animation: 200,
        handle: '.drag-widget'
      },this.options)
    };
  },
  methods: {
    end() {
      if(this.data.type == "group" && this.data.list.length == 0) {
        this.delGroup(this.group)
      }
    },
    handleDel(index) {
      this.data.list.splice(index, 1)
      this.delWidget()
      if(this.data.type == "group" && this.data.list.length == 0) {
        this.delGroup(this.group)
      }
    }
  }
};

</script>
