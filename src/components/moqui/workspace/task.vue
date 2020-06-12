<template>
	<div class="workspace-module-task">
	    <div class="module-title">
	        <span>任务列表</span>
	        <m-link class="more" href="ddd">更多任务</m-link>
	    </div>
	    <ul class="workspace-task-list">
			<li v-for="item in tastList" :key="item.id">
				<div class="content-box">
					<p class="title">{{ item.title }}</p>
					<p class="date">{{ item.startDate}} - {{ item.endDate }}</p>
				</div>
				<div class="btn-box">
					<m-dropdown title="进行中">
						<template #item>
							<m-dropdown-item value="1">开始</m-dropdown-item>
							<m-dropdown-item value="0">结束</m-dropdown-item>
							<m-dropdown-item value="2">暂停</m-dropdown-item>
						</template>
					</m-dropdown>

					<!-- <Dropdown :transfer="true">
					     <a class="icon">
					         进行中
					         <Icon type="arrow-down-b"></Icon>
					     </a>
					     <DropdownMenu slot="list">
					         <DropdownItem>开始</DropdownItem>
					         <DropdownItem>结束</DropdownItem>
					         <DropdownItem>暂停</DropdownItem>
					     </DropdownMenu>
					 </Dropdown> -->
				</div>
			</li>
	    </ul>
	</div>
</template>
<script>
export default {
	name:'',
	props: {

	},
	data() {
		return {
			tastList:[
			    {
			        title:'Curve PSD Web Template DesignCurve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Active'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Paused'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Done'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Time Out'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Active'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Paused'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Done'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Time Out'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Active'
			    },
			    {
			        title:'Curve PSD Web Template Design',
			        startDate:'2016.08.15',
			        endDate:'2016.11.10',
			        status:'Paused'
			    }
			],
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {

	}
}
</script>
<style>
.workspace-module-task {
	padding:10px;
}
.workspace-module-task .module-title {
	height: 40px;
	border-bottom: 3px solid #ebebed;
	display:flex;
	justify-content: space-between;
}

.workspace-module-task .module-title span{
	display: inline-block;
	height: 40px;
	line-height: 35px;
    padding: 0 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    border-bottom: 3px solid #99c787;
}
.workspace-module-task .module-title .more {
	line-height: 37px;
	margin-right:5px
}

/* 任务列表 */
.workspace-task-list {
	height:460px;
	margin: 10px 0;
    overflow-y: auto;
}
.workspace-task-list li {
	display: flex;
	padding: 20px 10px;

	border-bottom: 1px solid #ececee;
}

.workspace-task-list li:hover {
	background: #f9f9f9;
}

.workspace-task-list .content-box {
	flex: 1;
	width: 0; /* 下属使用文字超过显示省略号  */

}
.workspace-task-list .content-box .title {
	font-size: 14px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color:#333;
}
.workspace-task-list .content-box .date {
	color:#828E98;
	margin-top: 10px
}

.workspace-task-list .btn-box {
	width: 130px;
	text-align: center
}
.workspace-task-list .btn-box .icon {
	display: inline-block;
	padding:5px 15px;
	border-radius: 30px;
	background: #80C783;;
	color:#FFF;
}


</style>