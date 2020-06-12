<template>
	<div>
		<ul :class="['style-grid-wrap',{'style-grid-info':!noInfo}]">
			<template v-for="(item,index) in list">
				<li class="grid-item">
					<div class="item-content">
						<m-img-slide  :imgList="item.imgList" :size="imgWidth"></m-img-slide>
						<div class="item-data" :style="{'cursor': 'pointer','width':imgWidth+'px'}" @click="linkToDetail(item.url)">
							<template v-if="item.styleInfo">
								<p>设计号：{{item.styleInfo.designNumber}}</p>
								<p>款式号：{{item.styleInfo.pseudoId}}</p>
								<p>款式名称：{{item.styleInfo.productName}}</p>
							</template>
							<template v-if="item.rawInfo">
								<p>物料简码：{{item.rawInfo.pseudoId}}</p>
								<p>物料名称：{{item.rawInfo.productName}}</p>
							</template>
						</div>
					</div>
					<ul class="item-info" v-if="item.info">
						<li v-for="info in item.info" :style="{'background':itemBgColor(info.bgColor),'color':info.fontColor}">{{info.title}}</li>
						<li :style="{'background':item.phaseInfoMap.bgColor,'color':item.phaseInfoMap.fontColor}" v-if="item.phaseInfoMap.firstTitle!=''">
							<span>{{item.phaseInfoMap.firstTitle}}</span>
							<span>{{item.phaseInfoMap.secondTitle}}</span>
						</li>
					</ul>

<!-- 					<div class="item-content">
						<m-img-slide  :imgList="item.imgList" :size="imgWidth"></m-img-slide>
						<ul class="item-info" v-if="item.info">
							<li v-for="info in item.info" :style="{'background':info.bgColor,'color':info.fontColor}">{{info.title}}</li>
							<li :style="{'background':'#ccc','color':item.phaseInfoMap.fontColor}">
								<span>{{item.phaseInfoMap.firstTitle}}</span>
								<span>{{item.phaseInfoMap.secondTitle}}</span>
							</li>
						</ul>
						<div class="qrMark" :style="styles" @mouseenter="showQr(index)" @mouseleave="clearQr"></div>
						<transition name="fade">
							<div class="qr" :style="styles" v-show="item.qr" @mouseleave="hiddenQr(index)">
								<img :src="item.qrGeneratorUrl+item.qrUrlWithParams" alt="">
							</div>
						</transition>
					</div> -->

				</li>	
			</template>
		</ul>
		<div class="pagination_box">
			<m-page 
				:enable-all="false"
		        :max-allowed-count="30"
		        :paginate="{count:total, pageIndex:pageIndex, pageSize:pageSize, pageMaxIndex:pageMaxIndex}" 
		        :ref="'_page'"
		        :show-total="true"
		        :pageSizeOpts="[30,60,90]"
		        :page-change="'style_grid_page_change'"
	        >
	        </m-page>				
		</div>

	</div>

</template>
<script>

export default {
	name:'m-style-grid',
	props: {
		dataUrl: String,
		id: String,
		name: String,
		searchForm: String
	},
	data() {
		return {
			list:[],
			paginate:{},
			pageSize:30,
			pageIndex:0,
			total:0,
			queryKey:'',
			isSearch: false,
			oldParam:null,
			imgWidth:0,
			lastTime:null,
			noInfo: true,
			contentWidth: document.querySelector('.page-con').offsetWidth - 90,
			screen: document.body.offsetWidth
		}
	},
	computed: {
		pageMaxIndex() {
			let p = this.total/this.pageSize
			return p < 1 ? 1 : Math.ceil(p) + 1
		},
		styles() {
			return {
				width:this.imgWidth + 'px',
				height:this.imgWidth + 'px',

			}
		}
	},
	created: function() {
		this.getData()
	},
	mounted: function() {
		this.$root.eventBus.$on("style_grid_page_change",(data) => {
			this.getData(data)
		})
		if(this.searchForm)
			this.$root.eventBus.$on("search_form_data_"+this.searchForm, (data) => {
				var jsonData = {};
				for (let pair of data.entries()) {
						jsonData[pair[0]] = pair[1];
				}
				// console.log('formDataJson => ', jsonData); 
				this.getData({'searchJson':jsonData})
			})
	},
	methods: {
		setImgOption() {
			let showNum = this.noInfo ? 6 : 4
			if(this.screen > 1400) {
				showNum = this.noInfo ? 6 : 5
			}
			if(this.screen > 1580) {
				showNum = this.noInfo ? 6 : 5
			}
			if(this.screen > 1800) {
				showNum = 6
			}
			
			if(this.noInfo) {
				this.imgWidth = Math.floor(this.contentWidth/showNum) - 38
			} else {
				this.imgWidth = Math.floor(this.contentWidth/showNum) - 123
			}
		},
		cancelSearch(event) {
			let value = event.target.value

			if(value == '') {
				this.getData(this.oldParam)
				this.isSearch = false
			}
		},
		search() {
			if(this.queryKey != '') {
				let param = {
					params: this.queryKey
				}
				this.isSearch = true
				this.getData(param)
			}
		},
		getData(param) {
			let data = {}
			if(param) {
				data = {
					params:param
				}
			} else {
				data = {
					params:{pageSize:30}
				}
			}
			if(!this.isSearch) {
				this.oldParam = JSON.parse(JSON.stringify(data))
			}

			this.$root.$http.get(this.dataUrl,data).then(response => {
				if(response.data || response.status == 200){
					this.list = response.data.list
					// this.pageSize = response.data.pageSize
					this.total = response.data.totalCount
					this.noInfo = this.list[0].info == null ? true : false
					this.setImgOption()
				}
			},error =>{
				this.handleNotice('出错了', 'danger')
			})
		},
		clearQr() {
			clearTimeout(this.lastTime)
		},
		hiddenQr(index) {
			this.clearQr()
			if(this.list[index].qr) {
				this.list[index].qr = false
			}
		},
		showQr(index) {
			this.debounce(()=>{
				this.list[index].qr = !this.list[index].qr	
			},300)
		},
		setStyle(str) {
			return statusColor[str]
		},
		debounce (action,time) {
		  clearTimeout(this.lastTime)
		  this.lastTime = setTimeout(function(){
		    action()
		  },time)
		},
		linkToDetail(url) { //跳转到详情页
			this.$root.setUrl(url)
		},
		itemBgColor(value) {
			return value ? value : '#CCC'
		}
	},
	beforeDestroy: function() {
		this.$root.eventBus.$off("style_grid_page_change")
		if(this.searchForm)
			this.$root.eventBus.$off("search_form_data_" + this.searchForm)
	}
}
</script>
<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.style-grid-wrap .m-imgSlide {
	margin:0;
}

