<template>
  <input 
    type="hidden"
    :id="id" 
    :name="name" 
    :value="currentValue"
    :form="form"
  />
</template>

<script>

export default {
  name: "m-hidden",
  data() {
    return {
      currentValue: this.value
    };
  },
  props: {
    id: {
      type: String
    },
    value: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: String
    },
    form: {
      type: String
    }
  },

  mounted: function() {
    this.$root.eventBus.$on(this.name+'_value_change', result =>{ 
      this.currentValue = result
    });
  },

  beforeDestroy: function(){
    this.$root.eventBus.$off(this.name+'_value_change')
  }
};
</script>
