<template>
  <div class="preview-wrapper">
    <div class="content">
      <div class="header">
        <span class="logo">
          <img :src="icon" alt="" class="logo-img">
        </span>
        <span class="title">{{headTitle}}</span>
      </div>
      <div class="footer">
        <div class="menus">
          <div class="item" v-for="(index, v) in data" :key="v.itemName" :style="{width: 100/data.length + '%'}">
            <div class="item_title">
              <i v-show="v.submenu && v.submenu.length" class="ivu-icon ivu-icon-navicon" style="vertical-align: sub;font-size:20px;"></i>
              {{v.itemName}}
            </div>
            <ul class="submenu" v-if="v.submenu && v.submenu.length">
              <li v-for="sub in v.submenu" :key="sub.order">
                {{sub.itemName}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'preview',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    showTime: {
      type: Boolean,
      default: true
    },
    headTitle: String,
    icon: String
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.content {
  position: relative;
  width: 100%;
  height: 560px;
  border: 1px solid #ccc;
  background: url(../phone.jpg) no-repeat;
}

.header {
  position: absolute;
  top: 30px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;

  .logo {
    display: inline-block;
    height: 37px;
    width: 37px;
    background: #f7f7f7;

    .logo-img {
      height: 37px;
      width: 37px;
      border-radius: 50%;
    }
  }

  .title {
    padding-left: 12px;
    font-size: 16px;
    font-weight: bold;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 318px;
  height: 47px;
  background-color: #f7f7f7;
}

.menus {
  display: flex;
  height: 100%;
  line-height: 45px;
  align-items: center;
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
}

.item_title {
  line-height: 30px;
  margin-top: 10px;
  border-left: 1px solid #e6e6e6;
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
  & > div{position: absolute;left: 50px;right: 50px;text-align: center;}
}

</style>
