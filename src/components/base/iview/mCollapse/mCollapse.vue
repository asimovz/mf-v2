<template>
  <Collapse ref="collapse" :accordion="accordion" :simple="simple" v-model="openPanel" :class="classs">
    <slot></slot>
  </Collapse>
</template>
<script>
export default {
  name: "m-collapse",
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String]
    },
    type: { 
      type: String,
      default: 'default'
    },
    simple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      openPanel: this.value,
      classs: "aw-collapse aw-collapse-" + this.type
    }
  },
  provide() {
    let vm = this
    let openPanel = this.openPanel
    return {
      toggle(data) {
        let newVal = data.name
        if(vm.accordion) {
          vm.openPanel = data.name
        } else {
          if(!Array.isArray(vm.openPanel)) {
            vm.openPanel = []
          }
          let index = vm.openPanel.indexOf(newVal)
          if(index < 0 ) {
            vm.openPanel.push(newVal)
          } else {
            vm.openPanel.splice(index,1)
          }           
        }
      }
    }
  }
};
</script>
<style lang="less">

@default: #FAFAFA;
@default-border: #D9D9D9;
@primary: #e2f1f9;
@primary-border: #b8d9ec;
.aw-collapse {
  border-top: none;
  .ivu-collapse-content {
    padding: 10px 10px 0 10px
  }
}
.aw-collapse-default {
  border-color: @default-border;
  background-color: @default;
  .ivu-collapse-item {
    border-top-color: @default-border;
    .ivu-collapse-header {
      padding-left:12px;
      i {
        margin-right: 5px
      }
      .ivu-icon {
        vertical-align: unset
      }
    }
  }
  .ivu-collapse-item-active .ivu-collapse-header {
    border-bottom-color: @default-border;
  }

}

.aw-collapse-primary {
  border-color: @primary-border;
  background-color: @primary;
  .ivu-collapse-item {
    border-top-color: @primary-border;
    .ivu-collapse-header {
      transition:none;
      padding-left:12px;
      i {
        margin-right: 5px
      }
      .ivu-icon {
        vertical-align: unset
      }
    }
  }
  .ivu-collapse-item.ivu-collapse-item-active .ivu-collapse-header {
    border-bottom-color: @primary-border;
  }
}
</style>