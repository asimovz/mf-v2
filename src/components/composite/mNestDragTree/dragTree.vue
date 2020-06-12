<template>
  <div class="nest-tree-root" :id="id">
    <!--    <template v-if="mode=='update'">
      <div style="border:3px solid #ccc;position: fixed;top:100px;right:5px;z-index: 1919999;width:30vw; height: calc(99% - 100px); overflow: auto">
        <pre>{{JSON.stringify(jsonData, null, 2)}}</pre>
      </div>
    </template> -->
    <tree-node ref="tree" :data="data" :template="template">
      <template slot-scope="{item}" slot="treeItem" v-if="template">
        <slot :item="item" name="treeItem"></slot>
      </template>
    </tree-node>
  </div>
</template>
<script>
import treeNode from './dragTreeNode'
let $S = require('assets/js/script.js')
const jsArr = [
  "/static/js/jquery.nestable.js",
]

export default {
  name: 'm-drag-tree',
  components: {
    treeNode
  },
  props: {
    group: Number,
    maxDeep: {
      type: Number,
      default: 3
    },
    mode: {
      type: String,
      default: ''
    },
    subLevel: {
      type: Boolean,
      default: true
    },
    data: Array,
    id: String,
    fromId: String
  },

  data() {
    return {
      tree: null,
      template: false,
      isUpdate: this.mode == "update",
      jsonData: this.data ? this.data : []
    }
  },
  computed: {
    options() {
      let opt = {}
      if (this.group) opt.group = this.group
      if (this.mode == "clone") opt.isClone = true
      if (this.mode == "edit") opt.isDelete = true
      if (!this.subLevel) opt.isSubLevel = this.subLevel
      if (this.fromId) opt.formId = this.fromId
      return opt
    }
  },
  watch: {
    data() {
      this.jsonData = this.data
      $S.ready('nestTree', () => {
        this.$nextTick(function() {
          this.tree.nestable(this.options)
            .on("change", this.update)
        })
      })
    }
  },
  mounted: function() {
    this.template = Object.keys(this.$scopedSlots).length > 0
    this.tree = $(this.$el)
    $S(jsArr, 'nestTree')
  },
  methods: {
    update() {
      let data = this.tree.nestable("serialize")
      this.jsonData = data
      this.$emit("updateTree", data)
    }
  }
}

</script>
<style>
/* =========== 拖拽菜单树 ============= */
.nest-tree-root {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 菜单组 */
.nest-tree-group {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nest-tree-group .nest-tree-group {
  padding-left: 26px;
}

/* 空框样式 */
.nest-tree-root .nest-tree-empty {
/*  border: 1px dashed #bbb;
  min-height: 60px;
  background-color: #e5e5e5;*/
  /*background-image: linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);*/
/*  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;*/
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nest-tree-root .nest-tree-empty:before {
  content: "拖拽菜单到此处";
  font-size: 20px;
  color: #999
}

/* 拖动占位DIV */
.nest-tree-root .nest-tree-placeholder {
  min-height: 32px;
  margin: 5px 0;
  padding: 0;
  background: #f2fbff;
  border: 1px dashed #b6bcbf;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

/* 菜单项 */
.nest-tree-group .nest-tree-item {
  line-height: 32px;
  margin: 5px 0;
  position: relative;
}

.nest-tree-group .nest-tree-item:after {
  clear: both;
}

/* 菜单展开收缩 */
.nest-tree-item .nest-collapse {
  display: inline-flex;
  float: left;
  align-items: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  font-size: 0;
  width: 16px;
}

.nest-tree-item .nest-collapse:before {
  content: '+';
  font-size: 20px;
}

.nest-tree-item>.nest-collapse[data-action="collapse"]:before {
  content: '-';
}


/* 拖动手柄 */
.nest-tree-move-hand+.nest-collapse,
.nest-tree-move-hand+.nest-collapse+.nest-collapse {
  /*margin-left: -10px;*/
}

.nest-tree-group .nest-tree-move-hand {
  display: inline-flex;
  /*width: 25px;*/
  background: #94c6ff;
  justify-content: center;
  align-items: center;
  cursor: move;
  float: left;
  padding:0 10px;
  margin-right: 8px;
  border-radius:4px 0 0 4px;
}

.nest-tree-group .nest-tree-move-hand:before {
  content: '≡';
  display: inline-block;
  color: #fff;
  font-size: 18px;
  font-weight: normal;
}

.nest-nodrag>.nest-tree-move-hand {
  opacity: .3;
}


/* 菜单项内容box */
.nest-tree-group .nest-tree-content {
  display: block;
  background: #fff;
  border-radius: 4px;
}

/* 菜单移出 */
.nest-tree-group .nest-move-out {}

/* 菜单透明 */
.nest-tree-group .nest-opacity>.nest-tree-content,
.nest-tree-group .nest-opacity>.nest-tree-move-hand,
.nest-tree-group .nest-opacity>.nest-collapse {
  opacity: .3;
}

.nest-tree-group .nest-tree-item .nest-delete {
  position: absolute;
  display: inline-flex;
  width: 30px;
  color: #f99;
  justify-content: center;
  align-items: center;
  top: -1px;
  right: 0;
  cursor: pointer;
  font-size: 18px;
  border-radius: 0 4px 4px 0;
}

.nest-tree-group .nest-tree-item .nest-delete:hover {
  background: #f99;
  color: #FFF;
}

.nest-tree-group .nest-tree-item .nest-delete:before {
  content: "×";
}

/* 拖拽时 */
.nest-dragel>.nest-tree-item {
  margin: 0;
}

.nest-dragel {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}
</style>
