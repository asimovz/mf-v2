<template>
	<div class="popover-page prject-tag">
		<div class="title">选择标签</div>
		<div class="input-box">
			<Input  placeholder="搜索" class="column-name"></Input>
		</div>
		
		<ul class="tagList">
			<m-loading v-if="isLoading"></m-loading>
			<template v-for="(item,index) in tagData">
				<li @click="selectHandle(index)">
					<Icon type="pricetag" size="16" :style="{color:item.color}"></Icon>
					<span class="name">{{item.name}}</span>
					<Icon v-show="selectTag.indexOf(item.id)>=0" type="checkmark" class="selected"></Icon>
				</li>	
			</template>
		</ul>
		<div class="kb-menu">
			<a class="divider"></a>
			<a class="item" @click="addTag">创建新标签</a>
		</div>
	</div>
</template>
<script>
//测试项目标签数据载入
// import {tagAjaxData} from './jsonData'
import tagAdd from "./tagAdd"

export default {
	props: {
		data:Object,
	},
	data() {
		return {
			selectData:[],
			isLoading:true,
			tagData:[],
			memberColor:['#ADCE74','#AEC0FB','#87B8FB','#EFE456'],
			isMulti: this.data.multi || false
		}
	},

	computed:{
		selectTag() {
			let arr = []
			this.selectData.map((item)=>{
				arr.push(item.id)
			})
			return arr
		}
	},

	created: function() {
		// this.tagData = JSON.parse(JSON.stringify(tagAjaxData))
		//get remote tags data
		let urlParams = {
			params:{
				cmd: 'getTaskTags'
			}
		}
		this.$root.$http.get(this.data.transition,urlParams).then(response => {
			//console.log('project members data => ',response.data)
			this.tagData = response.data
			this.isLoading = false
			//this.memberData = JSON.parse(JSON.stringify(memberAjax))
		}, error => {
			// error callback
		})
		this.selectData = this.data.tags || []
		// console.log(this.tagData)
	},

	mounted: function() {
	},

	methods: {
		selectHandle(index) {
			let _root = this.$parent.vueRoot
			let tagArr = this.tagData[index]
			let tagIndex = this.selectTag.indexOf(tagArr.id)
			if(tagIndex>=0){
				this.data.del(this.selectData[tagIndex])
				this.selectData.splice(tagIndex,1)
			}else{
				this.selectData.push(tagArr)
				this.data.add(tagArr)
			}
		},

		setComponent(comp) {
			this.$emit("changeComponent",comp)
		},

		addTag() {
			this.setComponent(tagAdd)
		}
	},
	
	beforeDestroy:function() {
		delete this.tagData
	}
}
</script>

<style>
	.prject-tag {
		width: 250px;
	}
	.prject-tag .title {
		font-size: 14px;
		padding:5px 10px;
		border-bottom: 1px solid #F1F1F1;
	}
	.prject-tag .input-box {
		margin:10px;
	}

	.prject-tag .tagList {
		height: 200px;
		overflow: auto;
		padding-bottom: 10px;
	}
	.prject-tag .tagList li {
		padding:8px 10px;
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;

	}
	.prject-tag .tagList li:hover {
		background-color: #f9f9f9;
	}


	.prject-tag .tagList .name {
		color:#404040;
		display: inline-block;
		margin-left: 10px;
		font-size:12px;
	}
	.prject-tag .tagList .selected {
		position: absolute;
		right: 15px;
		top: 10px;
		color: #ccc;
		font-size: 16px;
	}
</style>