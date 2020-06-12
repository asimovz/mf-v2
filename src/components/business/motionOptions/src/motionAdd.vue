<template>
  <div class="opt-wrapper">
    <Button type="primary" @click="add">添加</Button>
    <input type="hidden" :name="name" :value="value" />
    <div class="opt-list">
      <div class="item" v-for="(item, index) in currentData" :key="index">
        <div class="flex">
          <!-- 参数名 -->
          <m-input class="label text-required" :id="`${id}input${index}`" :name="`un_name_input${index}`" :validate="{required:true}" validate-msg="参数名称不能为空" v-model="item.name" placeholder="参数名称" />
          <!-- 是否必填 -->
          <Checkbox style="line-height: 32px;margin-left: 20px;" v-model="item.required">是否必填</Checkbox>
          <!-- 参数类型 -->
           <!-- :class="['flex-1', {types: (item.type === 'select' || item.type === 'selectTable')}]" -->
          <div class="flex-1">
            <drop-down :filterable="false" placeholder="参数类型" :options="optTypes" v-model="item.type" @input="selectChange(item)"></drop-down>
          </div>
          <!-- <i class="remove el-icon-error" @click="remove(index)"></i> -->
          <Icon class="remove" type="ios-close-circle" size="22" @click="remove(index)" />
        </div>
        <div class="extend-opts flex" v-if="item.type === 'select' || item.type === 'selectTable'">
          <!-- 远程接口、静态数据 -->
          <m-radio v-if="item.type === 'select'" :options="[{id: 0, value: '0', label: '远程接口'}, {id: 1, value: '1', label: '静态数据'}]" v-model="item.r_type" @on-change="type => radioChange(type, item)"></m-radio>
          <div class="flex-1 text-required">
            <!-- 静态数据 -->
            <m-input v-show="item.r_type === '1'" key="inputt" :name="`un_name_inputt${index}`" v-model="item.value" :id="`${id}inputt${index}`" :validate="{required: true}" validate-msg="选项不能为空" placeholder="选项(英文逗号分隔)" />
            <!-- 原生接口 -->
            <drop-down v-show="item.r_type === '0'" :key="item.type === 'select' ? 'select' : 'selectTable'" :filterable="false" :options="urlList" :id="`${id}select${index}`" :validate="{required: true}" v-model="item.value" :name="`un_name_select${index}`" validate-msg="接口不能为空" placeholder="请选择接口">
            </drop-down>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const optTypes = ['input', 'textarea', 'select', 'selectTable']

export default {
  name: 'm-motion-options',
  props: {
    // form in
    id: {
      type: String
    },
    // form 中 input 的name 属性
    name: {
      type: String,
      default: 'formName',
    },
    /**
     * [url 获取接口列表的接口]
     * @type {Stirng}
     */
    url: {
      type: String,
      default: ''
    },
    urlList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentData: [],
      optTypes: optTypes.map(opt => ({ value: opt, label: opt })),
    }
  },
  watch: {
    data: {
      handler() {
        this.currentData = [...this.data]
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    value() {
      return this.currentData.length ? JSON.stringify(this.currentData) : ''
    },
  },
  methods: {
    selectChange(item) {
      item.value = ''
      item.r_type = (item.type === 'select' || item.type === 'selectTable') ? '0' : '1'
    },
    radioChange(type, item) {
      item.r_type = type
      item.value = ''
      // this.forceUpdate()
    },

    // m-form-error-tip
    add() {
      this.currentData.push({
        name: '',
        type: 'input',
        r_type: '1',
        required: false,
        value: ''
      })
    },

    /**
     * 删除会导致 表单 的校验出现 bug
     * (-- 已排除 类似 mInput 的销毁时注销 eventBus 的 mForm 校验事件 --)
     * (-- 暂未找到原因，先用一下代替方案 重新渲染 --)
     * ==> Vue 指令问题(态绑定与解绑)
     */
    forceUpdate() {
      let oldData = this.currentData
      this.currentData = []
      this.$nextTick(() => {
        this.currentData = oldData
      })
    },

    remove(index) {
      this.currentData.splice(index, 1)
      this.forceUpdate()
    },
  },
}

</script>
<style lang="less" scoped>
.text-required {
  position: relative;
  &:before {
    content: '*';
    position: absolute;
    top: 10px;
    left: -12px;
    color: red;
  }
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}

.opt-list {
  margin: 10px 0 -10px;
}
.item {
  margin-bottom: 10px;
  line-height: 1;
  .label {
    width: 150px;
    vertical-align: middle;
  }
  .flex{align-items: baseline;}
  .flex-1 {
    margin-left: 20px;
  }
  .remove {
    align-self: normal;
    margin: 5px 0 0 5px;
    padding: 0 5px;
    font-size: 18px;
    cursor: pointer;
  }
  /deep/ .m-form-error-tip {
    top: initial;
    padding-top: 0;
    line-height: initial;
  }
  .extend-opts {
    margin: 10px 30px 0 170px;
  }

  /deep/ .el-select{width: 100%;}
}

</style>
