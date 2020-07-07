<template>
    <editor-draggable
      :options="dragOptions"
      :data="data"
      :select-widget-id="selectWidgetId"
      :class="[{'widget-group':!selected}]"
      :isGroup="true"
      :group="group"
    >
    </editor-draggable>
</template>

<script>

export default {
  name:"widget-group",
  props: {
    data: {
      type: Object
    },
    selectWidgetId: [String,Number],
    selected: {
      type: Boolean,
      default: false
    },
    group: {
      type: Number
    }
  },
  data() {
    return {
      dragOptions: {
        group: {
          name:"dragBox",
          put: (to, from, target) => {
            let type = target.dataset['type']
            return type != "group"

          }
        },        
      },
    };
  },
  mounted() {

  },
};
</script>
<style lang="less">
.widget-group {
  // padding:10px;
  border:2px dashed #2e95ff;
}
</style>