<template>
  <drop-down 
    :options="optionsList"
    size="small"
    placeholder="请选择"
    ref="agDropFind"
    :transfer="true"
    :id="id"
    :name="id"
    v-model="selectValue"
    :allowEmpty="allowEmpty"
    :optionsUrl="optionsUrl"
    :valueField="valueField"
    :labelField="labelField"
    :dependsOptional="dependsOptional"
    :dependsOn="dependsOn"
    :optionsParameters="optionsParameters"
    :serverSearch="serverSearch"
    :serverDelay="serverDelay"
    :serverMinLength="serverMinLength"
    :optionsLoadInit="optionsLoadInit"
    @on-change="handleChange"
     />
</template>

<script>
  export default {
    name: 'ag-drop-down-find',

    data: function () {
      return {
        name: '',
        placeholder: '请选择',
        sizeType: 'small',
        selectValue: null,
        optionsList: [],
        remote: null,
        loading: false,
        id: new Date().getTime() + '',
        value: null,
        multiple: null,
        allowEmpty: null,
        optionsUrl: '',
        valueField: null,
        labelField: null,
        dependsOptional: null,
        dependsOn: null,
        optionsParameters: null,
        serverDelay: null,
        serverSearch: null,
        serverMinLength: null,
        optionsLoadInit: null,
        colName: null,
        parent: null,
        isClearFilter: false,
        condition:null
      }
    },
    
    mounted: function () {
      let root = this.params.context.$root;
      if (this.optionsUrl && this.optionsUrl.length > 0) {
        let dependsOnMap = this.dependsOn
        for (let doParm in dependsOnMap) {
          // console.log('doParm==', doParm, '===', dependsOnMap[doParm])
          root.eventBus.$on(dependsOnMap[doParm] + '_value_change', result => {
            let param = {}
            param[doParm] = result[dependsOnMap[doParm]]
            root.$http.post(this.optionsUrl, param).then(response => {
              this.disposeData(response.data)
            }, error => {
              console.log("error")
            })
          })
        }
      }
      root.eventBus.$on('grid_destroy', () =>{
        this.$destroy()
      })
    },

    created() {
      this.parent = this.params.context
      this.colName = this.params.colName
      this.name = this.params.props.name
      this.sizeType = this.params.props.size ? this.params.props.size :'small'
      this.multiple = this.params.props.multiple
      this.selectValue = this.multiple ? [] : ''
      this.allowEmpty = this.params.props.allowEmpty
      this.optionsUrl = this.params.props.optionsUrl
      this.valueField = this.params.props.valueField
      this.labelField = this.params.props.labelField
      this.dependsOptional = this.params.props.dependsOptional
      this.dependsOn = this.params.props.dependsOn
      this.optionsParameters = this.params.props.optionsParameters
      this.remote = this.params.props.serverSearch
      this.serverDelay = this.params.props.serverDelay
      this.serverMinLength = this.params.props.serverMinLength
      this.optionsLoadInit = this.params.props.optionsLoadInit
      this.optionsList = this.params.props.options
      this.condition = this.params.props.condition || null
      //refresh 组件的数据恢复
      if(this.parent.colFilterParams.hasOwnProperty(this.colName)){
        if(this.multiple)
          this.selectValue = this.parent.colFilterParams[this.colName].split(',')
        else
          this.selectValue = this.parent.colFilterParams[this.colName]
      }

      // 将子组件全部挂载在父组件上，方便统一处理
      this.parent.childrenComponent.push(this)
    },

    computed: {
      remoteFunc(){
        if(this.remote)
          return this.remoteSearch
        else 
          return null
      }
    },

    beforeDestroy: function(){
      if (this.optionsUrl && this.optionsUrl.length > 0) {
        let dependsOnMap = this.dependsOn
        for (let doParm in dependsOnMap) {
          this.parent.$root.eventBus.$off(dependsOnMap[doParm] + '_value_change')
        }
      }
      this.parent.$root.eventBus.$off("grid_destroy")

    },

    methods: {
      handleChange: function (value) {
        // if (this.isClearFilter) {
        //   this.isClearFilter = false
        //   return false
        // }
        if(this.multiple){
          this.parent.setFilter({
            [this.colName]: (value!=undefined&&value.join) ? value.join(",") : value,
            [this.colName + '_op']: this.condition || 'in'
          })
        }else{
          this.parent.setFilter({
            [this.colName]: value,
            [this.colName + '_op']: this.condition || 'equals'
          })
        }
      },

      remoteSearch: function (query) {
        let vm = this.parent.$root
        if (query !== '') {
          this.loading = true
          let param = {}
          param[this.name] = query
          Object.assign(param, this.optionsParameters)
          this.debounce(() => {
            this.getRemoteData(param)
          }, this.serverDelay)
        } else {
          this.optionsList = []
        }
      },

      getRemoteData: function (param) {
        let vm = this.parent.$root
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

      disposeData(data) {
        this.optionsList = []
        this.selectValue = ''
        if (data.length > 0) {
          data.forEach((item, index) => {
            this.optionsList.push({
              value: item[this.valueField],
              label: item[this.labelField],
            })
          })
          this.selectValue = this.optionsList[0]['value']
        }
      },

      clear() {
        this.$nextTick(
          () => {
            this.isClearFilter = true
            this.selectValue = this.multiple ? [] : ''
            //处理下拉框本身的清空操作和属性处理
            // this.$refs.agDropFind.clearSingleSelect()
            delete this.parent.colFilterParams[this.colName]
            delete this.parent.colFilterParams[this.colName + '_op']
          }
        )
      }
    }
  };
</script>
