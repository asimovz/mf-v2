<template>
  <div class="root">
    <div class="switch" v-if="conditions._join">

      <m-switch true-text="且" false-text="或" true-value="and" false-value="or" true-color="#13ce66" v-model="conditions._join" />

      <m-dropdown :transfer="true" placement="bottom-start" class="switch_menu" trigger="click">
        <div class="switch_triangle">
          <i class="el-icon-caret-right"></i>
        </div>
        <template #item>
          <m-dropdown-item>
            <div class="menu_item" @click="menuItemClick(1)">
              <i class="el-icon-circle-plus"></i>
              添加条件
            </div>
          </m-dropdown-item>
          <m-dropdown-item>
            <div class="menu_item" @click="menuItemClick(2)">
              <i class="el-icon-plus"></i>
              添加联合条件
            </div>
          </m-dropdown-item>
          <m-dropdown-item>
            <div class="menu_item menu_item_del" @click="menuItemClick(0)">
              <i class="el-icon-remove"></i>
              清空条件
            </div>
          </m-dropdown-item>
        </template>
      </m-dropdown>

    </div>

    <div class="condition_box">
      <div class="condition" v-for="(listItem, index) in conditions._list" :key="index">
        <Condition :conditions="listItem" :fields="fields" v-if="listItem._list"></Condition>
        <template v-if="!listItem._list" v-for="(it, key) in listItem">
          <!--字段-->
          <!-- <i-select :transfer="true" size="small" class="condition_item" v-if="key != '_comp'" v-model="it[0]" @on-change="fieldChange(it,$event)">
            <i-option v-for="item in fields" :value="item.value" :key="item.value">{{item.label}}</i-option>
          </i-select> -->

          <m-select :transfer="true" :filterable="false" :options="fields" size="small" class="condition_item" v-if="key != '_comp'" v-model="it[0]" @on-change="fieldChange(it,$event)"></m-select>

          <!--条件-->
          <!-- <i-select :transfer="true" size="small" class="condition_item" v-if="key == '_comp'" v-model="listItem['_comp']">
            <i-option v-for="item in comparisonOperator" :value="item.value" :key="item.value">{{item.label}}</i-option>
          </i-select> -->

          <m-select :transfer="true" :filterable="false" :options="comparisonOperator" size="small" class="condition_item" v-if="key != '_comp'" v-model="listItem['_comp']"></m-select>

        </template>
        <template v-if="!listItem._list" v-for="(it, key) in listItem">
          <!--值-->
          <m-input v-show="it[2]&&(it[2]=='text'||it[2]=='range')" size="small" :maxlength="200"
            class="condition_item" v-if="key != '_comp'" v-model="it[1]">
          </m-input>

          <m-dateTime v-show="it[2]&&it[2]=='date'" type="date" :format="it[3]"
            :transfer="true" size="small"
            class="condition_item" v-if="key != '_comp'" v-model="it[4]"
            @on-change="dateChange(it)"  @on-clear="dateChange(it)">
          </m-dateTime>

          <!-- <i-select :transfer="true" clearable size="small" class="condition_item" v-if="it[2]&&it[2]=='drop-down'" v-model="it[1]">
              <i-option v-if="it[2]&&it[2]=='drop-down'" v-for="item in it[5]" :value="item.value" :key="item.value">{{item.label}}</i-option>
          </i-select> -->

          <m-select :transfer="true" :filterable="false" :options="it[5]" size="small" class="condition_item" v-if="it[2]&&it[2]=='drop-down'" v-model="it[1]"></m-select>

        </template>
        <!--删除-->
        <div class="condition_item_del" v-if="!listItem._list" @click="deleteCondition(index)">
          <i class="el-icon-remove"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Moment from 'moment'

  const comparisonOperator = [
    {
      value: 'equals',
      label: '等于'
    },
    {
      value: 'not-equals',
      label: '不等于'
    }, {
      value: 'less',
      label: '小于'
    }, {
      value: 'greater',
      label: '大于'
    }, {
      value: 'less-equals',
      label: '小于等于'
    }, {
      value: 'greater-equals',
      label: '大于等于'
    }, {
      value: 'in',
      label: '存在于'
    }, {
      value: 'not-in',
      label: '不存在于'
    }, {
      value: 'between',
      label: '在...之间'
    }, {
      value: 'not-between',
      label: '介于...之外'
    }, {
      value: 'contains',
      label: '包含'
    }, {
      value: 'is-null',
      label: '为空'
    }, {
      value: 'is-not-null',
      label: '不为空'
    }
  ]
  export default {
    name: "Condition",
    props: {
      conditions: {
        type: Object,
        default: function () {
          return {}
        }
      },
      fields: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        comparisonOperator: comparisonOperator
      };
    },
    methods: {
      deleteCondition(index) {
        this.conditions._list.splice(index, 1)
      },

      menuItemClick(type) {
        switch (type) {
          case 0:
            this.conditions._list = []
            break
          case 1:
            // 一般条件
            this.conditions._list.push({
              field: ["", "", "", "", "",{}],
              _comp: 'contains'
            })
            break
          case 2:
            // 联合条件
            this.conditions._list.push({
              _join: 'or',
              _list: []
            })
            break
        }
      },

      fieldChange: function (it,e) {
        it[1] = ''
        it[3] = ''
        this.fields.forEach(field => {
          if(field.value == e) {
            it[2] = field.fieldType
            if(field.fieldType == 'date')
              it[3] = field.props.format
            if(field.fieldType == 'drop-down')
              it[5] = field.props.options
          }
        });
      },

      dateChange(it) {
        let momentFormat = it[3].split(" ").length > 1 ? it[3].split(" ")[0].toUpperCase() + " " + it[3].split(" ")[1] : it[3].toUpperCase()
        it[1] = it[4] ? Moment(it[4]).format(momentFormat) : ''
      },
    }
  };


</script>

<style scoped lang="less">
  .root {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .switch {
      width: 75px;
      padding: 0px;
      border: 1px solid #ccc;
      border-radius: 25px;
      position: relative;
      display: flex;
      align-items: center;

      .switch_triangle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 20px;
        margin-left: 4px;
        font-size: 14px;
        color: #7f848e;
        cursor: pointer;

        &:hover {
          color: #000;
        }
      }
      .switch_menu {
        .menu_item {
          i {
            margin-right: 3px;
          }
        }
        .menu_item_del {
          color: #f76868;
        }
      }
    }

    .condition_box {
      display: flex;
      width: 100%;
      flex-direction: column;
      border-left: 2px solid #ccc;
      border-radius: 10px;
      height: 100%;
      padding: 0px 0px 0px 10px;
      margin: 5px 0px 5px 5px;

      .condition {
        display: flex;
        margin: 3px 0px;
        .condition_item {
          margin-right: 10px;
          max-width: 110px;
          min-width: 80px;
        }
        .condition_item_del {
          display: flex;
          margin-right: 10px;
          margin-left: 5px;
          align-items: center;
          font-size: 16px;
          color: #ccc;
          cursor: pointer;
          width: auto;

          &:hover {
            color: #ff9d9d;
          }
        }
      }
    }
  }

</style>
