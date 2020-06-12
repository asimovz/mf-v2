<template>
  <div class="brandList">
    <div class="menuList">
      <template v-for="(item, index) in menuListData">
        <div class="content" :key="index">
          <Preview :data="item.menu" :headTitle="item.headTitle" :icon="item.icon" />
          <m-link  :href="editUrl + '?mId=' + item.menuId">
            <Button class="edit" type="primary">编辑</Button>
          </m-link>
          <Button class="delete" type="primary" @click="deleteMenu(index)">删除</Button>
          <div class="menu-name">{{item.menuName}}</div>
        </div>
      </template>
      <div>
        <m-link class="add-menu" :href="addUrl + '?pId=' + pubId">
          <Icon color="#2d8cf0" type="android-add-circle" size="40"/>
          <div style="font-size:16px;font-weight:bold;">添加菜单项</div>
        </m-link>
      </div>
    </div>
    <input type="hidden" :form="form" :name="brandListName" :value="uploadData" />
  </div>
</template>

<script>
import Preview from "./preview";

export default {
  name: "m-brandList-editor",
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

  data() {
    return {
      menuListData: this.data,
      uploadData: JSON.stringify(this.data)
    };
  },

  watch: {
    menuListData() {
      this.uploadData = JSON.stringify(this.menuListData)
    }
  },

  computed: {},

  created() {},

  mounted: function() {
    JSON.stringify
    if (this.form) {
      this.$root.eventBus.$on("form_validate" + this.form, () => {
        this.$validator.validate();
      });
    }
  },

  methods: {
    deleteMenu(index) {
      this.menuListData.splice(index, 1)
    }
  },

  beforeDestroy: function() {}
};
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
</style>