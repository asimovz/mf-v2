<template>
  <div class="text-editor">
    <div class="text-item">
      <label class="editor-label">参数名称</label>
      <span style="line-height:32px;">Text{{num}}</span>
    </div>
    <!-- 目前不支持配置，暂时隐藏 -->
    <!-- <div class="text-item">
      <label class="editor-label">参数类型</label>
      <el-select v-model="textConf.type"  placeholder="请选择">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div> -->
    <!-- <div class="text-item">
      <label class="editor-label">长度限制</label>
      <el-radio-group class="length-type" v-model="textConf.lengthType">
        <el-radio label="variable">可变长度</el-radio>
        <el-radio label="static">最大长度</el-radio>
      </el-radio-group>
    </div> -->
    <!-- <div v-if="textConf.lengthType === 'variable'">
      <div class="text-item">
        <label class="editor-label">最小长度</label>
        <el-input-number v-model="textConf.minNum" controls-position="right"  :min="0" :max="100"></el-input-number>
      </div>
      <div class="text-item">
        <label class="editor-label">最大长度</label>
        <el-input-number v-model="textConf.maxNum" controls-position="right"  :min="1" :max="100"></el-input-number>
      </div>
    </div> -->
    <!-- <div v-else>
      <div class="text-item">
        <label class="editor-label">固定长度</label>
        <el-input-number v-model="textConf.staticNum" controls-position="right"  :min="1" :max="100"></el-input-number>
      </div>
    </div> -->
    <div class="text-item" style="margin-top: 28px;">
      <!-- 插入参数功能已经完成，后端暂时不支持转换，故暂时disabled禁止 -->
      <el-button size="small" type="primary" :disabled="!activeBtn"  @mousedown.native.prevent @click.native="addParam">插入参数</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Object,
  },
  computed: {
    
  },
  data() {
    return {
      num: this.options.num +1,
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
  created() {
    if(!this.options.activeBtn) {
      // this.$set(this.options, 'list', [])
      // this.$set(this.options, 'current', null)
      // this.$set(this.options, 'num', 0)
      // this.$set(this.options, 'activeBtn', (val) => {
      //   this.activeBtn = val
      // })
      this.options.list = []
      this.options.current = null
      this.options.text = ""
      this.options.num = 0
      this.options.activeBtn = (val) => {
        this.activeBtn = val
      }
      this.$emit('update:options',this.options);
      this.num = this.options.num +1
    }
    // this.options = {
    //   list: [],
    //   current: null,
    //   activeBtn: (val) => {
    //     if(val) {
    //       this.add()
    //     }
    //     this.activeBtn = val
    //   },
    // }
    // this.textConf = {
    //   name: 'Text1',
      // type: 'c',
      // lengthType: 'variable',
      // minNum: 0,
      // maxNum: 100,
      // staticNum: 1,
    // }
  },
  methods: {
    addParam(event) {
      this.options.num = this.options.num+1
      this.options.current = {
        name: 'Text' + this.options.num
      }
      this.options.list.push(this.options.current)
      this.options.addParam()
      this.$nextTick(()=>{
        this.num = this.options.num +1
      })
      
    }
  }
};
</script>

<style lang="less" scoped>
.text-editor {
  width: 100%;
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