<template>
  <div class="opts-wrapper">
    <div class="extend-fields">
      <div v-for="(item, index) in options" :key="index + '-' + item.name + '_' + index" :class="['extend-val', {'text-require': item.required}]" :style="{'flex-basis': ((item.type === 'select' && item.r_type === '0') || item.type === 'textarea' || item.type === 'selectTable') ? '100%' : '50%'}">

        <template v-if="(item.type === 'select' && item.r_type === '0') || item.type === 'selectTable'">
          <m-select-table :name="item.name" :data="item.value" :keyField="keyField" :valueField="keyField" :placeholder="item.name" searchField="searchField" :fieldTitle="`选择${item.name}`" :value="currentData[item.name]" @on-change="e => onChange(e, item, index)" :column="columns" :page-size="20" :max-select="10" pagination></m-select-table>
          <m-input v-show="readonlys[`name_${index}`]" diabled style="margin-top: 10px;" readonly :value="readonlys[`name_${index}`]" placeholder="只读" />
        </template>

        <template v-else-if="item.type === 'select'">
          <m-select :name="item.name"
            v-model="currentData[item.name]"
            :filterable="false"
            :options="handler(item.value)"
            :placeholder="item.name"
          >
          </m-select>
        </template>

        <!-- 其他属性配置 -->
        <!-- <template v-else> -->
        <m-input v-else :name="item.name" v-model="currentData[item.name]" :type="item.type === 'textarea' ? 'textarea' : 'text'" :rows="6" :title="currentData[item.name]" :placeholder="item.name" />
        <!-- <m-codeEditor v-else height="300px" v-model="currentData[v.name]"></m-codeEditor> -->
        <!-- </template> -->
      </div>
    </div>
  </div>
</template>
<script>
  const COLUMNS = [
    {title:'服务标识名称', data:'indicatorName'},
    {title:'服务标识描述', data:'indicatorDesc'},
    {title:'服务名称', data:'bizServiceName'},
    {title:'资源类型', data:'serviceDataTypeEnumId'},
    {title:'服务URL', data:'bizServiceUrl'},
    {title:'服务APP包名', data:'bizServiceAppPackage'}
  ]
export default {
  name: 'extend-field',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Array,
      default: () => []
    },
  },
  inject: [ 'customParams' ],
  data(){

    let columns = COLUMNS
    let keyField = 'indicatorName'
    let readonlyField = 'bizServiceAppPackage'

    if(this.customParams && this.customParams.tableParams){
      (
        {
          columns = COLUMNS,
          keyField = 'indicatorName',
          readonlyField = 'bizServiceAppPackage'
        } = this.customParams.tableParams
      )
    }

    return {
      currentData: {},
      columns,
      keyField,
      readonlyField,
      readonlys: {},
    }
  },
  computed: {
    options(){
      let _data = JSON.parse(JSON.stringify(this.fields))
      _data.forEach(async v => {
        if(v.type === 'select'){
          if(v.r_type === '1'){
            v.value = v.value.split(',').map(v => v.trim())
          }
        }
      })
      return _data
    },
  },
  watch: {
    /** 监听 data 时改变菜单名称也会触发，这不是我们想要的,
     *  因此直接监听 itemType
     */
    'data.itemType': {
      handler(v){
        this.initData(this.data)
        this.readonlys = {}
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    handler(val){
      return val.map(v => ({
        value: v,
        label: v
      }))
    },
    initData(val){
      // let options = JSON.parse(decodeURIComponent(escape(window.atob(val.options)))) || {}

      let _options

      if(typeof val.options === 'object'){
        _options = val.options
      }
      if(typeof val.options === 'string'){
        _options = JSON.parse(
          decodeURIComponent(
            escape(
              window.atob(
                (val.options || '').replace(/-/g, "+").replace(/_/g, "/")
              )
            )
          )
        )
      }

      let options = _options || {}

      // options = options.replace('\'/g', '"')
      this.currentData = {}
      this.fields.forEach(async v => {
        if(v.name === 'extendVal' && val[v.name]){
          this.currentData[v.name] = unescape(window.atob(val[v.name]))
        }else{
          this.currentData[v.name] = options[v.name] || ''
        }
      })
    },
    onChange(data, item, index){
      let choiced = data.length ? data[0] : {}
      this.currentData[item.name] = choiced[this.keyField] || ''

      // this.$refs[`readonlyInput_${index}`][0].value = choiced.bizServiceAppPackage || ''

      // this.packageName[`_${index}`] = choiced.bizServiceAppPackage || ''

      this.$set(this.readonlys, `name_${index}`, choiced[this.readonlyField] || '')

      // this.packageName = choiced.bizServiceAppPackage || ''

      this.$forceUpdate()   // fix: mSelect 组件的无法更新
    },
    getData(){
      return this.currentData
    }
  }
}

</script>
<style scoped lang="less">
.opts-wrapper {
  width: 100%;
  margin-top: 5px;

  &.standard {
    margin: 10px -10px 5px 0px;

    &.standard .opts-wrapper {
      margin: 0;
    }
  }
}

.acts {
  margin-left: 30px;

  &-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
    padding: 3px 5px 3px 15px;
    overflow: auto;
    border-left: 2px solid #57a3f3;
    background: #fff;
    z-index: 1;
  }
}

.extend-fields {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.extend-val {
  flex: 1;
  flex-basis: 50%;
  padding: 5px 10px;
  width: 100%;
  /deep/ .el-select {width: 100%;}
}

</style>
