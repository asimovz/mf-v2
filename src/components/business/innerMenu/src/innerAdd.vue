<template>
  <div class="menu-wrapper section">
    <div class="title">
      <div class="text-require" style="display: inline-flex; align-items: center;padding: 5px 10px 0;margin-top: -5px;">
        <span style="width: 60px;margin-right: 10px;">菜单描述</span>
        <div>
          <m-input class="dec-input" name="desc"
            v-model="desc"
            placeholder="菜单描述(必填)"
            :readonly="readonly"
          />
        </div>
      </div>

      <div style="display: inline-block; margin-left: 50px;">
        <m-button class="act-btn" type="default" @click.native="goBack(backUrl)" text="取消" />
        <m-button v-if="!readonly" class="act-btn" type="primary" toggle="linkFormLink" @click.native="save" text="保存" />
      </div>
    </div>

    <TopHeader v-if="headerData" ref="topHeader" v-model="headerData"></TopHeader>

    <!-- style="overflow: hidden;" -->
    <div class="main section">
      <!-- 预览 -->
      <div class="aside-preview">
        <menu-preview :data="menu" ref="preview"></menu-preview>
      </div>
      <!-- 添加 -->
      <div class="menu-main">
        <div :class="['content-menu-item', {readonly: readonly}]">
          <transition-group name="fade" tag="div">
            <template v-for="(v, i) in menu">
              <Menu :ref="'menu' + i" class="item" :data="v" :key="i" @remove="remove(i)" @add="add" />
            </template>
          </transition-group>

          <template v-if="!readonly">
            <div :class="['add', {more: menu.length}]" @click="add">
              <Icon type="plus-circled" style="vertical-align: text-bottom;" /> 添加菜单
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import menuPreview from './preview.vue'
import Menu from './menu.vue'
import TopHeader from './header.vue'

function validData(data) {
  return data.length ? !data.some(d => !d) : true
}

export default {
  name: 'inner-menu',
  components: {
    TopHeader,
    menuPreview,
    Menu
  },
  props: {
    id: {
      type: String
    },
    // 菜单描述
    description: {
      type: String,
      default: '',
    },
    // 只读（查看）
    readonly: {
      type: Boolean,
      default: false
    },
    // 菜单数据
    menus: {
      type: Array,
      default: () => []
    },
    // 提交接口
    remoteUrl: {
      type: String,
      required: true
    },
    backUrl: {
      type: String,
      required: true
    },
    // 动作类型
    motions: {
      type: Array,
      default: () => []
    },
    // 头部数据
    headerData: {
      type: Object,
      default: null
    },
    customData: {
      type: Object,
      default: null
    }
  },
  provide() {
    return {
      // h5Url: this.h5Url,
      motions: this.motions,
      readonly: this.readonly,
      customParams: this.customData
    }
  },
  data() {
    let _menus = this.menus.length ? this.menus : [{
      order: 1,
      itemName: '',
      itemType: '',
      ruleDesc: '',
      startTime: '',
      endTime: '',
      submenu: []
    }]

    return {
      desc: this.description,
      menu: _menus
    }
  },
  mounted(){
    let header = document.querySelector('.aw-header') || {}
    let subHeader = document.querySelector('.aw-subheader')

    let height = subHeader ? subHeader.clientHeight + header.clientHeight : header.clientHeight || 0

    let title = document.querySelector('.title')
    let preview = document.querySelector('.preview-wrapper')

    title.style.top = height + 'px'

    setTimeout(() => {
      preview.style.top = height + title.clientHeight + 15 + 'px'
    }, 300)

  },
  methods: {
    remove(i) {
      if (this.menu.length <= 1) {
        this.handleMessage("删除失败，父菜单不能少于一个","warning")
      } else {
        this.menu.splice(i, 1)

        this.updateOrder(this.menu)
      }
    },

    updateOrder(data){
      data.forEach((v, i) => {
        v.order = i + 1
      })
    },
    add() {
      if (!this.canAdd()) return this.handleMessage("同一时间段最多仅支持3个一级菜单！","warning")
      this.menu.push({
        order: this.menu.length + 1,
        itemName: '',
        itemType: '',
        ruleDesc: '',
        startTime: '',
        endTime: '',
        submenu: []
      })
    },

    // 验证必填项(通过 .text-require 类名)
    valid() {
      if (!this.desc.trim().length) {
        this.handleMessage("请输入菜单描述","warning")
        return false
      }
      let box = document.querySelector('.content-menu-item')
      let textRequire = box.querySelectorAll('.text-require')
      let inputs = Array.from(textRequire).map(v => {
        return v.querySelector('input') || v.querySelector('textarea')
      })

      return Array.from(inputs).every(v => {
        if (!v.value.trim().length) {
          this.handleMessage(`请输入${v.getAttribute('placeholder') || '动作类型'}`,"warning")
          return false
        } else {
          return true
        }
      })
    },

    canAdd() {
      return this.$refs.preview.canAdd()
    },

    getData() {
      let dd = this.menu.map((v, i) => {
        return this.$refs['menu' + i] ? this.$refs['menu' + i][0].getData() : false
      })

      return validData(dd) ? dd : false
    },

    save() {
      if (!this.valid()) return

      let data = this.getData()
      if (data) {
        let params = {
          id: this.id,
          description: this.desc,
          menus: data
        }

        if(this.headerData){
          let { firm, area, channel } = this.headerData
          params = Object.assign(params, {headerData: {firm, area, channel}})
        }

        if(this.customData){
          let customData = JSON.parse(JSON.stringify(this.customData))
          if(customData.tableParams) delete customData.tableParams

          params = Object.assign(params, { customData })
        }

        console.log('params', params)
        this.submit(params)
      }
    },

    goBack(url){
      this.$root.setUrl(url)
    },

    submit(params) {
      this.$http.post(this.remoteUrl, params).then(res => {
        if(res.status === 200){
          this.handleMessage("保存成功","success")
          setTimeout(() => {
            this.goBack(res.data.screenUrl)
          }, 1200)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },

  },
}

</script>
<style scoped lang="less">
.menu-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.aside-preview {
  width: 380px;
  padding-top: 15px;
}

.title {
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 15px;
  background-color: #fff;
  border-radius: 3px;
  z-index: 9;
}

.act-btn {
  margin-left: 20px;
}

.menu-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 15px 0 0 20px;
  padding: 20px 0;
  background-color: #fff;
  overflow: auto;
  background-color: #fff;
}

.content-menu-item {
  position: relative;
  flex: 1;
  width: 660px;
  &.readonly{pointer-events: none;}
}

.item {
  flex: 1;
  margin: 0 20px 20px;
}

.add {
  position: absolute;
  top: 25%;
  left: 20px;
  right: 20px;
  width: calc(~"100% - 40px");
  padding: 40px;
  border: 1px dashed #cdcdcd;
  background-color: #f2f2f2;
  border-radius: 4px;
  align-self: center;
  text-align: center;
  font-size: 20px;
  color: #0093FF;
  cursor: pointer;
  transition: background-color .15s ease;

  &.more {
    position: static;
    width: initial;
    margin: 0 20px;
    padding: 15px 20px;
    background-color: #fafafa;
    text-align: initial;
    word-spacing: 5px;
  }

  &:hover {
    background-color: #f2f2f2 !important
  }
}

.dec {
  display: flex;
  align-items: center;
  margin: 10px 0 10px 20px;
  &-input {
    width: 200px;
  }
}

.dec-input {
  width: 200px;
}

</style>
