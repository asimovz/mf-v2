<template>
  <div class="mazy_search_box">
    <!-- <Select size="small" v-model="currentSearchIndex" @on-change="currentSearchChange" style="width:200px">
      <Option :value="-1">无(不使用查询方案)</Option>
      <Option v-for="(item, index) in mazySearchList" :value="index" :key="item.formListFindId">{{ item.description }}
      </Option>
    </Select> -->

    <m-select style="display: inline-block; width:200px" size="small"
      :options="mazySearchListCopy"
      v-model="currentSearchIndex"
    >
    </m-select>

    <!-- <Button size="small" type="info" ghost :icon="showPanel ? 'ios-arrow-up' : 'plus-round'" @click="togglePanel">{{showPanel
      ? '收起' : '新建'}}
    </Button> -->

    <m-button size="small" @click.native="togglePanel" :text="showPanel ? '收起' : '新建'">
      <i :class="`el-icon-${showPanel ? 'arrow-up' : 'arrow-down'}`"></i>
    </m-button>

    <transition name="fade">
      <div class="drop_down_panel" v-show="showPanel">
        <div class="toggle_panel_in_bnox">
          <i class="ivu-icon ivu-icon-eject"></i>
        </div>
        <div class="del_clear_box">
          <!-- <Button size="small" type="primary" @click="searchData">查询</Button> -->
          <m-button size="small" type="primary" @click.native="searchData" text="查询" />
          <!-- <Button size="small"
                  :disabled="!currentSearch.formListFindId || currentSearchIndex < 0 || currentSearch.isByUserId && currentSearch.isByUserId == 'false'"
                  type="default" @click="save">保存查询方案
          </Button> -->
          <m-button type="default" size="small" text="保存查询方案" @click.native="save"
            :disabled="!currentSearch.formListFindId || currentSearchIndex < 0 || currentSearch.isByUserId && currentSearch.isByUserId == 'false'"
           />

          <!-- <Button size="small" type="default" @click="saveAs">另存为查询方案</Button> -->
          <m-button size="small" type="default" @click.native="saveAs" text="另存为查询方案" />
          <!-- <Button size="small"
                  :disabled="!currentSearch.formListFindId || currentSearchIndex < 0 || (currentSearch.isByUserId && currentSearch.isByUserId == 'false')"
                  type="default" icon="minus-circled" @click="remove">删除查询方案
          </Button> -->

          <m-button type="default" size="small" text="删除查询方案" icon="el-icon-remove" @click.native="remove"
            :disabled="!currentSearch.formListFindId || currentSearchIndex < 0 || (currentSearch.isByUserId && currentSearch.isByUserId == 'false')"
          />

          <!-- <Button size="small" type="default" icon="refresh" @click="clear">清空查询条件</Button> -->
          <m-button size="small" type="default" icon="el-icon-refresh" @click.native="clear" text="清空查询条件" />
        </div>

        <sort-search :ref="'sort_' + id" :fields="fields" :sorts="sorts" class="sort_search"></sort-search>

        <condition-search :ref="'condition_' + id" :conditions="conditions" :fields="fields"></condition-search>
      </div>
    </transition>

    <!--另存为的model-->
    <m-modal
      v-model="showSaveAsModel"
      title="请输入新的查询方案名称"
    >
      <m-input v-model="saveAsDescription" />

      <span slot="footer">
        <m-button @click.native="saveAsCancel">取消</m-button>
        <m-button @click.native="saveAsConfirm">确认</m-button>
      </span>
    </m-modal>
  </div>
</template>

