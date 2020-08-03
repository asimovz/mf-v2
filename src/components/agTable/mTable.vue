<template>
  <div :id="id" :class="userConfigClass">
    <m-mazy-search v-if="savedFinds" :fields="fields" :search-list="userSaveFindList" :formSaveFindUrl="formSaveFindUrl"
                   :formLocation="formLocation" @on-mazy-search="onMazySearch"></m-mazy-search>

    <ag-grid-vue  :ref="id"
                  :style="setTableStyle" 
                  :class="['aw-ag-table',gridTheme]"
                  :gridOptions="gridOptions"
                  :modules="modules"
                 :fullWidthCellRendererFramework="getFullWidthCellRenderer()">
    </ag-grid-vue>

    <!--:isFullWidthCell="isFullWidthCell"-->
    <!--:getRowHeight="getRowHeight"-->
    <!--:getNodeChildDetails="getNodeChildDetails"-->

    <div :id="'backup_node' + id" class="backup_node"></div>
    <div :id="id + 'panel_btns'" class="tool_panel_btns_outer" v-show="showSaveColsPanel">
      <div v-show="isPanelColSave" class="tool_panel_sort_tip">排序请直接拖动左侧列表列头</div>
      <div class="tool_panel_btns">
        <m-button size="small" type="default" @click.native="foldToolPanel">收起</m-button>
        <m-tooltip v-show="isPanelColSave" content="保存列的显示、隐藏、宽度、顺序" placement="top">
          <m-button size="small" type="primary" @click.native="saveColumnSet">保存</m-button>
        </m-tooltip>
        <m-tooltip v-show="isPanelColSave" content="重置列的显示、隐藏、宽度、顺序" placement="left">
          <m-button size="small" type="success" @click.native="resetColumnSet">重置</m-button>
        </m-tooltip>
      </div>
    </div>
    <div class="pagination_box" v-if="!showPage">
      <m-page :enable-all="true"
              :max-allowed-count="maxAllowedCount * 1"
              :paginate="page"
              :ref="id + '_page'"
              :show-total="true"
              :page-change="'pageChange_' + id"></m-page>
    </div>
  </div>
