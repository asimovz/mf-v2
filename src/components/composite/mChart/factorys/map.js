import merge from 'lodash/merge'
import { globalOptions } from '../config'
import { getMapJson } from '../utils'

function getVisualMap (args) {
  const {
    visualMapVisible
  } = args

  return {
    type: 'continuous',
    min: 0,
    max: 1000000,
    text: ['高', '低'],
    show: visualMapVisible
  }
}

function getTooltip (args) {
  const {
    metrics,
    dataStore
  } = args

  return {
    formatter (item) {
      let tpl = []
      if (!item.name) return ''
      tpl.push(`${item.name}<br>`)
      metrics.forEach((label, index) => {
        tpl.push(`${label} : ${dataStore[item.name] ? dataStore[item.name][label] : '-'}`)
        tpl.push('<br>')
      })
      return tpl.join(' ')
    }
  }
}

function getLegend (args) {
  const {
    metrics
  } = args

  return { data: metrics }
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

function getSeries (args) {
  const {
    mapType,
    dimension,
    metrics,
    rows
  } = args
  const result = []
  const mapBase = {
    type: 'map',
    map: mapType
  }

  metrics.forEach(itemName => {
    const itemResult = Object.assign({
      name: itemName,
      data: []
    }, mapBase)

    rows.forEach(row => {
      itemResult.data.push({
        name: row[dimension],
        value: row[itemName]
      })
    })
    result.push(itemResult)
  })

  return result
}

export default async function ({ extend = {}, data = {}, settings = {} }) {
  const columns = data.columns
  const rows = data.rows
  const {
    visualMapVisible = false,
    mapType = 'china',
    dimension = columns[0],
    tooltipVisible = true,
    legendVisible = true,
    jsonLink = 'https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json'
  } = settings

  let metrics = columns.slice()
  if (settings.metrics) {
    metrics = settings.metrics
  } else {
    metrics.splice(columns.indexOf(dimension), 1)
  }

  const dataStore = {}
  rows.forEach(row => { dataStore[row[dimension]] = row })

  const visualMap = getVisualMap({
    visualMapVisible
  })

  const series = getSeries({
    mapType,
    dimension,
    metrics,
    rows
  })

  const legend = legendVisible && getLegend({
    metrics
  })

  const tooltip = tooltipVisible && getTooltip({
    metrics,
    dataStore
  })

  const grid = getGrid({
    legendVisible
  })

  const mapJson = await getMapJson({ jsonLink })
  this.registerMap('china', mapJson)

  return merge({}, globalOptions, { visualMap, grid, tooltip, legend, series }, extend)
}
