<template>
  <Steps class="aw-step" :current="current" :status="status" :direction="direction" >
    <Step v-for="item in data" :key="item.title" :title="item.title" :content="item.content"></Step>
  </Steps>
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
status 状态 wait、process、finish、error
direction 位置 横竖  horizontal、vertical
*/
export default {
  name: "m-step",
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    current: Number,
    status: String,
    direction: {
      type: String,
      default:'horizontal'
    }
  },
  data() {
    return {
 
    }
  }
}
</script>
<style lang="less">
.aw-step {
  margin:20px;
  .ivu-icon {
    vertical-align: unset;
  }

  .ivu-steps-title {
    line-height: 26px!important;
  }
}
  .aw-step.ivu-steps-vertical .ivu-steps-head-inner {
    margin-right: 10px!important;
  }
</style>