.style-grid-wrap {
	margin:0 0 0 0;
}
.style-grid-wrap .grid-item {
	display: inline-flex;
	margin:0 18px 20px 0;
	background: #FFF;
	padding:10px;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	position: relative;
    top: 0px;
	transition: all .2s linear
}
.style-grid-wrap .grid-item:hover{
	/*transform: translate3d(0, -2px, 0);*/
	top: -2px;
	box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.style-grid-wrap .grid-item .item-data {
	margin-top: 5px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}



.style-grid-wrap .item-content {
	position: relative;
	
}
.style-grid-wrap .item-content .qr,
.style-grid-wrap .item-content .qrMark {
	position: absolute;
	background: rgba(0,0,0,.6);
	left: 0;
	top: 0;
	z-index: 99;
	text-align: center;

}
.style-grid-wrap .item-content .qr img {
	width: 80%;
	margin-top: 10%
}

.style-grid-wrap .item-content .qrMark {
	background: transparent;
}

.style-grid-wrap .grid-item .item-info{
	display: inline-block;
	vertical-align: top;
	width: 80px;
	margin-left: 4px;
}
.style-grid-wrap .grid-item .item-info li {
	display: block;
	margin-bottom: 5px;
	padding:3px 0 2px;
	border-radius: 3px;
	text-align: center;
	color:#FFF;
	font-weight: 500;
}

.style-grid-wrap .grid-item .item-info li:last-child{
	
}
.style-grid-wrap .grid-item .item-info li span {
	display: block;
}

.style-grid-wrap .grid-item .item-info li.do {
	background: #F3F4F8;
	color:#333;
	border-left: 4px solid #a2a2a2
}
.style-grid-wrap .grid-item .item-info li.ing {
	background: #ffe77b;
	color:#614f02;
	border-left: 4px solid #d4ad00
}
.style-grid-wrap .grid-item .item-info li.error {
	background: #ff8a8a;
	color:#FFF;
	border-left: 4px solid #d45000
}
.style-grid-wrap .grid-item .item-info li.done {
	background: #B6DF7B;
	color:#48750c;
	border-left: 4px solid #77B12B
}


@media screen and (min-width: 1300px) and (max-width:1410px) {

	.style-grid-wrap  .grid-item:nth-child(6n){
		margin-right: 0
	}
	.style-grid-info  .grid-item:nth-child(6n){
		margin-right: 18px
	}
	.style-grid-info  .grid-item:nth-child(4n){
		margin-right: 0
	}


}
@media screen and (min-width: 1440px) and (max-width:1580px) {
	.style-grid-wrap  .grid-item:nth-child(6n){
		margin-right: 0
	}
	.style-grid-info  .grid-item:nth-child(6n){
		margin-right: 18px
	}
	.style-grid-info  .grid-item:nth-child(5n){
		margin-right: 0
	}
}
@media screen and (min-width: 1600px) and (max-width:1900px) {
	.style-grid-wrap  .grid-item:nth-child(6n){
		margin-right: 0
	}
	.style-grid-info  .grid-item:nth-child(6n){
		margin-right: 18px
	}
	.style-grid-info  .grid-item:nth-child(5n){
		margin-right: 0
	}
}
@media screen and (min-width: 1900px) {

	.style-grid-wrap  .grid-item:nth-child(6n){
		margin-right: 0
	}

}
</style>