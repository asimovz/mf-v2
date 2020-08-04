import defaultLogo from '../logo@2x.png'

class Watermark {
  constructor({ logo = '', renderWidth = 120, renderHeight = 110, sourceWidth = 420, sourceHeight = 173} = {}) {
    if (!Watermark.instance) {
      this.logo = logo || defaultLogo
      this.watermarkCanvas = null
      this.watermarkUrl = ''

      this.renderWidth = renderWidth
      this.renderHeight = renderHeight
      this.sourceWidth = sourceWidth
      this.sourceHeight = sourceHeight
      this.cnavasWidth = 170
      this.cnavasHeight = 170

      this.start()
      Watermark.instance = this
    }

    return Watermark.instance
  }

  async start () {
    let waterStyleDom = null
    this.watermarkCanvas = document.createElement("canvas")
    const ctx = this.watermarkCanvas.getContext("2d")

    const loginUser = localStorage.getItem('userFullName') || localStorage.getItem('username')

    this.watermarkCanvas.width = this.cnavasWidth
    this.watermarkCanvas.height = this.cnavasHeight
    
    ctx.clearRect(0, 0, this.watermarkCanvas.width, this.watermarkCanvas.height)
    ctx.save()

    const imageElement = new Image()
   

    imageElement.src = this.logo
    imageElement.setAttribute("crossOrigin", 'Anonymous')
    imageElement.width = this.sourceWidth
    imageElement.height = this.sourceHeight

    const ratio = this.sourceHeight / this.sourceWidth

    ctx.globalAlpha = 0.06
    ctx.fillStyle = "#000000"
    ctx.font = '12px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'
    ctx.textAlign = "center"
    ctx.translate(this.renderWidth / 6, this.renderHeight - 10)
    ctx.rotate(-Math.PI / 6)

    // 绘制
    imageElement.onload = res => {
      ctx.drawImage(imageElement, 0, 0, this.renderWidth, this.renderWidth * ratio)
      ctx.fillText(`用户名 ${loginUser}`, this.renderWidth / 2, this.renderWidth * ratio + 10)
      ctx.restore()

      this.watermarkUrl = this.watermarkCanvas.toDataURL()

      waterStyleDom = document.createElement("style")
      waterStyleDom.innerHTML = `
        .el-table__body-wrapper .el-table__body th, .el-table__body-wrapper .el-table__body tr{background:none}
        .el-table__body-wrapper .el-table__body{background:url(${this.watermarkUrl}) -60px -50px; }
      `

      document.head.appendChild(waterStyleDom)

      Promise.resolve(true)
    }
  }
}

export default new Watermark()