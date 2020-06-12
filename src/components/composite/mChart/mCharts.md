## mCharts 组件

接收描述性数据格式
  columns 为所有指标名称的数组
  rows 为按某些维度输入的各指标数据对象，如某日期下的”发送量、数据量...“等信息

全局配置项

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| type | 图表类型 | strin | default: 'line', 图表类型 目前为止支持的图表 histogram(柱状图), bar(条形图), line(折线图), pie(饼图), treemap(矩阵树图) |
| chartHeight | 图表的高度 | string,number | 类型为number时，单位为px |
| data | 数据源配置 | object,string | 可设置为数据接口地址，此时类型为string |
| settings | 图表常用配置项 | object | 详见每个图表组件帮助 |
| extend | 扩展的配置项 | object | 可接收完成的echart配置，优先级最高，用于覆盖默认配置及其他高级自定义功能 |
| ... | 支持其他vue-charts配置项 | ... | 详见vue-charts帮助文档 |

### 矩阵树图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| breadcrumbVisible | 是否显示面包屑导航 | boolean | default:false |

```
  <mCharts type="treemap" :data="treemap"></mCharts>

  export default {
    data(){
      return {
        treemap: {
          rows: [
            {'name': '极速放款', 'value': 109,
              children: [
                {'name': '子节点1', 'value': 40},
                {'name': '子节点2', 'value': 90}
              ]
            },
            {'name': '极速贷款', 'value': 117},
            {'name': '还款提醒', 'value': 218},
            {'name': '低息借款', 'value': 163},
            {'name': '办信用卡', 'value': 139},
            {'name': '急速贷款', 'value': 101}
          ]
        }
      }
    }
  }
```

### 折线图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| dimension | 自定义维度 | array | conlumns第一项为默认维度，双x轴时可能需要设置两个维度，目前最大支持两个维度设置 |
| metrics | 自定义指标 | array | conlumns排除第一项之外的其他项目为默认指标，默认全部显示，可通过配置此字段过滤掉部分指标 |
| axisSite | 配置各项指标所在的轴 | object | 双Y轴时可分别配置两轴上的指标 {left: ['左侧指标1'], right: ['右侧指标1']} |
| xAxisType | x轴的类型 | string | X轴的类型，默认为类目轴 category |
| yAxisName | 配置Y轴的名称 | array | ['左Y轴名称','右Y轴名称'] |
| stack | 配置堆叠规则 | object | default:undefined, 配置哪些维度需要堆叠显示，如 stack = "{'总量': ['维度1','维度2']}" 表示维度1和维度2将1️以总量的方式进行堆叠显示 |
| area | 是否展示位面积图 | boolean | default:false |
| scale | 左右Y轴是否是脱离 0 值比例 | array | default:[false, false], 数组项分别代表左右Y轴的scale配置，详细说明参照 echarts配置项 yAxis.scale |
| labelMap | 配置维度别名映射关系 | object | 当数据维度名称为字段名时，可以通过配置别名映射关系的方式，将展示名称显示为别名。如：labelMap={key1: '发送量'}，将key1这个维度使用发送量这个名称显示 |
| legendName | 配置图例别名映射关系 | object | 需要注意，当你已经使用了labelMap配置重置了维度别名事，此时需使用新的维度名称配置映射。如上面我们把key1映射为’发送量‘，此时的图例映射关系应为  legendName="{'发送量': '新的图例名称'}" |
| nullAddZero | 将数据中的假值设置0 | boolean | default:false, 默认情况下假设后端不会返回假值数据，并不会对假值进行处理。如遇特殊情况才需要配置 |


```
  <!-- 单Y轴 -->
  <mCharts type="line" :data="line" :settings="{yAxisName: ['单位(万)']}"></mCharts>

  <!-- 双Y轴 -->
  <mCharts type="line" :data="line" :settings="{axisSite: { right: ['发送量'] }, yAxisName: ['总量', '占比']}"></mCharts>

  export default {
    data(){
      return {
        line: {
        columns: ['日期', '发送量', '退定量', '接收量'],
          rows: [
            { '日期': '2020.5.1', '发送量': 1393, '退定量': 1093, '接收量': 0.32 },
            { '日期': '2020.5.2', '发送量': 3530, '退定量': 3230, '接收量': 0.26 },
            { '日期': '2020.5.3', '发送量': 2923, '退定量': 2623, '接收量': 0.76 },
            { '日期': '2020.5.4', '发送量': 1723, '退定量': 1423, '接收量': 0.49 },
            { '日期': '2020.5.5', '发送量': 3792, '退定量': 3492, '接收量': 0.32 },
            { '日期': '2020.5.6', '发送量': 4593, '退定量': 4293, '接收量': 0.78 }
          ]
        },
      }
    }
  }
```