</template>
<script>
  // import _ from 'lodash'
  import Moment from 'moment'
  import store from 'assets/js/localStorage'
  import {AgGridVue} from '@ag-grid-community/vue'
  import {AllModules} from "@ag-grid-enterprise/all-modules"
  
  import SubList from './subList'
  import AgDropDown from './agCellComponent/agDropDown'
  import AgInput from './agCellComponent/agInput'
  import AgButton from './agCellComponent/agButton'
  import AgLink from './agCellComponent/agLink'
  import AgDate from './agCellComponent/agDate'
  import AgImage from './agCellComponent/agImage'
  import AgSwitch from './agCellComponent/agSwitch'
  import AgHtml from './agCellComponent/agHtml'
  import AgColorDisplay from './agCellComponent/agColorDisplay'
  import AgTextFind from './agFilterComponent/agTextFind'
  import AgDateFind from './agFilterComponent/agDateFind'
  import AgRangeFind from './agFilterComponent/agRangeFind'
  import AgDropDownFind from './agFilterComponent/agDropDownFind'
  import AgFilterReset from './agFilterComponent/agFilterReset'
  import AgOperationGroup from './agCellComponent/agOperationGroup'

  let subColumnDefs = []
  export default {
    name: 'm-table',
    components: {
      'ag-grid-vue': AgGridVue,
      'sub-list': SubList,
      'ag-drop-down': AgDropDown,
      'ag-input': AgInput,
      'ag-button': AgButton,
      'ag-link': AgLink,
      'ag-date': AgDate,
      'ag-image': AgImage,
      'ag-switch': AgSwitch,
      'ag-html': AgHtml,
      'ag-color-display':AgColorDisplay,
      'ag-text-find': AgTextFind,
      'ag-date-find': AgDateFind,
      'ag-range-find': AgRangeFind,
      'ag-drop-down-find': AgDropDownFind,
      'ag-filter-reset': AgFilterReset,
      'ag-operation-group': AgOperationGroup
      
    },
    props: {
      id: {
        type: String,
        default: '',
        required: true
      },
      paginate: {
        type: Object,
        default: function () {
          return {}
        }
      },
      gridTheme: String,
      dataUrl: {
        type: String,
      },
      subColumnDefs: {
        type: String
      },
      mainColumnDefs: {
        type: String,
        required: true
      },
      multiColGroup:{
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
      tableJsData: {
        type: Object
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
      frontSavedFinds:{
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
        modules: AllModules,
        page: this.paginate,
        pageParams: {},
        queryParams: {}, // 高级搜索参数 or 表头过滤参数 (由当前请求决定)
        mazySearchParams: {}, // 高级搜索参数
        colFilterParams: {}, // 表头过滤参数
        showPage: this.moqui.isEmpty(this.paginate),
        gridOptions: null,
        fields: [],// 高级搜索用
        isPanelColSave: false,
        showSaveColsPanel: false,
        userColConfiged: false,
        childrenComponent: [],
        formSearchParam: undefined //表单搜索数据
        
      }
    },
    computed: {
      setTableStyle() {
        if(this.tableStyle) {
          return this.tableStyle
        } else if(this.fitScreenHight){
          this.$nextTick(() => {
            if(document.querySelectorAll("."+this.gridTheme).length == 1){
              let bodyHeight = document.body.getBoundingClientRect().height
              let table = document.querySelector("."+this.gridTheme)
              let tableHeight = bodyHeight - table.getBoundingClientRect().top - 80
              let tableContentHeight = document.querySelector(".ag-center-cols-container").getBoundingClientRect().height
              let tableHeaderHeight = document.querySelector(".ag-header").getBoundingClientRect().height
              if(tableContentHeight > 100) {
                let  returnHeight= (tableContentHeight < tableHeight && tableContentHeight+tableHeaderHeight+3 < tableHeight) ? tableContentHeight+tableHeaderHeight+3 : tableHeight
                returnHeight = returnHeight > 150 ? returnHeight : (returnHeight > tableHeaderHeight+4 ? 150 : tableHeaderHeight+3)
                table.style.height = returnHeight + 'px'
              } else {
                if(this.isDataTransition) {
                  table.style.height = tableHeight + 'px'
                } else {
                  table.style.height = tableContentHeight+tableHeaderHeight+'px'
                }
              }
            }
          })
        }
      },
      userConfigClass() {
        if(this.userColConfiged)
          return 'user-configed'
        else
          return 'user-no-config'
      }
    },
    mounted() {
      this.$root.setToolbar()
      //显示加载浮层
      this.gridOptions.api.showLoadingOverlay();

      // 监听到触发分页
      this.$root.eventBus.$on('pageChange_' + this.id, data => this.loadQueryData(this.queryParams, data))

      //监听外部的数据重载请求，例如主从模式下表单提交数据后，表格重新获取数据
      this.$root.eventBus.$on('table_reload_' + this.id, data => this.loadQueryData(this.queryParams, this.pageParams))

      //监听外部的(表单)数据，将其作为参数去过滤获取数据
      if(this.searchForm){
        this.$root.eventBus.$on("search_form_data_"+this.searchForm, (data) => {
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
          this.queryParams = jsonData
          this.loadQueryData(jsonData,this.pageParams)
        })
      }

      //监听外部的multi提交请求
      this.$root.eventBus.$on(this.id+'_multi_submit', params => {
        let submitData = this.getMultiSubmitData(params.submitRows)
        //console.log('emit on===',this.id+'_multi_submit', params,submitData)
        if(params.submitRows === 'selected' && submitData.length === 0){
           this.handleNotice("当前表格中未选择任何记录!", 'warning')
        }else{
          this.$http.post(params.multiSubmitUrl, submitData).then(
            response => {  
              if(response.data || response.status == 200){
                let responseData = response.data
                this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
                if (responseData.screenUrl && responseData.screenUrl.length > 0) {
                  if(responseData.messages){
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
      this.$root.eventBus.$on(this.id+'_data_download',linkHref =>{
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

      // 高级搜索
      if (this.savedFinds) {
        this.fields = getMazySearchFields(this.gridOptions.columnDefs)
      }

      //默认工具面板为自定义显示列面板
      this.toshowToolPanel(this, true)
      this.gridOptions.api.setSideBarVisible(false)

      if(this.autoStretch){
        //默认按照列头需要的宽度进行自适应扩展
        this.autoSizeAll() 
      }else{
        //默认自适应grid自身宽度
        this.sizeToFit();
      }
      
      //第一页不需要异步加载数据的话隐藏加载浮层
      if(!this.isDataTransition) {
        this.gridOptions.api.hideOverlay()
      }

      //默认选中的数据
      if(this.defaultRowSelectFunc){
        this.gridOptions.api.forEachNode(this.defaultRowSelectFunc)
      }
    },

    beforeMount() {
      let tableJsData = this.tableJsData
      let rowDataKey = this.rowData
      let columnDefsKey = this.mainColumnDefs
      let subColumnDefsKey = this.subColumnDefs
    
      this.gridOptions = {}
      let defaultRowHeight = 30
      this.userColConfiged = this.isUserConfigCol

      // subColumnDefs
      if (tableJsData[subColumnDefsKey]) {
        for (let i = 0, l = tableJsData[subColumnDefsKey].length; i < l; i++) {
          subColumnDefs.push({
            headerName: tableJsData[subColumnDefsKey][i].columnTitle,
            field: tableJsData[subColumnDefsKey][i].columnName
          })
        }
      }

      // columnDefs
      let multiColGroup = this.multiColGroup
      let columnDefs = []
      let colGroups = new Map()
      let enableFloatingFilter = false

      if(multiColGroup){
        //多列头需特殊处理,将列头的关系放到一个Map对象中
        for (let i = 0, l = tableJsData[columnDefsKey].length; i < l; i++) {
          let parent = tableJsData[columnDefsKey][i].colGroup
          let child = tableJsData[columnDefsKey][i].columnName
          if(parent){
            if(colGroups.get(parent)){
              colGroups.set(parent,colGroups.get(parent)+','+child)
            }else{
              colGroups.set(parent,child)
            }
          }else{
            colGroups.set(child,child)
          }
        }
        //多列头模式下，默认按照遍历后的Map进行列头组合处理
        colGroups.forEach((value,key)=>{
          if(value == key){
            for (let i = 0, l = tableJsData[columnDefsKey].length; i < l; i++) {
              if(key == tableJsData[columnDefsKey][i].columnName){
                !enableFloatingFilter && tableJsData[columnDefsKey][i].filterComponent ? enableFloatingFilter = true : null
                //这里对于可能的单元格高度有指定要求的进行扩展支持
                if(tableJsData[columnDefsKey][i].props && tableJsData[columnDefsKey][i].props.height > defaultRowHeight){
                  defaultRowHeight = tableJsData[columnDefsKey][i].props.height
                }
                let columnDefInfo = tableJsData[columnDefsKey][i]
                let that = this
                columnDefs.push(getColumnDef(columnDefInfo,that))
              }
            }
          }else{
            let colChildren = value.split(',')
            let children = []
            colChildren.forEach(child => {
              for (let i = 0, l = tableJsData[columnDefsKey].length; i < l; i++) {
                if(child == tableJsData[columnDefsKey][i].columnName){
                  !enableFloatingFilter && tableJsData[columnDefsKey][i].filterComponent ? enableFloatingFilter = true : null
                  //这里对于可能的单元格高度有指定要求的进行扩展支持
                  if(tableJsData[columnDefsKey][i].props && tableJsData[columnDefsKey][i].props.height > defaultRowHeight){
                    defaultRowHeight = tableJsData[columnDefsKey][i].props.height
                  }
                  let columnDefInfo = tableJsData[columnDefsKey][i]
                  let that = this
                  children.push(getColumnDef(columnDefInfo,that))
                }
              }
            });
            columnDefs.push({
              headerName: key,
              headerClass:"colGroupCenter",
              children: children
            })
          }
        })
      }
      //非多列头，直接添加到columnDefs中
      else{
        for (let i = 0, l = tableJsData[columnDefsKey].length; i < l; i++) {
          !enableFloatingFilter && tableJsData[columnDefsKey][i].filterComponent ? enableFloatingFilter = true : null
          //这里对于可能的单元格高度有指定要求的进行扩展支持
          if(tableJsData[columnDefsKey][i].props && tableJsData[columnDefsKey][i].props.height > defaultRowHeight){
            defaultRowHeight = tableJsData[columnDefsKey][i].props.height
          }
          let columnDefInfo = tableJsData[columnDefsKey][i]
          let that = this
          columnDefs.push(getColumnDef(columnDefInfo,that))
        }
      }
      // console.log('columnDefs are====',columnDefs)

      if (subColumnDefs.length > 0) {
        columnDefs[0].cellRenderer = 'group'
        columnDefs[0].cellRendererParams = {suppressCount: true}
      }
      this.gridOptions.columnDefs = columnDefs
      // rowData + callRecords
      if(tableJsData[rowDataKey]){
        for (let i = 0, l = tableJsData[rowDataKey].length; i < l; i++) {
          tableJsData[rowDataKey][i].callRecords = {
            rowData: tableJsData[rowDataKey][i].aggregateSubList || [],
            columnDefs: subColumnDefs || []
          }
          tableJsData[rowDataKey][i].aggregateSubList ? delete tableJsData[rowDataKey][i].aggregateSubList : null
        }
      }else{
        tableJsData.rowData = []
        tableJsData.callRecords = {
          rowData: [],
          columnDefs: subColumnDefs || []
        }
      }
      
      //处理表格的行样式
      if(this.rowStyle){
        this.gridOptions.rowStyle =  this.rowStyle
      }
      if(this.rowStyleFunc){
        this.gridOptions.getRowStyle =  this.rowStyleFunc
      }

      this.gridOptions.context = {}
      this.gridOptions.context.componentParent = this

      this.gridOptions.rowData = tableJsData[rowDataKey]
      
      //suport for version 18+
      //表格高度优先级为：tableStyle > fitScreenHight > autoHeight
      if(!this.tableStyle && !this.fitScreenHight){
        this.gridOptions.domLayout = 'autoHeight'
      }
      
      this.gridOptions.rowHeight = defaultRowHeight
      //禁用gridOptions的属性检查，优化性能和warning去除
      this.gridOptions.suppressPropertyNamesCheck = true
      //此处因为启用了rowSelected，不能复制单元格，所以这里需要处理优先级
      this.gridOptions.suppressCopyRowsToClipboard = true

      this.enableGroupBy ? this.gridOptions.rowGroupPanelShow = 'always' : null

      this.gridOptions.floatingFiltersHeight = 30
      this.gridOptions.floatingFilter = enableFloatingFilter
      this.gridOptions.getContextMenuItems = this.getContextMenuItems
      this.gridOptions.getMainMenuItems = this.getMainMenuItems
      this.gridOptions.pivotMode = this.enablePivotMode

      //表格行选择处理
      if(this.isMulti){
        this.gridOptions.rowSelection = 'multiple'
        this.gridOptions.rowMultiSelectWithClick = true
      }else
        this.gridOptions.rowSelection = 'single'


      // 默认隐藏右侧工具栏面板
      this.gridOptions.sideBar = {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
          },
          // {
          //   id: 'filters',
          //   labelDefault: 'Filters',
          //   labelKey: 'filters',
          //   iconKey: 'filter',
          //   toolPanel: 'agFiltersToolPanel',
          // },
        ],
        defaultToolPanel: 'columns',
        hiddenByDefault: true
      }
      
      //面板国际化
      this.gridOptions.localeText = {
        // for filter panel
        // page: 'daPage',
        // more: 'daMore',
        // to: 'daTo',
        // of: 'daOf',
        // next: 'daNexten',
        // last: 'daLasten',
        // first: 'daFirsten',
        // previous: 'daPreviousen',
        loadingOoo: '数据加载中...',

        // for set filter
        // selectAll: 'daSelect Allen',
        // searchOoo: 'daSearch...',
        // blanks: 'daBlanc',

        // for number filter and text filter
        filterOoo: '字段过滤...',
        // applyFilter: 'daApplyFilter...',

        // for number filter
        // equals: 'daEquals',
        // lessThan: 'daLessThan',
        // greaterThan: 'daGreaterThan',

        // for text filter
        // contains: 'daContains',
        // startsWith: 'daStarts dawith',
        // endsWith: 'daEnds dawith',

        // the header of the default group column
        group: '数据分组',

        // tool panel
        columns: '自定义设置',
        // rowGroupColumns: 'laPivot Cols',
        // valueColumns: 'laValue Cols',
        pivotMode: '透视模式',
        groups: '行分组',
        values: '数值计算',
        pivots: '列展开',
        valueColumnsEmptyMessage: '将字段拖拽此处进行数值汇总',
        rowGroupColumnsEmptyMessage: '将字段拖拽此处进行数据行分组',
        pivotColumnsEmptyMessage: '将字段拖拽此处进行数据列展开',

        // other
        noRowsToShow: '当前无记录',

        // enterprise menu
        pinColumn: '列锁定',
        valueAggregation: '数值汇总',
        // autosizeThiscolumn: '此列自适应',
        // autosizeAllColumns: '数据自适应',
        // groupBy: 'laGroup by',
        // ungroupBy: 'laUnGroup by',
        // resetColumns: 'laReset Those Cols',
        // expandAll: 'laOpen-em-up',
        // collapseAll: 'laClose-em-up',
        // toolPanel: 'laTool Panelo',
        // export: 'laExporto',
        // csvExport: 'la CSV Exportp',
        // excelExport: 'la Excel Exporto',

        // enterprise menu pinning
        pinLeft: '左边锁定',
        pinRight: '右边锁定',
        noPin: '不锁定',

        // enterprise menu aggregation and status panel
        sum: '合计',
        min: '最小值',
        max: '最大值',
        first: '第一条',
        last: '第末条',
        count: '总数',
        avg: '平均值',
        // average: '平均值',

        // standard menu
        // copy: 'laCopy',
        // copyWithHeaders: 'laCopy Wit hHeaders',
        // ctrlC: 'ctrl n C',
        // paste: 'laPaste',
        // ctrlV: 'ctrl n C'
      }

      // 新版本 21.0.0 的事件绑定方式调整
      this.gridOptions.onRowSelected = this.rowSelected;
      this.gridOptions.onSortChanged = this.sortChanged;

      if(this.isDataTransition){
        this.reLoadQueryData()
      }
      //如果存在前端条件存储，则从前端localStorage中获取相关条件信息进行数据加载
      if(this.frontSavedFinds && store.get(this.dataUrl)){
        let localStoreParams = JSON.parse(store.get(this.dataUrl))
        this.loadQueryData(localStoreParams.queryParams, localStoreParams.pageParams)
        //表格的简单搜索数据状态恢复
        this.colFilterParams = localStoreParams.queryParams
      }
    },
    methods: {
      getMultiSubmitData(type){
        let submitData = []
        if(type === 'selected'){
          if(this.gridOptions.api.getSelectedNodes().length > 0) {
            this.gridOptions.api.getSelectedNodes().forEach((node)=>{
              submitData.push(node.data)
            })
         }
        }else if(type === 'all'){
          submitData = this.gridOptions.rowData
        }
        return submitData
      },

      //列选择操作
      rowSelected(event){
        //console.log("selected rows data====", event.node.data, " selected = ", event.node.selected)
        let submitData = []
        this.gridOptions.api.getSelectedNodes().forEach((node)=>{
          submitData.push(node.data)
        })
        moquiVue.gridFeedbackData[this.id] = submitData
      },

      sortChanged(e) {
        this.clearMazySearchParams()
        // {colId: "orderName", sort: "desc"}
        let sort = this.gridOptions.api.getSortModel()[0]
        if (!sort) return false
        this.colFilterParams = {...this.colFilterParams, ...{orderByField: (sort.sort === 'desc' ? '-' : '+') + sort.colId}}
        if(!this.showPage && !this.frontSort)
          this.loadQueryData(this.colFilterParams, this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), {pageIndex: 0}))
      },

      setFilter(filter) {
        this.clearMazySearchParams()
        this.colFilterParams = {...this.colFilterParams, ...filter}
        this.loadQueryData(this.colFilterParams, this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), {pageIndex: 0}))
      },

      clearFilterParams(filter) {
        for (let i = 0; i < this.childrenComponent.length; i++) {
           this.childrenComponent[i].clear()
        }
        // this.$root.eventBus.$emit(this.id + "_clearFilter")
        store.remove(this.dataUrl)
      },

      clearMazySearchParams(filter) {
        if (this.savedFinds) this.$root.eventBus.$emit(this.id + "_clearMazySearch")

      },

      isFullWidthCell(rowNode) {
        return rowNode.level === 1
      },

      getRowHeight(params) {
        let rowIsDetailRow = params.node.level === 1
        let lines = params.data.rowData ? params.data.rowData.length : params.node.data.callRecords.rowData.length
        return rowIsDetailRow ? ((lines > 15 ? lines : lines) + 1) * 25 + 60 : 26
      },

      getNodeChildDetails(record) {
        if (record.callRecords && record.callRecords.columnDefs.length > 0) {
          return {
            group: true,
            // the key is used by the default group cellRenderer
            key: record.exampleType,
            // provide ag-Grid with the children of this group
            children: [record.callRecords],
            // for demo, expand the third row by default
            expanded: false

          };
        }
      },

      // 表格整行单元格渲染 
      getFullWidthCellRenderer() {
        let subColumnRenderType = this.subColumnRenderType
        let fullWidthCellRenderer = SubList
        switch (subColumnRenderType) {
          case 'list':
            fullWidthCellRenderer = SubList
            break
          default :
            fullWidthCellRenderer = SubList
        }
        return fullWidthCellRenderer
      },
      
      getMainMenuItems(params) {
        let that = this
        // 数值汇总列菜单在开启分组和透视模式下才展现
        if(this.enablePivotMode || this.enableGroupBy)
          return [
            'pinSubMenu',
            'valueAggSubMenu'
          ]
        else
          return [
            'pinSubMenu'
          ]
      },

      getContextMenuItems(params) {
        let that = this
        let contextMenus = [
            {
              name: '表格自适应',
              action: () => {
                that.sizeToFit()
              }
            },
            {
              name: '数据自适应',
              action: () => {
                that.autoSizeAll()
              }
            },
            'separator',
            {
              name: '导出Excel',
              subMenu: [
                {
                  name: '导出当前页',
                  action() {
                    // 前端的导出
                    that.gridOptions.api.exportDataAsExcel()
                  }
                },
                {
                  name:'导出数据',
                  action:() =>{
                    that.fetchExport()
                  }
                }
              ]
            },
            'separator',
            {
              name: '自定义显示列',
              action() {
                that.toshowToolPanel(that, true)
              }
            }
          ]
        if(this.enablePivotMode)
          contextMenus.push({
            'name':'数据统计',
            action() {
                that.toshowToolPanel(that, false)
              }
            })
        return contextMenus
      },

      /**************************
       * 显示自定义面板
       ***************************/
      toshowToolPanel(that, isPanelColSave) {
        this.isPanelColSave = isPanelColSave
        // 显示工具边栏
        this.gridOptions.api.setSideBarVisible(true)
        // 展开面板
        this.gridOptions.api.openToolPanel('columns')
        document.querySelector("#backup_node" + this.id).appendChild(document.querySelector("#" + this.id + "panel_btns"))
        document.querySelector("#" + this.id + " .ag-column-panel").appendChild(document.querySelector("#" + this.id + "panel_btns"))
        this.changeToolPanelView(isPanelColSave)
        this.showSaveColsPanel = true
      },

      /**************************
       * 切换原有toolPanel的界面展现
       ***************************/
      changeToolPanelView(isPanelColSave) {
        /************************************************************** 
         *  tooPanel columns Suppress Sections 右侧列配置面板默认选项
         *  suppressRowGroups: to suppress Row Groups section.
         *  suppressValues: to suppress Values section.
         *  suppressPivots: to suppress Column Labels (Pivot) section.
         *  suppressPivotMode: to suppress Pivot Mode section.
         *  suppressColumnFilter: To suppress Column Filter section.
         *  suppressColumnSelectAll: To suppress Select / Un-select all widget.
         *  suppressColumnExpandAll: To suppress Expand / Collapse all widget.
         ****************************************************************/
        this.gridOptions.columnApi.setPivotMode(!isPanelColSave)
        if(isPanelColSave){
          document.querySelector(".ag-pivot-mode-panel").classList.add('ag-hidden')
          document.querySelector(".ag-column-drop-values").classList.add('ag-hidden')
        }else{
          document.querySelector(".ag-pivot-mode-panel").classList.remove('ag-hidden')
          document.querySelector(".ag-column-drop-values").classList.remove('ag-hidden')
        }
        if(this.enableGroupBy){
          if(document.querySelectorAll(".ag-column-drop-row-group").length > 1)
            document.querySelectorAll(".ag-column-drop-row-group")[1].classList.remove('ag-hidden')
          else
            document.querySelector(".ag-column-drop-row-group").classList.remove('ag-hidden')
        }else{
          if(document.querySelectorAll(".ag-column-drop-row-group").length > 1)
            document.querySelectorAll(".ag-column-drop-row-group")[1].classList.add('ag-hidden')
          else
            document.querySelector(".ag-column-drop-row-group").classList.add('ag-hidden')
        }
      },

      /**
       * column setting cancle
       */
      foldToolPanel() {
        this.gridOptions.api.setSideBarVisible(false)
        this.showSaveColsPanel = false
      },

      /**
       * save column changed
       */
      saveColumnSet() {
        if (!this.formColumnsSaveUrl || !this.formLocation) {
          return false
        }
        let showCol = this.gridOptions.api.columnController.allDisplayedColumns
        let showColMap = {} // 数据格式：{ columnName: order }
        for (let i = 0; i < showCol.length; i++) {
          showColMap[showCol[i].colId] = i + 1
        }
        let hidden = {
          id: 'hidden',
          order: 0,
          children: []
        }
        let show = []
        this.$options.propsData.tableJsData.mainColumnDefs.forEach(el => {
          showColMap[el.columnName]
            ? show.push({
              id: 'column_' + show.length,
              order: showColMap[el.columnName],
              width: showCol[show.length].actualWidth,
              children: [{
                id: el.columnName,
                order: 0,
                children: []
              }]
            })
            : hidden.children.push({
              id: el.columnName,
              order: hidden.children.length,
              children: []
            })
        })
        let that = this
        let result = [hidden, ...show]
        let postData = {
          // formConfigId: this.id,
          formLocation: this.formLocation,
          columnsTree: JSON.stringify(result),
          SaveColumns: "保存"
        }
        this.$http.post(this.formColumnsSaveUrl, postData)
          .then(res => {
            this.handleNotice("列配置保存成功!",'success')
            that.userColConfiged = true
          }).catch(err => {
            this.handleNotice("列配置保存失败!",'danger')
        })

      },

      /**
       * reset column changed
       */
      resetColumnSet() {
        let postData = {
          formLocation: this.formLocation,
          ResetColumns: "重置"
        }
        this.$http.post(this.formColumnsSaveUrl, postData)
          .then(res => {
            this.handleNotice("列配置重置成功!",'success')
            this.$root.setUrl(window.location.pathname + window.location.search)
          }).catch(err => {
            this.handleNotice("列配置重置失败!",'danger')
        })
      },

      fetchExport() {
        let param = []
        for (let key in this.queryParams) {
          this.queryParams[key] ? null : delete this.queryParams[key]
        }
        for (let key in this.queryParams) {
          param.push(key + '=' + this.queryParams[key])
        }
        let fileUrl = ""
        if(this.isExportFileTransition){
          param.push('pageNoLimit = true')
          //自定义的transition处理下载
          fileUrl = this.exportFileUrl + '?' + param.join('&')
        }else {
          //后端框架自动的csv渲染下载
          fileUrl = param.length > 0 ? this.exportFileUrl + '&' + param.join('&') : this.exportFileUrl
        }
        window.open(fileUrl, "_blank")
      },

      /**************
       * 表格自适应
       *************/
      sizeToFit() {
        this.gridOptions.api.sizeColumnsToFit();
      },
      
      /**************
       * 数据自适应
       *************/
      autoSizeAll() {
        let noWidthColumnIds = [];
        this.gridOptions.columnApi.getAllColumns().forEach((column) => {
          if(column.colDef.width){
            //如果列有宽度(代码设置或者自定义的宽度)，则按照设置的宽度进行渲染
            this.gridOptions.columnApi.setColumnWidth(column, column.colDef.width, true)
          }else{
            noWidthColumnIds.push(column.colId);
          }
        });
        this.gridOptions.columnApi.autoSizeColumns(noWidthColumnIds);
      },

      onMazySearch(mazySearchParams) {
        this.mazySearchParams = mazySearchParams
        // 先清除表头过滤条件
        this.clearFilterParams()

        let _mazySearchParams = {}
        for (let key in this.mazySearchParams) {
          _mazySearchParams[key] = JSON.stringify(this.mazySearchParams[key])
        }
        this.loadQueryData(_mazySearchParams, this.moqui.merge(this.$refs[this.id + '_page'].$getPage(), {pageIndex: 0}))
      },
      resetLoadData() {
        this.colFilterParams = {}
        this.queryParams = {}
        this.formSearchParam = {}
        this.loadQueryData(this.queryParams, this.pageParams)
      },
      reLoadQueryData() {
        this.loadQueryData(this.queryParams, this.pageParams)
      },
      loadQueryData(queryParams, {pageIndex = 0, pageSize = 20} = {}) {
        Object.assign(this.queryParams,this.initQueryParams,this.moqui.clone(queryParams, true));
        // this.queryParams = {...this.colFilterParams, ...this.queryParams, ...this.formSearchParam}
        var that = this
        for (let key in this.queryParams) {
          this.queryParams[key] ? null : delete this.queryParams[key]
        }
        // 记录分页参数 size & index
        if (!this.moqui.isEmpty(this.paginate)) this.pageParams = {pageIndex, pageSize}
        //这里dataUrl由后端去拼装对应的actions请求路径以获取json格式的数据
        that.$http.get(this.dataUrl, {params: {...this.queryParams, pageIndex, pageSize}}).then(
          function (res) {
            if(res.data.redirectUrl && res.data.redirectUrl.length > 0) {
              window.location.href = res.data.redirectUrl;
              return
            }

            if(pageIndex > 0 && (!res.data || res.data.length === 0))
              that.loadQueryData(queryParams, {pageIndex: pageIndex - 1, pageSize: pageSize})
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
            that.gridOptions.api.setRowData(res.data)
            //如果需要前端保存条件和状态，将相关信息保存在localStorage
            if(that.frontSavedFinds){
              let localStoreParams = JSON.parse(store.get(that.dataUrl))
              let tempQueryParams = that.queryParams
              if(localStoreParams){
                tempQueryParams = this.moqui.merge(this.moqui.clone(that.queryParams, true), localStoreParams.queryParams)
              }
              store.set(that.dataUrl, JSON.stringify({queryParams: that.queryParams, pageParams: that.pageParams}) )
            }else{
              store.remove(that.dataUrl)
            }
          },
          err => {
            console.log("filter http error");
          }
        );
      }
    },
    watch: {},
    beforeDestroy() {
      this.childrenComponent = []
      this.$root.eventBus.$emit('grid_destroy')
      this.$root.eventBus.$off('pageChange_' + this.id)
      this.$root.eventBus.$off(this.id + "_clearMazySearch")
      this.$root.eventBus.$off('table_reload_' + this.id)
      this.$root.eventBus.$off(this.id+'_multi_submit')
      this.$root.eventBus.$off(this.id+'_data_download')
      if(this.searchForm){
        this.$root.eventBus.$off("search_form_data_" + this.searchForm)
      }
    },
    destroyed () {
      this.$root.eventBus.$off('grid_destroy')
    }
  }

  //列定义的数据组织
  function getColumnDef(columnDefInfo,that){
    return {
      width: columnDefInfo.width ? columnDefInfo.width * 1 : null,
      headerName: columnDefInfo.columnTitle,
      field: columnDefInfo.columnName,
      sortable: that.enableSorting,
      resizable: that.enableColResize,
      autoHeight: columnDefInfo.autoHeight,
      headerCheckboxSelection: that.isMulti && columnDefInfo.showCheckbox,
      checkboxSelection: columnDefInfo.showCheckbox,
      cellStyle: columnDefInfo.cellStyle ? columnDefInfo.cellStyle : null,
      pinned: columnDefInfo.pinned ? columnDefInfo.pinned : null,
      filter: columnDefInfo.filterComponent ? true : false,
      floatingFilterComponentFramework: columnDefInfo.filterComponent,
      floatingFilterComponentParams: {
        context: that,
        enableFilter: columnDefInfo.filterComponent ? true : false,
        suppressFilterButton: true,
        colName: columnDefInfo.columnName,
        props: columnDefInfo.filterProps || null,
        cellFormatterParams: {
          props: columnDefInfo.props || {}
        }
      },
      rowGroup: columnDefInfo.rowGroup || false,
      enableRowGroup: columnDefInfo.enableRowGroup || false,
      pivot: columnDefInfo.pivot || false,
      enablePivot: columnDefInfo.enablePivot || false,
      enableValue: columnDefInfo.enableAggregate || false,
      aggFunc: columnDefInfo.aggFunc || false,
      valueFormatter: function (params) {
        let props = params.colDef.floatingFilterComponentParams.cellFormatterParams.props
        if(params.value){
          let value = props.currencyUnit
          ? '￥' + Math.floor(params.value * 1).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : (props.format && props.format.length > 0
            ? Moment(params.value).format(props.format.split(" ").length > 1 ? props.format.split(" ")[0].toUpperCase() + " " + props.format.split(" ")[1] : props.format.toUpperCase())
            : params.value)
          return value
        }else{
          return ''
        }
      },
      valueGetter: function (params) {
        if(columnDefInfo.agExpression){
          return eval(columnDefInfo.agExpression)
        }
        if (!params.colDef.floatingFilterComponentParams.cellFormatterParams.props) return params.data ? params.data[params.column.colId] : null
        let text = params.colDef.floatingFilterComponentParams.cellFormatterParams.props.text
        let textMap = params.colDef.floatingFilterComponentParams.cellFormatterParams.props.textMap
        if (text) {
          let keyArr = text.match(/^\$\{(.*)\}$/i)
          if (keyArr) {
            if (textMap) {
              return params.data ? (params.data[textMap] ? params.data[textMap][keyArr[1]] : '') : null
            } else {
              return params.data ? (params.data[keyArr[1]] || '') : null
            }
          } else {
            return text || ''
          }
        } else {
          return params.data ? (params.data[params.column.colId] == 0 ?params.data[params.column.colId]+'':params.data[params.column.colId]) : null        
        }
      },
      menuTabs: ['generalMenuTab'],
      cellRendererFramework: columnDefInfo.cellRendererComponent || null,
      cellRendererParams: {
        props: columnDefInfo.props || {}
      },
      cellEditorFramework: columnDefInfo.cellEditorComponent || null,
      editable: columnDefInfo.cellEditorComponent ? true : false,
      cellEditorParams: {
        props: columnDefInfo.props || {}
      }
    }
  }

  function getMazySearchFields(columnDefs) {
    // 获取fields（enableFilter）
    let fields = []
    columnDefs.forEach(el => {
      //在多列头的情况下，需要先判断el.floatingFilterComponentParams
      if (el.floatingFilterComponentParams && el.floatingFilterComponentParams.enableFilter && el.floatingFilterComponentFramework.match(/ag-(\S*)-find/)) {
        fields.push({
          value: el.field,
          label: el.headerName,
          fieldType: el.floatingFilterComponentFramework.match(/ag-(\S*)-find/)[1],
          props: el.floatingFilterComponentParams.props
        })
      }
    })
    return fields
  }

  function fetchExport(url) {
    if (!url) return false
    fetch(url).then(res => res.blob().then(blob => {
      let url = window.URL.createObjectURL(blob);
      let filename = res.headers.get('filename');
      let a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }));
  }

</script>
<style lang="less">
.aw-ag-table {
  .ag-button-primary {
    color: #409eff;
    font-weight:400
  }
  .ag-button-info {
    color: #2db7f5;
    font-weight:400
  }
  .ag-button-danger {
    color: #f56c6c;
    font-weight:400
  }
  .el-input--mini .el-input__inner {
    height: 24px;
    line-height: 24px;
    padding:0 6px
  }
}

  // .user-configed {
  //   border-top: 4px solid;
  //   border-image: -webkit-linear-gradient(90deg, rgb(136, 252, 198), rgb(215, 248, 250)) 40 80;
  //   border-image: -moz-linear-gradient(90deg, rgb(136, 252, 198), rgb(215, 248, 250)) 40 80;
  //   border-image: linear-gradient(90deg, rgb(136, 252, 198), rgb(215, 248, 250)) 40 80; 
  // }
  .user-no-config {
    border: 0px;
  }
  .tool_panel_btns_outer {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px 0px;
  }

  .tool_panel_sort_tip {
    padding-bottom: 10px;
    text-align: center;
    color: #a9a9a9;
    font-size: 12px;
  }

  .tool_panel_btns {
    width: 100%;
    justify-content: space-around;
    display: flex;
  }

  .backup_node {
    display: none;
  }

  /*优化aggrid样式*/
  /* ===ag-theme-fresh=== */
  .ag-theme-fresh .ag-cell-focus {
    border: 1px solid transparent !important;
    background-color: #e3e3e3 !important;
  }

  .ag-theme-fresh .ag-cell-inline-editing {
    padding: 0 12px !important;
  }

  /* ===ag-theme-balham=== */
  .ag-theme-balham .ag-cell-focus {
    border: 1px solid transparent !important;
    background-color: #e3e3e3 !important;
  }

  .ag-theme-balham .ag-cell-inline-editing {
    padding: 0 12px !important;
  }

   /* ToolPanel 默认最小高度 */
  .ag-column-panel {
    min-height: 30vh;
  }

  .ag-column-select-panel {
    min-height: 120px;
  }

  /*多列头居中*/
  .ag-theme-balham .ag-header-group-cell-label span {
      float: none;
      width: 100%;
      height: 100%;
  }
  .ag-theme-balham .colGroupCenter{
    text-align: center;
  }

  .ag-column-select-label {
    cursor: move;
  }

  .ag-column-select-column:hover {
    background: #e3e3e3;
  }

  .ag-floating-filter-full-body input {
    height: 24px;
  }

  .ag-floating-filter-full-body .ivu-select-multiple .ivu-select-selection {
    overflow: auto;
  }

  /* for when auto height is used but there is no row data */
  .ag-layout-auto-height.ag-body-container {
      min-height: 15px;
  }

  /* for when auto height is used but there is no row data */
  .ag-layout-auto-height.ag-overlay-no-rows-wrapper {
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .ag-bl-overlay {
    height: 100%;
    left: 0;
    pointer-events: none;
    position: relative !important;
    top: 0;
    width: 100%;
    background-color: #f5f7f7;
    border: 1px solid #bdc3c7;
    border-top: none;
}

  .ag-theme-balham .ag-tool-panel .ag-side-buttons button {
      display: block;
      width: 20px;
      height: 100px;
      word-break:break-all;
      word-wrap : break-word;
      border-bottom :1px solid #BDC3C7;
      border-right: none;
      -webkit-transform: rotate(0deg) translateY(0px);
      transform: rotate(0deg) translateY(0px);
      -webkit-transform-origin: left top 0;
      transform-origin: left top 0;
      white-space: nowrap;
      outline: none; 
      }

  .ag-theme-balham .ag-column-name-filter {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 10px;
      width: 100%;
  }

  /* 表格单元格空隙调整 */
  .ag-theme-balham .ag-header-cell, .ag-theme-balham .ag-header-group-cell {
      padding-left: 5px;
      padding-right: 5px;
  }
  /* .ag-theme-balham .ag-cell{
      padding: 0px 5px !important;
  } */

  /*高亮鼠标移动的行列的背景色 */
  .ag-row-hover {
    /* putting in !important so it overrides the theme's styling as it hovers the row also */
    background-color: #cdeef8 !important;
  }

  .ag-column-hover {
      background-color: #cdeef8;
  }

</style>
