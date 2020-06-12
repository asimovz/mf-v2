### mCollapse 折叠面板

#### 概述
将内容区域折叠/展开

#### 代码示例

```html
<template>
    <m-collapse
        :accordion='accordion'
        :value='value'
        :type='type'
        :allowFold='allowFold'>
    </m-collapse>
</template>
<script>
    import mCollapse from '/src/components/baseComponents/iview/mCollapse'
    export default{
        data(){
            return {
                accordion:true,
                value:'',
                type:'',
                allowFold:false
            }
        },
        components:{
            mCollapse:mCollapse
        }
    }
</script>
```

#### API
props

| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | :------: | :------: |
| accordion | 是否开启手风琴模式，开启后每次至多展开一个面板 | Boolean | false|
| value | 当前激活的面板的 name 可使用 v-model 双向绑定 | Array/String | - |
| type | 根据type不同指定title的颜色 | String | - |
| allowFold | 是否允许折叠 | Boolean | false |