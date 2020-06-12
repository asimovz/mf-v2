<template>
  <div class="input-tags">
    <template v-for="(val, idx) in list">
      <Tag v-bind="$props" :class="size" :name="val" :fade="false" @on-close="remove(idx)">{{val}}</Tag>
    </template>
    <Input
      v-if="closable"
      v-validate="validateInput"
      placeholder="回车确认"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      :size="size"
      :class="['tags-input', errorCls]"
      v-model="inputValue"
      @keyup.enter.native="add"
      @on-focus="focusValidate"
      @on-blur="validateModel=0"
    />

    <div
      v-if="errors.has(name)"
      class="m-form-error-tip"
    >{{ validateMsg ? validateMsg : errors.first(name) }}</div>
    <input type="hidden" :name="name" v-model="value" v-validate="validateRquired" :data-vv-as="fieldTitle" :data-vv-name="name" />
  </div>
</template>
<script>
export default {
  name: "m-tags",
  props: {
    id: String,
    form: String, // 表单 formId
    /**
     * [name 表单字段]
     * @type {String}
     * required 必填
     */
    name: {
      type: String,
      required: true
    },
    /*
      fieldTitle:   校验字段
      validate:     校验规则
      validateMsg:  错误信息
     */
    fieldTitle: String,
    validate: [String, Object],
    validateMsg: String,

    /**
     * [character 分隔符]
     * @type { String }
     * @default 默认值
     */
    character: {
      type: String,
      default: ","
    },

    /**
     * [maxLength 最大可输入长度]
     * @type { Number }
     * @default 默认值
     */
    maxLength: {
      type: Number,
      default: 30
    },

    /**
     * [data 数据源]
     * @type { String }
     */
    data: {
      type: String,
      default: ""
    },

    size: {
      type: String,
      default: "default",
      validator(size) {
        let _size = ["small", "default", "large"];
        return _size.includes(size);
      }
    },
    /**
     * [closable 是否可关闭（编辑）]
     * @type { Boolean }
     */
    closable: {
      type: Boolean,
      default: true
    },

    /**
     * [color 颜色]
     * @type { String}
     * default、primary、success、warning、error、blue、green、red、yellow、pink、magenta、volcano、orange、gold、lime、cyan、geekblue、purple
     */
    color: {
      type: String,
      default: "default"
    },
    /**
     * [checked 是否选择]
     * @type { Boolean }
     * dafault 默认值
     */
    checked: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let _data = this.data.trim().length ? this.data.split(this.character) : [];
    return {
      input: "",
      list: _data,
      inputValue:"",
      validateModel:0 //默认是验证必填模式
    };
  },

  computed: {
    value() {
      return this.list.join(this.character);
    },
    errorCls: function() {
      return this.errors.has(this.name)
        ? this.validationClasses + " ivu-form-item-error"
        : this.validationClasses;
    },
    validateInput() {
      let newVal = Object.assign({},this.validate)
        if(newVal.hasOwnProperty("required")) {
          delete newVal["required"]
        }
        return newVal
    },
    validateRquired() {
      let newVal = Object.assign({},this.validate)
      if(this.validateModel == 0) {
        if(newVal.hasOwnProperty("required")) {
          return {
            required:true
          }
        }
      }
      return null
    }
  },
  methods: {
    remove(idx) {
      this.list.splice(idx, 1);
    },
    validateAdd(val) {
      if (!val.trim().length) return false;
      if (this.list.includes(val)) {
        this.handleMessage("当前输入值已存在","warning")
        return false;
      } else if (val === this.character) {
        this.handleMessage(`输入值不能为 ${this.character}`,"warning")
        return false;
      } else if (val.length > this.maxLength) {
        this.handleMessage(`最大输入长度为 ${this.maxLength}`,"warning")
        return false;
      } else {
        return true;
      }
    },
    focusValidate(event) {
      this.validateModel = 1
    },
    async add(event) {
      await this.$validator.validate();
      if(this.errors.has(this.name)) return
      let _val = event.target.value.trim();
      let _boo = await this.validateAdd(_val);
      if (_boo) {
        this.list.push(_val);
        event.target.value = "";
      }
    }
  },
  mounted() {
    if (this.validate) {
      //监听form的验证消息
      if (this.form) {
        this.$root.eventBus.$on("form_validate" + this.form, () => {
          this.$validator.validate();
        });
      } else {
        let idInfoArray = this.id.split("_");
        let formId = null;
        if (idInfoArray.length > 2) {
          formId = idInfoArray[0] + "_" + idInfoArray[1];
        } else {
          formId = idInfoArray[0];
        }
        this.$root.eventBus.$on("form_validate" + formId, () => {
          this.$validator.validate();
        });
      }
    }
  }
};
</script>
<style scoped>
.input-tags {
  display: inline-block;
  width: 100%;
}
.tags-input {
  min-width: 50px;
  max-width: 100px;
  vertical-align: middle;
}
.ivu-tag {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
}
.ivu-tag.small {
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
}
.ivu-tag.large {
  height: 34px;
  line-height: 34px;
}
</style>
