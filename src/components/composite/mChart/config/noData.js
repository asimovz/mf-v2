import noDataImg from '../theme/no-data.png'

export default {
  backgroundColor: '#fff',
  grid: {
    containLabel: true,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  legend: {
    show: false
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        width: 0
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        width: 0
      }
    }
  },
  graphic: [
    {
      type: 'image',
      left: 'center',
      top: 'center',
      z: 10,
      style: {
        image: noDataImg,
        width: 195,
        height: 204
      }
    }
  ]
}
