<template>
    <CheckboxGroup v-model="selectValue" @on-change="handleChange" :name="name" :size="size">
        <input type="hidden" :name="name" :form="form" :value="selectValue">
        <Checkbox v-for="item in options" :key="item.id"  :label="item.value" :disabled="item.disabled">
          <span>{{item.label}}</span>
        </Checkbox>
    </CheckboxGroup>
</template>

<script>
export default {
  name: "m-checkbox",
  props: {
    value: {
      type: Array,
      default:null
    },
    name: {
      type: String,
      default:''
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: null
    },
    options: Array,
    form: String
  },

  data() {
    return {
      selectValue: this.value
    }
  },

  computed: {},

  mounted: function() {

  },

  watch: {

  },

  methods: {
    handleChange (value) {
      
    }
  }
};
</script>
