<template>
  <m-datePeriod
    ref="date"
    v-model="value"
    :format="format"
    @on-ok="filterChange" 
    @on-clear="filterClear" 
    size="small"
  />
</template>

<script>
export default {
  name: "ag-date-find",
  data() {
    return {
      value: null,
      parent: null,
      colName: null,
      format: 'yyyy-MM-dd HH:mm',
      isClearFilter: false
    }
  },
  methods: {
    filterChange(data) {
      this.parent.setFilter({
        [this.colName + '_from']: data[0] || null,
        [this.colName + '_thru']: data[1] || null
      })
    },
    filterClear() {
      this.parent.setFilter({
        [this.colName + '_from']: null,
        [this.colName + '_thru']: null
      })
    },
    clear() {
      this.isClearFilter = true
      this.value = []
      this.$refs.date.clear()
      delete this.parent.colFilterParams[this.colName + '_from']
      delete this.parent.colFilterParams[this.colName + '_thru']
    }
  },
  created() {
    this.parent = this.params.context
    this.colName = this.params.colName
    this.format = this.params.props.format
    // this.type = this.params.props.format === 'yyyy-MM-dd HH:mm' ? 'datetimerange' : this.params.props.format === 'yyyy-MM-dd' ? 'daterange' : null
    // console.log(this.format,this.type,"-=-=-=-日期格式")
    //refresh 组件的数据恢复
    if(this.parent.colFilterParams.hasOwnProperty(this.colName + '_from')){
      this.value = []
      this.value[0] = this.parent.colFilterParams[this.colName + '_from']
      this.value[1] = this.parent.colFilterParams[this.colName + '_thru']
    }

    this.parent.$root.eventBus.$on('grid_destroy', () =>{
        this.$destroy()
    })
    // 将子组件全部挂载在父组件上，方便统一处理
    this.parent.childrenComponent.push(this)
  },
  beforeDestroy: function(){
    this.parent.$root.eventBus.$off("grid_destroy")
  }
}
</script>


