<template>
   <div class="custom-columns">
    <div class="cols-header">
      <el-checkbox @change="allChange" :indeterminate="indeterminate" :value="checked">全选</el-checkbox>
      <i class="close-close el-icon-close" @click="close"></i>
    </div>
    <div class="cols-body">
      <el-checkbox class="cols-item" v-for="(col, index) in columnList" :key="col.id" v-model="col.visible">{{col.title}}</el-checkbox>
    </div>
    <div class="cols-footer">
      <el-button size="mini" @click="reset">还原</el-button>
      <el-button size="mini" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'custom-column',
    props: {
      columns: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        columnList: this.columns
      }
    },
    computed: {
      colVis(){
        return this.columnList.map(col => col.visible)
      },
      // 半选
      indeterminate() {
        return this.colVis.some(col => col) && !this.colVis.every(col => col)
      },

      // 全选
      checked() {
        return this.colVis.every(col => col)
      },
    },
    methods: {
      reset(){
        this.$emit('on-reset')
      },
      confirm(){
        this.$emit('on-confirm', this.colVis)
      },
      close(){
        this.$emit('on-close')
      },
      // 自定义列全选
      allChange(visible) {
        if (this.columnsChecked) {
          this.columnList.forEach(col => {
            col.visible = visible
          })
        } else {
          this.columnList.forEach(col => {
            col.visible = visible
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
.custom-columns {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  z-index: 9;
  display: flex;
  flex-direction: column;
  width: 140px;
  border: 1px solid #efefef;
  border-radius: 3px;
  z-index: 99;
  .cols-body {
    flex: 1;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .cols-header,
  .cols-footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 36px;
  }
  .close-close {
    padding: 0 5px;
    margin: 0 -5px 0 20px;
    color: #2d8cf0;
    font-weight: bold;
    cursor: pointer;
  }
  .cols-item {
    display: block;
    margin: 5px 15px;
  }
}
</style>