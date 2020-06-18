import mixins from './mixins'
import * as factorys from './factorys'

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/treemap'
import 'echarts/lib/chart/map'

import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/visualMapContinuous'
import 'echarts/lib/component/graphic'

export default {
  name: 'mCharts',
  mixins: [mixins],
  data () {
    this.dataHandler = factorys[this.$props.type]
    return {}
  }
}
