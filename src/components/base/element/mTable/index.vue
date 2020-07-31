<template>
  <div class="table-wrap">
     <!-- :class="{'show-custom': customColsVisible}" -->
    <div class="eleTable-wrapper">

      <!-- 自定义列设置 -->
      <!-- <CustomColumn v-show="customColsVisible"
        :columns="customColumns"
        @on-reset="customColsReset"
        @on-confirm="customColsConfirm"
        @on-close="customColsColse"
      ></CustomColumn> -->

      <!-- 数据表格 -->
       <!-- @header-contextmenu="showCustomCols" :class="{'show-custom': customColsVisible}" -->
      <el-table :ref="`eleTable_${id}`" :style="{'border-radius': showPage ? '8px' : ''}"
        v-loading="isLoading"
        :size="allConfig.size"
        :border="allConfig.border"
        :highlight-current-row="allConfig.highlightCurrentRow"
        :data="tableData"
        header-row-class-name="m-eleTable-wrapper"
        cell-class-name="cell-word-break"
        @row-click="rowClick"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <!-- 显示多选框 -->
        <el-table-column v-if="isShowCheckbox" type="selection" fixed="left"></el-table-column>
        <el-table-column v-for="(col, index) in columnData" :key="col.field" v-bind="col" :prop="col.field" :label="col.title" :width="col.width">
          <template #default="{row, column, $index}">
            <template v-if="col.cellRender">
              <cell-render :params="{...col.props,
                  data: row,
                  node: {
                    data: row
                  },
                  value: row[col.field],
                  setValue: (val) => col.props.setValue(val, row, col)
                }">
              </cell-render>
            </template>
            <template v-else>
              {{col.valueGetter ? col.valueGetter({...col.props, data: row}) : data[col.field]}}
              <!-- {{valueGetter(col, col.props, row)}} -->
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination_box" v-if="!showPage">
      <m-page
        :enable-all="true"
        :max-allowed-count="maxAllowedCount * 1"
        :paginate="page"
        :ref="id + '_page'"
        :show-total="true"
        :page-change="'pageChange_' + id"
      ></m-page>
    </div>
  </div>
</template>
<script>
import Moment from 'moment'
import store from 'assets/js/localStorage'
import Cell from './cell/cellRender'
import CustomColumn from './customColumn'

let preview_customColumns = []

