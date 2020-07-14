<template>
	<div class="flex-center" style="position: relative;" :style="inputQuoteStyle">
			<div class="txt-limit-div" :class="{'handle-text-blocking' : maxlength }" style="position: relative; width: 100%;">
  					<!-- <Input v-model="inputAboutQuoteOne[quoteKey]" @on-change="onChangeInput($event)" :type="type" :rows="1" :placeholder="placeholder" :id="inputId" :size="size" /> -->
  					<m-input v-model="inputAboutQuoteOne[quoteKey]" :maxlength="maxlength" @input="onChangeInput" :type="type" :rows="1" :placeholder="placeholder" :id="inputId" :size="size" />
  					<!-- <template v-if="maxlength">
  						<span v-if="size=='small'" class="txt-limit1" >{{calculateStringActualLength(inputAboutQuoteOne[quoteKey])}}/{{maxlength}}</span>

  						<span v-else class="txt-limit">{{calculateStringActualLength(inputAboutQuoteOne[quoteKey])}}/{{maxlength}}</span>
  					</template> -->
  				</div>

			<!--新增emoji输入-->
			<roEmoji  v-if="showQuoteEmoji"  @addCatEmoji="addCatEmoji" class="about-quote-icon" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" ></roEmoji>

			<catDrawPoptip v-if="showQuote"  class="about-quote-icon" @drawQuote="drawQuote" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :size="size"></catDrawPoptip>
		</div>
</template>
<script>
	import catDrawPoptip from '../catDrawPoptip' //引用的图标

	import roEmoji from '../roEmoji/roEmoji'  //emoji输入框

	import { removeEmoji, getUUID, emojiCharStringLen, emojiCharStringSubstr } from '../util'

	//带上引用和emoji输入的input输入框
	export default {
		name: 'roInputAboutQuoteOne',
		components: {
			catDrawPoptip,
			roEmoji,
		},
		props: {
			nowNode: Object, //当前的节点
			nodeList: Array, //所有的节点
			otherNodeList: Array, //合并其他任务的节点
			//主要看下面3个值是否需要满足
			inputAboutQuoteOne: {
				type: Object,
				default: function() {
					return {}
				},
			}, //循环的引用内容

			maxlength: {
				type: Number,
				default: undefined,
			}, //长度限制，用于截取数据
			//设置样式
			inputQuoteStyle: {
				type: Object,
				default: function() {
					return {}
				},
			},
			//input的type，可以是text或textarea
			type: {
				type: String,
				default: 'text',
			},
			quoteKey: {
				type: String,
				default: 'originalMessage',
			},
			size: {
				type: String,
				default: 'default', //设置input时的small
			},
			placeholder: {
				type: String,
				default: '请输入', //设置默认的提示
			},

			showQuote: {
				type: Boolean,
				default: false, //是否显示引用组件
			},
			showQuoteEmoji: {
				type: Boolean,
				default: false, //是否显示emoji引用输入
			},
		},
		data: function() {
			return {
				inputId: getUUID(),
				index: 0,
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
			drawQuote(data) {
				this.selectionStart(data.currentIndex, data.nodeName) //添加到原来的input里面去
			},
			selectionStart(index, quote) {
				//				quote = `{${quote}}`
				//添加到原来的内容里
				//				var index = dataset.index

//				var emojiInput = this.inputId + index //获取的id
				var emojiInput = this.inputId //获取的id
				var elInput = document.getElementById(emojiInput); //根据id选择器选中对象
				var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
				var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
				if(startPos === undefined || endPos === undefined) return
				var txt = elInput.value;
				//		      // 将表情添加到选中的光标位置
				var result = txt.substring(0, startPos) + quote + txt.substring(endPos)

				//	如果有才去限制长度
				if(this.maxlength) {
//					result = result.slice(0, this.maxlength)
					result = emojiCharStringSubstr(result, 0, this.maxlength) //截取实际的长度
				}

				elInput.value = result; // 赋值给input的value
				// 重新定义光标位置
				elInput.focus();
				elInput.selectionStart = startPos + quote.length;
				elInput.selectionEnd = startPos + quote.length;

				//处理没有触发input的值
				const inputEvent = new Event('input')
				elInput.dispatchEvent(inputEvent)
			},

//			//新增监听input改变值
			onChangeInput(val) {
				//如果没有，不用去设置了
				if(!this.maxlength) {
					return
				}

				// var value = event.target.value
				var value = val

				var len = emojiCharStringLen(value)
				//需要取截取长度
				if(len <= this.maxlength) {
					return
				}

				var result = emojiCharStringSubstr(value, 0, this.maxlength) //截取实际的长度
				var emojiInput = this.inputId //获取的id
				var elInput = document.getElementById(emojiInput); //根据id选择器选中对象
				elInput.value = result; // 赋值给input的value

				//处理没有触发input的值
				const inputEvent = new Event('input')
				elInput.dispatchEvent(inputEvent)
			},
			//新增添加emoji表情
			addCatEmoji(data) {
				this.selectionStart(data.currentIndex, data.emoji) //添加到原来的input里面去
			},
		},
		created() {
			var that = this
		},
		mounted() {},
		directives: {
			dbClick: {
				inserted(el, binding) {
					el.addEventListener('click', e => {
						if(!el.disabled) {
							el.disabled = true;
							let timer = setTimeout(() => {
								el.disabled = false;
							}, 1000)
						}
					})
				}
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../asset/css/default.css';
	/*新增文字长度提示限制*/
	.txt-limit-div {
		/deep/ .ivu-input {
			resize: none;
		}
	}
	/*0508新增挡住文字的问题,如果有文字长度限制就加上这个*/
	.handle-text-blocking {
		/deep/ .ivu-input {
			padding-right: 43px !important;
		}
	}

	.txt-limit {
		position: absolute;
		top: 2px;
		right: 5px;
		background: #fff;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
		opacity: 0.25;
	}

	.txt-limit1 {
		position: absolute;
		top: 1px;
		right: 5px;
		background: #fff;
		height: 22px;
		line-height: 22px;
		color: #000;
		border-radius: 4px;
		opacity: 0.25;
	}

	.about-quote-one {
		position: absolute;
		right: 1px;
		top: 5px;
	}
	/*小输入框时的样式*/

	.about-quote-one-small {
		position: absolute;
		right: 2px;
		top: 2px;
	}

	.about-quote-icon {
		margin-left: 15px;
	}
</style>
