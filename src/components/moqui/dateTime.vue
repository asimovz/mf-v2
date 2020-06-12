<template>
  <m-timePicker v-if="type=='time'"
    :id="id"
    :name="name"
    :type="type"
    :initValue="value"
    :format="format"
    :size="size"
    :tooltip="tooltip"
    :form="form"
    :maxLength="maxLength"
    :required="required"
    :autoYear="autoYear"
    :validate="validate"
    :validateMsg="validateMsg"
    :fieldTitle="fieldTitle"
    transfer
  >
  </m-timePicker>
  <m-dateTime v-else
    :id="id"
    :name="name"
    :type="type"
    :initValue="value"
    :format="format"
    :size="size"
    :tooltip="tooltip"
    :form="form"
    :maxLength="maxLength"
    :required="required"
    :autoYear="autoYear"
    :validate="validate"
    :validateMsg="validateMsg"
    :fieldTitle="fieldTitle"
    transfer
  >
  </m-dateTime>
</template>
<script>
  export default {
    name: 'date-time',
    props: { 
      id:String, 
      name:{
        type:String,
        required:true
      }, 
      value:String, 
      type:{
        type:String,
        default:'datetime'
      },
      size:{
        type:String,
        default:undefined
      }, 
      maxLength:{
        type:String
      },
      format:String, 
      tooltip:String, 
      form:String, 
      required:String, 
      autoYear:String,
      fieldTitle: {
        type: String,
        default: ""
      },
      validate:[String,Object],
      validateMsg: String 
    },

    methods: {
     
    },

    computed: {

    },

    mounted: function () {
    
    }
  }
</script>

