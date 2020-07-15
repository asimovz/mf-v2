<template>
	<!--选择素材的弹窗-->
	<m-modal :id="id" :value="visible" :showClose="false" :title="modalTitle" :width="780" :height="600">
		<div v-if="showListArr.length">
				<div v-if="showListArr.length > 1" class="ivu-tabs-nav-scroll" style="margin-bottom: 10px;">
			   <div v-for="(item,index) in showListArr" :key="index"  @click="changTab(item)" :class="{'ivu-tabs-tab-focused' : (materialType == item), 'ivu-tabs-tab-active' : (materialType == item),}" class="ivu-tabs-nav">
			    <div v-if="materialType == item" class="ivu-tabs-ink-bar ivu-tabs-ink-bar-animated" style="visibility: visible; width: 60px; transform: translate3d(0px, 0px, 0px);" ></div>
			    <div class="ivu-tabs-tab">
			     {{titlesMateria[item]}}
			    </div>
			   </div>
			 </div>

			<div label="图片" name="pic" v-show="catChooseShow.showPic && materialType == 'pic'">
				<div id="zhl_scroll" class="choose-template">
					<div v-if="!materialList.picAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.picList" class="flex-center pop-list1">
						<template v-if="materialList.picList.length == 0">
							<div class="nodata">审核通过的图片素材为空</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.picList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<img class="template-litop-img" :src="img.materialUrl" />

										<!--<div class="preview-cover" v-bind:class="{ 'img-checked':img.checked}">
											<div class="outline-blank">
												<Icon v-if="img.checked" type="checkmark-circled" color="#2d8cf0" size="16"></Icon>
											</div>
										</div>-->
									</div>

									<div v-if="img.checked" class="template-li-checkmark">
											<!-- <Icon class="template-li-icon" type="android-done"  color="#fff" size="16"></Icon> -->
											<i class="el-icon-check template-li-icon" style="color:#fff;font-size:16px;"></i>
									</div>

									<div class="text-two template-litop-title">
										{{img.materialName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>
			<div label="音频" name="voice" v-show="catChooseShow.showVoice && materialType == 'voice'">
				<div id="zhl_scroll1" class="choose-template">
					<div v-if="!materialList.voiceAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.voiceList" class="flex-center pop-list1">
						<template v-if="materialList.voiceList.length == 0">
							<div class="nodata">审核通过的音频素材为空</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.voiceList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<div class="chat-detail-cover"></div>
										<div class="position-center chat-detail-play"></div>
										<div class="position-center chat-detail-play1"></div>
										<!-- <Icon class="position-center" type="ios-play" size="18" color="rgba(255,255,255,0.85)" style="margin-left: 2px;"></Icon> -->
										<i class="el-icon-caret-right position-center" style="color:rgba(255,255,255,0.85);font-size:18px;margin-left: 2px;"></i>
										<!--<div class="preview-cover" v-bind:class="{ 'img-checked':img.checked}">
											<div class="outline-blank">
												<Icon v-if="img.checked" type="checkmark-circled" color="#2d8cf0" size="16"></Icon>
											</div>
										</div>-->
									</div>

									<div v-if="img.checked" class="template-li-checkmark">
											<!-- <Icon class="template-li-icon" type="android-done"  color="#fff" size="16"></Icon> -->
											<i class="el-icon-check template-li-icon"  style="color:#fff;font-size:16px;"></i>
									</div>

									<div class="text-two template-litop-title">
										{{img.materialName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>
			<div label="视频" name="video" v-show="catChooseShow.showVideo && materialType == 'video'">
				<div id="zhl_scroll2" class="choose-template">
					<div v-if="!materialList.videoAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.videoList" class="flex-center pop-list1">
						<template v-if="materialList.videoList.length == 0">
							<div class="nodata">审核通过的视频素材为空</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.videoList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<!--<img class="template-litop-img" :src="img.materialUrl" />-->
										<img v-if="img.thumbnailMediaUrl" class="template-litop-img" :src="img.thumbnailMediaUrl">
										<video v-else class="template-litop-img" :src="img.materialUrl"></video>

										<div class="chat-detail-cover"></div>
										<div class="position-center chat-detail-play"></div>
										<div class="position-center chat-detail-play1"></div>
										<!-- <Icon class="position-center" type="ios-play" size="18" color="rgba(255,255,255,0.85)" style="margin-left: 2px;"></Icon> -->
										<i class="el-icon-caret-right position-center" style="color:rgba(255,255,255,0.85);font-size:18px;margin-left: 2px;"></i>
										<!--<div class="preview-cover" v-bind:class="{ 'img-checked':img.checked}">
											<div class="outline-blank">
												<Icon v-if="img.checked" type="checkmark-circled" color="#2d8cf0" size="16"></Icon>
											</div>
										</div>-->
									</div>

									<div v-if="img.checked" class="template-li-checkmark">
											<i class="el-icon-check template-li-icon"  style="color:#fff;font-size:16px;"></i>
									</div>

									<div class="text-two template-litop-title">
										{{img.materialName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>
		</div>

		<slot name="footer">
			<div class="pop-footer">
				<m-button :disabled="!fileList.checked" type="primary" @click.native="rejectConfirm" style="margin-right: 24px;">确认</m-button>
				<m-button @click.native="confirmDelete">取消</m-button>
			</div>
		</slot>
	</m-modal>
</template>
<script>
	var isTest = false //是否是测试环境
	import { AboutMaterial } from './aboutMaterial.js' //选择素材的弹窗

	//引入去除的正则表达式
	import { transformTime, checkURL, dealNoFileType, producedAllCaseCombination, removeEmoji, removeEmojiFrontSpace, removeEmojiAllSpaceChinese, removeEmojiHttpsChinese, getUUID, setMediaType } from '../util' //时间戳转时间,用于排序

	import catDrawListData from '../catRobotNew/cardType/catDrawListData'  //初始化media

	export default {
		name: 'catChoose',
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			botId: {
				type: String,
				default: '102658',
			},
			id: {
				type: String,
				default: '',
			},
			//0608新增设置素材
			materialList: {
				type: Object,
				default: function() {
					return {
						picList: [],
						voiceList: [],
						videoList: [],
					}
				},
			},
		},
		components: {
		},
		data: function() {
			return {
				maapApplyInfo: {
					botId: '',
					//					remark: '',
					chatbotName: ''
				},
				maapApplyValidate: {
					botId: [{
						required: true,
						message: '归属机器人不能为空',
						trigger: 'change'
					}, ],
				},
				chatbotList: [],
				uploadFileList: [],
				chatbotData: {
					chatbotName: ''
				},

				baseInfo: {
					templateName: '',
					templateDesc: '',
					templateLogo: '',
				},
				uploadType: {
					upLoadData: {
						mediaType: 'video',
					},
					mediaType: 'video',
					format: producedAllCaseCombination(['3gp', 'mp4']), //限制上传格式
					maxSize: 512000, //小于500m
					tishiTitle: '上传视频',
					accept: 'video/mp4,video/3gp',
					data: {
						'mediaType': 'video',
						'botId': this.botId
					}
				},
				uploadTypePic: {
					upLoadData: {
						mediaType: 'pic',
					},
					mediaType: 'pic',
					format: producedAllCaseCombination(['jpg', 'gif', 'png', 'bmp']), //限制上传格式
					//					maxSize: 2048, //小于2m
					tishiTitle: '上传封面',
          accept: '.jpg, .gif, .png, .bmp',
					data: {
						'mediaType': 'pic',
						'botId': this.botId,
						isCoverPic: true,
					}
				},
				videoResponse: {},
				picResponse: {},

				fileList: {}, //选择的对象
				showLoading: false, //是否显示loading动画

								materialType: 'pic', //图片素材

				showListArr: [], //可以展示列表的权限
				catChooseShow: {
					showPic: true, //显示图片
						showVoice: true, //显示音频
						showVideo: true, //显示视频
				},
				modalId: '',

				titlesMateria: {
					pic: '图片',
					voice: '音频',
					video: '视频',
				},

				modalTitle: '选择素材',  //设置title名字
			}
		},
		methods: {
			//改变当前的tab
			changTab(materialType) {
				this.materialType = materialType //设置类型
			},
			confirmDelete() {
				//新增关闭弹窗
				this.$emit("update:visible", false)
				// this.$root.eventBus.$emit("modal_visible_change_" + this.id)
			},
			rejectConfirm() {
				if(!this.fileList.checked) {
					
					this.handleNotice('未选择素材','info')
//		   		this.$Message.info("未选择素材");
					this.picResponse = {}
					return  //0629新增未选择素材，不让提交
				} else {
					this.picResponse = this.fileList
				}

				this.confirmDelete() //关闭当前的弹窗
				 //0609新增弹窗
				this.$root.eventBus.$emit("modal_material_modal_media", {
					materialObj: this.picResponse.materialFileProperty || new catDrawListData.CatMedia(), //选择的素材obj
					modalId: this.modalId,
				})
			},
			selectThis: function(i, isTrue) {
				var materialType = this.materialType
				var list = this.materialList[materialType + 'List']
				list.forEach(function(t, index) {
					if(index != i) {
						t.checked = false;
					}
				})
				var obj = list[i]

//				obj.checked = true  //选中的状态
				if(isTrue) {
					obj.checked = isTrue
				} else {
					obj.checked = !obj.checked
				}

				this.fileList = obj.checked ? obj : {}
//				//清空其他2个tab下选择的
				this.clearOther(materialType)

				this.$set(this.materialList[materialType + 'List'], i, obj) //这里需要改变数组，需要使用$set
			},
			clearOther(materialType) {
				//清空其他2个tab下选择的
				var list1 = {
					'voice': ('voice' + 'List'),
					'pic': ('pic' + 'List'),
					'video': ('video' + 'List'),
				}
				var list = {
					'pic': 'showPic',
					'voice': 'showVoice',
					'video': 'showVideo',
				}
				for(var key in list1) {
					if(key != materialType && this.catChooseShow[list[key]]) {
						var value = list1[key]
						var arr = this.materialList[value] || []
						arr.forEach((t, i) => {
							var obj = t
							obj.checked = false;
							this.$set(this.materialList[value], i, obj) //这里需要改变数组，需要使用$set
						})
					}
				}
			},
			//得到所有的需展示list的数组
			showArr() {
				var list = {
						'pic': 'showPic',
						'voice': 'showVoice',
						'video': 'showVideo',
					}
					var result = []
					for(var key in list) {
						if(this.catChooseShow[list[key]]) {
							result.push(key)
						}
					}
					this.showListArr = result
					this.materialType = this.showListArr[0] //显示第一个
					return result
			},
			setChooseStyle(obj) {
//				this.showListArr = []  //清空之前的之前的数据
//				this.$forceUpdate();
				this.setChooseStyleNew(obj)
//				this.$nextTick(() => {
//					this.setChooseStyleNew(obj)
//				})
				//0629新增滑动到顶部
				this.$nextTick(() => {
					document.getElementById('zhl_scroll').scrollTop =0
					document.getElementById('zhl_scroll1').scrollTop =0
					document.getElementById('zhl_scroll2').scrollTop =0
				})
			},
			//根据之前的去展示对应的选中状态
			setChooseStyleNew(obj) {
				var item = obj.mediaReply
				this.catChooseShow = obj.catChooseShow  //设置菜单
				this.modalId = obj.modalId
						//设置权限
					this.showArr()

				var materialId = item.materialId || ''
				if(!materialId || !item.mediaUrl) {
					this.clearOther()

					//0629新增设置弹窗title
					this.setTitle()

					this.fileList = {}  //清空之前的数据
					return
				}

//				//0629新增没有添加mediaType
//				if(!item.mediaType) {
//					item.mediaType = setMediaType(item.mediaContentType) //类型
//				}
//				var materialType = item.mediaType  //设置第几个tab
				var materialType = item.mediaType || setMediaType(item.mediaContentType)  //设置第几个tab

				this.materialType = materialType || 'pic'  //设置materialType

				//0629新增设置弹窗title
				this.setTitle()

				var list1 = {
					'voice': ('voice' + 'List'),
					'pic': ('pic' + 'List'),
					'video': ('video' + 'List'),
				}
				var list = this.materialList[list1[materialType]] || []
				var index = 0
				list.forEach((item1, i) => {
					if(item1.materialId == materialId) {
						index = i
					}
				})
				this.selectThis(index, true)
			},
			//0629新增设置弹窗title
			setTitle() {
				var showListArr = this.showListArr || []
				var materialType = this.materialType || 'pic'
				var list = {
						'pic': '选择图片',
						'voice': '选择音频',
						'video': '选择视频',
					}
				if(showListArr.length == 1) {
					this.modalTitle = list[materialType]
				} else {
					this.modalTitle = '选择素材'
				}
			}
		},
		created() {},
		mounted() {},
		destroyed() {
			this.$root.eventBus.$off("modal_material_modal_media")  //0624新增销毁eventBus
		},
	}
</script>
<style lang='less' scoped>
	@import '../asset/css/default.css';
	@default: #E2E2E2;
	.add-button {
		width: 100%;
		margin-top: 24px;
	}

	.upload-title {
		height: 22px;
		line-height: 22px;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.43);
		margin-top: 5px;
	}
	/*0601新增样式*/

	.upload-frame {
		width: 482px;
		height: 226px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		flex-direction: column;
	}

	.upload-frame-div {
		/deep/ .ivu-upload-drag {
			border: 1px solid rgba(151, 151, 151, 0.15);
		}
	}

	.upload-before {
		width: 278px;
		height: 156px;
		border-radius: 4px;
		border: 1px dashed rgba(0, 0, 0, 0.15);
		flex-direction: column;
	}

	.play-video-icon {
		width: 36px;
		height: 36px;
		background: #EBEEF5;
		border-radius: 4px;
	}
	/*0604新增样式*/

	.search-li {
		margin-left: 24px;
	}

	.search-li-title {
		width: 84px;
		text-align: end;
	}

	.phone-input {
		width: 274px;
	}

	.template-ul {
		flex-wrap: wrap;
	}

	.template-li {
		width: 312px;
		height: 210px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 2px 2px 16px 0px rgba(0, 0, 0, 0.05);
		border-radius: 2px;
		position: relative;
		overflow: hidden;
	}

	.template-litop-img {
		width: 312px;
		height: 154px;
		position: relative;
		object-fit: contain;
	}

	.template-litop-title {
		width: 300px;
		height: 56px;
		line-height: 56px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.9);
		text-align: center;
		-webkit-line-clamp: 1;
		white-space: inherit;
	}

	.choose-template {
		max-height: 520px;
		overflow-y: auto;
		background: #fff;

		height: 480px;
		overflow: auto;
	}

	.pop-list1 {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		.pop-listli {
			margin-right: 48px;
			margin-bottom: 36px;
		}
		.pop-listli:nth-child(2) {
			margin-right: 0;
		}
	}

	.nodata {
		width: 100%;
		text-align: center;
		margin: 100px 0;
	}

	.outline-blank {
		position: absolute;
		top: 17px;
		right: 104px;
	}

	.img-checked {
		display: block;
		background-color: rgba(67, 129, 230, 0.2) !important;
		box-shadow: none !important;
	}
	/*0608新增选择素材*/
	.chat-detail-cover {
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(169, 170, 177, 0.25);
		width: 100%;
		height: 100%;
	}

	.chat-detail-play {
		width: 50px;
		height: 50px;
		background: rgba(0, 0, 0, 0.65);
		border-radius: 50%;
		opacity: 0.3;
	}

	.chat-detail-play1 {
		width: 30px;
		height: 30px;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		opacity: 0.25;
	}

	.position-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	/*0624修改选中状态*/
	.template-li:hover {
		border: 1px solid rgba(24,144,255,0.5);
	}
	.template-li-checked {
		border: 2px solid #1890ff !important;
	}
	.template-li-checkmark {
		position: absolute;
		right: 0;
		top: 0;

		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 36px 36px 0;
		border-color: transparent #1890ff transparent transparent;
	}
	.template-li-icon {
		position: absolute;
		right: -33px;
    top: 2px;
	}
</style>
