<template>
  <div>
    <Select
      :value="selectValue"
      :name="name"
      :id="id"
      :placeholder="placeholderInfo"
      :multiple="multiple"
      :combo="combo"
      :filterable="filterable"
      :clearable="allowEmpty"
      :size="sizeType"
      :class="selectClasses"
      :transfer="transfer"
      :disabled="disabled"
      :selectAll="selectAll"
      :placement="placement"
      :remote="remote"
      :remote-method="remoteFunc"
      :loading="loading"
      :loading-text="loadingText"
      @on-change="handleChange"
      @on-query-change="queryChange"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      ref="select"
    >
      <Option v-for="item in optionsList" :value="item.value" :disabled="item.disabled" :key="item.value">{{ item.label }}<span style="float:right;color:#ccc">{{ item.text }}</span></Option>
    </Select>
    <span v-if="errors.has(name)" class="m-form-error-tip">
        {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'm-select',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    options: Array,
    id: String,
    name: String,
    size: {
      type: String,
      default: 'default'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowEmpty: {
      type: Boolean,
      default: false
    },
    combo:{
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    selectAll: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    valueField: String,
    labelField: String,
    dependsOn: Object,
    optionsParameters: Object,
    dependsOptional: {
      type: Boolean,
      default: false
    },
    serverSearch: {
      type: Boolean,
      default: false
    },
    serverDelay: {
      type: Number,
      default: 200
    },
    serverMinLength: [Number, String],
    optionsLoadInit:{
      type: Boolean,
      default: false
    },
    initUrl: String,
    depends: Object,
    optionsUrl: String,
    form: String,
    dropDownClass: {
      type: String,
      default: ""
    },
    fieldTitle: {
      type: String,
      default: ""
    },
    validate:[String,Object],
    validateMsg: String
  },

  data () {
    return {
      initValue: JSON.parse(JSON.stringify(this.value)),
      selectValue:this.value,
      optionsList: this.options,
      remote:this.serverSearch,
      placeholderInfo:this.placeholder?this.placeholder:'请选择',
      loading: false,
      loadingText: '加载中',
      tipText: this.serverMinLength>0 ? '最少输入'+this.serverMinLength+'个字符' : ''
    }
  },

  watch: {
    value(newVal){
      this.selectValue = newVal
    }
  },

  computed: {
    sizeType: function(){
      if(!isNaN(this.size) || !['large', 'small', 'default'].includes(this.size)){
        return 'default' ;
      }else{
        return this.size ;
      }
    },
    selectClasses: function(){
      return this.errors.has(this.name)?(this.dropDownClass+' ivu-form-item-error'):this.dropDownClass
    },
    remoteFunc(){
      if(this.remote)
        return this.remoteSearch
      else
        return null
    }
  },
  created() {
    if(this.form) {
      if(!this.$root.eventBus.hasOwnProperty(this.form)) {
        this.$root.eventBus[this.form] = []
      }
      this.$root.eventBus[this.form].push(this)
    }
  },
  mounted: function () {
    let root = this.$root;
    // if(this.validate){
    //   //监听form的验证消息
    //   if(this.form){
    //     root.eventBus.$on('form_validate'+this.form,()=>{
    //       this.$validator.validate()
    //     })
    //   }else{
    //     let idInfoArray = this.id.split('_')
    //     let formId = null
    //     if(idInfoArray.length>2){
    //       formId = idInfoArray[0]+'_'+idInfoArray[1]
    //     }
    //     else{
    //       formId = idInfoArray[0]
    //     }
    //     root.eventBus.$on('form_validate'+formId,()=>{
    //       this.$validator.validate()
    //     })
    //   }
    // }

    if( this.serverSearch){
      this.loadingText = "服务器检索中"
      if(this.serverMinLength >0){
        this.placeholderInfo = '最少输入'+this.serverMinLength+'个字符'
      }else if(this.serverMinLength <= 0){
        this.placeholderInfo = "模糊检索..."
        this.remoteSearch()
      }
    }

    //依赖其他字段联动检索options
    if(this.optionsUrl && this.optionsUrl.length > 0 && JSON.stringify(this.dependsOn) != "{}"){
      let dependsOnMap = this.dependsOn
      for (let doParm in dependsOnMap) {
          root.eventBus.$on(dependsOnMap[doParm]+'_value_change', result => {

            let param = {}
            if (typeof result == "string") {
              param[doParm] = result
            } else {
              param[doParm] = result[dependsOnMap[doParm]]
            }

            root.$http.post(this.optionsUrl,param).then(response => {
              setTimeout(()=>{
                this.disposeData(response.data)
              },0)
            },error => {
              console.log("error")
            })

            // if(param[doParm] != ''){
            //   root.$http.post(this.optionsUrl,param).then(response => {
            //     setTimeout(()=>{
            //       this.disposeData(response.data)
            //     },0)
            //   },error => {
            //     console.log("error")
            //   })
            // }else{
            //   this.disposeData('')
            // }

          })
      }
    }

    //依赖其他字段联动设置value
  if(this.initUrl && this.initUrl.length > 0 && JSON.stringify(this.depends) != "{}"){
      let dependsOnMap = this.depends
      for (let doParm in dependsOnMap) {
        root.eventBus.$on(dependsOnMap[doParm]+'_value_change', result => {
          let param = {}
          param[doParm] = result
          if(param[doParm] != ''){
            root.$http.post(this.initUrl,param).then(response => {
              setTimeout(()=>{
                this.selectValue = response.data[this.name]
                this.$validator.validate()
              },500)
            },error => {
              console.log("error")
            })
          }else{
            this.disposeData('')
          }
        })
      }
    }

    //绑定下拉框提交的form属性，用于表单字段提交
    if(this.form) {
      this.$el.querySelectorAll("input[type='hidden']")[0].setAttribute("form",this.form)
    }
  },

  methods: {
    resetValue() {
      this.selectValue = this.initValue
    },
    handleChange: function (value) {
      this.$emit('input', value)
      this.$emit('on-change', value)
      this.$nextTick(() => {
        this.selectValue = value
        let data = {}
        data[this.id] = value
        this.$root.eventBus.$emit(this.id+'_value_change',data)
      })
    },

    queryChange: function () {
      this.$emit('on-query-change', event);
    },
    remoteSearch: function (query) {
      let vm = this.$root
      let param = {}
      this.loading = true
      this.loadingText = this.tipText
      if(this.serverSearch){
        if(query !== ''&& query != undefined){
          if(query.indexOf("\n") < 0){
            param['term'] = query
          }else{
            param['term'] = ''
          }

        }else{
          param['term'] = ''
        }
      }else{
        param[this.name] = query
      }

      //输入查询的字符大于设定的最小输入查询字符或者默认最小查询为0时，远程查询
      if(this.serverMinLength == 0 || query.length >= this.serverMinLength){
        this.loadingText = "服务器加载中"
        Object.assign(param, this.optionsParameters)
        this.debounce(()=>{
          this.getRemoteData(param)
        },this.serverDelay)
      }
    },

    getRemoteData: function (param) {
      let vm = this.$root
      vm.$http.post(this.optionsUrl, param).then(
        response => {
          this.loading = false
          this.optionsList = response.data
        },
        response => {
          console.log("error")
        }
      )
    },
    debounce (action,time) {
      clearTimeout(this.last)
      this.last = setTimeout(function(){
        action()
      },time)
    },
    disposeData (data) {
      this.optionsList = []
      //调用iview组件自身方法
      this.$refs.select.clearSingleSelect()
      let defaultValue = null
      if(data.length>0){
        data.forEach((item, index) => {
            this.optionsList.push({
              value: item[this.valueField],
              label: item[this.labelField],
            })
            if(item['defaultItem'])
              defaultValue = item['defaultItem']
          }
        )
        if(!this.allowEmpty && !this.multiple && !this.selectAll){
          if(defaultValue){
            this.selectValue = defaultValue
          }else{
            this.selectValue = this.optionsList[0]['value']
          }
        }
        if(!this.allowEmpty && this.multiple && this.selectAll){
          this.selectValue = []
          let dataLength = this.optionsList.length
          this.optionsList.forEach((item, index) => {
            this.selectValue.push(item[this.valueField])
          })
        }
      }
    }
  },
  beforeDestroy: function(){
    this.$root.eventBus.$off(this.id+'_value_change')
    // if(this.validate){
    //   if(this.form){
    //     this.$root.eventBus.$off('form_validate'+this.form)
    //   }else{
    //     this.$root.eventBus.$off('form_validate'+this.id.split('_')[0])
    //   }
    // }
  }
}
</script>
