<template>
  <div class="menu">
    <p class="menu_title" v-if="level === 1">父菜单项</p>
    <div class="menu_info">

      <!-- 名称与动作类型 -->
      <div class="menu_inline text-require">
        <span>菜单名称</span>
        <m-input :id="`itemName_${currentData.id}`" class="menu-name-input" name="itemName" v-model="currentData.itemName" placeholder="菜单名称" emoji @input="nameInput" />
      </div>
      <div class="menu_inline text-require">
        <span>动作类型</span>
        <drop-down v-model="currentData.itemType" placeholder="请选择动作类型" name="itemType"
          :filterable="false"
          :options="actions"
          @input="actionChange"
        >
        </drop-down>
      </div>

      <div class="valid-time">
        <m-input style="width: inherit;" name="ruleDesc" v-model="currentData.ruleDesc" placeholder="ruleDesc" />
      </div>

      <!-- 参数 -->
      <template v-if="(level === 1 && !currentData.submenu.length) || level !== 1">
        <div class="valid-time">
          <span>生效时间</span>
          <m-dateTime size="default" class="time-input" name="validTime" type="datetimerange" beforeDisabled
            format="yyyy-MM-dd HH:mm" placeholder="请选择生失效时间"
            :initValue="validTime"
            @on-change="dateTimeChange"
          >
          </m-dateTime>
        </div>
        <div class="more-ops">
          <div v-show="!(currentData.itemType === 'MENU' && currentData.submenu.length) && extendFields.length" :class="['more', {'active': isMore}]" @click="isMore = isMore ? false : true" :title="`${isMore ? '隐藏' : '显示'}全部参数`">
            <Icon size="18" :class="{'active': isMore}" type="ios-arrow-down" />
          </div>
          <!-- <el-collapse-transition> // 依赖 element 不适合后期更换 UI 库，so 舍弃动画 -->
            <div class="infos" v-show="isMore">
              <div class="opts-field" v-if="extendFields.length">
                <extend-field ref="options" :isStandard="currentData.itemType === 'STANDARD'" :fields="extendFields" :data="currentData">
                </extend-field>
              </div>
            </div>
          <!-- </el-collapse-transition> -->
        </div>
      </template>

      <span v-if="level !== 1" class="remove" @click="remove(-1)"><!-- <i class="el-icon-error"></i> --><Icon type="ios-close-circle" /></span>
    </div>

    <!-- 二级菜单 -->
    <template v-if="currentData.submenu && currentData.submenu.length">
      <!-- <div style="height: 1px background-color: #eee"></div> -->
      <p class="menu_title" style="margin: 10px 10px 10px 20px;">子菜单项</p>
      <div class="submenu" v-for="(v, i) in currentData.submenu" :key="v.id">
        <item :key="i" :ref="'item' + i" :level="currentData.submenu.length ? +level + 1 : level" :data="v" @remove="remove(i)" />
      </div>
    </template>

    <!-- 添加二级菜单 -->
    <template v-if="level === 1 && !readonly">
      <div v-show="currentData.itemType === 'MENU'" class="menu_add sub-add" @click="add">
        <Icon type="plus-circled" style="vertical-align: baseline" /> 添加子菜单
      </div>
    </template>
  </div>
