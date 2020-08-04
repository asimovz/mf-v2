<template>
	<!--表情选择器-->
	<m-popover :value="visible" popper-class="cat-draw-emoji" placement="bottom-end" width="320" style="padding:0px;">
	<!-- <Poptip v-model="visible" :transfer="true" popper-class="cat-draw-emoji" placement="bottom-end" width="320" padding="0px"> -->
		<!-- <Icon v-if="showPoptip" class="cursor-pointer instance-top-link" type="android-happy" size="16"></Icon> -->
		<svg v-if="showPoptip" t="1594104720172" class="icon cursor-pointer instance-top-link" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1994" width="16" height="16"><path d="M512 63.9C264.5 63.9 63.9 264.5 63.9 512S264.5 960.1 512 960.1 960.1 759.5 960.1 512 759.5 63.9 512 63.9z m271.6 719.7c-35.3 35.3-76.4 63-122.1 82.3-47.3 20-97.6 30.2-149.5 30.2S409.8 886 362.5 865.9c-45.7-19.3-86.8-47-122.1-82.3s-63-76.4-82.3-122.1c-20-47.3-30.2-97.6-30.2-149.5s10.1-102.2 30.2-149.5c19.3-45.7 47-86.8 82.3-122.1s76.4-63 122.1-82.3c47.3-20 97.6-30.2 149.5-30.2s102.2 10.1 149.5 30.2c45.7 19.3 86.8 47 122.1 82.3s63 76.4 82.3 122.1c20 47.3 30.2 97.6 30.2 149.5S886 614.2 865.9 661.5c-19.3 45.7-47 86.8-82.3 122.1z" fill="#000000" p-id="1995"></path><path d="M704.1 384.2m-64.1 0a64.1 64.1 0 1 0 128.2 0 64.1 64.1 0 1 0-128.2 0Z" fill="#000000" p-id="1996"></path><path d="M320.1 384.2m-64.1 0a64.1 64.1 0 1 0 128.2 0 64.1 64.1 0 1 0-128.2 0Z" fill="#000000" p-id="1997"></path><path d="M512.1 831.7c141.2 0 255.7-114.5 255.7-255.7H256.5c-0.1 141.3 114.4 255.7 255.6 255.7z" fill="#000000" p-id="1998"></path></svg>
		<div class="instance-linkbox" slot="content">
			<!--放在内部显示和隐藏-->
			<roEmojiPicker :name="name" @selectEmoji="addCatEmoji"></roEmojiPicker>
		</div>
	<!-- </Poptip> -->
	</m-popover>
</template>
<script>
	import roEmojiPicker from "../roEmojiPicker/roEmojiPicker" //emoji输入框

	export default {
		name: 'roEmoji',
		props: {
			currentIndex: {
				type: Number,
				default: 0, //请求的地址
			},
			aboutObj: Object, //需要传递过来的值
		},
		components: {
			roEmojiPicker,
		},
		data: function() {
			return {
				showPoptip: true, //是否显示图标
				name: 'pick',
				
				visible: false,
			}
		},
		methods: {
			clickAll(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType]()
					return
				}
			},
			addCatEmoji(val) {
				var that = this
				//关闭弹窗
				this.visible = false

				this.$emit('addCatEmoji', {
					currentIndex: this.currentIndex,
					emoji: val,
					aboutObj: this.aboutObj,
				})
			},
		},

		created() {},
		mounted() {},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import '../asset/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.instance {
		border-bottom: 1px solid @defaultBorder;
	}
	
	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
	}
	
	.instance-linkbox {
		font-size: 12px;
		line-height: 22px;
	}
	
	.instance-linkbox-title {
		color: rgba(174, 173, 177, 1);
		margin-top: 4px;
		display: inline-block;
	}
	
	.instance-linkbox-input {
		margin-bottom: 8px;
	}
</style>