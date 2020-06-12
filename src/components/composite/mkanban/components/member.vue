<template>
	<div class="prject-member">
		<div class="input-box">
			<Input  placeholder="搜索" class="column-name"></Input>
			<p class="empty-tips" v-if="false">项目中无任何成员，请联系项目负责人添加成员后再进行指派。</p>
		</div>
		
		<ul class="memberList">
			<m-loading v-if="isLoading"></m-loading>
			<template v-for="(item,index) in memberData">
				<li @click="selectHandle(index)">
					<span class="user-avatar" :style="{backgroundColor:setMemberColor(index)}">
						<span class="avatar-name">{{moqui.shortName(item.name)}}</span>
					</span>
					<span class="name">{{item.name}}</span>
					<Icon v-show="selectMember.indexOf(item.uid)>=0" type="checkmark" class="selected"></Icon>
				</li>	
			</template>
		</ul>
	</div>
</template>
<script>

//测试用户数据载入
// import {memberAjax} from './jsonData'

export default {
	name:'',

	props: {
		data:Object,
	},

	data() {
		return {
			selectData:[],
			memberData:[],
			memberColor:['#ADCE74','#AEC0FB','#87B8FB','#EFE456'],
			isMulti: this.data.multi || false,
			isLoading: true
		}
	},

	computed:{
		selectMember() {
			let arr = []
			this.selectData.map((item)=>{
				arr.push(item.uid)
			})
			return arr
		}
	},

	created: function() {
		//get remote project members data
		let urlParams = {
			params:{
				cmd: 'getMembers' ,
				projectId: this.data.projectId
			}
		}
		if(this.data.transition){
			this.$root.$http.get(this.data.transition, urlParams).then(response => {
				//console.log('project members data => ',response.data)
				this.memberData = response.data
				this.isLoading = false
				//this.memberData = JSON.parse(JSON.stringify(memberAjax))
			}, error => {
				// error callback
			})
		}
		this.selectData = this.data.executor || []
	},

	mounted: function() {
		
	},

	methods: {
		selectHandle(index) {
			let _root = this.$parent.vueRoot
			let userData = this.memberData[index]
			userData.background = this.memberColor[index]

			if(this.isMulti) {
				let memberIndex = this.selectMember.indexOf(userData.uid)
				if(memberIndex>=0){
					this.data.del(this.selectData[memberIndex])
					this.selectData.splice(memberIndex,1)

				}else{
					this.selectData.push(userData)
					this.data.add(this.selectData)
				}
			} else {
				this.selectData = [userData]
				this.data.add(this.selectData)
			}
			if(!this.isMulti) this.$parent.handleClose()
		},

		setMemberColor(index) {
			let num = index % 4
			return this.memberColor[num]
		},
	},

	beforeDestroy:function() {
		delete this.memberData
		let _root = this.$parent.vueRoot
		_root.eventBus.$emit("kb_addTask_handle_"+this.data.eventId)
	}
}
</script>
<style>
.prject-member {
	width: 250px
}
.prject-member .input-box {
	margin:10px;
}
.prject-member .empty-tips {
	color:#a6a6a6;
	margin-top: 5px
}

.prject-member .memberList {
	height: 260px;
	overflow: auto;
	padding-bottom: 10px;
}
.prject-member .memberList li {
	padding:8px 10px;
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;

}
.prject-member .memberList li:hover {
	background-color: #f9f9f9;
}


.prject-member .memberList .name {
	color:#404040;
	display: inline-block;
	margin-left: 10px;
	font-size:14px;
}
.prject-member .memberList .selected {
	position: absolute;
	right: 15px;
	top: 14px;
	color: #ccc;
	font-size: 16px;
}


.prject-member .memberList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.prject-member .memberList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #dedbdb;
}

.prject-member .memberList::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
  */
  background: #eee;
}
</style>