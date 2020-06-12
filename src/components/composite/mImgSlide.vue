<template>
	<div v-if="this.imgList.length" class="m-imgSlide">
		<transition name="m-imgSlide-fade">
			<div v-if="show" class="m-imgSlide-box" @click="onImg">
				<img
					class="m-imgSlide-drop"
					:src="currentBig.big"
				>
			</div>
		</transition>
		
		<div
			class="big-img img-wrap"
			:style="bigStyle"
			ref="bigBox"
			@click="onImg"
		>
			<img
				ref="bigImg"
				@load="setStyle"
				:src="currentBig.big"
			>
		</div> <!-- @mousemove="moveImg" -->
		<ul class="thumbnail">
			<li :class="['img-wrap',{'active':index == currentIndex}]" v-for="(item,index) in imgList" @click="setBigImg(index)" :style="smallStyle">
				<img :src="item.small" alt="" @load="setStyle">
			</li>
		</ul>
	</div>
</template>
<script>

export default {
	name:'m-img-slide',
	props: {
		size: Number,
		imgList: Array
	},
	data() {
		return {
			currentIndex:0,
			show: false
		}
	},
	computed: {
		currentBig() {
			return this.imgList[this.currentIndex]
		},
		bigStyle() {
			return {
				width: this.size + "px",
				height: this.size + "px"
			}
		},
		smallStyle() {
			let size = (this.size - 20)/5
			return {
				width: size + "px",
				height: size + "px"
			}
		}
	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {
		onImg() {
			this.show = !this.show
		},
		moveImg(event) {
			let move,out,natural,img_move
			let bigBox = this.$refs.bigBox
			let bigImg = this.$refs.bigImg
			if(bigImg.style.width == "auto") {
				natural = this.size - (this.size/bigImg.naturalHeight)*bigImg.naturalWidth
				out = Math.floor(natural / 2)
				move = event.clientX - bigBox.offsetLeft - this.size/2
				img_move = Math.floor(move/(this.size/2)*out) + out
				bigImg.style.left = img_move + "px"
			} else {
				natural = this.size - (this.size/bigImg.naturalWidth)*bigImg.naturalHeight
				out = Math.floor(natural / 2)
				move = event.clientY - bigBox.offsetTop - this.size/2
				img_move = Math.floor(move/(this.size/2)*out) + out
				bigImg.style.top = img_move + "px"
			}
		},
		setBigImg(index) {
			let bigImg = this.$refs.bigImg
			bigImg.style.left = "auto"
			bigImg.style.top = "auto"
			this.currentIndex = index
		},
		setStyle(event) {
			let img = event.target
			this.getImgOrigin(img)
		},
		getImgOrigin (img) {
		    let w = img.naturalWidth
		    let h = img.naturalHeight
		    if(w >= h){
		    	img.style.width = "auto"
		    	img.style.height = "100%"
		    }else{
		    	img.style.width = "100%"
		    	img.style.height = "auto"
		    }
		}
	}
}
</script>
<style>
.m-imgSlide-fade-enter-active, .m-imgSlide-fade-leave-active {
  transition: opacity .5s;
}
.m-imgSlide-fade-enter, .m-imgSlide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.m-imgSlide-box {
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
}
.m-imgSlide-drop {
	width: auto;
	height: auto;
	display: block;
	max-width: 80%;
	max-height: 80%;
}
.m-imgSlide {
	display: inline-block;
	margin:30px 0 0 20px;
}

.m-imgSlide .img-wrap {
	overflow: hidden;
	text-align: center;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}
.m-imgSlide .img-wrap img {
	position: absolute;
}
.m-imgSlide .thumbnail {
	width: 100%;
	margin-top: 5px;
	display: flex;
}
.m-imgSlide .thumbnail li {
	border:2px solid transparent;
	cursor: pointer;
	margin-right: 5px;
}
.m-imgSlide .thumbnail li:last-child {
	margin-right: 0
}
.m-imgSlide .thumbnail li.active {
	border-color: #FF8A80
}
</style>