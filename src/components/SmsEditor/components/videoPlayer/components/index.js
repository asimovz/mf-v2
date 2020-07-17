import videojs from 'video.js'
import NextTimeButton from './NextTimeButton'
import PrevTimeButton from './PrevTimeButton'

const Component = videojs.getComponent('Component')

const components = {
  NextTimeButton,
  PrevTimeButton
}

for (let key in components) {
  Component.registerComponent(key, components[key])
}
