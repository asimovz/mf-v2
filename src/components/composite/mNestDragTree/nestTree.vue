<template>
  <div class="aw-nest-tree-wrapper">
    <m-button type="success" text="保存菜单" size="default" @click.native="save"></m-button>
    <div class="aw-nest-tree-row" ref="treeBox">
      <div class="cloumn">
        <div class="cloumn-title">默认菜单</div>
        <div class="nest-tree-box scrollbar">
          <nest-drag-tree id="left" mode="edit" :data="treeData">
            <template slot-scope="{item}" slot="treeItem">
              <div class="nest-template">
                <div class="menu-title">{{item.title}}</div>
                <!-- <i class="menu-handle ivu-icon ivu-icon-android-create" @click="edit(item,$event)"></i> -->
                <!-- <i :class="'nest-item-icon ivu-icon ivu-icon-' + item.image "></i> -->
              </div>
            </template>
          </nest-drag-tree>
        </div>
      </div>
      <Icon class="arrow" type="arrow-swap"></Icon>
      <div class="cloumn">
        <div class="cloumn-title">自定义菜单</div>
        <div class="nest-tree-box scrollbar">
          <nest-drag-tree id="right" from-id="left" class="edit-nset-tree" mode="update" :data="menuData" @updateTree="updateData" ref="customTree">
            <template slot-scope="{item}" slot="treeItem">
              <div class="nest-template">
                <!-- <i :class="'nest-item-icon ivu-icon ivu-icon-' + item.image "></i> -->
                <div class="menu-title">{{item.title}}</div>
                <span class="nest-delete"></span>
                <!-- <i class="menu-handle ivu-icon ivu-icon-android-create" @click="edit(item,$event)"></i> -->
              </div>
            </template>
          </nest-drag-tree>
        </div>
      </div>
    </div>


    <Modal v-model="isEdit" class="nest-modal" title="编辑菜单" @on-ok="ok" @on-cancel="cancel">
      <Row :gutter="16">
        <Col span="8">选择图标</Col>
        <Col span="16">菜单文字</Col>
      </Row>
      <Row :gutter="16" style="margin-top:5px">
        <Col span="8">
        <Select v-model="currentMenuData.image">
          <template v-for="(item,key) in iconListData">
            <Option :key="key" :value="item.value" :label="item.icon">
              <Icon :type="item.value" size="20"></Icon>
              <span class="icon_text">{{item.icon}}</span>
            </Option>
          </template>
        </Select>
        </Col>
        <Col span="16">
        <Input v-model="currentMenuData.title" />
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import nestDragTree from "./dragTree";
import { treeData } from "./data.js";
export default {
  name: "m-nest-tree",
  props: {
    saveUrl: String,
    userData: {
      type: Array,
      default: null
    },
    loadParam: Object
  },
  components: {
    nestDragTree
  },
  data() {
    return {
      isEdit: false,
      treeData: [],
      rootNode: {},
      dragCustomData: this.userData && this.userData[0].children,
      currentMenuData: {
        text: "",
        icon: ""
      },
      menuData: [],
      currentEl: null,
      iconListData: [{
          icon: "folder",
          value: "folder"
        },
        {
          icon: "filing",
          value: "filing"
        },
        {
          icon: "tshirt",
          value: "tshirt"
        },
        {
          icon: "social-buffer",
          value: "social-buffer"
        }
      ]
    };
  },
  computed: {},
  created: function() {
    //获取菜单
    this.$http.get("/getMenuItemsByUserGroup", { params: this.loadParam }).then(response => {
      let newMenuData = response.data;
      this.rootNode = newMenuData[0];
      this.treeData = this.rootNode.children;
      this.menuData = this.userData != null && this.userData.length > 0 ? this.userData[0].children : null;
    });
  },
  mounted() {
    let bodyHeight = document.body.getBoundingClientRect().height
    let boxTop = this.$refs.treeBox.getBoundingClientRect().top
    let currentHeight = bodyHeight - boxTop - 50
    this.$refs.treeBox.style.height = currentHeight + "px"
  },
  methods: {
    ok() {
      this.currentEl.dataset.title = this.currentMenuData.title;
      this.currentEl.dataset.image = this.currentMenuData.image;
      this.currentEl.querySelector(
        ".title"
      ).innerHTML = this.currentMenuData.title;
      // this.currentEl
      //     .querySelector(".nest-icon")
      //     .classList.add("ivu-icon-" + this.currentMenuData.image);
      this.currentEl = null;
      this.$refs.customTree.update();
    },
    cancel() {
      this.isEdit = false;
    },
    edit(data, event) {
      this.currentMenuData = data;
      this.currentEl = event.target.parentNode.parentNode;

      this.isEdit = true;
    },
    updateData(data) {
      this.dragCustomData = data;
    },
    save() {
      this.rootNode.children = this.dragCustomData;
      // console.log([this.rootNode])
      let postParams = this.getUrlParams();
      postParams.customMenuJson = [this.rootNode];
      let postUrl = "";
      if (this.saveUrl.indexOf("?") != -1) {
        postUrl = this.saveUrl.split("?")[0];
      } else {
        postUrl = this.saveUrl;
      }
      this.$root.$http.post(postUrl, postParams).then(
        response => {
          if (response.data || response.status == 200) {
            let message = "用户组菜单树保存成功！";
            this.handleNotice(message, "success");
          }
        },
        error => {
          this.handleNotice(error.errors, "error");
          // error callback
        }
      );
    },
    getUrlParams() {
      let paramsObj = {};
      let params = [];
      if (this.saveUrl.indexOf("?") != -1) {
        let paramStr = this.saveUrl.split("?")[1];
        params = paramStr.split("&");
        for (let i = 0; i < params.length; i++) {
          paramsObj[params[i].split("=")[0]] = unescape(
            params[i].split("=")[1]
          );
        }
      }
      return paramsObj;
    }
  }
};

</script>
<style lang="less">
.aw-nest-tree-wrapper {
  .aw-nest-tree-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin:10px 0;
    height:500px;
    .arrow {
      margin:0 20px;
      font-size: 24px;
      color: #ccc
    }
    .cloumn {
      width: 45%;
      height: 100%;
      background: #f9fafc;
      border: 1px solid #dcdee2;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      .cloumn-title {
        text-align: center;
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #dcdee2;
      }
      .nest-tree-box {
        flex:1;
        background:#f0f3f7;
        border-radius: 0 0 6px 6px;
        min-height: 400px;
        overflow-x: hidden;
        padding:5px 10px;
      }
    }
  }
}

.nest-template {
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content: space-between;
  margin-right: 30px;
  .menu-icon {
    display: inline-block;
    text-align: center;
    font-size: 16px;
    color: #9a9a9a;
    background: #ccc;
    width: 24px;
  }
  .menu-title {
    flex:1;
    height: 32px;
    overflow: hidden;
    line-height: 35px;
    font-size: 14px;
  }
  .menu-handle {
    width: 30px;
    line-height: 32px;
    text-align: center;
    color: #94c6ff;
    display: none;
    &:hover {
      background: #f99;
      color: #FFF;
    }
  }
}


.edit-nset-tree .menu-handle {
  display:block;
}

.nest-modal .icon_text {
  float: right;
  color: #ccc;
}

</style>
