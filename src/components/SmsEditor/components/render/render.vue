<template>
    <div class="widget-wrapper" :data-type="data.type">
      <!-- 组合 -->
      <div v-if="data.type=='group'" ref="widget" :class="[{'group--selected':data.id == selectWidgetId}]">
        <component :selected="data.id == selectWidgetId" :select-widget-id="selectWidgetId" is="widgetGroup" :group="listIndex" :data="data"></component>
      </div>
      <!-- 基础组件 -->
      <div v-else :class="['widget-border',{'widget--selected':data.id == selectWidgetId,'noText':data.type != 'text'}]" ref="widget" @click.stop="selectWidget">
        <component  :is="setCompWidget(data)" @edit="setWidgetState" :data="data" v-bind="data.props" v-on="$listeners"></component>
      </div>

      <!-- 操作 -->
      <div class="widget-group-handle" ref="handleBox" v-if="data.type=='group'">
        <span :class="['move','drag-widget',{'cursor-grabbing':isDragGroup}]"  @mousedown.capture="dropGroup">
          <editor-icon name="yidong" size="14" />
        </span>
        <span :class="[{'selected':data.id == selectWidgetId}]" @click.stop="selectGroup"><i style="font-weight:700" class="el-icon-check"></i></span>
        <span class="delete"><editor-icon name="shanchu" size="12" @click.native="handleDel" /></span>
      </div>

      <div class="widget-handle" ref="handleBox" v-if="data.type!='group' && data.id == selectWidgetId && !isEdit">
        <editor-icon class="move drag-widget" name="yidong" size="14" />
        <editor-icon class="del"  name="shanchu" size="14" @click.native="handleDel" />
      </div>

  </div>
</template>
<script>
import {widgetGroup,widgetText,widgetImage,widgetVideo, widgetAudio}  from "../widget-comps"

export default {
  props:{
    listIndex: Number,
    data: Object,
    selectWidgetId: [String,Number],
    isGroup: Boolean,
  },
  components: {
    widgetGroup,widgetText,widgetImage,widgetVideo, widgetAudio
  },
  inject:['setSelectWidget','setSelectGroup','delWidget'],
  data() {
    return {
      compData: this.data,
      isEdit: false,
      isDragGroup: false
    }
  },   
  computed: {
    type() {
      return this.compData.type
    }
  },
  watch: {
		data: {
      handler(val) {
        this.compData = val
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    
  },
  methods: {
    dropGroup() {
      this.isDragGroup = true
      document.onmouseup = () => {
        this.isDragGroup = false
      }
    },
    selectGroup() {
      this.setSelectGroup(this.compData,{
        evt:this.$refs.widget,
        index:this.listIndex
      })
    },
    setWidgetState(val) {
      this.isEdit = val
    },
    selectWidget() {
      if(this.isGroup) {
        this.setSelectWidget(this.compData,{
          isGroup: this.isGroup
        })
      } else {
        this.setSelectWidget(this.compData,{
          evt:this.$refs.widget,
          index:this.listIndex,
          isGroup: this.isGroup,
          group:this.group
        })
      }
    },
    // 判断组件类型
    setCompWidget(data) {
      return `widget-${data.type}`
    },

    handleDel(){
      let msg = this.compData.type == "group" ? `确定删除此组合?` : `确定删除此${this.compData.title}?`
      this.$confirm(msg, '提示', {
        type: 'warning'
      }).then(async () => {
        this.$emit("del")
      }).catch(() => {
      });
      
    }
  }
}
</script>

<style lang="scss" >
$primary-color: #5D78FF; // #409EFF;
$primary-background-color: #ecf5ff;
@mixin widgethandle {
  // position: absolute;
  background: #5D78FF;
  color: #fff;
}
.widget-wrapper {
  padding: 0px;
  position: relative;
  margin-left: -100px;
  padding-left: 100px;
  user-select: none;
  .widget-border {
    cursor: pointer;
    border: 1px dashed transparent;
  }
  .noText {
    font-size: 0;
  }
 .widget-handle {
    @include widgethandle;
    position: absolute;
    right:0px;
    top: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 19;
    span {
      display: inline-block;
      padding:4px;
      color: #fff;
      &:hover {
        text-decoration: none;
        background: #3e54c1;
      }
    }
    .move {
      cursor: grab;
    }
  }    
}
.widget--selected {
   border: 1px dashed #CFD7FF!important;
}
.group--selected {
   border: 2px solid #5D78FF;
}

.widget-group-handle {
  position: absolute;
  left: 0;
  top:0;
  display: flex;
  flex-direction: column;
  &::before {
    content:"";
    border-top: 2px solid #C8CDD0;
    position: absolute;
    width: 75px;
    top: 11px;
    right: -75px;
  }
  .move {
    cursor: grab;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        height: 2px;
        width: 380px;
        top: -2px;
        left: 0;

    }
  }
  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 100%;
    border:2px solid #b5b9bd;
    margin-bottom: 10px;
    color: #b1b1b1;
    cursor: pointer;
  }
  .selected {
    color: #5D78FF;
    border-color: #5D78FF;
  }
}
.cursor-grabbing {
  cursor: grabbing!important;
}
</style>