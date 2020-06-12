<template>
  <div class="conditions-box">
    <Condition :conditions="thisConditions" :fields="fields"></Condition>
  </div>
</template>
<script>
  import Condition from "./condition";
  // import _ from 'lodash'

  export default {
    name: "condition-search",
    components: {Condition},
    props: {
      fields: {
        type: Array,
        required: true
      },
      conditions: {
        type: Object,
        default: function () {
          return {
            "_join": "or",
            "_list": []
          }
        }
      }
    },
    data() {
      return {
        thisConditions: {}
      };
    },
    created() {
      if (!this.conditions._list) {
        this.thisConditions = {
          "_join": "or",
          "_list": []
        }
        return
      }
      this.thisConditions = formatForVue(this.moqui.clone(this.conditions, true),this.fields)
    },
    mounted() {
      this.$on()
    },
    methods: {
      $getResult() {
        return formatForSave(this.moqui.clone(this.thisConditions, true))
      }
    },
    watch: {
      conditions(newVal) {
        if (!newVal._list) {
          this.thisConditions = {
            "_join": "or",
            "_list": []
          }
          return
        }
        this.thisConditions = formatForVue(this.moqui.clone(newVal, true),this.fields)
      }
    }
  };

  // 格式化数据，将filedName:filedValue => [filedName, filedName]
  function formatForVue(data,fields) {
    if (!data._list) return {
      "_join": "or",
      "_list": []
    }
    data._list.forEach(el => {
      if (el._list) {
        formatForVue(el,fields)
      } else {
        for (let key in el) {
          if (key != '_comp') {
            let fieldType = ''
            let fieldFormat = ''
            let fieldDate = null
            let fieldOptions = {}
            fields.forEach(field => {
              if(field.value == key) {
                fieldType = field.fieldType
                if(field.fieldType == 'date'){
                  fieldFormat = field.props.format
                  fieldDate = new Date(el[key])
                }
                if(field.fieldType == 'drop-down')
                  fieldOptions = field.props.options
              }
            });
            let filed = [key, el[key], fieldType, fieldFormat, fieldDate, fieldOptions]
            delete el[key]
            el.field = filed
          }
        }
      }
    })
    return data
  }

  function formatForSave(data) {
    data._list.forEach(el => {
      if (el._list) {
        formatForSave(el)
      } else {
        for (let key in el) {
          if (key == 'field') {
            el[el.field[0]] = el.field[1]
            delete el.field
          }
        }
      }
    })
    return data
  }
</script>
<style scoped>
  .conditions-box {
  }
</style>
