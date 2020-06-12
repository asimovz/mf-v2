<template>
  <div style="display:flex; height:29px; justify-content: space-around; padding-top: 2px;">
    <m-input v-model="min" @on-enter="filterChange" placeholder="仅数字" :number="true" size="small" @on-blur="filterChange" />
    <span align="center" style="display: inline-block;line-height: 24px;">~</span>
    <m-input v-model="max" @on-enter="filterChange" placeholder="仅数字" :number="true" size="small" @on-blur="filterChange" />
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: "ag-range-find",
  data() {
    return {
      min: null,
      max: null,
      parent: null,
      colName: null,
      isClearFilter: false
    }
  },
  methods: {
    filterChange() {
      if (this.isClearFilter) {
        this.isClearFilter = false
        return false
      }
      this.moqui.isNumber(this.min) ? null : this.min = ''
      this.moqui.isNumber(this.max) ? null : this.max = ''
      if (this.moqui.isNumber(this.min) && this.moqui.isNumber(this.max) && this.min < this.max) {
        this.parent.setFilter({
          [this.colName + '_from']: this.min,
          [this.colName + '_thru']: this.max
        })
      } else {
        this.parent.setFilter({
          [this.colName + '_from']: null,
          [this.colName + '_thru']: null
        })
      }
    },

    clear() {
      this.isClearFilter = true
      this.min = null
      this.max = null
      delete this.parent.colFilterParams[this.colName + '_from']
      delete this.parent.colFilterParams[this.colName + '_thru']
    }
  },
  created() {
    this.parent = this.params.context
    this.colName = this.params.colName

    //refresh 组件的数据恢复
    if(this.parent.colFilterParams.hasOwnProperty(this.colName + '_from')){
      this.min = this.parent.colFilterParams[this.colName + '_from']
      this.max = this.parent.colFilterParams[this.colName + '_thru']
    }

    // 将子组件全部挂载在父组件上，方便统一处理
    this.parent.childrenComponent.push(this)
  },
  beforeDestroy: function(){
  },
}
</script>


