<template>
	<div>
		<div class="flex-center instance-top">
			<div class="flex-center">
				<div class="flex-center add-content-txt" style="font-size: 12px; margin-left: 0; margin-right: 12px; color: inherit">
					<!--<img class="add-content-img" src="http://down3.bizport.cn/rcs/chatbot/images/20200226/robot.png" /> 文字-->
					<img class="add-content-img" :src="menusIcon[item.replyType].img" /> {{menusIcon[item.replyType].txt}}
				</div>
				<!--<span v-if="item.replyType == 'text'">{{item.originalMessage && item.originalMessage.length || 0}}/{{maxlength}}</span>-->
				<span v-if="item.replyType == 'text'" style="font-size:12px;">{{calculateStringActualLength(item.originalMessage)}}/{{maxlength}}</span>
			</div>

			<div>
				<!--右侧侧操作按钮-->
				<slot name="quote"></slot>
			</div>
		</div>
	</div>
</template>
<script>
	import {emojiCharStringLen, emojiCharStringSubstr} from '../../util'
	
	export default {
		name: 'catDrawListTop', //图片，音频和视频
		props: {
			item: Object,
		},
		components: {},
		data: function() {
			return {
				maxlength: 600,
				menusIcon: {
					'text': {
						txt: '文字',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/text1.png',
					},
					'image': {
						txt: '图片',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/images1.png',
					},
					'voice': {
						txt: '音频',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/audio1.png',
					},
					'video': {
						txt: '视频',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/video1.png',
					},
					'singleCard': {
						txt: '单卡',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/simpleCard1.png',
					},
					'manyCards': {
						txt: '多卡',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/multipleCard1.png',
					},
				},
			}
		},
		computed:{
		  //改变备注的长度，长度大于14位就用...代替剩余内容
		  calculateStringActualLength(){
		      //text就是所传参数
		      return function (text) {
		      		var len = 0
		      		if(text) {
		      			len = emojiCharStringLen(text)
		      		}
		    			return len
		      }
		  }
		},
		methods: {
		},
		created() {},
		mounted() {
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import '../../asset/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
	}

	.add-content-txt {
		font-size: 14px;
		color: rgba(24, 144, 255, 1);
		margin-left: 16px;
		/*移上去显示手指*/
		cursor: pointer;
	}

	.add-content-img {
		width: 12px;
		height: 12px;
		margin-right: 6px;
	}
</style>
