<template>
    <form v-if="!formList || (formList.paginate && formList.paginate.pageMaxIndex > 4)" @submit.prevent="goPage" class="form-inline" :id="idVal+'_GoPage'" style="display: -webkit-box;">
        <div style="display: flex;">
            <input type="text" size="5" name="pageIndex" :id="idVal+'_GoPage_pageIndex'" placeholder="页码" style="margin-right: 18px; font-size: 13px;">
        </div>
        <m-button style="border-radius: 8px;" type="info" size="small" :ghost="true" html-type="submit" round icon="el-icon-search" toggle="linkFormForm">前往</m-button>
    </form>
</template>
<style>
</style>
<script>
  export default{
    name: 'form-go-page',
    data(){
        return{ }
    },
    props: {idVal: {type: String, required: true}, maxIndex: Number, formList: Object},
    methods: {
      goPage: function () {
        var formList = this.formList
        var jqEl = $('#' + this.idVal + '_GoPage_pageIndex')
        var newIndex = jqEl.val() - 1
        if (newIndex < 0 || (formList && newIndex > formList.paginate.pageMaxIndex) || (this.maxIndex && newIndex > this.maxIndex)) {
          jqEl.parents('.form-group').addClass('has-error')
        } else {
          jqEl.parents('.form-group').removeClass('has-error')
          if (formList) {
            formList.setPageIndex(newIndex)
          } else {
            this.$root.setParameters({pageIndex: newIndex})
          }
          jqEl.val('')
        }
      }
    }
  }
</script>

