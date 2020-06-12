<template>
  <div :class="classes">
    <div :class="[prefixCls + '-bar']" v-if="!isRadio">
      <div :class="[prefixCls + '-nav-right']" v-if="showSlot">
        <slot name="extra"></slot>
      </div>
      <div :class="[prefixCls + '-nav-container']">
        <div
          ref="navWrap"
          :class="[prefixCls + '-nav-wrap', scrollable ? prefixCls + '-nav-scrollable' : '']"
        >
          <span
            :class="[prefixCls + '-nav-prev', scrollable ? '' : prefixCls + '-nav-scroll-disabled']"
            @click="scrollPrev"
          >
            <i class="ivu-icon ivu-icon-chevron-left"></i>
          </span>
          <span
            :class="[prefixCls + '-nav-next', scrollable ? '' : prefixCls + '-nav-scroll-disabled']"
            @click="scrollNext"
          >
            <i class="ivu-icon ivu-icon-chevron-right"></i>
          </span>
          <div ref="navScroll" :class="[prefixCls + '-nav-scroll']">
            <div ref="nav" :class="[prefixCls + '-nav']" class="nav-text" :style="navStyle">
              <div :class="barClasses" :style="barStyle"></div>
              <div
                :class="tabCls(item)"
                v-for="(item, index) in navList"
                @click="handleChange(index)"
              >
                <i v-if="item.icon !== ''" :class="'ivu-icon ivu-icon-'+item.icon"></i>
                <Render v-if="item.tabLabelContent" :render="item.tabLabelContent"></Render>
                <template v-else>{{ item.label }}</template>
                <i
                  v-if="showClose(item)"
                  class="ivu-icon ivu-icon-ios-close-empty"
                  @click.native.stop="handleRemove(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="el-form-item">
        <label :class="'el-form-item__label el-col-'+radioLayout[0]">{{title}}</label>
        <div :class="'el-form-item__content iel-col-'+radioLayout[1]">
          <m-radio :value="activeKey" :options="radioList" @on-change="radioChange"></m-radio>
        </div>
      </div>
    </template>

    <div :class="contentClasses" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Render from './render'
import elementResizeDetectorMaker from 'element-resize-detector'
import Vue from 'vue'
const prefixCls = 'aw-tabs'
const isServer = Vue.prototype.$isServer
const MutationObserver = isServer ? false : window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false

function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

