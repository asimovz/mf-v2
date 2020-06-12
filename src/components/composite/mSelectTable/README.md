### mSelect 下拉表格选择

#### 概述
主要用于展示、选择大量结构化数据

#### 代码示例

```html
<template>
    <m-select
        :id='id'
        :name='name'
        :value='value'
        :data='data'
        :column='column'
        :multiple='multiple'
        :maxSelect='maxSelect'
        :keyField='keyField'
        :valueField='valueField'
        :searchField='searchField'
        :title='title'
        :placeholder='placeholder'
        :pagination='pagination'
        :pageSize='pageSize'
        :form='form'
        :fieldTitle='fieldTitle'
        :validate='validate'
        :validateMsg='validateMsg'>
    </m-select>
</template>
<script>
    import mSelect from '/src/components/baseComponents/iview/mSelect'
    export default{
        data(){
            return {
                id:'select',
                name:'select',
                value:'',
                data:[{
                    id:1 ,
                    name:'The People\'s Republic of China',
                    desc:'中华人民共和国'
                }],
                column:[{
                    title: 'id',
                    data: 'id'
                },{
                    title: 'name',
                    data: 'name'
                },{
                    title: 'desc',
                    data: 'desc'
                }],
                multiple:false,
                maxSelect:1,
                keyField:'',
                valueField:'',
                searchField:'',
                title:'请选择',
                placeholder:'请选择',
                pagination:true,
                pageSize:10,
                form:'select',
                fieldTitle:'',
                validate:{
                    required:true,
                    regex:/^[0-9]+$/
                },
                validateMsg:'请做出正确的选择'
            }
        },
        components:{
            mSelect:mSelect
        }
    }
<script>
```

#### API
props

| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | :------: | :------: |
| id | id值 | String | - |
| name | 组件名称 | String | - |
| value | 组件值 | String | - |
| data | 选择的数据集 [{id:1 ,name:'The People\'s Republic of China',desc:'中华人民共和国'}] | Array/String | [] |
| column |  表格模式下的列头 [{title: 'id',data: 'id'},{title: 'name',data: 'name'},{title: 'desc',data: 'desc'}] | Array | [] |
| multiple | 是否多选 | Boolean | false |
| maxSelect | 最多选择个数 | Number | 0 |
| keyField | key值对应的字段 | String | - |
| valueField | value值所对应的字段 | String| - |
| searchField | 搜索所对应的字段 | String | - |
| title | 列头显示文字 | String | '请选择' |
| placeholder | 占位符 | String | '请选择' |
| pagination | 是否分页 | Boolean | false |
| pageSize | 每页显示条数 | Number | 10 |
| form | 组件form属性 | String | - |
|fieldTitle | 下拉表格的标题 | String | - |
| validate | 设置v-validate的值，用于规定表单验证规则 | Object/String | - |
| validateMsg | 显示验证结果的信息 | String | -|