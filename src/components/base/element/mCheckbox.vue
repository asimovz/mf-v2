<template>
    <el-checkbox-group v-model="selectValue" @change="handleChange" :name="name" :size="sizeType">
        <input type="hidden" :name="name" :form="form" :value="selectValue">
        <el-checkbox v-for="item in options" :key="item.id"  :label="item.value" :disabled="item.disabled">
          <span>{{item.label}}</span>
        </el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
  name: "m-checkbox",
  props: {
    value: {
      type: [Array, Boolean],
      default:null
    },
    name: {
      type: String,
      default:''
    },
    // type: {
    //   type: String,
    //   default: ''
    // },
    // !! el组件的size仅对为button样式有效！！ 目前size设置没效果
    size: {
      type: String,
      default: 'default'
    },
    options: Array,
    form: String
  },
  model: {
    event: 'on-change'
  },
  data() {
    return {
      selectValue: this.value,
      //!! 映射element配置
      sizeConfig:{
        small: "mini",
        default: "small",
        large: "medium"
      }
    }
  },

  computed: {
    sizeType: function() {
      return this.sizeConfig[this.size];
    }
  },
  watch: {
    value(newVal){
      this.selectValue = newVal
    }
  },

  methods: {
    handleChange (value) {
      this.$emit('on-change', value)
    }
  }
};
</script>
