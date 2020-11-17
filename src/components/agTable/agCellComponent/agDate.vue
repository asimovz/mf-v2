<template>
  <m-dateTime
    :id="id"
    :name="colName"
    :type="type"
    :initValue="value"
    :format="format"
    size="small"
    @on-change="valueChange"
    transfer
  >
  </m-dateTime>
</template>

<script>
  export default {
    name: "ag-date",
    data() {
      return {
        id: new Date().getTime() + '',
        value: null,
        parent: null,
        colName: null,
        format: 'yyyy-MM-dd HH:mm',
        type: 'date',
        momentFormat: '',
      };
    },
    beforeMount() {
      this.value = this.value ? new Date(this.params.value) : this.params.value
      this.format = this.params.props.format || 'yyyy-MM-dd HH:mm'
      this.type = this.params.props.format ? (this.params.props.format === 'HH:mm' ? null : (this.params.props.format === 'yyyy-MM-dd') ? 'date' : 'datetime') : 'datetime'
      if(this.params.props.type) this.type = this.params.props.type
      this.momentFormat = this.format.split(" ").length > 1 ? this.format.split(" ")[0].toUpperCase() + " " + this.format.split(" ")[1] : this.format.toUpperCase()
    },
    methods: {
      valueChange(data) {
        this.value = data.Format(this.format)
        this.params.setValue && this.value ? this.params.setValue(this.value) : null
      },
    }
  };
</script>
