<template>
	<div :style="listStyle">
		<div class="flex-center add-content" style="color:rgba(0,0,0,1); align-items: flex-start;">
			<template v-if="!showMaxMenus">
				<div class="cat-draw-title">
					添加内容
				</div>
				<div class="flex-center " style="flex-wrap: wrap; justify-content: flex-start;  align-items: flex-start;">
					<!--<div v-for="(item, index) in menus" :key="index" @click="addMenu" :data-type="item.type" class="flex-center add-content-txt">
						<img class="add-content-img" :src="item.img" /> {{item.txt}}
					</div>-->
					<template v-for="(item, index) in menus" >
						<div v-if="!selectOnlyOne"  @click="addMenu"  :data-type="item.type" class="flex-center add-content-txt add-content-txt1">
							<img class="add-content-img" :src="item.img" /> {{item.txt}}
						</div>
						<div v-else :class="{'add-content-txt1' : selectOnlyOneObj.replyType == item.type}" @click="addMenu"  :data-type="item.type" class="flex-center add-content-txt">
							<img class="add-content-img" :src="selectOnlyOneObj.replyType == item.type ? item.img : item.img1" /> {{item.txt}}
						</div>
					</template>
				</div>
			</template>
			
			<!--已达上限-->
			<!--<div v-else class="content-limit-reached">内容数量已达上限</div>-->
			<div v-else class="flex-center add-button"  style="color:#A9AAB1">
					<!-- <Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon> -->
					<i class="el-icon-plus" style="margin-right: 6px;font-size:20px;"></i>
					内容数量已达上限
				</div>
		</div>
		
	</div>
</template>
<script>
	export default {
		name: 'catDrawListAddMenu', //图片，音频和视频
		props: {
			listStyle: {
				width: '351px',
			},
			showMaxMenus: {
				type: Boolean,
				default: false, //是否显示上限按钮
			},
			selectOnlyOne: {
				type: Boolean,
				default: false, //0527新增是否值选择一个，默认是可以选择多个的
			},
			//0527新增是否值选择一个，默认是可以选择多个的
			selectOnlyOneObj: {
				type: Object,
				default: function() {
					return {
						nodeType: 'text', 
					}
				},
			},
		},
		components: {},
		data: function() {
			return {
				menus: [{
						txt: '文字',
						type: 'text',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/text.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/text1.png', //未选中的状态
					},
					{
						txt: '图片',
						type: 'image',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/images.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/images1.png', //未选中的状态
					},
					{
						txt: '音频',
						type: 'voice',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/audio.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/audio1.png', //未选中的状态
					},
					{
						txt: '视频',
						type: 'video',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/video.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/video1.png', //未选中的状态
					},
					{
						txt: '单卡',
						type: 'singleCard',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/simpleCard.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/simpleCard1.png', //未选中的状态
					},
					{
						txt: '多卡',
						type: 'manyCards',
						img: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/multipleCard.png',
						img1: 'http://down3.bizport.cn/rcs/chatbot/images/20200318/multipleCard1.png', //未选中的状态
					},
				]
			}
		},
		methods: {
			addMenu(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				this.$emit("addMenu", {
					addMenuType: clickType
				}); //自定义事件 此方法直接出发父组件中的显示数据的方法
			},
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
	.add-content {
		font-size: 14px;
		line-height: 22px;
		cursor: pointer;
		height: inherit;
		justify-content: flex-start;
		/*padding: 17px 16px;*/
		padding: 12px 16px;
	}
	
	.add-content-icon {
		margin-right: 6px;
	}
	
	.add-content-txt {
		font-size: 14px;
		/*color: rgba(24, 144, 255, 1);*/
		margin-left: 15px;
		/*移上去显示手指*/
		cursor: pointer;
		
		color: #979797;
	}
	
	.add-content-txt1 {
		color: rgba(24, 144, 255, 1);
	}
	
	.add-content-img {
		width: 12px;
		height: 12px;
		margin-right: 6px;
	}
	
	.instance-top-content {
		width: 100%;
		height: 198px;
		background: rgba(255, 255, 255, 1);
	}
	
	.upload-img {
		width: 116px;
		height: 116px;
	}
	
	.cat-draw-title {
		min-width: 60px;
	}
	
	/*新增回复已达上限*/
	.content-limit-reached {
		font-size:14px;
		color:rgba(0,0,0,0.25);
	}
	.add-button {
		font-size: 12px;
		border-radius: 0 0 4px 4px;
		padding: 0 16px;
		cursor: pointer;
	}
</style>