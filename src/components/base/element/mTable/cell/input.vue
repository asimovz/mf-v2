<template>
  <m-input
    @input="valueChange"
    :ref="id"
    :id="id"
    :name="id"
    :type="text"
    :placeholder="placeholder"
    v-model="value"
    v-if="isShow"
    size="small"/>
</template>

<script>
  export default {
    name: "ag-input",
    props: {
      params: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        id: new Date().getTime() + '',
        text: 'text',
        value: '',
        isShow: true,
        placeholder:""
      };
    },
    beforeMount() {
      if(this.params.hasOwnProperty("data")){
        this.value = this.params.value
        this.placeholder = this.params.placeholder
        this.params.setValue(this.value) //防止表达式字段为空
      }else{
			  this.isShow = false
		  }
    },
    methods: {
      valueChange() {
        this.params.setValue ? this.params.setValue(this.value) : null
      },
      getValue() {
        return this.value
      },
      isPopup() {
      },
      isCancelBeforeStart() {
      },
      isCancelAfterEnd() {
      },
      refresh(params) {
        if(this.value !== params.value){
          this.value = params.value
          this.valueChange()
        }
        return true
      }
    }
  };
</script>
