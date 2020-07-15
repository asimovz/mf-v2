<template>
  <m-select 
    v-model="selectVal"
    :multiple="true"
    :collapseTags="true"
    :placeholder="placeholder"
    :options="list"
    @on-change="select"
  />
</template>

<script>
export default {
  name: "m-search-filter",
  props: {
    value: Array,
    data: Array,
    placeholder:{
      type: String,
      default: '添加筛选项'
    }
  },
  data() {
    return {
      list: this.washData(this.data),
      selectVal: this.value
    }
  },
  methods: {
    washData(data) {
      return data.map(item => {
        return {
          field:item.field,
          label:item.label,
          value:item.field
        }
      })
    },
    select(data) {
      let noSlectArr = []
      this.list.map( item => {
        data.indexOf(item.field) == -1 && noSlectArr.push(item.field)
      })
      this.setElDisplay(noSlectArr,"none")
      this.setElDisplay(data,"")
    },
    setElDisplay(data,param) {
      data.map(item => {
        let fieldEl = document.querySelector(`[data-for='${item}']`)
        fieldEl.style.display = param
        let inputArr = Array.from(fieldEl.querySelectorAll(`input`))
        inputArr.map(child => {
          if(param == "none") {
            child.value = ""
          }
        })
      })
    }
  }
}
</script>