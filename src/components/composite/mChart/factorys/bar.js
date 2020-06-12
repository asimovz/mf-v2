import { getStackMap, clone } from '../utils'
import set from 'lodash/set'
import get from 'lodash/get'
import merge from 'lodash/merge'
import { globalOptions } from '../config'
const VALUE_AXIS_OPACITY = 0.5

function getBarDimAxis (args) {
  const { innerRows, dimAxisName, dimension } = args
  return dimension.map(item => ({
    type: 'category',
    name: dimAxisName,
    nameLocation: 'middle',
    nameGap: 22,
    data: innerRows.map(row => row[item]),
    axisLabel: {
      formatter (v) {
        return String(v)
      }
    },
    show: true
  }))
}

function getBarMeaAxis (args) {
  const {
    scale
  } = args
  const meaAxisBase = {
    type: 'value',
    axisTick: {
      show: false
    },
    show: true
  }
  let meaAxis = []

  for (let i = 0; i < 2; i++) {
    meaAxis[i] = Object.assign({}, meaAxisBase)
    meaAxis[i].scale = scale[i] || false
  }

  return meaAxis
}

function getBarTooltip (args) {
  return {
    trigger: 'axis',
    formatter (items) {
      let tpl = []
      tpl.push(`${items[0].name}<br>`)
      items.forEach(item => {
        const seriesName = item.seriesName
        tpl.push(`${seriesName}: ${item.value}`)
        tpl.push('<br>')
      })

      return tpl.join('')
    }
  }
}

function getBarSeries (args) {
  const {
    innerRows,
    metrics,
    stack,
    axisSite,
    isHistogram,
    labelMap,
    showLine = [],
    dimAxisType,
    barGap,
    opacity
  } = args
  let series = []
  const seriesTemp = {}
  const secondAxis = isHistogram
    ? axisSite.right || []
    : axisSite.top || []
  const secondDimAxisIndex = isHistogram ? 'yAxisIndex' : 'xAxisIndex'
  const stackMap = stack && getStackMap(stack)

  metrics.forEach(item => { seriesTemp[item] = [] })
  innerRows.forEach(row => {
    metrics.forEach(item => {
      seriesTemp[item].push(row[item])
    })
  })
  series = Object.keys(seriesTemp).map((item, index) => {
    const data = seriesTemp[item]
    const seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      type: ~showLine.indexOf(item) ? 'line' : 'bar',
      data,
      [secondDimAxisIndex]: ~secondAxis.indexOf(item) ? '1' : '0'
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item]

    let itemOpacity = opacity || get(seriesItem, 'itemStyle.opacity')

    if (dimAxisType === 'value') {
      seriesItem.barGap = barGap
      seriesItem.barCategoryGap = '1%'
      if (itemOpacity == null) itemOpacity = VALUE_AXIS_OPACITY
    }

    if (itemOpacity != null) {
      set(seriesItem, 'itemStyle.opacity', itemOpacity)
    }

    return seriesItem
  })

  return series.length ? series : false
}

function getLegend (args) {
  const { metrics, labelMap, legendName } = args
  if (!legendName && !labelMap) return { data: metrics }
  const data = labelMap
    ? metrics.map(item => (labelMap[item] == null ? item : labelMap[item]))
    : metrics
  return {
    data,
    formatter (name) {
      return legendName[name] != null ? legendName[name] : name
    }
  }
}

function getGrid (args) {
  const { legendVisible } = args

  if (legendVisible) {
    return {}
  } else {
    return {
      bottom: 10
    }
  }
}

export const bar = async ({ extend = {}, data = {}, settings = {} }) => {
  const innerRows = clone(data.rows)
  const {
    axisSite = {},
    dimension = [data.columns[0]],
    stack = {},
    dataOrder = false,
    scale = [false, false],
    legendName = {},
    labelMap = {},
    barGap = '-100%',
    opacity,
    tooltipVisible = true,
    legendVisible = true
  } = settings
  let metrics = data.columns.slice()
  if (axisSite.top && axisSite.bottom) {
    metrics = axisSite.top.concat(axisSite.bottom)
  } else if (axisSite.bottom && !axisSite.right) {
    metrics = axisSite.bottom
  } else if (settings.metrics) {
    metrics = settings.metrics
  } else {
    metrics.splice(data.columns.indexOf(dimension[0]), 1)
  }

  const dimAxisType = settings.yAxisType || 'category'
  const isHistogram = false

  if (dataOrder) {
    const { label, order } = dataOrder
    if (!label || !order) {
      console.warn(`请配置排序字段 dataOrder，并制定用于排序的维度名称及顺序规则 {label:'维度名称', order: 'desc'}`)
    } else {
      innerRows.sort((a, b) => {
        if (order === 'desc') {
          return a[label] - b[label]
        } else {
          return b[label] - a[label]
        }
      })
    }
  }

  const legend = legendVisible && getLegend({ metrics, labelMap, legendName })

  const yAxis = getBarDimAxis({
    innerRows,
    dimension,
    dimAxisType
  })

  const xAxis = getBarMeaAxis({
    scale
  })

  const series = getBarSeries({
    innerRows,
    metrics,
    stack,
    axisSite,
    isHistogram,
    labelMap,
    dimAxisType,
    dimension,
    barGap,
    opacity
  })
  const tooltip = tooltipVisible && getBarTooltip({ axisSite, isHistogram, labelMap })
  const grid = getGrid({
    legendVisible
  })

  return merge({}, globalOptions, { legend, grid, yAxis, series, xAxis, tooltip }, extend)
}

export const histogram = async ({ extend = {}, data = {}, settings = {} }) => {
  const innerRows = clone(data.rows)
  const {
    axisSite = {},
    dimension = [data.columns[0]],
    stack = {},
    dataOrder = false,
    scale = [false, false],
    labelMap = {},
    legendName = {},
    showLine,
    barGap = '-100%',
    opacity,
    tooltipVisible = true,
    legendVisible = true
  } = settings

  if (dataOrder) {
    const { label, order } = dataOrder
    if (!label || !order) {
      console.warn(`请配置排序字段 dataOrder，并制定用于排序的维度名称及顺序规则 {label:'维度名称', order: 'desc'}`)
    } else {
      innerRows.sort((a, b) => {
        if (order === 'desc') {
          return b[label] - a[label]
        } else {
          return a[label] - b[label]
        }
      })
    }
  }

  let metrics = data.columns.slice()
  if (axisSite.left && axisSite.right) {
    metrics = axisSite.left.concat(axisSite.right)
  } else if (axisSite.left && !axisSite.right) {
    metrics = axisSite.left
  } else if (settings.metrics) {
    metrics = settings.metrics
  } else {
    metrics.splice(data.columns.indexOf(dimension[0]), 1)
  }
  const dimAxisType = settings.xAxisType || 'category'
  const isHistogram = true

  const legend = legendVisible && getLegend({ metrics, labelMap, legendName })
  const xAxis = getBarDimAxis({
    innerRows,
    dimension,
    dimAxisType
  })
  const yAxis = getBarMeaAxis({
    scale
  })
  const series = getBarSeries({
    innerRows,
    metrics,
    stack,
    axisSite,
    isHistogram,
    labelMap,
    showLine,
    dimAxisType,
    dimension,
    barGap,
    opacity
  })
  const tooltipParams = { axisSite, isHistogram, labelMap }
  const tooltip = tooltipVisible && getBarTooltip(tooltipParams)
  const grid = getGrid({
    legendVisible
  })

  return merge({}, globalOptions, { legend, grid, yAxis, series, xAxis, tooltip }, extend)
}
