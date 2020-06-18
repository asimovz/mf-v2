import merge from 'lodash/merge'
import { clone } from '../utils'
import { globalOptions } from '../config'

function getPieSeries (args) {
  const {
    innerRows,
    percentShow,
    dimension,
    metrics,
    radius,
    offsetY,
    selectedMode,
    hoverAnimation,
    limitShowNum
  } = args

  let series = []
  let rowsTemp = []
  rowsTemp.push(innerRows)

  let seriesBase = {
    type: 'pie',
    selectedMode,
    hoverAnimation,
    center: ['50%', offsetY]
  }
  let rowsTempLength = rowsTemp.length
  rowsTemp.forEach((dataRows, index) => {
    let seriesItem = Object.assign({ data: [] }, seriesBase)
    const centerWidth = radius / rowsTempLength
    if (!index) {
      seriesItem.radius = centerWidth
    } else {
      const outerWidth = centerWidth + radius / (2 * rowsTempLength) * (2 * index - 1)
      const innerWidth = outerWidth + radius / (2 * rowsTempLength)
      seriesItem.radius = [outerWidth, innerWidth]
    }
    if (rowsTempLength > 1 && index === 0) {
      seriesItem.label = {
        normal: { position: 'inner' }
      }
    }
    if (percentShow) {
      seriesItem.label = {
        normal: {
          show: true,
          position: rowsTempLength > 1 && index === 0 ? 'inner' : 'outside',
          formatter (item) {
            let tpl = []
            tpl.push(`${item.name}:${item.value}`)
            tpl.push(`(${item.percent}%)`)
            return tpl.join(' ')
          }
        }
      }
    }
    seriesItem.data = dataRows.map(row => ({
      name: row[dimension],
      value: row[metrics]
    }))
    series.push(seriesItem)
  })
  if (limitShowNum && limitShowNum < series[0].data.length) {
    const firstData = series[0].data
    const remainArr = firstData.slice(limitShowNum, firstData.length)
    let sum = 0
    remainArr.forEach(item => { sum += item.value })
    series[0].data = firstData.slice(0, limitShowNum)
    series[0].data.push({ name: '其他', value: sum })
  }
  return series
}

function getPieLegend (args) {
  const { innerRows, dimension, legendLimit, legendName, limitShowNum } = args
  let legend = []
  if (limitShowNum && limitShowNum < innerRows.length) {
    for (let i = 0; i < limitShowNum; i++) {
      legend.push(innerRows[i][dimension])
    }
    legend.push('其他')
  } else {
    legend = innerRows.map(row => row[dimension])
  }
  if (legend.length) {
    return {
      data: legend,
      show: legend.length < legendLimit,
      formatter (name) {
        return legendName[name] != null ? legendName[name] : name
      }
    }
  } else {
    return false
  }
}

function getPieTooltip (args) {
  const {
    innerRows,
    limitShowNum,
    metrics,
    dimension
  } = args
  let sum = 0
  const remainArr = innerRows.map(row => {
    sum += row[metrics]
    return {
      name: row[dimension],
      value: row[metrics]
    }
  }).slice(limitShowNum, innerRows.length)
  return {
    formatter (item) {
      let tpl = []
      if (limitShowNum && item.name === '其他') {
        tpl.push('其他:')
        remainArr.forEach(({ name, value }) => {
          const percent = (value / sum) * 100 + '%'
          tpl.push(`<br>${name}:${value}`)
          tpl.push(`(${percent})`)
        })
      } else {
        tpl.push(`${item.name}:${item.value}`)
        tpl.push(`(${item.percent}%)`)
      }
      return tpl.join(' ')
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

export default async ({ extend = {}, data = {}, settings = {} }) => {
  const innerRows = clone(data.rows)

  const {
    percentShow,
    dimension = data.columns[0],
    metrics = data.columns[1],
    radius = 100,
    offsetY = 200,
    legendLimit = 30,
    selectedMode = false,
    hoverAnimation = true,
    legendName = {},
    limitShowNum = 0,
    tooltipVisible = true,
    legendVisible = true
  } = settings

  innerRows.sort((a, b) => b[metrics] - a[metrics])
  const seriesParams = {
    innerRows,
    percentShow,
    dimension,
    metrics,
    radius,
    offsetY,
    selectedMode,
    hoverAnimation,
    legendName,
    limitShowNum
  }
  const series = getPieSeries(seriesParams)

  const legendParams = {
    innerRows,
    dimension,
    legendLimit,
    legendName,
    limitShowNum
  }

  const legend = legendVisible && getPieLegend(legendParams)
  const tooltip = tooltipVisible && getPieTooltip({
    innerRows,
    limitShowNum,
    metrics,
    dimension
  })

  const grid = getGrid({
    legendVisible
  })

  return merge({}, globalOptions, { series, grid, legend, tooltip }, extend)
}
