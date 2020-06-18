<template>
  <div style="width:100%">
    <el-input
      v-if="type != 'textarea'"
      :id="id"
      :ref="id"
      :type="type"
      :size="sizeType"
      :class="['aw-input',inputClasses]"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :readonly="readonly"
      :name="name"
      :value="currentValue"
      :number="number"
      :autofocus="autofocus"
      :suffix-icon="icon"
      :depends="depends"
      :transition="transition"
      :addParam="addParam"
      v-inputmask="mask"
      @input="handleInput"
      @change="handleEnter"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
    >
      <slot slot="prepend" name="prepend"></slot>
      <m-emoji-picker v-if="emoji" slot="append" :name="name" @select="innerEmoji"></m-emoji-picker>
      <slot v-else slot="append" name="append"></slot>
    </el-input>
    <el-input
      v-else
      :id="id"
      :ref="id"
      :type="type"
      :class="['aw-textarea',inputClasses]"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :readonly="readonly"
      :name="name"
      :value="currentValue"
      :number="number"
      :depends="depends"
      :transition="transition"
      :autofocus="autofocus"
      :rows="rows"
      @input="handleInput"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
    />
    </el-input> 
    <span v-if="errors.has(name)" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
  </div>
</template>

<script>
import Inputmask from "inputmask"
import store from 'assets/js/localStorage'
import mEmojiPicker from "./mEmojiPicker"
export default {
  name: "m-input",
  components:{
    mEmojiPicker
  },
  props: {
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    size: {
      type: String,
      default: "default"
    },
    placeholder: {
      type: String,
      default: ""
    },
    validationClasses: {
      type: String,
      default: ""
    },
    maxlength: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    // !!将用户的输入转换为 Number 类型,el暂不支持
    number: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      default: "off"
    },
    id: {
      type: String
    },
    mask: String,
    depends: String,
    transition: String,
    addParam: Object,
    form: String,
    fieldTitle: {
      type: String,
      default: ""
    },
    validate:[String,Object],
    validateMsg: String,
    delay: {
      type: Number,
      default: 0
    },
    emoji: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const sizeConfig = { small: "mini", default: "small", large: "medium" }
    return {
        currentValue: this.washValue(this.value),
        initValue: this.washValue(this.value),
        timer:null,
        sizeType: sizeConfig[this.size]
    };
  },

  computed: {
    inputClasses: function(){
      return this.errors.has(this.name)?(this.validationClasses+' is-error'):this.validationClasses
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
  mounted: function() {
    let self = this;
    let root = this.$root;
    if (typeof this.depends != "undefined") {
      let depends = this.depends.split(",");
      let url = self.transition;
      depends.forEach(function(value, key) {
        root.eventBus.$on(value+'_value_change', result => {
          self.$nextTick(function(){
            let param = self.getTransition();
            Object.assign(param, self.addParam);
            //先去localStorage中对应url作为key的缓存中检查，是否存在自己的数据；如果没有则去请求，如果有直接去取，并清除掉自己的信息
            //localStorage的value只能为字符串，这里需要注意进行转换
            if(store.get(url)){
              setTimeout(function(){self.setDataFromStore(url)},382)
            }else{
              store.set(url,{})
              self.getRemoteDataByDepandsOn(url, param)
            }
          })
        });
      });
    }


    //绑定提交的form属性，用于表单字段提交
    if(this.form) {
      if(this.type == 'text'){
        this.$el.querySelector("input").setAttribute("form",this.form)
      }else if(this.type == 'textarea'){
        this.$el.querySelector("textarea").setAttribute("form",this.form)
      }
    }
  },

  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  },

  methods: {
    washValue(val) {
      if(this.value && this.value != "" && typeof this.value == "string") {
        return this.value.replace(/&#39;/g,'\'')
      } else {
        return this.value
      }
    },
    resetValue() {
      this.currentValue = this.initValue
    },
    innerEmoji(val) {
      let elInput = this.$refs[this.id].$el.querySelector("input")
      if(elInput.value.length > this.maxlength - 2) {
        this.handleMessage('超过限制的字符长度','warning')
        return
      }
      let startPos = elInput.selectionStart
      let endPos = elInput.selectionEnd;
      if(startPos != 0 && endPos != 0) {
        var txt = elInput.value;    
        var result = txt.substring(0, startPos) + val + txt.substring(endPos)
        elInput.value = result;
        this.currentValue = result;
        elInput.focus();
        elInput.selectionStart = startPos + val.length;
        elInput.selectionEnd = startPos + val.length;
      } else {
        this.currentValue += val
      }
      this.$emit("input",this.currentValue)
    },
    getTransition(event) {
      let self = this;
      if (typeof this.depends != "undefined") {
        let depends = self.depends.split(",");
        let param = {};
        depends.forEach(function(value, key) {
          let itemName = value.split("_")[1]
          let obj = document.querySelector(`input[name='${itemName}']`)
          param[value.split("_")[1]] = obj.value;
        });
        param["moquiSessionToken"] = this.$root.moquiSessionToken;
        return param;
      }
    },

    setDataFromStore(url){
      let self = this
      let cacheData = JSON.parse(store.get(url))
      //console.log('cacheData==',cacheData)
      if(cacheData && cacheData.hasOwnProperty(self.name)){
        self.currentValue = cacheData[self.name]
        //移除自己的数据
        delete cacheData[self.name]
        //重新还回到localStorage中
        if(JSON.stringify(cacheData) === '{}') {
          store.remove(url)
        }
        else store.set(url,JSON.stringify(cacheData))
      }
    },

    getRemoteDataByDepandsOn(url, param){
      let self = this
      self.$http.post(url, param).then(
        response => {
          store.set(url,JSON.stringify(response.data))
          self.setDataFromStore(url)
        },
        response => {
          store.remove(url)
          console.log("dependsOn动态取值失败！");
        }
      );
    },

    handleChange(event) {
      //console.log(this.errors)
      if(this.delay > 0) {
          this.debounce(()=>{
              this.$emit("on-input-change", this.currentValue)
          },this.delay)
      } else {
          this.$emit("on-input-change", this.currentValue)
      }
      
      if (this.depends != "") {
        this.$root.eventBus.$emit(this.id+'_value_change', this.currentValue);
      }
    },

    handleInput(value) {
      this.setCurrentValue(value)
      this.$emit("input",value)
    },
    handleEnter() {
      this.$emit("on-enter")
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
    },
    debounce(action,time) {
        clearTimeout(this.timer)
        this.timer = setTimeout(function(){
            action()
        },time)
    },
  },

  beforeDestroy: function(){
    let that = this
    if (typeof this.depends != "undefined") {
      let depends = this.depends.split(",");
      depends.forEach(function(value, key) {
        that.$root.eventBus.$off(value+'_value_change')
      });
    }

  },

  directives: {
    inputmask: {
      bind: function(el, binding, vnode) {
        var inputEl = el.querySelector("input")
        var maskOptions = binding.value
        if (typeof maskOptions != "undefined") {
          Inputmask(maskOptions).mask(inputEl)
        }
        
      }
    }
  }
};
</script>
<style lang="less">
.aw-textarea,
.aw-input {
  // input {padding:0 8px;}
  // textarea { padding: 5px 8px}
}
.is-error {
  input,textarea {
    border-color:#f00
  }
}

</style>