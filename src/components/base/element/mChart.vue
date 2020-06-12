<template>
  <figure>
    <chart
      :id='id'
      :style='echartStyle'
      :options="optionsData"
      :init-options="initOptions"
      auto-resize
      :theme='theme'
    ></chart>
  </figure>
</template>

<script>
// import ECharts from 'vue-echarts/components/ECharts'

//此处必须手动引入 SVG 渲染器模块,如果指定使用svg进行渲染的话
import 'zrender/lib/svg/svg'

// built-in theme
import 'echarts/theme/shine'
import 'echarts/theme/macarons'
import 'echarts/theme/vintage'
//import 'echarts/theme/infographic'

// import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/dataset'

export default {
  name: "m-chart",
  components: {
    "chart":() => import(/* webpackChunkName: "echart" */'vue-echarts/components/ECharts')
  },
  props:{
    id: String,
    chartInitOptions:{
      type: Object,
      default: ()=>{
        return {
          renderer: 'canvas',
          width:'150px',
          height:'150px'
        }
      }
    },
    theme: {
      type: String,
      default: 'light'
    },
    chartData:{
      type: Object,
      default: ()=>{
        return {}
      }
    },
    dataUrl: String
  },
  data: function () {
    return {
      initOptions: this.chartInitOptions,
      optionsData: {}
    }
  },

  computed: {
    echartStyle() {
      return {
        width: this.chartInitOptions.width,
        height: this.chartInitOptions.height
      }
    }
  },

  beforeMount(){
    let that =this
    // console.log('this.dataUrl===',this.dataUrl)
    if(this.dataUrl){
      this.$root.$http.get(this.dataUrl).then(response => {
        // console.log('remote chart data===',response.data)
        that.optionsData = response.data
      }, err => {
        console.log('get remote chart data error => ',err)
      })
    }else{
      that.optionsData = this.chartData
    }
  },

  mounted(){
  },

  methods:{
  }
}
</script>