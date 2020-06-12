<template>
  <ul v-if="paginate" class="ivu-page">
    <template v-if="paginate.pageIndex > 0">
      <a href="#" @click.prevent="setIndex(0)">
        <li class="ivu-page-item">
          <i class="ivu-icon ivu-icon-ios-skipbackward"></i>
        </li>
      </a>
      <a href="#" @click.prevent="setIndex(paginate.pageIndex-1)">
        <li class="ivu-page-item">
        <i class="ivu-icon ivu-icon-arrow-left-b"></i>
        </li>
      </a>
    </template>
    <template v-else>
      <li class="ivu-page-item">
        <span><i class="ivu-icon ivu-icon-ios-skipbackward"></i></span>
      </li>
      <li class="ivu-page-item">
        <span><i class="ivu-icon ivu-icon-arrow-left-b"></i></span>
      </li>
    </template>

    <span v-for="prevIndex in prevArray">
      <a href="#" @click.prevent="setIndex(prevIndex)">
        <li  class="ivu-page-item">{{prevIndex+1}}</li>
      </a>
    </span>
    <li style="display: inline-block;vertical-align: middle;">
      <span>Page {{paginate.pageIndex+1}} of {{paginate.pageMaxIndex+1}} ({{paginate.pageRangeLow}} - {{paginate.pageRangeHigh}} of {{paginate.count}})</span>
    </li>
    <span v-for="nextIndex in nextArray">
      <a href="#" @click.prevent="setIndex(nextIndex)">
        <li  class="ivu-page-item">{{nextIndex+1}}</li>
      </a>
    </span>

    <template v-if="paginate.pageIndex < paginate.pageMaxIndex">
      <a href="#" @click.prevent="setIndex(paginate.pageIndex+1)">
        <li class="ivu-page-item"><i class="ivu-icon ivu-icon-arrow-right-b"></i></li>
      </a>
      <a href="#" @click.prevent="setIndex(paginate.pageMaxIndex)">
        <li class="ivu-page-item"><i class="ivu-icon ivu-icon-ios-skipforward"></i></li>
      </a>
    </template>
    <template v-else>
      <li class="ivu-page-item">
        <span><i class="ivu-icon ivu-icon-arrow-right-b"></i></span>
      </li>
      <li class="ivu-page-item">
        <span><i class="ivu-icon ivu-icon-ios-skipforward"></i></span>
      </li>
    </template>
  </ul>
</template>

<style>
  .ivu-page-item {
    min-width: 24px;
    height: 24px;
    line-height: 20px;
  }
  .ivu-page-item .ivu-icon {
    font-size: 14px;
  }
</style>

<script>
  export default{
    name: 'form-paginate',
    data(){
        return{ }
    },
    props: {paginate: Object, formList: Object},
    computed: {
      prevArray: function () {
        var pag = this.paginate
        var arr = []
        if (!pag || pag.pageIndex < 1) return arr
        var pageIndex = pag.pageIndex
        var indexMin = pageIndex - 3
        if (indexMin < 0) {
          indexMin = 0
        }
        var indexMax = pageIndex - 1
        while (indexMin <= indexMax) {
          arr.push(indexMin++)
        }
        return arr
      },
      nextArray: function () {
        var pag = this.paginate
        var arr = []
        if (!pag || pag.pageIndex >= pag.pageMaxIndex) return arr
        var pageIndex = pag.pageIndex
        var pageMaxIndex = pag.pageMaxIndex
        var indexMin = pageIndex + 1
        var indexMax = pageIndex + 3
        if (indexMax > pageMaxIndex) {
          indexMax = pageMaxIndex
        }
        while (indexMin <= indexMax) {
          arr.push(indexMin++)
        }
        return arr
      }
    },
    methods: {
      setIndex: function (newIndex) {
        if (this.formList) {
          this.formList.setPageIndex(newIndex)
        } else {
          this.$root.setParameters({pageIndex: newIndex})
        }
      }
    }
  }
</script>

