<template>
	<div class="page_box">
		<Page :total="page.count" :current="page.pageIndex" :page-size="page.pageSize" :show-total="showTotal" size="small" show-elevator @on-change="pageChanged" :page-size-opts="pageSizeOpts">
		</Page>
		<Select size="small" class="page_size" v-model="page.pageSize" @on-change="pageSizeChanged">
			<Option v-for="item in pageSizeOpts" :key="item" :value="item" style="text-align:center;">{{ item }}条/页</Option>
			<!--<Tooltip :transfer="true"  v-if="enableAll" placement="top" :content="'大于' + maxAllowedCount + '条时不支持全部'" :disabled="this.page.count <= maxAllowedCount">-->
<!-- 			<Option v-if="enableAll" :disabled="page.count > maxAllowedCount" :key="page.count+6666" style="text-align:center;" :value="page.count" @click.native="clickAll">全部</Option> -->
			<!--</Tooltip>-->
		</Select>
	</div>
</template>
<script>
// import _ from 'lodash'
export default {
	name: 'm-page',
	data() {
		return {
			disabledAll: false,
			pageSizeIsAll: false
		}
	},

	props: {
		id: String,
		showTotal: {
			type: Boolean,
			default: true
		},
		showElevator: {
			type: Boolean,
			default: true
		},
		pageSizeOpts: {
			type: Array,
			default:function() {
				return [10, 20, 50, 100]
			}
		},
		// params: {
		//   type: Object,
		//   default: function () {
		//     return {}
		//   }
		// },
		paginate: Object,
		pageChange: String,
		// dataUrl: String,
		enableAll: {
			type: Boolean,
			default: false
		},
		maxAllowedCount: {
			type: Number
		}
	},
	computed: {
		page: {
			get() {
				let page = this.paginate
				page.pageIndex = page.pageIndex + 1
				page.pageMaxIndex = page.pageMaxIndex + 1

				if (this.pageSizeIsAll && page.count > this.maxAllowedCount) {
					//超过最大限制,重新按默认pageSize请求
					this.pageSizeIsAll = false
					this._getPageData(1, this.pageSizeOpts[0])

					return false
				}
				return page
			}
		}
	},
	mounted() {

	},
	methods: {
		clickAll() {
			this.pageSizeIsAll = true
		},
		pageSizeChanged(size) {
			if (size <= 0) return false
			// this.page.pageSize = size
			this._getPageData(1, size)
		},
		pageChanged(index) {
			if (index < 1 || index > this.page.pageMaxIndex) {
				return false
			}
			// this.page.pageIndex = index
			this._getPageData(index, this.page.pageSize)
		},
		// $setPage(page) {
		//   if(this.pageSizeIsAll && this.page.count > this.maxAllowedCount){
		//     //超过最大限制,重新按默认pageSize请求
		//     this.page.pageSize = 10
		//     this.page.pageIndex = 1
		//     this.pageSizeIsAll = false
		//     this._getPageData(this.page.pageSize, this.page.pageIndex)
		//   }else{
		//     this.page = this.moqui.clone(this.page, true)
		//   }
		// },
		$getPage() {
			return this.moqui.clone(this.page, true)
		},
		_getPageData(pageIndex, pageSize) {
			this.$root.eventBus.$emit(this.pageChange, { pageIndex: pageIndex - 1, pageSize: pageSize })

			// 请求分页数据
			// this.$http.get(this.$root.currentPath + '/actions/' + this.dataUrl, {
			//   params: {
			//     pageIndex: pageIndex - 1,
			//     pageSize: pageSize,
			//     ...this.params
			//   }
			// }).then(
			//   res => {
			//     this.page = {
			//       pageIndex: Number(res.headers['x-page-index']) + 1 || 0,
			//       pageSize: Number(res.headers['x-page-size']) || 0,
			//       pageMaxIndex: Number(res.headers['x-page-max-index']) + 1 || 0,
			//       pageRangeLow: Number(res.headers['x-page-range-low']) || 0,
			//       pageRangeHigh: Number(res.headers['x-page-range-high']) || 0,
			//       count: Number(res.headers['x-total-count']) || 0
			//     }
			//     this.$root.eventBus.$emit(this.pageChange, res.data || [])
			//   },
			//   err => {
			//     console.log("m-pagination http error");
			//   }
			// );
		}
	},

	beforeDestroy() {
		this.$root.eventBus.$off(this.pageChange)
	}
}

</script>
<style lang="less" scoped>
.page_box {
	display: flex;
	button {
		margin-right: 10px;
	}
	.page_size {
		margin-left: 10px;
		width: 80px;
	}
}

</style>
