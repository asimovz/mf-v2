<template>
    <RadioGroup v-model="currentValue" @on-change="handleChange" :value="value" :type="type"  :size="size">
        <input type="hidden" :value="currentValue" :form="form" :name="name">
        <Radio v-for="item in options" :key="item.id"  :label="item.value" :disabled="item.disabled">
          <span>{{item.label}}</span>
        </Radio>
    </RadioGroup>

</template>

<script>
export default {
  name: "m-radio",
  props: {
    value: {
      type:[String,Number],
      default:''
    },
    name: {
      type: String,
      default:''
    },
    type: {
      default: null
    },
    size: {
      type: String,
      default: 'default'
    },
    options: Array,
    form: String
  },

  data() {
    return {
      currentValue: this.value
    }
  },

  computed: {},

  mounted: function() {

  },

  watch: {

  },

  methods: {
    handleChange (value) {
      this.currentValue = value
      this.$emit("on-change",value)
    }
  }
};
</script>
