<template>
	<div style="display:inline">
    <el-cascader 
      :id="id" 
      :name="name" 
      :value="selectValue" 
      :options="dataList" 
      :expandTrigger="trigger" 
      :clearable="clearable"
      :lazy="true"
      :lazyLoad="loadData" 
      :class="cascaderClasses"
      :placeholder="placeholder" 
      :filterable="filterable"
      :transfer="transfer"
      :notFound="notFound" 
      :transition="transition"
      @change="handleChange"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
    ></el-cascader>
    <input v-for="(item,index) in inputArr" :id="item.id" :name="item.name" :key="index" :value="item.value" type="hidden" :form="form"/>
    <span v-if="errors.has(name)" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
	</div>
</template>
<script>
export default {
  name: 'm-cascader',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
    },
    initValue: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    notFound: {
      type: String,
      default: '无匹配数据'
    },

    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    transfer: {
      type: Boolean,
      default: true
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    transition: {
      type: String,
      default: null
    },
    cascadeParameter: {
      type: Object,
      default: null
    },
    dependIds: String,
    dependFieldNames: String,
    valueField:String,
    parentValueField: String,
    labelField: String,
    form: String,
    fieldTitle: {
      type: String,
      default: ""
    },
    validate:[String,Object],
    validateMsg: String
  },
  data() {
    return {
      dataList: [],
      remoteData: [],
      selectValue: this.initValue,
      currentValue: this.initValue.filter((value)=>{ return value!='null' }),
      fieldID: this.dependIds.split(","),
      fieldName: this.dependFieldNames.split(",")
    }
  },
  computed: {
  	inputArr: function () {
  		return this.fieldID.map((item,index)=>{
  			return {
  				id:item,
  				name: this.fieldName[index],
  				value: this.currentValue[index]
  			}
  		})
  	},
    cascaderClasses: function(){
      return this.errors.has(this.name)?'ivu-form-item-error':''
    }
  },
  mounted: function() {
    let root = this.$root;
    this.loadData()
    if(this.validate){
      //监听form的验证消息
      if(this.form){
        root.eventBus.$on('form_validate'+this.form,()=>{
          this.$validator.validate()
        })
      }else{
        let idInfoArray = this.id.split('_')
        let formId = null
        if(idInfoArray.length>2){
          formId = idInfoArray[0]+'_'+idInfoArray[1]
        }
        else{
          formId = idInfoArray[0]
        }
        root.eventBus.$on('form_validate'+formId,()=>{
          this.$validator.validate()
        })
      }
    }
  },
  methods: {
    disposeData(param) {
      let newData = []
      this.remoteData.forEach((item, index) => {
        (typeof param == "undefined") ? param = null: param
        if (item[this.parentValueField] == param) {
          newData.push({
            value: item[this.valueField],
            label: item[this.labelField],
            children: this.disposeData(item[this.valueField])
          })
        }
      })
      return newData
    },
    loadData(node, resolve) {
      let vm = this.$root
      this.loading = true
      vm.$http.post(this.transition, this.cascadeParameter).then(response => {
        this.remoteData = response.data
        this.dataList = this.disposeData()
        this.loading = false
      }, response => {
        console.log("请求数据出错，请检查请求地址和参数")
      })
    },
    handleChange (value, selectedData) {
      this.currentValue = value
    }
  },

  beforeDestroy: function() {
    if(this.validate){
      if(this.form){
        this.$root.eventBus.$off('form_validate'+this.form)
      }else{
        this.$root.eventBus.$off('form_validate'+this.id.split('_')[0])
      }
    }
  }
}

</script>
