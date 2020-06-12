<template>
  <div class="m-drag-sort">
    <input type="hidden" :name="name" :value="value" />
    <div class="m-drag-sort--wrapper" ref="treeBox">
      <draggable tag="ol" class="m-drag-sort--group" :list="dataList" :options="dragOption">
        <li class="m-drag-sort--item" v-for="(item, indx) in data" :key="item.id">
          <div class="m-drag-sort--hand m-drag-sort--move-hand"></div>
          <div class="m-drag-sort--content">
            {{item.name}}
          </div>
        </li>
      </draggable>
    </div>
  </div>
</template>
<script>
import Draggable from './draggable.js'
export default {
  name: "m-drag-sort",
  props: {
    id: String,
    form: String,
    name: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  components: { Draggable },
  data() {
    return {
      dataList: this.data,
      option: {
        animation: 150,
        handle: '.m-drag-sort--hand'
      }
    };
  },
  computed: {
    value() {
      return JSON.stringify(this.dataList)
    },
    dragOption() {
      return this.option
    }
  }
};

</script>
<style lang="less" scoped>
.m-drag-sort {
  height: inherit;
  &--wrapper {
    min-height: 400px;
    height: inherit;
    max-height: 600px;
    padding: 5px 10px;
    overflow: auto;
    background: #f0f3f7;
    border: 1px solid #dcdee2;
    border-radius: 6px;
  }

  &--column {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &--move-hand {
    display: inline-flex;
    background: #94c6ff;
    cursor: move;
    padding: 0 10px;
    border-radius: 4px 0 0 4px;
    &:before {
      content: '≡';
      display: inline-block;
      color: #fff;
      font-size: 18px;
      font-weight: normal;
    }
  }
  &--group {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &--item {
    display: flex;
    line-height: 32px;
    margin: 5px 0;
    position: relative;
  }
  &--content {
    flex: 1;
    background: #fff;
    padding-left: 6px;
    border-radius: 0 4px 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
