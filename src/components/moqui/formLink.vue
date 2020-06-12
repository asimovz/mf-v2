<template>
    <form :id="id" 
          @submit.prevent="submitForm" 
          class="aw-form form-list form-horizontal">
      <slot></slot>
    </form>
</template>
<style>
</style>
<script>
  export default {
    name: 'form-link',
    props: {
      id: String,
      action: {
        type: String, 
        required: true
      }, 
      focusField: String, 
      noValidate: Boolean,
      bodyParameterNames:Array
    },
    provide() {
      return {FormInstance:this}
    },
    data: function () {
      return {
        fields: {},
        formData: null,
      }
    },
    created() {
      if(!this.$root.eventBus.hasOwnProperty(this.id)) {
        this.$root.eventBus[this.id] = []
      }
    },
    methods: {
      async validateField() {
        let validateField = async function f(data,isValue=[]) {
          for (const field of data) {
            if(field.$children && field.$children.length > 0 && field.$el.tagName != "FORM") await f(field.$children,isValue)
            if(field.$props.hasOwnProperty("form")&&field.validate != undefined) {
              let resp = await field.$validator.validate()
              isValue.push(resp)
            }
          }
          return isValue
        }
        let formField = this.$root.eventBus[this.id] ? [...Array.from(this.$children),...this.$root.eventBus[this.id]] : [...Array.from(this.$children)]
        let resp = await validateField(formField)
        let result = resp.find(item => item == false)
        return result == undefined ? true : result
      },
      async submitForm(param) {

        //验证表单字段
        let isValidate = await this.validateField()
        if(isValidate) {
          this.formData = new FormData(this.$el)
          Object.keys(this.fields).map(index => {
            this.formData.append(index, this.fields[index]);
          })

          if(param && param.toString() != "[object SubmitEvent]") {
            Object.keys(param).map(index => {
              this.formData.append(index, param[index]);
            })
          }
          let extraList = [];
          let plainKeyList = [];
          let parmStr = "";
          let bodyParameters = null;

          for (var key of this.formData.keys()) {
            let value = this.formData.get(key)
            if(value =="" || key === "moquiSessionToken" || key === "moquiFormName") continue
            if (key.indexOf("_op") > 0 || key.indexOf("_not") > 0 || key.indexOf("_ic") > 0) {
              extraList.push({
                name:key,
                value: value
              })
            } else {
              plainKeyList.push(key)
              if (this.bodyParameterNames && this.bodyParameterNames.indexOf(key) >= 0) {
                if (!bodyParameters) bodyParameters = {};
                bodyParameters[key] = value;
              } else {
                if (parmStr.length > 0) parmStr += '&';
                parmStr += (encodeURIComponent(key) + '=' + encodeURIComponent(value));
              }
            }
          }
          for (var ei=0; ei<extraList.length; ei++) {
            var eparm = extraList[ei]; 
            var keyName = eparm.name.substring(0, eparm.name.indexOf('_'));
            if (plainKeyList.indexOf(keyName) >= 0) {
              if (parmStr.length > 0) { parmStr += '&'; }
              parmStr += (encodeURIComponent(eparm.name) + '=' + encodeURIComponent(eparm.value));
            }
          }


          let url = this.action;
          url = url.indexOf('?') > 0 ? url + '&' + parmStr : url + '?' + parmStr
          // console.log("form-link url " + url + " bodyParameters " + JSON.stringify(bodyParameters));
          this.$root.setUrl(url, bodyParameters);
        }
      }
    },
    mounted: function () {
      this.$root.eventBus.$on("m_form_submit_" + this.id, result => {
        this.submitForm()
      })
    },
    beforeDestroy() {
      this.$root.eventBus.$off("m_form_submit_" + this.id)
    }
  }
</script>

