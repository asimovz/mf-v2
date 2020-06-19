<template>
  <div style="width:100%">
    <el-select
      :value="selectValue"
      :id="id"
      :placeholder="placeholderInfo"
      :multiple="multiple"
      :collapse-tags="collapseTags"
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
      @change="handleChange"
      @input.native="queryChange"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      ref="select"
    >
      <el-option v-for="item in optionsList" :label="item.label" :value="item.value" :disabled="item.disabled" :key="item.value">
        {{ item.label }}
        <span style="float:right;color:#ccc">{{ item.text }}</span>
      </el-option>
    </el-select>
    <input type="hidden" :name="name" :form="form" v-model="selectValue"/>
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
    collapseTags: {
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
    //  !!transfer目前el不支持该属性配置
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
    //  !! placement目前el不支持该属性配置
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
  model: {
    event: 'on-change'
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
      tipText: this.serverMinLength>0 ? '最少输入'+this.serverMinLength+'个字符' : '',
      //!! 映射element配置
      sizeConfig:{
        small: "mini",
        default: "small",
        large: "medium"
      }
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
        return this.sizeConfig.default;
      }else{
        return this.sizeConfig[this.size];
      }
    },
    selectClasses: function(){
      return this.errors.has(this.name)?(this.dropDownClass+' is-error'):this.dropDownClass
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
            this.$nextTick(function(){
              let respParam = this.getDependParam()
              root.$http.post(this.optionsUrl,respParam).then(response => {
                setTimeout(()=>{
                  this.disposeData(response.data)
                },0)
              },error => {
                console.log("error")
              })
            })
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
      // this.$el.querySelectorAll("input[type='hidden']")[0].setAttribute("form",this.form)
    }
  },

  methods: {
    getDependParam() {
        let param = {};
        for (const key in this.dependsOn) {
          let value = this.dependsOn[key]
          let itemName = value.split("_")[1]
          let obj = document.querySelector(`input[name='${itemName}']`)
          param[value.split("_")[1]] = obj.value;

        }
        param["moquiSessionToken"] = this.$root.moquiSessionToken;
        return param;
    },
    resetValue() {
      this.selectValue = this.initValue
    },
    handleChange: function (value) {
      this.$emit('on-change', value)
        this.selectValue = value
        let data = {}
        data[this.id] = value
        this.$root.eventBus.$emit(this.id+'_value_change',data)
    },

    queryChange: function () {
      // !! 因为el不支持 搜索词改变时触发事件，因此只能通过@input.native实现
      if(this.filterable) this.$emit('on-query-change', event);
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
      // !! el暂时没有下面这种内部方法,但实际上就是将值设为undefined
      // this.$refs.select.clearSingleSelect()
      this.selectValue = undefined
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