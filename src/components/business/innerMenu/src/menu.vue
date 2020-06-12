<template>
  <div class="box-wrapper">
    <div class="box-content">
      <Item ref="item" :data="currentData" @add="add" @remove="remove" />
      <span class="remove" @click="remove(-1)"><Icon type="ios-close-circle" /></span>
    </div>
  </div>
</template>
<script>
import Item from './menuItem'

export default {
  name: 'menus',
  components: { Item },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      currentData: {},
    }
  },

  watch: {
    data: {
      handler(v) {
        this.initData(v)
      },
      // deep: true, // ？ 可选 ？
      immediate: true
    }
  },
  methods: {
    initData(val) {
      /**
       * 二级菜单与一级菜单需要与外层数据响应
       * 模板中可直接使用 data，此处为方便数据追踪与不直接修改 props 原则，进行一个对象的赋值
       */
      if(val.options !== undefined && Object.keys(val.options).length){
        val.options = JSON.parse(
          decodeURIComponent(
            escape(
              window.atob(
                (val.options || '').replace(/-/g, "+").replace(/_/g, "/")
              )
            )
          )
        )
      }
      this.currentData = val /*{...val}*/
    },
    add(n) {
      if (!this.canAddFn()) return false

      this.currentData.submenu.push({
        order: this.currentData.submenu.length + 1,
        itemName: '',
        itemType: '',
        ruleDesc: '',
        startTime: '',
        endTime: '',
        extendVal: ''
      })
    },
    /**
     * [remove 删除菜单]
     * @param  {[type]} i [-1: 一级菜单 || 子菜单]
     */
    remove(i) {
      if (i === -1) {
        this.handleConfirm({
          title: '提示',
          content: this.currentData.submenu.length ? '删除一级菜单会同时删除下属所有二级菜单' : '确认删除一级菜单吗？',
          onOk: () => {
            this.$emit('remove')
          }
        })
      } else {
        if (this.currentData.submenu.length < 2) {
          this.handleMessage("菜单类型为MENU，至少包含一个无时间限制的子菜单","warning")
        }
      }
      this.updateOrder(this.currentData.submenu)
    },
    updateOrder(data){
      data.forEach((v, i) => {
        v.order = i + 1
      })
    },
    canAddFn() {
      if (!this.currentData.itemName.trim().length || !this.currentData.submenu.length) {
        this.handleMessage('菜单名称为空，不能添加新的子菜单！',"warning")
        return false
      } else {
        return !this.currentData.submenu.some(v => {
          if (!v.itemName.trim().length) {
            this.handleMessage('菜单名称为空，不能添加新的子菜单！',"warning")
            return true
          } else if (!v.itemType.length) {
            this.handleMessage('动作类型为空，不能添加新的子菜单！',"warning")
            return true
          } else {
            return false
          }
        })
      }
    },

    getData() {
      let submenus = this.currentData.submenu
      if (!submenus.length || submenus.some(v => {
          return v.startTime === '' && v.endTime === ''
        })) {
        return this.$refs.item.getData()
      } else {
        this.handleMessage('菜单类型为MENU，请至少添加一个无时间限制的子菜单','warning')
        return false
      }
    }
  }
}

</script>
<style scoped lang="less">
.box-wrapper {
  padding: 20px;
  background-color: #f4f4f4;
  border: 1px solid #bbb;
  border-radius: 8px;
}

.box-content {
  position: relative;
  padding: 0 10px;
  border: 1px solid #d6d6d6;
  background-color: #fff;
}

.remove {
  position: absolute;
  right: -10px;
  top: -10px;
  border-radius: 50%;
  line-height: 1px;
  font-size: 22px;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity .2s ease;
}

.box-wrapper:hover .box-content>.remove {
  opacity: 1
}

</style>
<!-- another style -->
<style lang="less" scoped>
.box-wrapper {
  position: relative;
  padding: 0;
  border: none;
  background-color: initial;
  border-radius: initial;
}

.box-content {
  position: static;
  padding: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>
