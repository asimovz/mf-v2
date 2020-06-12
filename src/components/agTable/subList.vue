<template>
  <ag-grid-vue :ref="'listRefs'" v-bind:style="tableStyle" class="ag-fresh"
               :gridOptions="gridOptions"

               :enableSorting="true"
               :enableFilter="true"
               :enableColResize="true">
  </ag-grid-vue>
</template>

<script>
  import Vue from "vue";
  //import {AgGridVue} from "ag-grid-vue";

  export default Vue.extend({
    data() {
      return {
        tableStyle: {
          height: '100%',
          padding: '20px',
        },
        gridOptions: null,
        parentRecord: null
      }
    },
    components: {
      //'ag-grid-vue': AgGridVue
    },
    methods: {
      consumeMouseWheelOnDetailGrid($event) {
        $event.stopPropagation();
      },
    },
    beforeMount() {

    },
    created() {
      this.gridOptions = {};
      this.gridOptions.domLayout = 'autoHeight';
      this.parentRecord = this.params.node.parent.data;
      this.gridOptions.columnDefs = this.parentRecord.callRecords.columnDefs
    },
    mounted() {

      this.gridOptions.api.setRowData(this.parentRecord.callRecords.rowData);
      this.gridOptions.api.sizeColumnsToFit();

      // if we don't do this, then the mouse wheel will be picked up by the main
      // grid and scroll the main grid and not this component. this ensures that
      // the wheel move is only picked up by the text field
      this.$refs.listRefs.$el.addEventListener('mousewheel', this.consumeMouseWheelOnDetailGrid)
    },
    destroyed() {
      if (this.$refs.listRefs) {
        this.$refs.listRefs.$el.removeEventListener('mousewheel', this.consumeMouseWheelOnDetailGrid)
      }
    }
  })
</script>

<style scoped>

</style>
