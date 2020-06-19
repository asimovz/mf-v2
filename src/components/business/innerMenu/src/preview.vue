<template>
  <div class="preview-wrapper">
    <div class="content">

      <Logo class="header" v-if="logoInfo" :data="logoInfo" />

      <div class="menu-list">
        <div class="item" v-for="(v, i) in currentData[dateIndex]" :key="v.order" :style="{width: 100/currentData[dateIndex].length + '%'}">
          <div class="item_title" :title="formatDate(v.startTime || '0') + ' ~ ' + formatDate(v.endTime || '1')">
            <!-- <Icon type="navicon" size="20" style="vertical-align: sub"></Icon> -->
            <i v-show="v.submenu && v.submenu.length" class="el-icon-menu"></i>
            {{v.itemName || `父菜单${i + 1}`}}
          </div>
          <ul class="submenu" v-if="v.submenu && v.submenu.length">
            <li v-for="(sub, idx) in v.submenu" :key="sub.order" :title="formatDate(sub.startTime || '0') + ' ~ ' + formatDate(sub.endTime || '1')">
              {{sub.itemName || `子菜单${idx + 1}`}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="time-view">
      <span @click="arrow(-1)" title="从前" :class="{disabled: dateIndex === 0}">
        <i class="el-icon-arrow-left"></i> 从前
      </span>
      <div v-if="dateAxis.length" class="preview-date-axis axis">
        <div class="axis-wrapper" :style="axisStyle">
          <div class="axis-item" v-for="(v, i) in allDateLabel" :key="i">{{v}}</div>
        </div>
      </div>
      <div v-else>从前 ~ 往后</div>
      <span @click="arrow(1)" title="往后" :class="{disabled: dateIndex === (dateAxis.length - 1)}">
        往后 <i class="el-icon-arrow-right"></i>
      </span>
    </div>
  </div>
</template>
<script>

// 上一次切换的index
let arrowIdx = 0

function filterData(date){
  return date.filter(v => v.show)
}
import Logo from './logo.vue'
export default {
  name: 'menu-preview',
  components: { Logo },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    logoInfo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      currentData: [],
      dateAxis: [],
      dateIndex: 0,
    }
  },
  computed: {
    currentAxis(){
      return this.dateAxis[this.dateIndex]
    },

    dateLabel(){
      return this.handlerDate2Label(this.currentAxis)
    },

    axisStyle(){
      return {
        width: this.dateAxis.length  * 288 + 'px',
        transform: `translate3d(${-288 * this.dateIndex}px, 0, 0)`
      }
    },

    allDateLabel(){
      return this.dateAxis.map(axis => {
        return this.handlerDate2Label(axis)
      })
    }

  },
  watch: {
    data: {
      handler(v){
        this.initData(v)
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    initData(val){
      this.getDateAxis(val)
      this.dateIndex = 0
      this.reloadDate()
    },

    handlerDate2Label(axis){
      return (axis[0] ? this.formatDate(axis[0]) : '从前') + ' ~ ' + (axis[1] ? this.formatDate(axis[1]) : '往后')
    },

    // 根据时间轴重载数据
    reloadDate(){
      let arr = []
      for(let i = 0; i < this.dateAxis.length; i ++){
        let data = this.getDataWithDate(this.data, this.dateAxis[i])
        arr.push(filterData(data))
      }
      this.currentData = arr
    },

    // 根据时间轴获取数据
    getDataWithDate(data, dateAxis){
      return data.map(v => {
        if(!v.submenu || !v.submenu.length){
          return {
            ...v,
            show: this.isInAxis(v, dateAxis)
          }
        }else{
          return {
            ...v,
            show: this.isParentShow(v.submenu, dateAxis),
            submenu: filterData(this.getDataWithDate(v.submenu, dateAxis))
          }
        }
      })
    },

    // 子菜单都不在生效时间内，父级不显示
    isParentShow(data, dateAxis){
      return data.some(v => {
        return this.isInAxis(v, dateAxis)
      })
    },

    // 菜单是否在时间轴中生效
    isInAxis(data, axis){
      return !data.startTime
        || (data.startTime >= axis[0] && data.startTime < axis[1])
        || (data.endTime > axis[0] && data.endTime <= axis[1])
        || (axis[0] && data.startTime < axis[0] && axis[1] && data.endTime >= axis[1])
    },

    // 获取时间轴
    getDateAxis(val){
      // 提取生失效时间
      let dateAxisArr = this.dealDates(val)

      // 时间扁平化
      let dateAxisFlat = dateAxisArr.join(',').split(',')

      // 时间排序并过滤无生、失效的时间
      let dateAxisSorted = dateAxisFlat.filter(v => v).sort((a, b) => a - b)

      dateAxisSorted = [...new Set(dateAxisSorted)]

      // 无生效时间限制
      let hasPre = dateAxisFlat.some(v => {
        return !v[0]
      })

      // 无失效时间限制
      let hasNext = dateAxisFlat.some(v => {
        // return !v[1] && Math.max(...dateAxisSorted) === v[0]    // 无失效时间且生效时间为设置的最大时间
        return !v[1]
      })

      // 添加从前、往后
      hasPre && dateAxisSorted.unshift('')
      hasNext && dateAxisSorted.push('')

      // 取两相邻的时间组成时间轴
      let i = 0, len = dateAxisSorted.length - 1, arr = []
      while(i < len){
        arr.push([dateAxisSorted[i], dateAxisSorted[i + 1]])
        i ++
      }

      this.dateAxis = arr
    },

    // 提取生失效时间
    dealDates(data){
      return data.map(v => {
        if(!v.submenu || !v.submenu.length){
          return [v.startTime || '', v.endTime || '']
        }else{
          return [
            [v.startTime || '', v.endTime || ''],
            this.dealDates(v.submenu)
          ]
        }
      })
    },
    canAdd(){
      return !this.currentData.some(v => v.length >= 3)
    },

    // 切换时间轴
    arrow(n){
      arrowIdx = n
      if(this.dateIndex + n > this.dateAxis.length - 1 || this.dateIndex + n < 0) return
      this.dateIndex += n
    },
    formatDate(date){
      if(date === '0'){
        return '从前'
      }else if(date === '1'){
        return '往后'
      }else{
        // let D = new Date(+date)
        let D = reFormat(date)
        let yyyy = D.getFullYear(),
            MM   = D.getMonth() + 1,
            dd   = D.getDate(),
            HH   = D.getHours(),
            mm   = D.getMinutes();

        return `${yyyy}-${MM > 9 ? MM : '0' + MM}-${dd > 9 ? dd : '0' + dd} ${HH > 9 ? HH : '0' + HH}:${mm > 9 ? mm : '0' + mm}`
      }
    }
  }
}

// 兼容 时间戳 与 '2020-5-2 20:20' 这两种格式
function reFormat(date) {
  let _data = new Date(date)
  if(_data instanceof Date && !isNaN(_data.getTime())){
    return new Date(date)   // '2020-5-2 20:20'
  }else{
    return new Date(+date)  // 时间戳(字符串)
  }
}

</script>

<style scoped lang="less">
.preview-wrapper{position: sticky; width: 380px;}
.content {
  position: relative;
  width: 100%;
  height: 560px;
  border: 1px solid #ccc;
  background: url(../phone.jpg) no-repeat;
}

.menu-list {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 63px;
  height: 47px;
  background-color: #f7f7f7;
}

.header{
  position: absolute;top: 30px;left: 50px;right: 46px;height: 45px;background: #f7f7f7;
}

.item {
  position: relative;
  flex: 1;
  height: 100%;
  border: 1px solid transparent;
  list-style: none;
  text-align: center;

  &.active {
    background-color: #fff;
    border: 1px solid green;
    color: green;
  }
  &:not(:first-child) .item_title{border-left: 1px solid #e6e6e6;}
}

.preview-date-axis{flex: 1;text-align: center;overflow: hidden;}
.axis{
  &-wrapper{transition: transform 500ms ease 0s;}
  &-item{float: left;width: 288px;}
}

.item_title {
  line-height: 30px;
  margin-top: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.submenu {
  position: absolute;
  left: 50%;
  bottom: 130%;
  width: 90%;
  background-color: #f7f7f7;
  border: 1px solid #eee;
  transform: translateX(-50%);

  &:before, &:after {
    position: absolute;
    bottom: -10px;
    left: 50%;
    content: '';
    transform: rotateZ(45deg) translateX(-50%);
    content: '';
    width: 10px;
    height: 10px;
    background-color: #f7f7f7;
    border: 1px solid #eee;
  }
  &:after{
    bottom: 0;
    width: 20px;
    margin-left: 2px;
    border: none;
    transform: translateX(-50%);
  }
  li {
    list-style: none;
    height: 40px;
    line-height: 40px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.submenu li:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.time-view{
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  margin: 10px 0;
  & > span{width: 46px;height: 36px;line-height: 34px;text-align: center;/*background-color: #dfdfdf;*/border-radius: 50%;color: #2d8cf0;font-size: 12px;cursor: pointer;
    &.disabled {/*background-color: #eaeaea;*/cursor: not-allowed;color: #aaa;}
    // &:not(.disabled):hover{background-color: #d1d1d1}
  }
}

</style>
