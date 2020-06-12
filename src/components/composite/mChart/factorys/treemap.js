import merge from 'lodash/merge'
import { globalOptions } from '../config'

function getTreemapTooltip (args) {
  const {
    tooltipFormatter
  } = args

  return {
    show: true,
    formatter (res) {
      if (tooltipFormatter) {
        return tooltipFormatter.apply(null, arguments)
      }

      const { name, value } = res.data
      return `${name}: ${value}`
    }
  }
}

function getTreemapSeries (args) {
  const {
    rows,
    breadcrumbVisible,
    seriesMap
  } = args

  const series = []

  seriesMap.breadcrumb.show = breadcrumbVisible
  seriesMap.data = rows
  series.push(seriesMap)

  return series
}

function getGrid (args) {
  const { breadcrumbVisible } = args

  if (breadcrumbVisible) {
    return {}
  } else {
    return {
      bottom: 10
    }
  }
}

export default async ({ extend = {}, data = {}, settings = {} }) => {
  const rows = data.rows
  const seriesMap = {
    type: 'treemap',
    roam: false,
    nodeClick: false,
    breadcrumb: {},
    label: {
      show: true,
      formatter: '{b}\n{@score}'
    },
    data: []
  }

  const {
    breadcrumbVisible = false,
    tooltipVisible = true,
    tooltipFormatter
  } = settings

  const series = getTreemapSeries({
    rows,
    breadcrumbVisible,
    seriesMap
  })

  const tooltip = tooltipVisible && getTreemapTooltip({
    tooltipFormatter
  })

  const grid = getGrid({
    breadcrumbVisible
  })

  return merge({}, globalOptions, { series, grid, tooltip }, extend)
}
