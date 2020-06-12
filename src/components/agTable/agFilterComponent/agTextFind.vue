<template>
    <m-input v-model="value" autocomplete="on" @on-enter="filterChange"   :disabled="condition == 'empty'" size="small"></m-input>
</template>

<script>
export default {
  name: "ag-text-find",
  props:{
    delay: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      parent: null,
      value: null,
      condition: 'includes',
      colName: null,
      isClearFilter: false
    }
  },
  methods: {
    filterChange(event) {
      if (this.condition) {
        let value = ''
        if (this.value) {
          value = this.value
            .replace(/，/g, ",")
            .split(",")
            .map(el => {
              return el.trim()
            })
            .filter(el => {
              return el.length > 0
            })
            .join(",")
        }

        this.parent.setFilter({
          [this.colName]: value,
          [this.colName + '_op']: this.condition
        })
      }
    },

    handleChange(event) {
      if(this.delay > 0) {
          this.debounce(()=>{
              this.$emit("on-input-change", this.value)
              this.filterChange(event)
          },this.delay)
      } else {
          this.$emit("on-input-change", this.value)
          this.filterChange(event)
      }
    },

    debounce(action,time) {
        clearTimeout(this.timer)
        this.timer = setTimeout(function(){
            action()
        },time)
    },

    clear() {
      this.isClearFilter = true
      this.value = null
      delete this.parent.colFilterParams[this.colName]
      delete this.parent.colFilterParams[this.colName + '_op']
    }

  },

  created() {
    this.parent = this.params.context
    this.colName = this.params.colName
    
    //refresh 组件的数据恢复
    if(this.parent.colFilterParams.hasOwnProperty(this.colName)){
      this.value = this.parent.colFilterParams[this.colName]
    }

    // 将子组件全部挂载在父组件上，方便统一处理
    this.parent.childrenComponent.push(this)
  },
  beforeDestroy: function(){
  }
}
</script>

