<template>
	<el-pagination background layout="total, prev, pager, next, jumper, sizes" :total="page.count" :current-page	="page.pageIndex" :page-size="page.pageSize" :show-total="showTotal"  @current-change="pageChanged" @size-change="pageSizeChanged" :page-sizes="pageSizeOpts">
	</el-pagination>
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
		}
	},

	beforeDestroy() {
		this.$root.eventBus.$off(this.pageChange)
	}
}

</script>
<style lang="less">
.el-pagination {
	padding: 0;
	.el-pagination__sizes {
		margin:0 0 0 10px!important;
	}
	.el-select .el-input {
		margin:0 0 0 10px;
	}
}

</style>
