<template>
  <div>
    <!-- user input element -->
    <div
      :class="{'sp-input-container':true,'sp-open':show,'sp-disabled':disabled}"
      ref="caller"
      @click="open"
    >
      <!--<slot></slot>-->
      <!--<input type="text" ref="input" v-if="!multiple" readonly="readonly" :value="results">-->
      <div class="sp-base sp-input" ref="input" v-if="!multiple">
        <span v-html="results"></span>
        <span class="sp-placeholder" v-show="picked.length === 0">{{placeholderString}}</span>
      </div>
      <div class="sp-base sp-inputs" ref="input" v-if="multiple">
        <span class="sp-placeholder" v-show="picked.length === 0">{{placeholderString}}</span>
        <span class="sp-selected-tag" v-for="sel,index in picked">
          <span v-html="renderCell(sel)"></span>
          <span @click="remove(index)" v-show="!disabled">
            <i class="sp-iconfont sp-icon-close"></i>
          </span>
        </span>
      </div>
      <div
        class="sp-clear"
        v-show="!multiple && picked.length && !disabled"
        @click.stop="remove"
        :title="i18n.clear"
      >
        <i class="sp-iconfont sp-icon-close"></i>
      </div>
      <div :class="{'sp-button':true,open: show}">
        <span class="sp-caret ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></span>
      </div>
    </div>

    <!-- drop down list -->
    <v-dropdown ref="dropdown" @show-change="dropdownVisible">
      <!-- message bar -->
      <div class="sp-message" v-if="message">
        <i class="sp-iconfont sp-icon-warning"></i>
        <span v-html="message"></span>
      </div>
      <!-- header bar -->
      <div class="sp-header" v-show="!message">
        <h3 v-html="headerTitle"></h3>
        <button
          type="button"
          :title="i18n.select_all"
          class="sp-select-all-btn"
          @click="pickPage(true)"
          v-if="multiple"
        >
          <i class="sp-iconfont sp-icon-select-all"></i>
        </button>
        <button
          type="button"
          :title="i18n.unselect_all"
          class="sp-remove-all-btn"
          @click="pickPage(false)"
          v-if="multiple"
        >
          <i class="sp-iconfont sp-icon-unselect-all"></i>
        </button>
        <button type="button" :title="i18n.clear_all" class="sp-clear-all-btn" @click="remove">
          <i class="sp-iconfont sp-icon-clear"></i>
        </button>
        <button type="button" @click="close" :title="i18n.close_btn" class="sp-close-btn">
          <i class="sp-iconfont sp-icon-close"></i>
        </button>
      </div>

      <!-- search bar -->
      <div class="sp-search" v-show="!message">
        <input
          type="text"
          autocomplete="off"
          ref="search"
          v-model="search"
          @keyup="processKey"
          @keydown.stop="processControl"
          class="sp-search-input"
        >
      </div>

      <!-- content list bar -->
      <div class="sp-result-area" v-show="!message" ref="list">
        <!-- single column(list) mode -->
        <ul
          class="sp-results"
          v-if="!tbColumns"
          v-show="list.length"
          @mouseleave="highlight=-1"
          ref="listUl"
        >
          <li
            :title="row[showField]"
            v-for="row,index in list"
            :class="{
                            'sp-over':highlight===index,
                            'sp-selected':picked.findIndex(val=>val[keyField] === row[keyField])!==-1
                        }"
            @click="selectItem(row)"
            v-html="renderCell(row)"
            @mouseenter="highlight=!picked.includes(row)?index:-1"
          ></li>
        </ul>
        <!-- multiple columns(table) mode -->
        <table
          v-if="Array.isArray(tbColumns)&&tbColumns.length"
          ref="table"
          v-show="list.length"
          class="sp-table"
        >
          <thead>
            <tr>
              <th v-for="col in tbColumns" :style="thStyle">{{col.title}}</th>
            </tr>
          </thead>
          <tbody @mouseleave="highlight=-1" class="new-scrollbar">
            <tr
              v-for="row,index in list"
              :class="{
                                'sp-over': highlight === index,
                                'sp-selected':picked.findIndex(val=>val[keyField] === row[keyField])!==-1
                            }"
              @click="selectItem(row)"
              @mouseenter="highlight=picked.findIndex(val=>val[keyField] === row[keyField])>-1?-1:index"
            >
              <td v-for="col in tbColumns" v-html="row[col.data]"></td>
            </tr>
          </tbody>
        </table>

        <!-- no result message -->
        <div v-if="!list.length" class="sp-message" v-text="i18n.not_found"></div>
      </div>

      <!-- pagination bar -->
      <div class="sp-pagination" v-show="!message" v-if="pagination">
        <div class="sp-page-info">{{pageInfo}}</div>
        <ul ref="page">
          <li :class="{'sp-disabled':pageNumber===1}" :title="i18n.first">
            <a href="javascript:void(0);" @click="switchPage('first')">
              <i class="sp-iconfont sp-icon-first"></i>
            </a>
          </li>
          <li :class="{'sp-disabled':pageNumber===1}" :title="i18n.prev">
            <a href="javascript:void(0);" @click="switchPage('previous')">
              <i class="sp-iconfont sp-icon-previous"></i>
            </a>
          </li>
          <li
            :class="{'sp-disabled':pageNumber===totalPage || totalRows===0}"
            class="sp-right"
            :title="i18n.last"
          >
            <a href="javascript:void(0);" @click="switchPage('last')">
              <i class="sp-iconfont sp-icon-last"></i>
            </a>
          </li>
          <li
            :class="{'sp-disabled':(pageNumber===totalPage || totalRows===0)}"
            class="sp-right"
            :title="i18n.next"
          >
            <a href="javascript:void(0);" @click="switchPage('next')">
              <i class="sp-iconfont sp-icon-next"></i>
            </a>
          </li>
        </ul>
      </div>
    </v-dropdown>
  </div>
