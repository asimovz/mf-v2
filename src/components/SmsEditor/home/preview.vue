<template>
	<div class="mmsPreview mms-phone">
		<div class="content-wrapper">
			<div v-for="(item, index) in data" :class="['mms-item', `mms-item--${item.type}`]">
				<div v-if="item.type === 'text'">{{item.content}}</div>
				<img v-if="item.type === 'pic'" :src="item.src">
				<video v-if="item.type === 'video'" :src="item.src" controls></video>
				<audio v-if="item.type === 'voice'" :src="item.src" controls></audio>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'mms-preview',
		props: {
			data: {
				type: Array,
				default: () => []
			}
		},
	}
</script>

<style lang="less">
	.mmsPreview{
		position: relative;
		// display: inline-block;
		margin: 10px auto;
    width: 320px;
    height: 640px;
    user-select: none;
	}

	.mms-phone{
		background: url(../../assets/img/phone_bg.png) no-repeat;
		&:after{
			content: '';
      background: url(../../assets/img/phone_bottom_bg.png) no-repeat;
      width: 320px;
      height: 18px;
      position: absolute;
      bottom: 17px;
      left: 0;
      z-index: 1;
      background-position: 0px -18px;
		}
	}

	.mms-item{position: relative;margin-bottom: 5px;}

	.mms-item--video{
		padding-top: 56.25%;background-color: #000;
		& > video{position: absolute;top: 0;height: 100%;width: 100%}
	}
	.content-wrapper{
		position: absolute;left: 17px;top: 43px;right: 17px;bottom: 20px;overflow: auto;
		img, video, audio{width: 100%;}
	}

	.content-wrapper::-webkit-scrollbar {
	  width: 4px;
	  height: 1px;
	}

	.content-wrapper::-webkit-scrollbar-thumb {
	  -webkit-box-shadow: inset 0 0 0 2px #dedede;
	  box-shadow: inset 0 0 0 2px #dedede;
	  border-radius: 20px;
	}
	.content-wrapper::-webkit-scrollbar-track {
	  background: #FFF;
	}

</style>