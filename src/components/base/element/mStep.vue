<template>
  <el-steps class="aw-step" :active="current" :process-status	="status" :direction="direction" >
    <el-step v-for="item in data" :key="item.title" :title="item.title" :description="item.content"></el-step>
  </el-steps>
</template>

<script>
/*
<m-step :data="data" status="process" :current="1" direction="vertical"></m-step>
data 数据格式
[
  {
    title: "进行中",
    content: "步骤的描述信息"
  }
]
current 当前步骤 Number
status 状态 wait、process、finish、error、success
direction 位置 横竖  horizontal、vertical
*/
export default {
  name: 'm-step',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    current: Number,
    status: String,
    direction: {
      type: String,
      default: 'horizontal'
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="less">
.aw-step {
  margin:20px;
  // .ivu-icon {
  //   vertical-align: unset;
  // }

  .el-step__main {
    min-height: 50px;
  }

  .el-step__title {
    line-height: 26px!important;
  }
}
  .aw-step.el-steps--vertical .el-step__head {
    margin-right: 10px!important;
  }
</style>