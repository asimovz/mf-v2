<template>
	<div>
		<div v-if="colorType === 'hex' && isShow" v-bind:style="{backgroundColor: hexValue,height:height+'px',width:width+'px'}"></div>
		<img v-if="colorType === 'image' && isShow" :src="imgUrl" :width="width" :height="height" @click="onImg" />
	</div>
</template>

<script>
	export default {
	name: "ag-color-display",
	data() {
		return {
				colorType:"",
				hexValue:"",
				imgUrl:"",
				width:100,
				height:28,
				isShow: true
		};
	},
	beforeMount(){
		if(this.params.hasOwnProperty("data")){
			let typeField = this.params.props.typeField
			let hexValueField = this.params.props.hexValueField
			let imageValueField = this.params.props.imageValueField
			this.colorType = this.params.data[typeField]
			this.hexValue = this.params.data[hexValueField]
			this.imgUrl = this.params.props.transitionUrl + "?" + imageValueField + "=" + this.params.data[imageValueField]
			this.width = this.params.props.width
			this.height = this.params.props.height
		}else{
			this.isShow = false
		}
	},
	methods: {
		onImg() {
			const box = document.querySelector('#my-img-box')
			if (box) {
				document.body.removeChild(box)
			} else {
				const div = document.createElement('div')
				div.classList.add('m-box')
				div.onclick = this.onImg
				div.setAttribute('id', 'my-img-box')
				const img = document.createElement('img')
				img.classList.add('m-drop')
				img.src = this.imgUrl
				div.appendChild(img)
				document.body.appendChild(div)
				setTimeout(()=>{
					div.style.opacity = 1
				},0)
			}},
	}
	}
</script>
<style>
.m-box {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 99999;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0,0,0, .5);
	transition: opacity .2s linear;
	opacity: 0;
}
.m-drop {
	width: auto;
	height: auto;
	display: block;
	max-width: 80%;
	max-height: 80%;
}
</style>