</template>

<script>

import dropdown from "./Dropdown";
import lang from "./language";
export default {
  name: "v-selectpage",
  components: {
    "v-dropdown": dropdown
  },
  props: {
    /**
     * Specify key to make list item selected, the must be match 'keyField' option value
     *
     * example:
     * single mode: '123'
     * multiple mode: '123, 124, 125'
     */
    value: String,
    data: {
      type: Array | String,
      required: true
    },
    /**
     * server side querying params
     */
    params: Object,
    /**
     * server side result format
     * @param resp [object] server side request result
     * @return [object] the formatted data
     */
    resultFormat: Function,
    title: {
      type: String,
      default: "SelectPage"
    },
    placeholder: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: "cn"
    },
    keyField: {
      type: String,
      default: "id"
    },
    /**
     * Specify field to
     */
    showField: {
      type: String | Function,
      default: "name"
    },
    /**
     * Table mode to show data, format sample:
     * title: [string] - the title content text,
     * data: [string|function] - specify column name to load data,
     * [
     *      {title: 'full name', data: function(row){ return row.lastName + ' ' + row.firstName; }},
     *      {title: 'age', data: 'age'},
     *      {title: 'birthday', data: function(row){ return someformat(row.birthday); }}
     * ]
     */
    tbColumns: Array,
    /**
     * Sort config, use space to split field name and sort order
     * example: 'name desc'
     */
    sort: String,
    searchField: String,
    pageSize: {
      type: Number,
      default: 10
    },
    /**
     * max selected item limit, set 0 to unlimited
     */
    maxSelectLimit: {
      type: Number,
      default: 0
    },
    pagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      disabled: false,
      search: "",
      lastSearch: null,
      searchColumn: null,
      i18n: {},
      message: "",
      highlight: -1,

      list: [],
      sortedList: null,
      picked: [],

      pageNumber: 1,
      totalPage: 0,
      totalRows: 0
    };
  },
  methods: {
    dataLoad: function(data, params) {
      return new Promise((resolve, reject) => {
        this.$http
          .post(data, params)
          .then(resp => resolve(resp))
          .then(resp => reject(resp));
      });
    },

    open() {
      if (this.disabled) return;
      if (!this.show) this.show = true;
      else this.inputFocus();
      setTimeout(() => {
        let table = this.$refs.table;
        let width = this.$refs.dropdown.$el.getBoundingClientRect().width;
        let thNum = table.querySelectorAll("th").length;
        if (thNum * 150 > width) {
          table.style.width = thNum * 150 + "px";
        }
      }, 0);
    },
    close() {
      this.$refs.dropdown.$emit("show", false);
    },
    remove(index) {
      let that = this,
        removed = [];
      if (typeof index !== "number") {
        removed = this.picked.concat();
        this.picked.splice(0, this.picked.length);
      } else {
        removed = [this.picked[index]];
        this.picked.splice(index, 1);
      }

      if (this.multiple && this.show) {
        this.$nextTick(() => {
          that.adjustList();
          that.inputFocus();
        });
      }
      this.$emit("removed", removed);
    },
    pickPage(check) {
      let removed = [];
      for (let row of this.list) {
        if (
          !this.picked.includes(row) &&
          (this.maxSelectLimit && this.picked.length < this.maxSelectLimit) &&
          check
        )
          this.picked.push(row); //picked current page items
        if (this.picked.includes(row) && !check) {
          //removed current page items
          let idx = this.picked.findIndex(value => Object.is(value, row));
          if (idx !== -1) {
            removed.push(this.picked[idx]);
            this.picked.splice(idx, 1);
          }
        }
      }

      this.$emit("removed", removed);
      this.$nextTick(() => {
        this.adjustList();
        this.inputFocus();
      });
    },
    inputFocus() {
      this.$refs.search.focus({ preventScroll: true });
    },
    adjustList() {
      this.$refs.dropdown.$emit("adjust", this.$refs.caller);
    },
    getResults() {
      let str = "";
      if (this.picked.length && !this.multiple) {
        switch (typeof this.showField) {
          case "string":
            str += this.picked[0][this.showField];
            break;
          case "function":
            str += this.showField(this.picked[0]);
            break;
        }
      }
      return str;
    },
    dropdownVisible(val) {
      this.show = val;
    },
    processKey(e) {
      // if (![37, 38, 39, 40, 27, 13, 9].includes(e.keyCode)) {
      //     this.populate();
      // }
      // 按下回车才触发搜索，不自动输入时实时搜索
      if (e.keyCode == 13) {
        this.populate();
      }
    },
    processControl(e) {
      if ([37, 38, 39, 40, 27, 13, 9].includes(e.keyCode)) {
        switch (e.keyCode) {
          case 37: //left
            this.switchPage("previous");
            break;
          case 38: // up
            this.previous();
            break;
          case 39: //right
            this.switchPage("next");
            break;
          case 40: // down
            this.next();
            break;
          case 9: // tab
          case 13: // return
            if (this.highlight !== -1)
              this.selectItem(this.list[this.highlight]);
            break;
          case 27: // escape
            this.close();
            break;
        }
      }
    },
    next() {
      if (this.highlight < this.list.length - 1) {
        let that = this,
          nextIndex = this.list.findIndex((val, idx) => {
            return idx > that.highlight && !that.picked.includes(val);
          });
        if (nextIndex !== -1) this.highlight = nextIndex;
      }
    },
    previous() {
      if (this.highlight > 0) {
        let that = this,
          preIndex = -1,
          previous = this.list.filter((val, idx) => {
            return idx < that.highlight && !that.picked.includes(val);
          });
        if (previous.length) {
          preIndex = this.list.findIndex(value =>
            Object.is(value, previous[previous.length - 1])
          );
          if (preIndex !== -1) this.highlight = preIndex;
        }
      }
    },
    renderCell(row) {
      let result = "";
      if (row && Object.keys(row).length) {
        if (typeof this.showField === "string") result = row[this.showField];
        else if (typeof this.showField === "function")
          result = this.showField(row);
      }
      return result;
    },
    selectItem(row) {
      if (typeof row == "object") {
        if (
          this.picked.findIndex(
            val => val[this.keyField] === row[this.keyField]
          ) > -1
        )
          return;
      } else {
        if (this.picked.includes(row)) return;
      }

      if (this.multiple) {
        if (
          (this.maxSelectLimit && this.picked.length < this.maxSelectLimit) ||
          !this.maxSelectLimit
        )
          this.picked.push(row);
        else
          this.message = this.i18n.max_selected.replace(
            "max_selected_limit",
            `<b>${this.maxSelectLimit}</b>`
          );
        this.$nextTick(() => {
          this.adjustList();
          this.inputFocus();
        });
      } else {
        this.picked = [row];
        this.close();
      }
      this.highlight = -1;
    },
    sortList() {
      if (this.data && Array.isArray(this.data) && this.sort) {
        let that = this,
          sortArr = this.sort.split(" "),
          sort = {};
        if (sortArr.length === 2) {
          sort.field = sortArr[0];
          sort.order = sortArr[1];
          this.sortedList = this.data.concat().sort((a, b) => {
            let valA = a[sort.field],
              valB = b[sort.field],
              result = null;
            let order = sort.order ? sort.order.toLowerCase() : "asc";
            if (order === "asc") {
              result =
                typeof valA === "number"
                  ? valA - valB
                  : String(valA).localeCompare(String(valB));
            } else if (order === "desc") {
              result =
                typeof valA === "number"
                  ? valB - valA
                  : String(valB).localeCompare(String(valA));
            }
            return result;
          });
        }
      }
    },
    populate(dynamicParams) {
      if (this.data) {
        let that = this;
        if (this.search && this.search !== this.lastSearch) this.pageNumber = 1;
        if (Array.isArray(this.data)) {
          let list = this.sortedList
            ? this.sortedList.concat()
            : this.data.concat();
          if (this.search)
            list = list.filter(val =>
              val[that.searchColumn]
                .toLowerCase()
                .includes(that.search.toLowerCase())
            );
          this.totalRows = list.length;
          this.totalPage = this.pagination
            ? Math.ceil(list.length / this.pageSize)
            : 1;

          if (this.pagination) {
            let start = (this.pageNumber - 1) * this.pageSize,
              end = start + this.pageSize - 1;
            this.list = list.filter(
              (val, index) => index >= start && index <= end
            );
          } else this.list = list;
        } else if (typeof this.data === "string") {
          this.remote(false, dynamicParams);
        }
        if (this.search) this.lastSearch = this.search;
        this.highlight = -1;
      }
      this.inputFocus();
    },
    remote(init, dynamicParams) {
      if (
        typeof this.data === "string" &&
        this.dataLoad &&
        typeof (this.dataLoad === "function")
      ) {
        let that = this,
          queryParams =
            this.params && Object.keys(this.params).length
              ? JSON.parse(JSON.stringify(this.params))
              : {};
        if (dynamicParams) {
          queryParams = Object.assign(queryParams, dynamicParams);
        }
        queryParams.pageSize = this.pageSize;
        queryParams.pageNumber = this.pageNumber;
        if (this.sort) queryParams.orderBy = this.sort;
        if (init && this.value) {
          queryParams.searchKey = this.keyField;
          queryParams.searchValue = this.value;
        }
        if (this.search) {
          let field = "";
          //this.searchField ? this.searchField : this.showField;
          if (!this.searchField && typeof this.showField === "function") {
            console.error(
              'Your "showField" was a function, in server side mode, your need specified "searchField" to search content.'
            );
          } else {
            field = this.searchField ? this.searchField : this.showField;
            queryParams[field] = this.search;
          }
        }
        this.dataLoad(this, this.data, queryParams).then(resp => {
          if (resp) {
            if (!that.resultFormat || typeof that.resultFormat !== "function") {
              console.error(
                'In server side mode, you need specified "resultFormat" function to format server side result.'
              );
            } else {
              let tmpObj = that.resultFormat(resp);
              if (tmpObj && Object.keys(tmpObj).length) {
                if (!init) {
                  that.list = tmpObj.list;
                  that.totalRows = tmpObj.totalRow;
                  that.totalPage = that.pagination
                    ? Math.ceil(tmpObj.totalRow / that.pageSize)
                    : 1;
                } else {
                  that.picked = tmpObj.list;
                }
              }
            }
          }
        });
      }
    },
    switchPage(pNum) {
      if (typeof pNum === "string") {
        switch (pNum) {
          case "first":
            if (this.pageNumber !== 1) this.pageNumber = 1;
            break;
          case "previous":
            if (this.pageNumber !== 1) this.pageNumber--;
            break;
          case "next":
            if (this.pageNumber !== this.totalPage) this.pageNumber++;
            break;
          case "last":
            if (this.pageNumber !== this.totalPage)
              this.pageNumber = this.totalPage;
            break;
        }
      } else if (typeof pNum === "number") {
        this.pageNumber = pNum;
      }
      this.populate();
    },
    initSelection() {
      if (this.value) {
        if (Array.isArray(this.data)) {
          let that = this,
            arr = this.value.split(",");
          if (arr.length) {
            let matchRows = this.data.filter(val =>
              arr.includes(String(val[that.keyField]))
            );
            if (matchRows.length) {
              this.picked = this.multiple ? matchRows : [matchRows[0]];
            }
          }
          this.findSelectionPage();
        } else if (typeof this.data === "string") {
          this.remote(true);
        }
      }
      this.populate();
    },
    findSelectionPage() {
      if (!this.multiple && this.pagination) {
        let list = this.sortedList
          ? this.sortedList.concat()
          : this.data.concat();
        let index = list.findIndex(
          val => String(val[this.keyField]) === this.value
        );
        if (index >= 0) {
          this.pageNumber = Math.ceil((index + 1) / this.pageSize);
        }
      }
    },
    disabledInput(val) {
      if (typeof val === "boolean") this.disabled = val;
      if (val === true && this.show) this.close();
    },
    scrollPolyfill() {
      var supportPageOffset = window.pageXOffset !== undefined;
      var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

      var x = supportPageOffset
        ? window.pageXOffset
        : isCSS1Compat
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft;
      var y = supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop;
    }
  },
  watch: {
    show(val) {
      if (val) {
        let that = this;
        this.$refs.dropdown.$emit("show", true, this.$refs.caller);

        this.$nextTick(() => {
          //fix open drop down list and set input focus, the page will scroll to top
          //that.$refs.search.focus({preventScroll:true}); only work on Chrome
          let x = window.pageXOffset,
            y = window.pageYOffset;
          that.$refs.search.focus();
          if (window.pageYOffset !== y) window.scrollTo(x, y);
        });
      }
    },
    picked(val) {
      if (
        this.message &&
        this.maxSelectLimit &&
        val.length < this.maxSelectLimit
      )
        this.message = "";
      let that = this;
      this.$emit("input", val.map(value => value[that.keyField]).join(","));
      this.$emit("values", this.picked.concat());
    },
    value(val) {
      // this.initSelection();
    },
    data(val) {
      this.sortList();
      this.populate();
      if (this.picked.length) this.picked.splice(0, this.picked.length);
      else this.initSelection();
    }
  },
  computed: {
    headerTitle() {
      let headerStr = this.i18n.items_selected,
        result = "";
      let replace = val => headerStr.replace("selected_count", `<b>${val}</b>`);
      if (this.picked.length) {
        result = this.multiple
          ? replace(this.picked.length)
          : this.getResults();
      } else result = this.title;
      return result;
    },
    results() {
      return this.getResults();
    },
    placeholderString() {
      return this.placeholder ? this.placeholder : this.i18n.placeholder;
    },
    pageInfo() {
      return this.i18n.page_info
        .replace("page_num", this.pageNumber)
        .replace("page_count", this.totalPage)
        .replace("row_count", this.totalRows);
    },
    thStyle() {
      if (this.tbColumns.length > 3) {
        return {
          width: "200px"
        };
      }
    }
  },
  beforeMount() {
    //read language
    this.i18n = lang[this.language];
  },
  mounted() {
    let that = this;
    this.scrollPolyfill();
    //switch class name
    let className = this.$el.className;
    this.$el.className = "v-selectpage";
    this.$refs.input.className += " " + className;

    //set searchField when user not config
    if (!this.searchField) {
      if (typeof this.showField === "string")
        this.searchColumn = this.showField;
      else if (Array.isArray(this.showField) && this.showField.length)
        this.searchColumn = this.showField[0].data;
    } else this.searchColumn = this.searchField;

    //sort data list
    this.sortList();

    //init item selected
    this.initSelection();

    this.$on("disabled", this.disabledInput);
    this.$on("clear", this.remove);
  },
  destroyed() {
    this.$off("disabled", this.disabledInput);
    this.$off("clear", this.remove);
  }
};
</script>
<style lang="less">
@import "./selectPage";
</style>
