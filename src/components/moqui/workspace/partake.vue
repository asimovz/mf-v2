<template>
	<div class="workspace-module-partake">
	    <div class="module-title">参与的项目（6）</div>
	    <div class="workspace-partake-list">
	        <ul>
	            <li class="partake-list-th">
	                <span class="td-num">项目编号</span>
	                <span class="td-name">项目名称</span>
	                <span class="td-progress">进度</span>
	            </li>
	            <li class="partake-list-row" v-for="item in myProject" :key="item.id">
	                <span class="td-num">{{ item.styleNumber }}</span>
	                <span class="td-name" :title="item.name">{{ item.name }}</span>
	                <span class="td-progress">
	                    <m-progress :stroke-width="5" :percentage="item.progress" :showText="false" />
	                </span>
	            </li>
	        </ul>
	    </div>
	</div>
</template>
<script>
export default {
	name:'',
	props: {

	},
	data() {
		return {
			myProject:[
			    {
			        name:'款式EYXH001款开发设计项目款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:100
			    },
			    {
			        name:'款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:80
			    },
			    {
			        name:'款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:20
			    },
			    {
			        name:'款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:60
			    },
			    {
			        name:'款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:30
			    },
			    {
			        name:'款式EYXH001款开发设计项目',
			        styleNumber:"EYXH000001",
			        progress:25
			    }
			]
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


.workspace-module-partake .module-title{
    height: 45px;
    line-height: 45px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: 700;
    color: #FFF; 
    background-color: #65bcff;
}


.workspace-partake-list {
	padding:10px 0;
}
.workspace-partake-list li{
    margin-left: 15px;
    margin-right: 15px;
	padding:10px 0;
}
.workspace-partake-list li span {
	display: inline-block;
	vertical-align: bottom;
}
.workspace-partake-list .partake-list-th{
 	padding:5px 0;
    font-size: 14px;
    color: #7587A4;
    font-weight: 700;
    border-bottom: 1px solid #eaeaea;
    background: none;
}

.workspace-partake-list li .td-num{
    width: 19%;
    padding-left:1%;
}
.workspace-partake-list li .td-name{
    width: 40%;
    white-space: nowrap;  
    text-overflow:ellipsis; 
    overflow:hidden;
}
.workspace-partake-list li .td-progress{
    width: 39%;
}

.workspace-partake-list .partake-list-row:nth-child(2n+1){
    background-color: rgba(247, 250, 255, 1);
}

/* 进度条颜色 */
.td-progress .ivu-progress-bg{
    background-color: #00cc33
}
</style>