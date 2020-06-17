<template>
  <div style="display: inline-block;">
      <el-color-picker
        :id="id"
        :name="name"

        :predefine="defualtColor"
        :size="currentSize"
        :show-alpha="showAlpha"

        v-model="colorValue"
        @change="$emit('input', $event)"
      />
        <input v-if="form != undefined " type="hidden" :value="colorValue" :form="form" :name="name">
  </div>
</template>
<script>
//标准色
const standardColor = ['#B12318','#EB3223','#F6C143','#FFFD54','#A0CD63','#4EAC5B','#4BAFEA','#2B70BA','#05215C','#67379A']
const EL_SIZE = {
  large: 'medium',
  medium: 'small',
  small: 'mini',
}
export default {
  name: 'm-color',
  props: {
    id:String,

    name: String,
    value: String,
    recommend: Boolean,
    size: {
      type:String,
      default:'default'
    },
    showAlpha: Boolean,
    form: String
  },
  data() {
    return {
      colorValue: this.value,
      defualtColor: this.recommend ? standardColor : []
    }
  },
  computed: {
    currentSize(){
      if(Object.keys(EL_SIZE).includes(this.size)){
        return EL_SIZE[this.size]
      }else{
        return 'medium'
      }
    }
  },
  watch: {
    colorValue(value){
      if(this.defualtColor.indexOf(value)== -1 ){
        this.defualtColor.unshift(value)
      }
    }
  },
}

</script>

