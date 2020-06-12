<template>
  <el-dropdown :trigger="trigger" :split-button="splitButton" :size="currentSize" @click="click" @command="command">
    <slot v-if="$slots.default"></slot>
    <template v-else-if="splitButton">{{title}}</template>
    <span v-else class="el-dropdown-link">
      {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>

    <el-dropdown-menu slot="dropdown">
      <template v-if="$slots.item">
        <slot name="item"></slot>
      </template>
      <template v-else>
        <m-dropdown-item v-for="(item, index) in options" :key="item.value" :command="item.value" :disabled="item.disabled" :divided="item.divided">{{item.label}}</m-dropdown-item>
      </template>
    </el-dropdown-menu>

  </el-dropdown>
</template>

<script>

  /**
   *
   * <!-- slot 方式（可前端定制实现） -->
   * <m-dropdown>
   *   <span>title<span>
   *   <template #item>
   *     <m-drop-down-item value="1" disabled>item1</m-drop-down-item>
   *     <m-drop-down-item value="2">item2</m-drop-down-item>
   *     <m-drop-down-item value="3">item3</m-drop-down-item>
   *   </template>
   * </m-dropdown>
   *
   * <m-dropdown :options="" title="下拉菜单"></m-dropdown>
   *
   * slot: {
   *   default, // title
   *   item,    // options
   * }
   *
   */

  const EL_SIZE = {
    default: 'small',
    large: 'medium',
    small: 'mini'
  }
  export default {
    name: 'm-dropdown',
    props: {
      title: {
        type: String,
        default: '下拉菜单'
      },
      options: {
        type: Array,
        default: () => []
      },
      trigger: {
        type: String,
        default: 'hover'
      },
      type: {
        type: String,   //  same as with button, only effected when the splitButton is true
      },
      splitButton: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'default',
      },
      placement: {
        type: String,
        default: 'bottom-end'     // top/top-start/top-end/bottom/bottom-start/bottom-end
      }
    },
    computed: {
      currentSize(){
        return EL_SIZE[this.size] !== undefined ? EL_SIZE[this.size] : 'default'
      }
    },
    methods: {
      click(){
        this.$emit('on-click')
      },
      command(value){
        this.$emit('on-command', value)
      },
    }
  }
</script>

<style lang="scss">
.el-select {
  width: 100%;
  input[readonly] {
    background: #fff;
    color: unset;
  }
}
</style>