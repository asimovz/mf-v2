## 分析模块组件

### 时间选择tab

- id 组件的标识
- slot 提供一个插槽，用于放置tab栏右侧的工具

```
  <m-time-tab id="mTimeTab">
    <m-custom-kpis id="mCustomKpis" kpi-card-id="mKpiCard"></m-custom-kpis>
  </m-time-tab>
```

### 自定义维度容器

- id 组件的标识
- search-form 指定自身从那个form组件收集参数，支持传入数组，当需要收集多个表单元素的数据时
- init-query-params 初始化携带的请求参数，如页面顶部的筛选项，可以保存在这里
- kpi-custom-id 将kpi维度数据，发送给哪一个自定义维度组件
- default-checked 默认展示项
- data 数据源地址

```
  <m-kpi-card
    id="mKpiCard"
    search-form="mTimeTab"
    :init-query-params="{a:1}"
    kpi-custom-id="mCustomKpis"
    :default-checked="['活动组数(个)','发送量(条)','活动数(个)']"
    data="http://127.0.0.1:3001/v1/a">
  </m-kpi-card>
```

### 自定义维度筛选器

- id 组件标识
- kpi-card-id 指定自身从那个kpi维度容器组件中收集数据

```
  <m-custom-kpis id="mCustomKpis" kpi-card-id="mKpiCard"></m-custom-kpis>
```

### m-charts 组件说明

- type 图表类型
- search-form 指定自身从那个form组件收集参数，支持传入数组，当需要收集多个表单元素的数据时
- init-query-params 初始化携带的请求参数，如页面顶部的筛选项，可以保存在这里
- metrics-form 指定当前图表的显示指标，会被哪个表单元素控制（注意，当某个下拉框是用来控制显示指标的，那么这个下拉框的value值应该为指标名称）
- settings.metrics 默认显示的指标（如果不需要筛选指标，不需要配置）
- data 数据源地址

```
  <m-charts
    type="line"
    search-form="mTimeTab"
    :init-query-params="{a:1}"
    :settings="{metrics: ['发送量']}"
    data="http://127.0.0.1:3001/v1/b">
  </m-charts>
```

### m-ranking-list 分析页面排行榜组件

- id 组件标识
- title 排行榜名称
- link 是否为链接类型
- dividerRight 显示右侧分割线
- padding 当前排行榜的style.padding配置
- res-data-key 点击每行数据时，需要将哪个字段的数据广播出去？广播的数据格式为对象类型 {key: value}
- search-form 指定自身从那个form组件收集参数，支持传入数组，当需要收集多个表单元素的数据时
- init-query-params 初始化携带的请求参数，如页面顶部的筛选项，可以保存在这里
- data 数据源地址 

```
  <m-ranking-list
    title="某排行"
    id="rank1"
    link
    dividerRight
    padding="0 10px"
    res-data-key="title"
    search-form="mTimeTab"
    :init-query-params="{a:1}"
    data="http://127.0.0.1:3001/v1/d">
  </m-ranking-list>

  // 接口数据格式

  [
    { title: '短信拦截校验', desc: '13231321321321321321', data: '534,112.15'},
    { title: '短信拦截校验', desc: '13231321321321321321', data: '534,112.15'},
    { title: '短信拦截校验', desc: '13231321321321321321', data: '534,112.15'}
  ]
```


### 示例

```
<m-time-tab id="mTimeTab">
  <m-custom-kpis id="mCustomKpis" kpi-card-id="mKpiCard"></m-custom-kpis>
</m-time-tab>

<m-kpi-card
  id="mKpiCard"
  search-form="mTimeTab"
  kpi-custom-id="mCustomKpis"
  :init-query-params="{a:1}"
  :default-checked="['活动组数(个)','发送量(条)','活动数(个)']"
  data="http://127.0.0.1:3001/v1/a">
</m-kpi-card>

<drop-down
  id="metricsForm"
  value="发送量"
  :options="[{value:'发送量',label:'发送量'},{value:'退定量',label:'退定量'},{value:'接收量',label:'接收量'}]">
</drop-down>

<m-charts
  type="line"
  search-form="mTimeTab"
  metrics-form="metricsForm"
  :init-query-params="{a:1}"
  :settings="{metrics: ['发送量']}"
  data="http://127.0.0.1:3001/v1/b">
</m-charts>

<m-charts
  type="pie"
  :search-form="['mTimeTab', 'metricsForm']"
  :init-query-params="{a:1}"
  data="http://127.0.0.1:3001/v1/c">
</m-charts>

<m-ranking-list
  id="rank1"
  res-data-key="id"
  search-form="mTimeTab"
  :init-query-params="{a:1}"
  data="http://127.0.0.1:3001/v1/d">
</m-ranking-list>

<m-ranking-list
  search-form="mTimeTab"
  :init-query-params="{a:1}"
  data="http://127.0.0.1:3001/v1/d">
</m-ranking-list>
```