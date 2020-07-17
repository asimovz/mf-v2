<template>
  <div class="text-editor">
    <div class="text-item">
      <label class="editor-label">参数名称</label>
      <span class="editor-label" >{{textConf.name}}</span>
    </div>
    <div class="text-item">
      <label class="editor-label">参数类型</label>
      <el-select v-model="textConf.type"  placeholder="请选择">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="text-item">
      <label class="editor-label">长度限制</label>
      <el-radio-group class="length-type" v-model="textConf.lengthType">
        <el-radio label="variable">可变长度</el-radio>
        <el-radio label="static">最大长度</el-radio>
      </el-radio-group>
    </div>
    <div v-if="textConf.lengthType === 'variable'">
      <div class="text-item">
        <label class="editor-label">最小长度</label>
        <el-input-number v-model="textConf.minNum" controls-position="right"  :min="0" :max="100"></el-input-number>
      </div>
      <div class="text-item">
        <label class="editor-label">最大长度</label>
        <el-input-number v-model="textConf.maxNum" controls-position="right"  :min="1" :max="100"></el-input-number>
      </div>
    </div>
    <div v-else>
      <div class="text-item">
        <label class="editor-label">固定长度</label>
        <el-input-number v-model="textConf.staticNum" controls-position="right"  :min="1" :max="100"></el-input-number>
      </div>
    </div>
    <div class="text-item">
      <!-- 插入参数功能已经完成，后端暂时不支持转换，故暂时disabled禁止 -->
      <el-button size="small" type="primary" :disabled="!activeBtn"  @mousedown.native.prevent @click.native="addParam">插入参数</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentData: Object,
  },
  computed: {
    
  },
  data() {
    return {
      paramIndex: 0,
      textConf: {},
      activeBtn: false,
      typeList: [{
        value: 'd',
        label: '纯数字（d）'
      }, {
        value: 'w',
        label: '字母数字（w）'
      }, {
        value: '￥',
        label: '金额（￥）'
      },{
        value: 'c',
        label: '任意字符（c）'
      },{
        value: 'YYYY-MM-DD',
        label: '日期（YYYY-MM-DD）'
      },{
        value: 'YYYY/MM/DD',
        label: '日期（YYYY/MM/DD）'
      },{
        value: 'MM-DD',
        label: '日期（MM-DD）'
      },{
        value: 'MM/DD',
        label: '日期（MM/DD）'
      },{
        value: 'YYYY-MM-DD hh:mm:ss',
        label: '日期时间（YYYY-MM-DD hh:mm:ss）'
      },{
        value: 'YYYY/MM/DD hh:mm:ss',
        label: '日期时间（YYYY/MM/DD hh:mm:ss）'
      },{
        value: 'MM-DD hh:mm:ss',
        label: '日期时间（MM-DD hh:mm:ss）'
      },{
        value: 'MM/DD hh:mm:ss',
        label: '日期时间（MM-DD hh:mm:ss）'
      },{
        value: 'hh:mm:ss',
        label: '时间（hh:mm:ss）'
      }],
    }
  },
  beforeCreate() {
    // 因为目前这个功能暂时还没实现，暂定该数据格式，为防止冲突，暂时绑定到window上
    if(!window._textParams) {
      window._textParams = {
        list: [],
        current: null,
        activeBtn: (val) => {
          if(val) {
            this.add()
          }
          this.activeBtn = val
        },
      }
    }
  },
  mounted() {
    this.textConf = {
      name: '参数',
      type: 'c',
      lengthType: 'variable',
      minNum: 0,
      maxNum: 100,
      staticNum: 1,
    }
  },
  methods: {
    add() {
      let obj = {
        name: '参数',
        type: 'c',
        lengthType: 'variable',
        minNum: 0,
        maxNum: 100,
        staticNum: 1,
      }
      window._textParams.current = obj
      this.textConf = obj
    },
    addParam(event) {
      this.paramIndex = this.paramIndex + 1
      window._textParams.list.push(window._textParams.current)
      window._textParams.addParam()
    }
  }
};
</script>

<style lang="less" scoped>
.text-editor {
  .text-item {
    display: flex;
    padding: 8px;
    .editor-label {
      width: 80px;
      line-height: 32px;
    }

    .length-type {
      width: 200px;
      padding-top: 9px;
    }
  }
}
</style>