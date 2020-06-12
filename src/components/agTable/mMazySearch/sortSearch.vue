<style lang="less" scoped>
  .root {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    .sort_box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 15px;

      .sort_item {
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        padding: 0px 8px 0px 0px;
        border-radius: 20px;
        margin-right: 10px;

        .field_name {
          margin: 0px 8px;
        }

        .del_icon {
          cursor: pointer;
          font-size: 16px;
          color: #ccc;

          &:hover {
            color: #ff9d9d;
          }
        }
      }
    }
  }

</style>
<template>
  <div class="root">
    <div class="sort_box">列表排序方式：
      <div class="sort_item" v-for="(item, index) in sortList">
        <!-- <Button :type="item.order == 'ASC' ?'info':'success'"
                shape="circle"
                size="small"
                :icon="item.order == 'ASC' ? 'arrow-up-a' : 'arrow-down-a'"
                @click="changeOrder(index)"
        ></Button> -->

        <m-button shape="circle" size="small"
          :type="item.order == 'ASC' ?'info':'success'"
          :icon="item.order == 'ASC' ? 'arrow-up-a' : 'arrow-down-a'"
          @click.native="changeOrder(index)"
        />

        <div class="field_name">{{item.field | getSortFieldName(fieldList)}}</div>

        <div class="del_icon" @click="deleteThis(index,item)">
          <i class="el-icon-remove"></i>
        </div>
      </div>

      <m-dropdown trigger="click" @on-click="add" :options="fieldList">
        <m-button size="small" style="padding: 4px 8px">添加 <i class="el-icon-caret-bottom"></i></m-button>
      </m-dropdown>

    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  export default {
    name: "sort-search",
    props: {
      fields: Array,
      sorts: Array
    },
    data() {
      return {
        sortList: [],
        fieldList: []
      };
    },
    mounted() {

    },
    methods: {
      changeOrder(index) {
        this.sortList[index].order = this.sortList[index].order == 'DESC' ? 'ASC' : 'DESC'
      },
      deleteThis(index,item) {
        this.fieldList.forEach(el_f => {
          el_f.value == item.field ? el_f.show = true : null
        })
        // this.fieldList[index].show = true
        this.sortList.splice(index, 1)
      },
      add(command) {
        let index = this.fieldList.findInex(field => field.value === command)
        this.fieldList[index].show = false
        this.sortList.push({
          order: 'ASC',
          field: this.fieldList[index].value
        })
      },
      $getResult() {
        let result = []
        this.sortList.forEach(el => {
          if(el.field){
            result.push((el.order == 'DESC' ? '-' : '+') + el.field)
          }
        })
        return result.join(',')
      }

    },

    watch: {
      sorts(newVal) {
        this.sortList = this.moqui.clone(this.sorts, true)
        this.fieldList = this.moqui.clone(this.fields, true).map(el => {
          el['show'] = true
          return el
        })
        this.sortList.forEach(el_s => {
          this.fieldList.forEach(el_f => {
            el_f.value == el_s.field ? el_f.show = false : null
          })
        })
      },

      fields() {
        this.fieldList = this.moqui.clone(this.fields, true).map(el => {
          el['show'] = true
          return el
        })
      }
    },
    filters: {
      getSortFieldName(value, fields) {
        if (value && fields.length > 0) {
          return fields.filter(el => {
            return el.value == value
          })[0].label
        }

      }
    }
  };

</script>


