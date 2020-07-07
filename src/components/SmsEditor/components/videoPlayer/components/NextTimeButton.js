import videojs from 'video.js'
const Button = videojs.getComponent('Button')

class NextTimeButton extends Button {
  constructor (player, options = {}) {
    super(player, options)
    this.controlText('快进10秒')
  }
  createEl (tag = 'div', props = {}, attributes = {}) {
    const el = super.createEl(tag, {
      innerHTML: '<span aria-hidden="true" class="vjs-icon-placeholder el-icon-refresh-right"><i>10</i></span>',
      className: this.buildCSSClass(),
      tabIndex: 0
    }, attributes)

    this.createControlTextEl(el)

    return el
  }
  handleClick (event) {
    const prevTime = this.player_.currentTime() + 10
    this.player_.currentTime(prevTime)
  }
}

export default NextTimeButton