</template>
<script>
import extendField from './extendField.vue'
// import { actionData, standardAct} from '../data.js'
export default {
  name: 'item',
  components: {
    extendField
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    level: {
      type: [String, Number],
      default: 1
    },
  },
  inject: [ 'motions', 'readonly' ],
  data() {
    let actions = this.level === 1 ? this.motions : this.motions.filter(v => v.value !== 'MENU')
    return {
      currentData: {},
      isMore: false,
      levels: ['一', '二', '三', '四'],
      actions: actions,
      fields: [],
      dateTimeOpts: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    }
  },
  computed: {
    // title() {
    //   return `${this.levels[this.level - 1]}级菜单`
    // },
    // 扩展参数字段
    extendFields() {
      // if(this.currentData.itemType !== 'STANDARD'){
        let currentAction = this.actions.filter(v => v.value == this.currentData.itemType)
        return currentAction.length ? currentAction[0].opts || [] : []
      // }else{
      //   return standardAct
      // }

    },
    // 生效时间
    validTime: {
      get() {
        return [
          this.currentData.startTime ? new Date(this.currentData.startTime) : '',
          this.currentData.endTime ? new Date(this.currentData.endTime) : ''
        ]
      },
      set(val) {
        this.currentData.startTime = val[0] instanceof Date ? +val[0] : ''
        this.currentData.endTime = val[1] instanceof Date ? +val[1] : ''
      }
    }
  },
  watch: {
    data: {
      handler(v, o) {
        this.initData(v)
      },
      // deep: true, // ？ 可选 ？
      immediate: true
    },
    'currentData.itemType': {
      handler(v){
        // this.isMore = v == 'STANDARD'
        this.isMore = true
      },
      immediate: true
    }
  },
  methods: {
    nameInput(val){
      if(val.length > 10){
        this.handleMessage('名称最多10个字符','warning')
        let newVal = val.slice(0, 10)
        this.currentData.itemName = newVal
        this.$nextTick(()=> {
          event.target.value = newVal
        })
      }
    },
    initData(val) {
      /**
       * 菜单名称需要与外层数据响应
       * 模板中可直接使用 data，此处为方便数据追踪，进行一个对象的赋值
       */
      this.currentData = val
    },
    actionChange(n) {
      if (n !== 'MENU') {
        this.currentData.submenu = []
      } else {
        this.currentData.options = ""
        this.currentData.startTime = this.currentData.endTime = ''
        this.currentData.submenu = [{
          order: this.currentData.submenu.length + 1,
          itemName: '',
          startTime: '',
          itemType: '',
          endTime: ''
        }]
      }

      this.clearVal()
      this.isMore = true
    },
    clearVal() {
      // this.currentData['options'] && this.extendFields && this.extendFields.forEach(v => {
      //   this.currentData['options'][v.name] === undefined || (this.currentData['options'][v.name] = '')
      // })

      if(this.currentData.hasOwnProperty('extendVal')) this.currentData.extendVal = ''
      if(this.currentData.hasOwnProperty('options')) this.currentData['options'] = {}
    },
    dateTimeChange(date) {
      this.currentData.startTime = date && date[0] ? +new Date(date[0]) : ''
      this.currentData.endTime = date && date[1] ? +new Date(date[1]) : ''
    },
    /**
     * [remove 删除二菜单]
     * @param {[type]} id [二级菜单的id]
     */
    remove(id) {
      if(id === -1){
        this.$emit('remove')
      }else{
        this.$emit('remove', id)
        // this.currentData.submenu.splice(id, 1)
      }
    },

    /**
     * [add 添加二级菜单]
     */
    add() {
      this.currentData.startTime = this.currentData.endTime = ''
      this.$emit('add', 1)
    },
    getData() {
      if (!this.currentData.itemName.trim().length) {
        this.handleMessage('请输入菜单名称','warning')
        return false
      }
      if (!this.currentData.itemType) {
        this.handleMessage('请选择动作类型','warning')
        return false
      }

      // MENU 类型
      if (this.currentData.itemType === 'MENU') {
        let submenu = this.currentData.submenu || []
        // 必须添加子菜单
        if (!submenu.length) {
          this.handleMessage('请添加二级菜单','warning')
          return false
        } else {
          let subs = []
          subs = submenu.map((v, i) => {
            return this.$refs['item' + i][0].getData()
          })

          // 验证子菜单的数据
          if (subs.some(v => {
              return typeof v === 'boolean' && !v
            })) {
            return false
          } else {
            return {
              ...this.currentData,
              submenu: subs
            }
          }
        }
      } else {
          let options = {}, hasExtend, extendVal
          if(this.extendFields.length){
            options = this.$refs.options.getData()
            hasExtend = options.hasOwnProperty('extendVal')
            extendVal = options['extendVal']
            hasExtend && delete options.extendVal
          }

          return Object.assign(
            {
              ...this.currentData,
              options: JSON.stringify(options),
            }, hasExtend ? {extendVal: extendVal} : null
          )

      }
    }
  }
}

</script>
<style scoped lang="less">
.menu {
  margin: 10px;

  &_title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
  }

  &_inline {
    display: inline-flex;
    flex-basis: 50%;
    padding: 5px 10px;
    align-items: center;
    &>span {
      width: 60px;
      margin-right: 10px;
    }

    &>div {
      flex: 1;
    }
  }

  &_info {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 2px;
  }

  &_add {
    margin: 10px 0;
    padding: 15px 20px;
    border: 1px dashed #ccc;
    text-align: center;
    border-radius: 2px;
    color: #0093FF;
    cursor: pointer;
    transition: background-color .2s ease;

    &:hover {
      background-color: #f7f7f7;
    }

    &.disabled {
      background-color: #f3f3f3;
      cursor: not-allowed;
    }

    &.sub-add {
      margin: 10px 0 0 20px;
      padding: 10px 20px;
      text-align: initial;
      font-size: 14px;
      word-spacing: 5px;
    }
  }
}


.submenu .menu {
  background-color: #fff
}

.valid-time {
  margin: 10px 10px 5px;
  display: flex;
  width: 100%;
  align-items: center;

  &>span {
    width: 60px;
    margin-right: 10px;
    text-align: right;
  }

  .time-input {
    flex: 1;
    /deep/ .ivu-date-picker,
    /deep/ .el-date-editor--datetimerange.el-input,
    /deep/ .el-date-editor--datetimerange.el-input__inner{width: 100%;}
    /deep/ .el-date-editor .el-range-input{width: 45%}
  }
}

.opts-field {
  .ivu-input {
    margin-top: 10px;
  }
}

.remove {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  line-height: 15px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity .2s ease;
}

.more-ops {
  position: relative;
  width: 100%;

  .more {
    margin-bottom: -5px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;

    .ivu-icon {
      transition: transform .2s linear;
    }
    .el-icon-arrow-down{transition: all .3s ease;}
    &.active .el-icon-arrow-down {
      transform: rotateX(180deg)
    }
  }
}

.submenu {
  margin: 0 -10px;
  padding-left: 20px;
}

.submenu:hover .remove {
  opacity: 1
}

</style>
<!-- another style -->
<style lang="less" scoped>
.menu {
  margin: 0;

  &_title {
    padding: 15px 20px 0;
    margin-bottom: 0;
    background-color: #fafafa;
    border-radius: 4px;
  }

  &_info {
    background-color: #fafafa;
    border-radius: 4px;

    &+.menu_title {
      margin: 0 !important;
      padding-left: 30px;
      background-color: #fff;
      border-top: 1px solid #ccc;
      border-radius: 0
    }
  }

  &_add {
    margin: 0 20px 10px 30px !important;
  }
}

.submenu {
  margin: 0;
  padding-left: 0;

  .menu {
    &_info {
      margin: 15px 20px 10px 30px;
      background-color: #f7f7f7;
      border-radius: 2px;
    }
  }
}

</style>