<script>
  // import _ from 'lodash'
  import ConditionSearch from './conditionSearch'
  import SortSearch from './sortSearch.vue'

  export default {
    name: "m-mazy-search",
    components: {SortSearch, ConditionSearch},
    props: {
      id: {
        type: String,
        required: false,
        default: new Date().getTime() + ''
      },
      searchList: {
        type: Array,
        default: () => []
      },
      fields: {
        type: Array,
        default: () => []
      },
      formSaveFindUrl: String,
      formLocation: String,
    },
    data() {
      return {
        saveAsDescription: '',
        showSaveAsModel: false,
        showPanel: false,
        currentSearchIndex: '',
        currentSearch: {},
        mazySearchList: [],
        sorts: [],
        conditions: {},
        isClearMazySearch: false
      };
    },
    computed: {
      mazySearchListCopy(){
        return [{value: -1, label: '无(不使用查询方案)'}].concat(this.mazySearchList)
      }
    },
    created() {
      this.searchList.forEach((el, idx) => {
        this.mazySearchList.push({
          value: idx,
          label: el.description,
          description: el.description,
          formListFindId: el.findParameters.formListFindId,
          filterMap: el.filterMap,
          orderByField: el.findParameters.orderByField,
          isByUserId: el.isByUserId
        })
      })
      this.$parent.$root.eventBus.$on(this.$parent.id + "_clearMazySearch", () => {
        this.isClearMazySearch = true
        this.clear()
        this.currentSearchIndex = -1
      })
    },
    methods: {
      searchData() {
        this.$emit('on-mazy-search', {
          filterMap: this.$refs['condition_' + this.id].$getResult(),
          orderByField: this.$refs['sort_' + this.id].$getResult()
        })

      },
      currentSearchChange(index) {
        this.currentSearchIndex = index
        if (index < 0 || index === "") {
          // 不使用查询方案
          this.sorts = []
          this.conditions = {}
          this.currentSearch = {}
          if (this.isClearMazySearch) {
            this.isClearMazySearch = false
            return false
          }
        } else {
          // 使用已有查询方案
          // this.currentSearchIndex = index
          this.currentSearch = this.mazySearchList[index]
          if(this.currentSearch){
            this.sorts = formatSorts(this.currentSearch.orderByField)
            this.conditions = JSON.parse(JSON.stringify(this.mazySearchList[index].filterMap ? this.mazySearchList[index].filterMap : {}))
          }
        }

        let sortStr = []
        this.sorts.forEach(el => {
          sortStr.push((el.order == 'DESC' ? '-' : '+') + el.field)
        })
        this.$emit('on-mazy-search', {
          filterMap: this.conditions,
          orderByField: sortStr.join(',')
        })
      },
      togglePanel() {
        this.showPanel = !this.showPanel
        // if(!this.showPanel){
        //   this.clear()
        // }
      },
      save() {
        this._httpMazySearch(this.currentSearch.formListFindId)
      },
      saveAs() {
        this.saveAsDescription = this.currentSearch.description
        this.showSaveAsModel = true
      },
      saveAsConfirm() {
        this._httpMazySearch()
      },
      saveAsCancel() {
        this.showSaveAsModel = false
      },
      remove() {
        let that = this
        this.$http.post(this.formSaveFindUrl, {formListFindId: this.currentSearch.formListFindId, DeleteFind: 'delete'})
          .then(res => {
            this.handleNotice("查询方案删除成功!",'success')
            that.mazySearchList.splice(that.currentSearchIndex, 1)
            that.currentSearchIndex = -1
            that.currentSearch = {}
            that.clear()
          }).catch(err => {
          this.handleNotice('查询方案删除失败!',"error")
        })
      },
      clear() {
        this.sorts = []
        this.conditions = {}
      },
      _httpMazySearch(id) {
        let that = this
        let data = {
          formLocation: this.formLocation,
          filterMap: JSON.stringify(this.$refs['condition_' + this.id].$getResult()),
          orderByField: this.$refs['sort_' + this.id].$getResult()
        }
        if (id) {
          data['formListFindId'] = id
        } else {
          data['_findDescription'] = this.saveAsDescription

        }
        this.$http.post(this.formSaveFindUrl, data)
          .then(res => {
            this.handleNotice('保存成功!',"success")
            if (id) {
              // 更新
              that.mazySearchList[that.currentSearchIndex].filterMap = JSON.parse(data.filterMap)
              that.mazySearchList[that.currentSearchIndex].orderByField = data.orderByField
            } else {
              // 新增到列表
              that.mazySearchList.push({
                value: that.mazySearchList.length + 1,
                label: data._findDescription,
                description: data._findDescription,
                formListFindId: res.data.screenParameters.formListFindId,
                filterMap: JSON.parse(data.filterMap),
                orderByField: data.orderByField,
                isByUserId: true
              })
            }
          }).catch(err => {
            this.handleNotice('保存失败!',"error")
        })
      }
    },

    destroyed:function(){
      this.$parent.$root.eventBus.$off(this.$parent.id + "_clearMazySearch")
	  }
  };

  function formatSorts(sortStr) {
    let sorts = []
    //console.log('sortStr ==>',sortStr)
    if(sortStr != undefined){
      let sort = JSON.parse(JSON.stringify(sortStr || ''))

      sort.split(",").forEach(el => {
        let sort = {
          order: moquiVue.moqui.startsWith(el, '+') ? 'ASC' : 'DESC',
          field: moquiVue.moqui.trimStart(el, '+-^')
        }
        sorts.push(sort)
      })
    }
    return sorts
  }
</script>

<style lang="less" scoped>
  .mazy_search_box {
    position: relative;
    padding: 10px 0px;

    .drop_down_panel {
      box-shadow: 0px 1px 8px #bbb;
      background-color: #f9f9f9f0;
      border: 1px solid #dddddd;
      width: 100%;
      min-height: 550px;
      max-height: 1000px;
      position: absolute;
      z-index: 800;
      border-radius: 4px;
      overflow: auto;
      margin-top: 2px;
      padding: 15px;

      .toggle_panel_in_bnox {
        width: 20%;
        height: 50px;
        position: absolute;
        top: -30px;
        left: 30%;
        border-radius: 100%;
        cursor: pointer;

        &:hover {
          background: #fff;
        }
      }

      .sort_search {
        margin-bottom: 20px;
      }

      .del_clear_box {
        margin-bottom: 5px;
        display: flex;
        justify-content: flex-end;

        button {
          margin: 0 5px;
        }
      }
    }

  }

</style>
