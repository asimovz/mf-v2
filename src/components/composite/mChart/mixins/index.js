import merge from 'lodash/merge'
import baseChart from '../base'
import methodMixins from './methods'
import { noData } from '../config'

const methodNames = [
  'mergeOptions',
  'appendData',
  'resize',
  'dispatchAction',
  'showLoading',
  'hideLoading',
  'convertToPixel',
  'convertFromPixel',
  'containPixel',
  'getDataURL',
  'getConnectedDataURL',
  'clear',
  'dispose',

  /**
   * 代理 vue-echarts 上的静态方法
   */
  'registerMap'
]

const methods = {}

methodNames.forEach(name => {
  methods[name] = function () {
    this.$refs.baseChart[name](...arguments)
  }
})

export default {
  components: {
    baseChart
  },
  render (h) {
    return h('base-chart', {
      ref: 'baseChart',
      props: merge({}, this.$props, { options: this.options })
    })
  },
  mixins: [methodMixins],
  data () {
    return {
      options: {},
      chartData: {},
      params: {},
      innerSettings: {},
      searchForms: []
    }
  },
  computed: {
    chartDataStr () {
      return JSON.stringify(this.extend) + JSON.stringify(this.settings) + JSON.stringify(this.innerSettings) + JSON.stringify(this.chartData)
    }
  },
  watch: {
    params: {
      deep: true,
      handler (v) {
        this.getData(v)
      }
    },
    chartDataStr: {
      async handler (v) {
        const [extend, originData] = [this.extend, this.chartData]

        const data = this.extract(originData, ['columns', 'rows'])
        const originSetting = this.extract(originData, ['settings'])

        const settings = merge({}, this.settings, this.innerSettings, originSetting.settings)

        this.options = data.rows.length === 0
          ? noData
          : await this.dataHandler({ extend, settings, data })
      }
    }
  },
  props: {
    /**
     * 代理 vue-charts 配置项
     * 不再对外提供 options 选项，组件内部封装部分通用配置（可使用settings进行配置），如遇高度自定义图表，可使用extend重置默认和新增配置。
     * 原options = merge(globalOptions + data + innerOptions + settings + extend)
     * settings 包含一些常用的行为配置
     */

    // 自定义部分
    type: {
      // 图表类型 目前为止支持的图表 histogram, bar(条形图), line, pie, treemap(矩阵树图)
      type: String,
      default: 'line'
    },
    data: [Object, String],
    extend: Object,
    chartHeight: [String, Number],
    settings: Object,
    searchForm: [String, Array],
    metricsForm: String,
    initQueryParams: {
      type: Object,
      default () {
        return {}
      }
    },

    // vue-charts 默认配置
    // options: Object,
    theme: [String, Object],
    initOptions: Object,
    group: String,
    autoResize: {
      type: Boolean,
      default: true
    },
    watchShallow: Boolean,
    manualUpdate: Boolean
  },
  created () {
    this.$nextTick(() => {
      if (this.searchForm) {
        this.listenerSearch()
      }

      if (this.metricsForm) {
        this.listenerMetrics()
      }
    })
  },
  mounted () {
    /**
     * 为自定义组件上的事件与echart (vue-charts)事件做一层代理
     * 支持的事件将与vue-charts保持一致
     */
    const baseChart = this.$refs.baseChart
    const events = Object.keys(this.$listeners)

    events.forEach(eventName => {
      baseChart.$on(eventName, payload => {
        this.$emit(eventName, payload)
      })
    })
  },

  /**
   * 为自定义组件上的方法与echart (vue-charts)支持的方法做一层代理
   * 支持的方法将与vue-charts保持一致
   */
  methods,
  async beforeMount () {
    this.getData()
  },
  beforeDestroy () {
    this.searchForms.forEach(item => {
      this.$root.eventBus.$off(`${item}_value_change`)
    })
    this.$root.eventBus.$off(`custom_kpi_data_${this.kpiCustomId}`)
  }
}
