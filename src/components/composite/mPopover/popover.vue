<template>
	<div class="popover-wrap" >
		<div class="popover-box" v-if="show" ref="popover" :style="styles">
			<transition :name="'page-move-'+direction">
			<component ref="component" :is="curComponent" :data="opData" @changeComponent="changeComponent" @set-height="changeHeight"></component>
			</transition>
		</div>
	</div>
</template>
<script>
export default {
	name:'m-popover',
	props: {
		
	},
	data() {
		return {
			top:0,
			left:0,
			width:0,
			height:0,
			pid:'',
			handleTarget: null,
			direction: 'left',
			historyComponent:[]
		}
	},
	computed: {
		styles() {
			let style = {}
			style['top'] = `${this.top}px`
			style['left'] = `${this.left}px`
			style['height'] = `${this.height}`
			style['width'] = `${this.width}`
			
			return style
		}
	},
	created: function() {


	},
	mounted: function() {
		this.historyComponent.push(this.curComponent)
		let box = this.el.currentTarget
		this.pid = box.dataset.popover
		this.setPosition(box)
		this.handleTarget = box
		document.addEventListener('mousedown', this.documentHandler)
		document.addEventListener('mousewheel', this.documentHandler)
	},
	methods: {
		setPosition(elBox) {
			/*
				由于左右切换动画，需要内部元素绝对定位，所以要延迟获取内部元素的高度
				来设置弹层的left、top、height属性
			*/

			let pos = elBox.getBoundingClientRect()
			let posX = pos.left
			let posY = pos.top
			let elHeight = elBox.offsetHeight + 5
			let elWidth = elBox.offsetWidth + 10

			setTimeout(()=>{ 
				let componentEl = this.$refs.component.$el
				let componentStyle = getComputedStyle(componentEl)
				this.width = componentStyle.width
				this.height = componentStyle.height

				let body_w = document.body.clientWidth
				let body_h = document.body.clientHeight
				let pop_w = Math.floor(this.width.replace("px",""))
				let pop_h = Math.floor(this.height.replace("px",""))
				if(this.isUpDown) {
					if(posX + pop_w > body_w) {
						this.left = posX - pop_w 
					} else {
						this.left = posX
					}
					if(posY + elHeight + pop_h > body_h) {
						this.top = posY - pop_h 
					} else {
						this.top = posY + elHeight
					}
				} else {

					if(posX + pop_w + elWidth > body_w) {
						this.left = posX - pop_w - 10 
					} else {
						this.left = posX + elWidth
					}

					if(posY + elHeight + pop_h > body_h) {
						this.top = posY - (posY + elHeight + pop_h - body_h)
					} else {
						this.top = posY - elHeight
					}
				}




				this.$refs.popover.style.marginTop = "0px"
				this.$refs.popover.style.opacity = 1

			},0)
		},
		changeComponent(comp) {
			this.setOverFlow()
			this.direction = "left"
			this.curComponent = comp
			this.historyComponent.push(comp)
			this.changeHeight()
			this.cancelOverFlow()
		},
		backComponent(){
			this.setOverFlow()
			let curComponent
			this.historyComponent.pop()
			this.direction = "right"
			this.curComponent = this.historyComponent[this.historyComponent.length-1]
			this.changeHeight()
			
		},
		changeHeight() {
			setTimeout(()=>{
				let h = this.$refs.component.$el.offsetHeight + 5 + 'px'
				this.height = h
				// if(this.historyHeight > 0 && this.historyHeight >= h ) {
				// 	this.height = this.historyHeight
				// } else {
				// 	this.height = h
				// 	this.historyHeight = h
				// }
			},0)
		},
		documentHandler(event) {
			let isOf = this.$el.contains(event.target) || this.handleTarget.contains(event.target)
			let popID = event.target.dataset.popover
			if (popID != this.pid){
				if (!isOf){
					this.handleClose()
				}
			}
		},
		handleClose(event) {
			this.show = false
			document.removeEventListener('mousedown', this.documentHandler)
			document.removeEventListener('mousewheel', this.documentHandler)
			// document.body.removeChild(this.$el)
		},
		cancelOverFlow() { //解决组件有下拉内容的隐藏问题
			setTimeout(()=>{
				this.$refs.popover.style.overflow = "inherit"
			},300)
		},
		setOverFlow() {
			this.$refs.popover.style.overflow = "hidden"
		}
	}
}
</script>

