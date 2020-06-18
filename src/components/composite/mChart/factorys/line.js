import merge from 'lodash/merge'
import isArray from 'lodash/isArray'
import { globalOptions } from '../config'
import { getStackMap, clone } from '../utils'

function getLegend (args) {
  const { metrics, legendName, labelMap } = args
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

function getLineTooltip (args) {
  const { tooltipFormatter } = args
  return {
    trigger: 'axis',
    formatter (items) {
      if (tooltipFormatter) {
        return tooltipFormatter.apply(null, arguments)
      }
      let tpl = []
      const { name, axisValueLabel } = items[0]
      const title = name || axisValueLabel
      tpl.push(`${title}<br>`)
      items.forEach(({ seriesName, data, marker }) => {
        const itemData = isArray(data) ? data[1] : data
        tpl.push(marker)
        tpl.push(`${seriesName}: ${itemData}`)
        tpl.push('<br>')
      })
      return tpl.join('')
    }
  }
}

function getLineXAxis (args) {
  const { dimension, rows, xAxisName, xAxisType } = args
  if (dimension.length > 2) {
    console.warn(`最大支持X轴上最大两个维度设置，目前有${dimension.length}个，图标渲染可能有异常。`)
  }
  return dimension.map((item, index) => ({
    type: xAxisType,
    nameLocation: 'middle',
    boundaryGap: false,
    nameGap: 22,
    name: xAxisName[index] || '',
    axisTick: { show: true, lineStyle: { color: '#eee' } },
    data: rows.map(row => row[item]),
    show: true
  }))
}

function getLineYAxis (args) {
  const {
    yAxisName,
    scale
  } = args

  const yAxisBase = {
    type: 'value',
    axisTick: {
      show: false
    },
    show: true
  }
  let yAxis = []
  for (let i = 0; i < 2; i++) {
    yAxis[i] = Object.assign({}, yAxisBase)
    yAxis[i].name = yAxisName[i] || ''
    yAxis[i].scale = scale[i] || false
  }
  return yAxis
}

/**
 * 动态计算grid的左右留白空间，这里预设全角字符大小为12px，半角为6px，主题预设Y轴刻度与轴线距离为8px，标记点最大宽度6px，左右容错距离6px
 * 获取X轴上的最大和最小刻度，按预设大小计算实际使用空间。取最大值作为左右留白。
 * @param {*} args
 */

function getGrid (args) {
  const grid = clone(globalOptions.grid)
  const {
    yAxisName,
    legendVisible,
    xAxis,
    series
  } = args

  // const [fullCharSize, charSize, margin, symbolSize, areaSize] = [12, 6, 8, 6, 6]

  // const getOverflow = label => {
  //   const fullChar = label.match(/[^\x00-\xff]/g)
  //   const fullCharNum = fullChar ? fullChar.length : 0
  //   return (fullCharNum * fullCharSize + (label.length - fullCharNum) * charSize) / 2
  // }

  // const [minLabels, maxLabels] = [[], []]

  // xAxis.forEach(item => {
  //   minLabels.push(item.data[0])
  //   maxLabels.push(item.data[item.data.length - 1])
  // })

  // const minLabelsOverflow = minLabels.map(item => {
  //   return getOverflow(item)
  // })

  // const maxLabelsOverflow = maxLabels.map(item => {
  //   return getOverflow(item)
  // })

  // let allData = []

  // series.forEach(item => {
  //   allData = allData.concat(item.data)
  // })

  // const maxYaxisLabelWidth = Math.max(...allData).toString().length * charSize + margin

  // let leftOverflow = Math.max(...minLabelsOverflow)
  // let rightOverflow = Math.max(...maxLabelsOverflow)
  // let gridLeft = 0
  // let gridRight = rightOverflow + symbolSize / 2 + areaSize

  // if (leftOverflow <= maxYaxisLabelWidth) {
  //   gridLeft = 0
  // } else {
  //   gridLeft = leftOverflow - maxYaxisLabelWidth + areaSize
  // }

  // return {
  //   left: gridLeft,
  //   right: gridRight
  // }

  // 去除图例空间
  if (!legendVisible) {
    grid.bottom = 10
  }

  // 增加轴线名称空间
  if (yAxisName && yAxisName.length !== 0) {
    grid.top = 35
  }

  return grid
}

function getLineSeries (args) {
  const {
    rows,
    axisSite,
    metrics,
    area,
    stack,
    nullAddZero,
    labelMap
    // dimension
  } = args
  let series = []
  const dataTemp = {}
  const stackMap = stack && getStackMap(stack)

  metrics.forEach(item => { dataTemp[item] = [] })
  rows.forEach(row => {
    metrics.forEach(item => {
      let value = null
      if (row[item] != null) {
        value = row[item]
      } else if (nullAddZero) {
        value = 0
      }
      // dataTemp[item].push([row[dimension[0]], value])
      dataTemp[item].push(value)
    })
  })

  metrics.forEach(item => {
    let seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      type: 'line',
      data: dataTemp[item]
    }

    if (area) seriesItem.areaStyle = { normal: {} }
    if (axisSite.right) {
      seriesItem.yAxisIndex = ~axisSite.right.indexOf(item) ? 1 : 0
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item]

    series.push(seriesItem)
  })
  return series
}

/**
 * @param {Object} extend - 扩展属性，高度自定义
 * @param {Object} data - 数据
 * @param {Object} settings - 封装的常用配置
 */

export default async ({ extend = {}, data = {}, settings = {} }) => {
  const rows = isArray(data.rows) ? data.rows : []
  const columns = isArray(data.columns) ? data.columns : []

  const {
    axisSite = {},
    xAxisType = 'category',
    yAxisName = [],
    dimension = [columns[0]],
    xAxisName = [],
    area = false,
    stack,
    scale = [false, false],
    nullAddZero = false,
    legendName = {},
    labelMap = {},
    tooltipVisible = true,
    legendVisible = true,
    tooltipFormatter
  } = settings

  let metrics = columns.slice()

  if (axisSite.left && axisSite.right) {
    metrics = axisSite.left.concat(axisSite.right)
  } else if (axisSite.left && !axisSite.right) {
    metrics = axisSite.left
  } else if (settings.metrics) {
    metrics = settings.metrics
  } else {
    metrics.splice(columns.indexOf(dimension[0]), 1)
  }

  const legend = legendVisible && getLegend({ metrics, legendName, labelMap })

  const tooltip = tooltipVisible && getLineTooltip({
    axisSite,
    labelMap,
    xAxisType,
    tooltipFormatter
  })

  const xAxis = getLineXAxis({
    dimension,
    rows,
    xAxisName,
    xAxisType
  })

  const yAxis = getLineYAxis({
    yAxisName,
    scale
  })

  const series = getLineSeries({
    rows,
    axisSite,
    metrics,
    area,
    stack,
    nullAddZero,
    labelMap,
    xAxisType,
    dimension
  })

  const grid = getGrid({
    yAxisName,
    legendVisible,
    xAxis,
    series
  })

  return merge({}, globalOptions, { legend, grid, xAxis, series, yAxis, tooltip }, extend)
}
