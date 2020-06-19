<template>
  <div class="brandList">
    <div class="menuList">
      <template v-for="(item, index) in menuListData">
        <div class="content" :key="index">
          <Preview :data="item.menu" :headTitle="item.headTitle" :icon="item.icon" />
          <m-link :href="editUrlItem(item.menuId)">
            <button class="btnClass btn-primary edit" type="button">编辑</button>
          </m-link>
          <button class="btnClass btn-primary delete" type="button" @click="deleteMenu(index)">删除</button>
          <div class="menu-name">{{item.menuName}}</div>
        </div>
      </template>
      <div>
        <m-link class="add-menu" :href="addUrlItem">
          <i class="el-icon-circle-plus" style="color:#2d8cf0;font-size:40px;"></i>
          <div style="font-size:16px;font-weight:bold;">添加菜单项</div>
        </m-link>
      </div>
    </div>
    <input type="hidden" :form="form" :name="brandListName" :value="uploadData" />
  </div>
</template>

<script>
import Preview from './preview'

export default {
  name: 'm-brandList-editor',
  components: {
    Preview
  },
  props: {
    form: String,
    brandListName: String,
    data: {
      type: Array,
      default: () => []
    },
    // 新增菜单项，需要传入的id
    pubId: String,
    editUrl: String,
    addUrl: String
  },

  data () {
    return {
      menuListData: this.data,
      uploadData: JSON.stringify(this.data)
    }
  },

  watch: {
    menuListData () {
      this.uploadData = JSON.stringify(this.menuListData)
    }
  },

  computed: {
    editUrlItem() {
      return function(menuId) {
        if(this.editUrl.indexOf("?") != -1) {
          return this.editUrl + '&mId=' + menuId
        } else {
          return this.editUrl + '?mId=' + menuId
        }
      }
    },
    addUrlItem() {
      if(this.addUrl.indexOf("?") != -1) {
        return this.addUrl + '&pId=' + this.pubId
      } else {
        return this.addUrl + '?pId=' + this.pubId
      }
    }
  },

  created () {},

  mounted: function () {
    JSON.stringify
    if (this.form) {
      this.$root.eventBus.$on('form_validate' + this.form, () => {
        this.$validator.validate()
      })
    }
  },

  methods: {
    deleteMenu (index) {
      this.menuListData.splice(index, 1)
    }
  },

  beforeDestroy: function () {}
}
</script>
<style lang="scss" scoped>
.brandList {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 32px 0 10px;

  .menuList {
    display: flex;
    width: 100%;
    padding: 16px;
    overflow: auto;

    .content {
      flex-shrink: 0;
      position: relative;
      width: 380px;
      // height: 600px;
      margin-right: 30px;

      .edit {
        width: 80px;
        position: absolute;
        top: 42%;
        left: 40%;

      }

      .delete {
        width: 80px;
        position: absolute;
        top: 50%;
        left: 40%;

      }

      .menu-name {
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
      }
    }

    .add-menu {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 380px;
      height: 560px;
      border: 1px solid #ccc;
      background: #fff;
    }
    .add-menu:hover {
      cursor: pointer;
    }
  }

  .button-bar {
    display: flex;
    justify-content: flex-end;
    width: 100%;

    .button-item {
      margin-right: 12px ;
    }
  }
}
  .btnClass {
    display: inline-block;
    margin-bottom: 0;
    outline: 0;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    user-select: none;
    padding: 5px 15px 6px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #fff;
    border-color: #dcdee2;
  }
  .btnClass:hover {
    color: #747b8b;
    background-color: #fff;
    border-color: #e3e5e8;
  }
  .btn-primary {
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .btn-primary:hover {
    color: #fff;
    background-color: #57a3f3;
    border-color: #57a3f3;
  }
</style>