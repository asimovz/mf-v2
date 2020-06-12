<template>
  <m-datePeriod
    ref="date"
    :startDateName="startDateName"
    :endDateName="endDateName"
    :startDate="startDate"
    :endDate="endDate"
    :format="format"
    :placeholder="placeholder"
    separator="至"
  />
</template>
<script>

export default {
  name: 'date-period',
  props: {
    startDateName: String,
    endDateName: String,
    startDate: String,
    endDate: String,
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },  
    placeholder: {
      type: String,
      default: '请选择'
    },  
  },
  data() {
    return {

    }
  },
  methods: {
  }
}

</script>