### 饼图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| dimension | 自定义维度 | array | conlumns第一项为默认维度，双x轴时可能需要设置两个维度，目前最大支持两个维度设置 |
| metrics | 自定义指标 | array | conlumns排除第一项之外的其他项目为默认指标，默认全部显示，可通过配置此字段过滤掉部分指标 |
| legendLimit | 显示图例数量限制 | number | defulat: 30 |
| selectedMode | 选中模式 | string | default: false,详细说明查看echarts文档 series-pie.selectedMode 配置项 |
| hoverAnimation | hover时扇区放大 | boolean | default: true |
| radius | 饼图半径 | number | default: 100 |
| offsetY | 纵向偏移量 | number | default: 200 |
| limitShowNum | 最多显示多少个扇形区域，超过此数量后，剩余数据在其他中显示 | number | default: 0, 为0时不做限制 |
| legendName | 配置图例别名映射关系 | object | 可以通过配置图例名称映射关系对展示图例名进行修改  legendName="{'发送量': '新的图例名称'}" |

```
  <mCharts type="pie" :data="pie"></mCharts>

  export default {
    data(){
      return {
        pie: {
          columns: ['手机品牌', '用户'],
          rows: [
            {'手机品牌': '苹果', '用户': 325}, 
            {'手机品牌': '华为', '用户': 310}, 
            {'手机品牌': '三星', '用户': 332}, 
            {'手机品牌': '魅族', '用户': 108}, 
            {'手机品牌': '小米', '用户': 127}, 
            {'手机品牌': '锤子', '用户': 136}, 
            {'手机品牌': 'opp', '用户': 332}, 
            {'手机品牌': '联想', '用户': 305}, 
            {'手机品牌': '奇酷', '用户': 152},
            {'手机品牌': '诺基亚', '用户': 275}
          ]
        }
      }
    }
  }
```

### 柱状图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| dimension | 自定义维度 | array | conlumns第一项为默认维度，双x轴时可能需要设置两个维度，目前最大支持两个维度设置 |
| metrics | 自定义指标 | array | conlumns排除第一项之外的其他项目为默认指标，默认全部显示，可通过配置此字段过滤掉部分指标 |
| axisSite | 配置各项指标所在的轴 | object | 双X轴时可分别配置两轴上的指标 {top: ['top轴指标1'],bottom:['bottom轴指标1']} |
| xAxisType | x轴的类型 | string | X轴的类型，默认为类目轴 category |
| scale | 数值轴是否是脱离 0 值比例 | array | default:[false, false], 数组项分别代表数值轴轴的scale配置，详细说明参照 echarts配置项 yAxis.scale |
| labelMap | 配置维度别名映射关系 | object | 当数据维度名称为字段名时，可以通过配置别名映射关系的方式，将展示名称显示为别名。如：labelMap={key1: '发送量'}，将key1这个维度使用发送量这个名称显示 |
| legendName | 配置图例别名映射关系 | object | 需要注意，当你已经使用了labelMap配置重置了维度别名事，此时需使用新的维度名称配置映射。如上面我们把key1映射为’发送量‘，此时的图例映射关系应为  legendName="{'发送量': '新的图例名称'}" |
| showLine | 展示为折线图的指标 | array | 被设置的指标将显示为折线 |
| barGap | 不同系列的柱间距离 | string | default:'-100%',详细说明查看echarts配置项 series-bar.barGap  |
| opacity | 图形透明度 | number | default:undefined,详细说明查看echarts配置项 series-bar.itemStyle.opacity  |
| stack | 配置堆叠规则 | object | default:undefined, 配置哪些维度需要堆叠显示，如 stack = "{'总量': ['维度1','维度2']}" 表示维度1和维度2将1️以总量的方式进行堆叠显示 |
| dataOrder | 设置数据排序方式 | object | 按照某一维度进行排序。如 dataOrder="{label:'用户',order:'desc'}" 根据用户字段降序排列 |

