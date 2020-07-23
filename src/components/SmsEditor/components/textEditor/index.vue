<template>
  <div class="text-editor">
    <div class="text-item">
      <label class="editor-label">参数名称</label>
      <span style="line-height:32px;">{{paramName.name}}</span>
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
      <el-button size="small" type="primary" :disabled="overMaxParam || !activeBtn"  @mousedown.native.prevent @click.native="addParam">插入参数</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Object,
    paramsText: String,
    maxParamNum: {
      type: Number,
      default: 5
    }
  },
  computed: {
  },
  watch:{
    paramsText:{
      handler(){
        console.log(12121,this.paramsText)
        this.getParamsText(this.paramsText)
      },
      immediate:true
    }
  },
  data() {
    return {
      paramName: '',
      textConf: {},
      activeBtn: false,
      overMaxParam: false,
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
  mounted() {
    if(!this.$root.TEXT_PARAM) {
      let nameList = []
      for(let i=0;i<this.maxParamNum;i++) {
        nameList.push(
          'text'+(i+1)*1
        )
      }
      this.$root.TEXT_PARAM = {
        textParamlist: [],
        nameList: nameList,
        current: {
          name: 'text1'
        },
        activeBtn: (val) => {
          this.activeBtn = val
        },
        changeCurrent: (val) => {
          this.$root.TEXT_PARAM.current = val
          this.paramName = val
        },
        checkMax: this.checkMax,
        delParam: () =>{
          let inputs = []
          let inputsArr = document.getElementsByClassName("param-input")
          let list = this.$root.TEXT_PARAM.textParamlist
          for(var i in inputsArr){
            if(inputsArr[i].value) {
              inputs.push({
                name:inputsArr[i].value
              })
            }
          }
          let delItems = inputs.concat(list).filter(v => !inputs.some((e)=>{
            return e.name === v.name
          }) || !list.some((e)=>{
            return e.name === v.name
          }))
          this.$root.TEXT_PARAM.textParamlist = inputs
          delItems.map((item)=>{
            this.$root.TEXT_PARAM.nameList.push(item.name)
          })
          this.$root.TEXT_PARAM.nameList = this.$root.TEXT_PARAM.nameList.sort()
          this.$root.TEXT_PARAM.changeCurrent({
            name: this.$root.TEXT_PARAM.nameList.length>0?this.$root.TEXT_PARAM.nameList[0]:'text1'
          })
        }
      }
      this.options.text = ""
      this.paramName = {
        name: 'text1'
      }
      this.$emit('update:options',this.options);
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
    getParamsText(val) {
      var re = /{(.*?)}/g;
      var array = [];
      var temp
      while (temp = re.exec(val)) {
        array.push(temp[0].replace(/\{|\}/gi,''))
      }
      console.log(2222,array)
    },
    checkMax() {
      let num = document.getElementsByClassName("param-input").length
      if(num >= this.maxParamNum) {
        this.overMaxParam = true
        return true
      } else {
        this.overMaxParam = false
        return false
      }
    },
    addParam(event) {
      this.$root.TEXT_PARAM.changeCurrent ({
        name: this.$root.TEXT_PARAM.nameList[0]
      })
      this.$root.TEXT_PARAM.nameList.splice(0, 1)
      this.$root.TEXT_PARAM.textParamlist.push(this.$root.TEXT_PARAM.current)
      this.$root.TEXT_PARAM.addParam()
      if(this.checkMax()) {
        this.$root.TEXT_PARAM.changeCurrent ({
          name: 'text1'
        })
      } else {
        this.$root.TEXT_PARAM.changeCurrent ({
          name: this.$root.TEXT_PARAM.nameList[0]
        })
      }

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