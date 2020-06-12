<template>
  <component :is="cellComponent" :params="params" />
</template>

<script>


    /*params: {
      // 组件渲染的参数
      props: {

      },
      cellComponent, // 渲染组件的名称, 利用动态组件进行渲染
    }*/


  import OperationGroup from './operationGroup.vue'
  import Button from './button.vue'
  import ColorDisplay from './colorDisplay.vue'
  import Date from './date.vue'
  import Select from './select.vue'
  import Image from './image.vue'
  import Input from './input.vue'
  import Link from './link.vue'
  import Switch from './switch.vue'
  import Html from './html.vue'

  export default {
    name: "cell-render",

    components: {
      'ag-button': Button,
      'ag-link': Link,
      'ag-input': Input,
      'ag-drop-down': Select,
      'ag-date': Date,
      'ag-image': Image,
      'ag-switch': Switch,
      'ag-color-display': ColorDisplay,
      'ag-operation-group': OperationGroup,
      'ag-html': Html
    },

    props: {
      params: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
      }
    },
    computed: {
      cellComponent(){
        return this.params.cellComponent
      }
    },
    mounted(){
    }
  };
</script>