```
  <mCharts type="histogram" :data="histogram" :settings="{legendVisible:false, dataOrder: {label:'用户',order:'desc'}}"></mCharts>

  export default {
    data(){
      return {
        histogram: {
          'columns': ['通道号', '用户'],
          'rows': [
            {'通道号': '新客首贷', '用户': 192}, {'通道号': '还款提醒', '用户': 335}, {'通道号': '提款提醒', '用户': 193}, {'通道号': '审批通过', '用户': 291}, {'通道号': '授信额度', '用户': 282}, {'通道号': '额度提升', '用户': 219}
           ]
        }
      }
    }
  }
```

### 条形图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| dimension | 自定义维度 | array | conlumns第一项为默认维度，双x轴时可能需要设置两个维度，目前最大支持两个维度设置 |
| metrics | 自定义指标 | array | conlumns排除第一项之外的其他项目为默认指标，默认全部显示，可通过配置此字段过滤掉部分指标 |
| axisSite | 配置各项指标所在的轴 | object | 双X轴时可分别配置两轴上的指标 {top: ['top轴指标1'],bottom:['bottom轴指标1']} |
| yAxisType | Y轴的类型 | string | Y轴的类型，默认为类目轴 category |
| scale | 数值轴是否是脱离 0 值比例 | array | default:[false, false], 数组项分别代表数值轴轴的scale配置，详细说明参照 echarts配置项 yAxis.scale |
| labelMap | 配置维度别名映射关系 | object | 当数据维度名称为字段名时，可以通过配置别名映射关系的方式，将展示名称显示为别名。如：labelMap={key1: '发送量'}，将key1这个维度使用发送量这个名称显示 |
| legendName | 配置图例别名映射关系 | object | 需要注意，当你已经使用了labelMap配置重置了维度别名事，此时需使用新的维度名称配置映射。如上面我们把key1映射为’发送量‘，此时的图例映射关系应为  legendName="{'发送量': '新的图例名称'}" |
| barGap | 不同系列的柱间距离 | string | default:'-100%',详细说明查看echarts配置项 series-bar.barGap  |
| opacity | 图形透明度 | number | default:undefined,详细说明查看echarts配置项 series-bar.itemStyle.opacity  |
| stack | 配置堆叠规则 | object | default:undefined, 配置哪些维度需要堆叠显示，如 stack = "{'总量': ['维度1','维度2']}" 表示维度1和维度2将1️以总量的方式进行堆叠显示 |
| dataOrder | 设置数据排序方式 | object | 按照某一维度进行排序。如 dataOrder="{label:'用户',order:'desc'}" 根据用户字段降序排列 |


```
  <mCharts type="bar" :data="bar" :settings="{legendVisible:false, dataOrder: {label:'用户',order:'desc'}}"></mCharts>

  export default {
    data(){
      return {
        bar: {
          'columns': ['通道号', '用户'],
          'rows': [
            {'通道号': '新客首贷', '用户': 192}, {'通道号': '还款提醒', '用户': 335}, {'通道号': '提款提醒', '用户': 193}, {'通道号': '审批通过', '用户': 291}, {'通道号': '授信额度', '用户': 282}, {'通道号': '额度提升', '用户': 219}
           ]
        }
      }
    }
  }
```

### 地图

常用配置 settings

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| legendVisible | 是否显示图例 | boolean | default:true |
| tooltipVisible | 是否显示tooltip | boolean | default:true |
| visualMapVisible | 是否显示视觉映射组件 | boolean | default:flase |
| mapType | 地图类型 | string | default:'china',目前仅支持china |
| dimension | 自定义维度 | array | conlumns第一项为默认维度 |
| jsonLink | 地图geoJson数据地址 | string | default: https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json |

```
  <m-charts type="map" :data="map"></m-charts>

  export default {
    data(){
      return {
        map: {
          columns: ['城市', '文本消息', '多媒体消息', 'Chatbot'],
          rows: [
            { '城市': '广东省', '文本消息': 100, '多媒体消息': 332, 'Chatbot': 10000 },
            { '城市': '北京市', '文本消息': 224, '多媒体消息': 4432, 'Chatbot': 20000 },
            { '城市': '上海市', '文本消息': 53, '多媒体消息': 111, 'Chatbot': 30000 },
            { '城市': '四川省', '文本消息': 566, '多媒体消息': 222, 'Chatbot': 40000 },
            { '城市': '新疆维吾尔自治区', '文本消息': 566, '多媒体消息': 222, 'Chatbot': 40000 },
            { '城市': '黑龙江省', '文本消息': 566, '多媒体消息': 222, 'Chatbot': 40000 }
          ]
        }
      }
    }
  }
```