export default {
  name: 'm-tabs',
  // mixins: [Emitter],
  components: { Render },
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      validator (value) {
        return oneOf(value, ['line', 'card'])
      },
      default: 'line'
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'default'])
      },
      default: 'default'
    },
    // animated: {
    //     type: Boolean,
    //     default: false
    // },
    closable: {
      type: Boolean,
      default: false
    },
    setField: {
      type: String
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      navList: [],
      barWidth: 0,
      barOffset: 0,
      activeKey: this.value,
      showSlot: false,
      navStyle: {
        transform: ''
      },
      scrollable: false,
      animated: false,
      radioList: [],
      radioLayout: this.layout.split(',')
    }
  },
  computed: {
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-card`]: this.type === 'card',
          [`${prefixCls}-border-card`]: this.type === 'border-card',
          [`${prefixCls}-mini`]: this.size === 'small' && this.type === 'line',
          [`${prefixCls}-no-animation`]: !this.animated
        }
      ]
    },
    contentClasses () {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-animated`]: this.animated
        }
      ]
    },
    barClasses () {
      return [
        `${prefixCls}-ink-bar`,
        {
          [`${prefixCls}-ink-bar-animated`]: this.animated
        }
      ]
    },
    contentStyle () {
      const x = this.navList.findIndex(nav => nav.name === this.activeKey)
      const p = x === 0 ? '0%' : `-${x}00%`

      let style = {}
      if (x > -1) {
        style = {
          transform: `translateX(${p}) translateZ(0px)`
        }
      }
      return style
    },
    barStyle () {
      let style = {
        display: 'none',
        width: `${this.barWidth}px`
      }
      if (this.type === 'line') style.display = 'block'
      if (this.animated) {
        style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`
      } else {
        style.left = `${this.barOffset}px`
      }

      return style
    }
  },
  methods: {
    getTabs () {
      // !! 获取slot，让label支持slot自定义
      const paneSlots = this.$slots.default.filter(
        vnode =>
          vnode.tag &&
          vnode.componentOptions &&
          vnode.componentOptions.Ctor.options.name === 'm-tabPane'
      )
      let panes = []
      paneSlots.map((item) => {
        if (item.componentInstance) panes.push(item.componentInstance)
      })
      return panes
      // return this.$children.filter(item => item.$options.name === "m-tabPane");
    },
    updateNav () {
      this.navList = []
      this.radioList = []
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          labelType: typeof pane.label,
          label: pane.label,
          icon: pane.icon || '',
          name: pane.currentName || index,
          disabled: pane.disabled,
          closable: pane.closable,
          tabLabelContent: h => {
            return <span>{pane.$slots.label || pane.label}</span>
          }
        })
        this.radioList.push({
          label: pane.label,
          value: pane.currentName || index
        })
        if (!pane.currentName) pane.currentName = index
        if (index === 0) {
          if (!this.activeKey) this.activeKey = pane.currentName || index
        }
      })

      this.updateStatus()
      this.updateBar()
    },
    updateBar () {
      this.$nextTick(() => {
        const index = this.navList.findIndex(
          nav => nav.name === this.activeKey
        )
        if (!this.$refs.nav) return // 页面销毁时，这里会报错，为了解决 #2100
        const prevTabs = this.$refs.nav.querySelectorAll(`.${prefixCls}-tab`)
        const tab = prevTabs[index]
        this.barWidth = tab ? parseFloat(tab.offsetWidth) : 0

        if (index > 0) {
          let offset = 0
          const gutter = this.size === 'small' ? 0 : 16
          for (let i = 0; i < index; i++) {
            offset += parseFloat(prevTabs[i].offsetWidth) + gutter
          }

          this.barOffset = offset
        } else {
          this.barOffset = 0
        }
        this.updateNavScroll()
      })
    },
    updateStatus () {
      const tabs = this.getTabs()
      if (tabs.length === 0) return
      tabs.forEach(
        tab => (tab.show = tab.currentName === this.activeKey || this.animated)
      )
    },
    tabCls (item) {
      return [
        `${prefixCls}-tab`,
        {
          [`${prefixCls}-tab-disabled`]: item.disabled,
          [`${prefixCls}-tab-active`]: item.name === this.activeKey
        }
      ]
    },
    radioChange (value) {
      let currentIndex
      this.radioList.find((item, index) => {
        if (item.value == value) {
          currentIndex = index
        }
      })
      this.handleChange(currentIndex)
    },
    handleChange (index) {
      const nav = this.navList[index]
      if (nav.disabled) return
      this.activeKey = nav.name
      this.$emit('input', nav.name)
      this.$emit('on-click', nav.name)
      // 如果绑定了字段，tab页的切换会发送tabpanel的name，作为绑定的字段值
      if (this.setField) {
        this.$root.eventBus.$emit(this.setField + '_value_change', nav.name)
      }
    },
    handleRemove (index) {
      const tabs = this.getTabs()
      const tab = tabs[index]
      tab.$destroy()

      if (tab.currentName === this.activeKey) {
        const newTabs = this.getTabs()
        let activeKey = -1

        if (newTabs.length) {
          const leftNoDisabledTabs = tabs.filter(
            (item, itemIndex) => !item.disabled && itemIndex < index
          )
          const rightNoDisabledTabs = tabs.filter(
            (item, itemIndex) => !item.disabled && itemIndex > index
          )

          if (rightNoDisabledTabs.length) {
            activeKey = rightNoDisabledTabs[0].currentName
          } else if (leftNoDisabledTabs.length) {
            activeKey =
              leftNoDisabledTabs[leftNoDisabledTabs.length - 1].currentName
          } else {
            activeKey = newTabs[0].currentName
          }
        }
        this.activeKey = activeKey
        this.$emit('input', activeKey)
      }
      this.$emit('on-tab-remove', tab.currentName)
      this.updateNav()
    },
    showClose (item) {
      if (this.type === 'card') {
        if (item.closable !== null) {
          return item.closable
        } else {
          return this.closable
        }
      } else {
        return false
      }
    },
    scrollPrev () {
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()

      if (!currentOffset) return

      let newOffset =
        currentOffset > containerWidth ? currentOffset - containerWidth : 0

      this.setOffset(newOffset)
    },
    scrollNext () {
      const navWidth = this.$refs.nav.offsetWidth
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      if (navWidth - currentOffset <= containerWidth) return

      let newOffset =
        navWidth - currentOffset > containerWidth * 2
          ? currentOffset + containerWidth
          : navWidth - containerWidth

      this.setOffset(newOffset)
    },
    getCurrentScrollOffset () {
      const { navStyle } = this
      return navStyle.transform
        ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1])
        : 0
    },
    setOffset (value) {
      this.navStyle.transform = `translateX(-${value}px)`
    },
    scrollToActiveTab () {
      if (!this.scrollable) return
      const nav = this.$refs.nav
      const activeTab = this.$el.querySelector(`.${prefixCls}-tab-active`)
      if (!activeTab) return

      const navScroll = this.$refs.navScroll
      const activeTabBounding = activeTab.getBoundingClientRect()
      const navScrollBounding = navScroll.getBoundingClientRect()
      const navBounding = nav.getBoundingClientRect()
      const currentOffset = this.getCurrentScrollOffset()
      let newOffset = currentOffset

      if (navBounding.right < navScrollBounding.right) {
        newOffset = nav.offsetWidth - navScrollBounding.width
      }

      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset =
          currentOffset - (navScrollBounding.left - activeTabBounding.left)
      } else if (activeTabBounding.right > navScrollBounding.right) {
        newOffset =
          currentOffset + activeTabBounding.right - navScrollBounding.right
      }

      if (currentOffset !== newOffset) {
        this.setOffset(Math.max(newOffset, 0))
      }
    },
    updateNavScroll () {
      const navWidth = this.$refs.nav.offsetWidth
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      if (containerWidth < navWidth) {
        this.scrollable = true
        if (navWidth - currentOffset < containerWidth) {
          this.setOffset(navWidth - containerWidth)
        }
      } else {
        this.scrollable = false
        if (currentOffset > 0) {
          this.setOffset(0)
        }
      }
    },
    handleResize () {
      this.updateNavScroll()
    },
    isInsideHiddenElement () {
      let parentNode = this.$el.parentNode
      while (parentNode && parentNode !== document.body) {
        if (parentNode.style && parentNode.style.display === 'none') {
          return parentNode
        }
        parentNode = parentNode.parentNode
      }
      return false
    }
  },
  watch: {
    value (val) {
      this.activeKey = val
    },
    activeKey () {
      this.updateBar()
      this.updateStatus()
      // this.broadcast("Table", "on-visible-change", true);
      this.$nextTick(() => {
        this.scrollToActiveTab()
      })
    }
  },
  mounted () {
    if (!this.isRadio) {
      this.showSlot = this.$slots.extra !== undefined
      this.observer = elementResizeDetectorMaker()
      this.observer.listenTo(this.$refs.navWrap, this.handleResize)

      const hiddenParentNode = this.isInsideHiddenElement()
      if (hiddenParentNode) {
        this.mutationObserver = new MutationObserver(() => {
          if (hiddenParentNode.style.display !== 'none') {
            this.updateBar()
            this.mutationObserver.disconnect()
          }
        })

        this.mutationObserver.observe(hiddenParentNode, {
          attributes: true,
          childList: true,
          characterData: true,
          attributeFilter: ['style']
        })
      }
    }
  },
  beforeDestroy () {
    if (!this.isRadio) { this.observer.removeListener(this.$refs.navWrap, this.handleResize) }
    if (this.mutationObserver) this.mutationObserver.disconnect()
    if (this.setField) { this.$root.eventBus.$off(this.setField + '_value_change') }
  }
}
</script>
<style lang="scss">
.aw-tabs {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  color: #515a6e;
  zoom: 1;
}

.aw-tabs:after,
.aw-tabs:before {
  content: "";
  display: table;
}

.aw-tabs:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0;
}

.aw-tabs-bar {
  outline: 0;
}

.aw-tabs-ink-bar {
  height: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #2d8cf0;
  position: absolute;
  left: 0;
  bottom: 1px;
  z-index: 1;
  -webkit-transition: -webkit-transform 0.3s ease-in-out;
  transition: -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
}

.aw-tabs-bar {
  border-bottom: 1px solid #dcdee2;
  margin-bottom: 16px;
}

.aw-tabs-nav-container {
  margin-bottom: -1px;
  line-height: 1.5;
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  zoom: 1;
}

.aw-tabs-nav-container:after,
.aw-tabs-nav-container:before {
  content: "";
  display: table;
}

.aw-tabs-nav-container:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0;
}

.aw-tabs-nav-container:focus {
  outline: 0;
}

.aw-tabs-nav-container:focus .aw-tabs-tab-focused {
  border-color: #57a3f3 !important;
}

.aw-tabs-nav-container-scrolling {
  padding-left: 32px;
  padding-right: 32px;
}

.aw-tabs-nav-wrap {
  overflow: hidden;
  margin-bottom: -1px;
}

.aw-tabs-nav-scroll {
  overflow: hidden;
  white-space: nowrap;
}

.aw-tabs-nav-right {
  float: right;
  margin-left: 5px;
}

.aw-tabs-nav-prev {
  position: absolute;
  line-height: 32px;
  cursor: pointer;
  left: 0;
}

.aw-tabs-nav-next {
  position: absolute;
  line-height: 32px;
  cursor: pointer;
  right: 0;
}

.aw-tabs-nav-scrollable {
  padding: 0 12px;
}

.aw-tabs-nav-scroll-disabled {
  display: none;
}

.aw-tabs-nav {
  padding-left: 0;
  margin: 0;
  float: left;
  list-style: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  -webkit-transition: -webkit-transform 0.5s ease-in-out;
  transition: -webkit-transform 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out, -webkit-transform 0.5s ease-in-out;
}

.aw-tabs-nav:after,
.aw-tabs-nav:before {
  display: table;
  content: " ";
}

.aw-tabs-nav:after {
  clear: both;
}

.aw-tabs-nav .aw-tabs-tab-disabled {
  pointer-events: none;
  cursor: default;
  color: #ccc;
}

.aw-tabs-nav .aw-tabs-tab {
  display: inline-block;
  height: 100%;
  padding: 8px 16px;
  margin-right: 16px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  -webkit-transition: color 0.3s ease-in-out;
  transition: color 0.3s ease-in-out;
}

.aw-tabs-nav .aw-tabs-tab:hover {
  color: #57a3f3;
}

.aw-tabs-nav .aw-tabs-tab:active {
  color: #2b85e4;
}

.aw-tabs-nav .aw-tabs-tab .ivu-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.aw-tabs-nav .aw-tabs-tab-active {
  color: #2d8cf0;
}

.aw-tabs-mini .aw-tabs-nav-container {
  font-size: 14px;
}

.aw-tabs-mini .aw-tabs-tab {
  margin-right: 0;
  padding: 8px 16px;
  font-size: 12px;
}

.aw-tabs .aw-tabs-content-animated {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  will-change: transform;
  -webkit-transition: -webkit-transform 0.3s ease-in-out;
  transition: -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
}

.aw-tabs .aw-tabs-tabpane {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 100%;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
  opacity: 1;
  outline: 0;
}

.aw-tabs .aw-tabs-tabpane-inactive {
  opacity: 0;
  height: 0;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-nav-container {
  height: 32px;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-ink-bar {
  visibility: hidden;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab {
  margin: 0;
  margin-right: 4px;
  height: 31px;
  padding: 5px 16px 4px;
  border: 1px solid #dcdee2;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  background: #f8f8f9;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab-active {
  height: 32px;
  padding-bottom: 5px;
  background: #fff;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  border-color: #dcdee2;
  color: #2d8cf0;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-nav-wrap {
  margin-bottom: 0;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab .ivu-icon-ios-close {
  width: 0;
  height: 22px;
  font-size: 22px;
  margin-right: 0;
  color: #999;
  text-align: right;
  vertical-align: middle;
  overflow: hidden;
  position: relative;
  top: -1px;
  -webkit-transform-origin: 100% 50%;
  -ms-transform-origin: 100% 50%;
  transform-origin: 100% 50%;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab .ivu-icon-ios-close:hover {
  color: #444;
}

.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab-active .ivu-icon-ios-close,
.aw-tabs.aw-tabs-card > .aw-tabs-bar .aw-tabs-tab:hover .ivu-icon-ios-close {
  width: 22px;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  margin-right: -6px;
}

.aw-tabs-no-animation > .aw-tabs-content {
  -webkit-transform: none !important;
  -ms-transform: none !important;
  transform: none !important;
}

.aw-tabs-no-animation > .aw-tabs-content > .aw-tabs-tabpane-inactive {
  display: none;
}

// border-card
.aw-tabs.aw-tabs-border-card{
  
  border:1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  .aw-tabs-nav-scroll{
    margin-bottom: -1px;
  }
  .aw-tabs-bar{
    margin: 0;
  }
  .aw-tabs-tab{
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    border: 1px solid transparent;
    color: #909399;
    margin: -1px 0 0 -1px;
  }
  .aw-tabs-nav-wrap{
    overflow: unset;
    margin-bottom: 0;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
  }
  .aw-tabs-nav{
    .aw-tabs-tab-active{
      color: #409eff;
      background-color: #fff;
      border-right-color: #dcdfe6;
      border-left-color: #dcdfe6;
    }
  }
}

</style>