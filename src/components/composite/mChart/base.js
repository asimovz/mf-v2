import vueEcharts from 'vue-echarts/components/ECharts'
import { walden } from './theme'

export default {
  name: 'baseVueEcharts',
  extends: vueEcharts,
  render (h) {
    return h('div', {
      style: {
        width: '100%',
        height: this._chartHeight
      }
    })
  },
  props: {
    /**
     * 扩展属性
     */
    chartHeight: {
      type: [Number, String],
      default: 450
    },

    /**
     * 重写默认值
     */
    theme: {
      type: [String, Object],
      default () {
        return walden
      }
    }
  },
  computed: {
    _chartHeight () {
      return isNaN(this.chartHeight) ? this.chartHeight : `${this.chartHeight}px`
    }
  },
  methods: {
    /**
     * 增加实例方法，代理到静态方法
     * vue-echarts 支持的静态方法如下，需要时按需注册
     * connect
     * disconnect
     * registerMap
     * registerTheme
     * graphic.clipPointsByRect
     * graphic.clipRectByRect
     */
    registerMap () {
      vueEcharts.registerMap(...arguments)
    }
  }
}
