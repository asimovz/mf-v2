<template>
  <div class="aw-radio">
    <input type="hidden" :value="currentValue" :form="form" :name="name">
    <el-radio-group v-model="currentValue" @change="handleChange" :value="value" :size="sizeType">
      <template v-if="type==='button'">
        <el-radio-button  v-for="item in options" :key="item.id"  :label="item.value" :disabled="item.disabled">
          <span>{{item.label}}</span>
        </el-radio-button>
      </template>
      <template v-else>
        <el-radio v-for="item in options" :key="item.id"  :label="item.value" :disabled="item.disabled">
          <span>{{item.label}}</span>
        </el-radio>
      </template>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "m-radio",
  props: {
    value: {
      // !! iview不支持布尔值，el是支持的，所以这里加上Boolean
      type:[String,Number,Boolean],
      default:''
    },
    name: {
      type: String,
      default:''
    },
    type: {
      default: null
    },
    // !! el组件的size仅对type为button样式有效！！
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
      currentValue: this.value,
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

  mounted: function() {

  },

  watch: {
    value(newVal){
      this.currentValue = newVal
    }
  },

  methods: {
    handleChange (value) {
      // this.currentValue = value
      this.$emit("on-change",value)
    }
  }
};
</script>