export default {
  name: 'm-table',
  components: {
    'cell-render': Cell,
    CustomColumn
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        align: ''
      })
    },
    id: {
      type: String,
      default: '',
      required: true
    },
    dataUrl: String,
    tableJsData: {
      type: Object,
      default: () => ({})
    },
    paginate: {
      type: Object,
      default: () => ({})
    },

    gridTheme: String,
    subColumnDefs: {
      type: String
    },
    mainColumnDefs: {
      type: String,
      required: true
    },
    multiColGroup: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: String,
      required: true
    },
    subColumnRenderType: {
      type: String
    },
    autoSizePadding: {
      type: Boolean,
      default: true
    },
    autoStretch: {
      type: Boolean,
      default: false
    },
    fitScreenHight: {
      type: Boolean,
      default: false
    },
    enableSorting: {
      type: Boolean,
      default: true
    },
    enableColResize: {
      type: Boolean,
      default: true
    },

    tableStyle: Object,
    formColumnsSaveUrl: {
      type: String
    },
    formSaveFindUrl: {
      type: String
    },
    formLocation: {
      type: String
    },
    enableGroupBy: {
      type: Boolean,
      default: false
    },
    enablePivotMode: {
      type: Boolean,
      default: false
    },
    savedFinds: {
      type: Boolean,
      default: false
    },
    frontSavedFinds: {
      type: Boolean,
      default: false
    },
    userSaveFindList: {
      type: Array
    },
    rowStyle: Object,
    rowStyleFunc: Function,
    initQueryParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    maxAllowedCount: {
      type: [String, Number]
    },
    exportFileUrl: {
      type: String
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    frontSort: {
      type: Boolean,
      default: false
    },
    isDataTransition: {
      type: Boolean,
      default: false
    },
    isExportFileTransition: {
      type: Boolean,
      default: false
    },
    isUserConfigCol: {
      type: Boolean,
      default: false
    },
    searchForm: String,
    defaultRowSelectFunc: Function
  },
  data() {
    return {
      eleTable: null,
      isLoading: false,

      // 处理后的列信息
      headerData: [],
      // 行数据
      tableData: [], // 不在 data 中定义可提升渲染性能？？？

      // 列设置显示
      customColsVisible: false,
      // 列头自定义
      customColumns: [],

      // 当前 Row
      currentRow: [],
      // 当前 Cell
      currentCell: {},

      // 多选选中的 Row 信息
      sectionsRow: [],

      // 默认配置
      defaults: {
        align: '',
        size: '',
        autoHeight: false,
        stripe: false,
        border: true,
        fit: true,
        resizable: true,
        autoResize: true,
        highlightCell: true,
        highlightCurrentRow: true
      },

      // 分页
      page: this.paginate,

      pageParams: {},
      queryParams: {}, // 高级搜索参数 or 表头过滤参数 (由当前请求决定)

      mazySearchParams: {}, // 高级搜索参数
      colFilterParams: {}, // 表头过滤参数
      showPage: this.moqui.isEmpty(this.paginate),

      fields: [], // 高级搜索用

      childrenComponent: [],
    }
  },
  computed: {
    // 渲染的列数据
    columnData() {
      return this.headerData.filter(column => column.visible)
    },
    // 合并所有配置
    allConfig() {
      return Object.assign({},
        this.defaults,
        this.config,
      )
    },

    // 显示多选框
    isShowCheckbox() {
      return this.tableJsData.mainColumnDefs.some(v => v.showCheckbox)
    },

    // 远程排序
    isRemoteSort() {
      return !this.showPage && !this.frontSort
    }
  },

  watch: {
    isShowCheckbox: {
      immediate: true,
      handler(val) {
        this.defaults.highlightCurrentRow = !val
      }
    },
  },

  created() {
    let tableJsData = this.tableJsData

    let _headerData = tableJsData.mainColumnDefs || []

    this.headerData = _headerData.map((val, index) => this.columnHandle(val, index))
    this.customColumns = this.headerData.map(col => ({
      id: col.field,
      title: col.title,
      visible: col.hasOwnProperty('visible') ? col.visible : true
    }))
    this.tableData = tableJsData.rowData || []
  },

  mounted() {
    this.$root.setToolbar()
    //显示加载浮层

    // 监听到触发分页
    this.$root.eventBus.$on('pageChange_' + this.id, data => this.loadQueryData(this.queryParams, data))

    //监听外部的数据重载请求，例如主从模式下表单提交数据后，表格重新获取数据
    this.$root.eventBus.$on('table_reload_' + this.id, data => this.loadQueryData(this.queryParams, this.pageParams))

    //监听外部的(表单)数据，将其作为参数去过滤获取数据
    if (this.searchForm) {
      this.$root.eventBus.$on("search_form_data_" + this.searchForm, (data) => {
        let jsonData = {};
        if(typeof data.entries == "function") {
          for (let pair of data.entries()) {
            let key = pair[0]
            let value = pair[1]
            if (value == "" || key === "moquiSessionToken" || key === "moquiFormName") continue
            jsonData[key] = value
            if (value.split(",").length > 1) {
              jsonData[pair[0] + "_op"] = "in"
            } else {
              jsonData[pair[0] + "_op"] = "includes"
            }
          }
        } else {
          jsonData = data
        }
        this.formSearchParam = jsonData
        this.loadQueryData(jsonData, this.pageParams)
      })
    }

    //监听外部的multi提交请求
    this.$root.eventBus.$on(this.id + '_multi_submit', params => {
      let submitData = this.getMultiSubmitData(params.submitRows)
      //console.log('emit on===',this.id+'_multi_su
      //bmit', params,submitData)
      if (params.submitRows === 'selected' && submitData.length === 0) {
        this.handleNotice("当前表格中未选择任何记录!", 'warning')
      } else {
        this.$http.post(params.multiSubmitUrl, submitData).then(
          response => {
            if (response.data || response.status == 200) {
              let responseData = response.data
              this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
              if (responseData.screenUrl && responseData.screenUrl.length > 0) {
                if (responseData.messages) {
                  this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
                }
                this.$root.setUrl(responseData.screenUrl);
              } else if (responseData.redirectUrl && responseData.redirectUrl.length > 0) {
                window.location.href = responseData.redirectUrl;
              }
            }
          },
          response => {
            this.handleNotice("提交失败!", 'danger')
          }
        )
      }
    })
    //监听外部的请求；目前只做m-link的通知下载
    this.$root.eventBus.$on(this.id + '_data_download', linkHref => {
      let param = []
      for (let key in this.queryParams) {
        this.queryParams[key] ? null : delete this.queryParams[key]
      }
      for (let key in this.queryParams) {
        param.push(key + '=' + this.queryParams[key])
      }
      param.push('pageNoLimit = true')

      let downloadUrl = linkHref + '?' + param.join('&')

      window.open(downloadUrl, "_blank")
    })

    if (this.isDataTransition) {
      this.reLoadQueryData()
    }

    // this.eventsBind()
  },

  beforeDestroy() {
    this.eventsOff()
  },
  methods: {
    // 事件绑定
    eventsBind() {
      document.addEventListener('mousedown', this.customColsEvent)
    },
    // 自定义列设置事件
    customColsEvent(evt) {
      if (document.querySelector('.custom-columns').contains(evt.target)) return
      this.customColsVisible && this.customColsColse()
    },
    // 事件解绑
    eventsOff() {
      // document.removeEventListener('mousedown', this.customColsEvent)

      this.$root.eventBus.$off('pageChange_' + this.id)
      this.$root.eventBus.$off('table_reload_' + this.id)
      this.$root.eventBus.$off("search_form_data_" + this.searchForm)
      this.$root.eventBus.$off(this.id + '_multi_submit')
    },

    // 选择项发生变化
    selectionChange(sections) {
      this.sectionsRow = sections
      moquiVue.gridFeedbackData[this.id] = sections
    },

    // 点击行
    rowClick(row, column, event) {
      this.currentRow = row
    },

    // 点击单元格
    cellClick(row, column, cell, event) {
      this.currentRow = row
      this.currentCell = cell
    },

    // 排序方法
    sortChange({ column, prop, order }) {
      // if (column.sortable !== 'custom') return

      if (order !== null) {
        let _field = column.property
        this.colFilterParams = {
          ...this.colFilterParams,
          ...{ orderByField: (order === 'descending' ? '-' : '+') + _field }
        }
        if (this.isRemoteSort) {
          this.loadQueryData(
            this.colFilterParams,
            this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), { pageIndex: 0 })
          )
        }
      } else {
        this.isRemoteSort && this.loadQueryData({})
      }
    },
    // 显示自定义列设置
    showCustomCols(column, event) {
      event.preventDefault()
      preview_customColumns = this.customColumns.map(col => !!col.visible)
      this.customColsVisible = true
    },
    // 自定义列全选
    columnsAllChange(visible) {
      if (this.columnsChecked) {
        this.customColumns.forEach(col => {
          col.visible = visible
        })
      } else {
        this.customColumns.forEach(col => {
          col.visible = visible
        })
      }
    },
    // 关闭自定义列设置
    customColsColse() {
      this.customColsVisible = false

      this.customColumns.forEach((col, index) => {
        col.visible = preview_customColumns[index]
      })
    },
    // 重置自定义列设置
    customColsReset() {
      this.headerData.forEach((column, index) => {
        this.customColumns[index].visible = column.visible = true
      })

      this.customColsVisible = false
    },
    // 确认自定义列设置
    customColsConfirm(data) {
      this.headerData.forEach((column, index) => {
        column.visible = data[index]
      })
      //
      this.customColsVisible = false
    },
    // 获取多选框得 Row 数据
    getMultiSubmitData(type) {
      let submitData = []
      if (type === 'selected') {
        submitData = this.sectionsRow
      } else if (type === 'all') {
        submitData = this.sectionsRow[0]
      }
      moquiVue.gridFeedbackData[this.id] = submitData
      return submitData
    },

    clearFilterParams(filter) {
      for (let i = 0; i < this.childrenComponent.length; i++) {
        this.childrenComponent[i].clear()
      }
      // this.$root.eventBus.$emit(this.id + "_clearFilter")
      store.remove(this.dataUrl)
    },
    onMazySearch(mazySearchParams) {
      this.mazySearchParams = mazySearchParams
      // 先清除表头过滤条件
      this.clearFilterParams()

      let _mazySearchParams = {}
      for (let key in this.mazySearchParams) {
        _mazySearchParams[key] = JSON.stringify(this.mazySearchParams[key])
      }
      this.loadQueryData(_mazySearchParams, this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), { pageIndex: 0 }))
    },

    // 表格列数据处理
    columnHandle(columnData, index) {
      let that = this
      let common = {
        field: columnData.columnName,
        title: columnData.columnTitle,
        align: columnData.align || this.allConfig.align,
        visible: true,
        width: columnData.width || '',
        minWidth: 130,
        sortable: columnData.cellRendererComponent !== 'ag-operation-group' ? columnData.hasOwnProperty('sortable') ? columnData.sortable : true : false,
        fixed: columnData.pinned,
        cellRender: columnData.cellRendererComponent || '',
        // showOverflowTooltip: true,
        props: {
          filterComponent: columnData.filterComponent || '', // 筛选组件名称
          cellComponent: columnData.cellRendererComponent || '', // 单元格组件名称
          filterProps: columnData.filterProps, // 筛选组件参数
          props: columnData.props || {}, // 渲染参数
          context: that, // 给渲染组件传递 eleTable 实例,
          colName: columnData.columnName,
          setValue(val, row, column) {
            row[column.field] = val
          }
        },
        valueGetter: function (params) {
          if (columnData.agExpression) {
            return eval(columnData.agExpression)
          }
          if (!params.props) return params.data ? params.data[params.colName] : null

          if(params.props.format && params.props.format != "" && params.data[params.colName] && params.data[params.colName] != "") {
            //兼容safari垃圾浏览器日期格式问题，及日期毫秒问题
            let value = params.data[params.colName].replace(/-/gi,"/").split(".")[0]
            return new Date(value).Format(params.props.format)
          } else {
            let text = params.props.text
            let textMap = params.props.textMap
            if (text) {
              let keyArr = text.match(/^\$\{(.*)\}$/i)
              if (keyArr) {
                if (textMap) {
                  return params.data ? (params.data[textMap] ? params.data[textMap][keyArr[1]] : params.data[params.colName]) : null
                } else {
                  return params.data ? (params.data[keyArr[1]] || params.data[params.colName]) : null
                }
              } else {
                return text || ''
              }
            } else {
              return params.data ? (params.data[params.colName] == 0 ? params.data[params.colName] + '' : params.data[params.colName]) : null
            }
          }

        },
      }

      return common
    },
    clearMazySearchParams(filter) {
      if (this.savedFinds) this.$root.eventBus.$emit(this.id + "_clearMazySearch")
    },
    // 设置远程搜索
    setFilter(filter) {
      this.clearMazySearchParams()
      this.colFilterParams = { ...this.colFilterParams, ...filter }
      this.loadQueryData(this.colFilterParams, this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), { pageIndex: 0 }))
    },
    // 刷新表格
    reLoadQueryData() {
      this.loadQueryData(this.queryParams, this.pageParams)
    },
    // 加载数据
    loadQueryData(queryParams, { pageIndex = 0, pageSize = 20 } = {}) {
      this.queryParams = this.moqui.merge(this.moqui.clone(queryParams, true), this.initQueryParams)
      var that = this
      for (let key in this.queryParams) {
        this.queryParams[key] ? null : delete this.queryParams[key]
      }
      // 记录分页参数 size & index
      if (!this.moqui.isEmpty(this.paginate)) this.pageParams = { pageIndex, pageSize }
      //这里dataUrl由后端去拼装对应的actions请求路径以获取json格式的数据

      this.isLoading = true

      this.$http.get(this.dataUrl, { params: { ...this.queryParams, pageIndex, pageSize } }).then(
        function (res) {
          if (res.data.redirectUrl && res.data.redirectUrl.length > 0) {
            window.location.href = res.data.redirectUrl;
            return
          }

          if (pageIndex > 0 && (!res.data || res.data.length === 0))
            that.loadQueryData(queryParams, { pageIndex: pageIndex - 1, pageSize: pageSize })
          let page = {
            pageIndex: Number(res.headers['x-page-index']) || 0,
            pageSize: Number(res.headers['x-page-size']) || 0,
            pageMaxIndex: Number(res.headers['x-page-max-index']) || 0,
            pageRangeLow: Number(res.headers['x-page-range-low']) || 0,
            pageRangeHigh: Number(res.headers['x-page-range-high']) || 0,
            count: Number(res.headers['x-total-count']) || 0
          }
          // that.$refs[that.id + '_page'] && that.$refs[that.id + '_page'].$setPage(page)
          that.$refs[that.id + '_page'] ? that.page = page : null
          // that.$root.eventBus.$emit('pageChange_' + that.id, res.data || [])

          that.tableData = []

          that.$nextTick(() => {
            that.tableData = res.data || []
          })

          setTimeout(() => {
            that.isLoading = false
          }, 150)

          //如果需要前端保存条件和状态，将相关信息保存在localStorage
          if (that.frontSavedFinds) {
            let localStoreParams = JSON.parse(store.get(that.dataUrl))
            let tempQueryParams = that.queryParams
            if (localStoreParams) {
              tempQueryParams = this.moqui.merge(this.moqui.clone(that.queryParams, true), localStoreParams.queryParams)
            }
            store.set(that.dataUrl, JSON.stringify({ queryParams: that.queryParams, pageParams: that.pageParams }))
          } else {
            store.remove(that.dataUrl)
          }
        },
        err => {
          this.isLoading = false
          console.log("filter http error");
        }
      );
    },
  },
}

</script>
<style lang="less">
.eleTable-wrapper {
  position: relative;
  &.show-custom:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.06);
    z-index: 9
  }


  .el-table__body {
    // 使表格兼容safari，不错位
    width: 100%;
    table-layout: fixed !important;
  }
  .el-table-column--selection .cell {
    text-align: center !important;
  }
  th,
  .tableHeader {
    background-color: rgba(0, 0, 0, .03)
  }
  .cell-word-break .cell {
    white-space: nowrap;
    word-break: break-all;
  }

  .el-table th.gutter{
      display: table-cell!important;
  }
  .el-table colgroup.gutter{
      display: table-cell!important;
  }
}

</style>
