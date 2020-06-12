<template>
  <div>

    <div class="user-count">
      <div class="number">
        <div class="title">{{title}}</div>
        <ul class="count-list" >
          <li v-for="item in countList" :key="item.id">
            <h2 :class="item.type">{{ item.number}}</h2>
            <p>{{ item.description }}</p>
          </li>
        </ul>
      </div>
      <div class="chart">
        <m-chart id="" :chart-init-options="chartOption" theme="macarons" :chart-data="chartData"></m-chart>
      </div>
    </div>

    <div class="workspace-module-partake">
		<table cellspacing="0" cellpadding="0" border="0" class="workspace-partake-table">
			<thead>
			<tr>
				<th v-for="(item,index,key) in workHeaders" :key="key" :class="{'name':key==0}">
					{{item}}
				</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="item in workList" :key="item.id">
				<td v-for="(child,index,key) in item" :class="{'name':key==0}">
					<template v-if="index == 'percentComplete'">
						<m-progress :stroke-width="6" :percentage="child" :show-text="false" />
						<div style="text-align:center;transform:scale(.8)">{{child}}%</div>
					</template>
					<template v-else>
						{{child}}
					</template>
					
				</td>
			</tr>
			</tbody>
		</table>
		<m-link :href="moreUrl" class="moreLink">
			更多...
		</m-link>

    </div>
  </div>
</template>

<script>
export default {
	name:'',
	props: {
		url: String
	},
	data() {
		return {
			title:'',
			moreUrl:'',
			countList:[],
			workHeaders:[],
      		workList:[],
			chartOption:{renderer:'svg',width:'150px',height:'120px'},
			option:{
			    name: '任务状态',
			    type: 'pie',
			    radius: ['45%', '80%'],
			    center: ['50%', '50%'],
			    avoidLabelOverlap: false,
			    data:null,

			    labelLine: {
			         normal: {
			             show: false
			         }
			     },
			    label: {
			        normal: {
			            show: false,
			            position: 'center',
			            formatter: '{b}\n{c}',
			        },
			        emphasis: {
			            show: true,
			            textStyle: {
			                fontSize: '12',
			            }
			        }
			    },
			},
			chartData:{
				series:[]
			}

		}
	},
	computed: {

	},
	created: function() {
		if(this.url){
			this.$root.$http.get(this.url).then(response => {
				console.log('userCount data => ',response.data)
				setTimeout(()=>{
					let remoteData = response.data
					this.title = remoteData.title
					this.countList = remoteData.countList
					this.option.data = remoteData.countData
					this.workList = remoteData.workList
					this.chartData.series.push(this.option)
					this.workHeaders = remoteData.workHeaders
					this.moreUrl = remoteData.moreUrl
				},0)
			}, error => {
				// error callback
				console.log("获取任务统计信息失败！")
			})
		}
		
	},
	mounted: function() {

	},
	methods: {
        setPriority(value) {
            let priority = ['低','中','高']
            return priority[value-1]
        }
	}
}
</script>
<style>
.workspace-partake-table {
    width:99%;
    margin:0 auto 0;
}
.workspace-partake-table thead th {
    text-align: left;
 	padding:10px 8px;
    font-size: 14px;
    color: #7587A4;
    font-weight: 700;
    border-bottom: 1px solid #eaeaea;
    background: none;
}
.workspace-partake-table th.name {
	width:30%;
}
.workspace-partake-table td {
    padding:10px 8px;
}
.workspace-partake-table tbody tr:nth-child(2n) {
    background-color: rgba(247, 250, 255, 1);
}
.workspace-partake-table td.name{
    white-space: nowrap;  
    text-overflow:ellipsis; 
    overflow:hidden;
}

.workspace .user-count {
	display: flex;
	padding:10px;
}
.workspace .user-count .number {
	flex: 1;
}
.workspace .user-count .chart {
	width: 150px;
}

.workspace .user-count .title{
    margin: 10px 0 20px 10px;
    font-size: 14px;
    font-weight: 700;
}
.workspace .user-count .count-list {
	margin-bottom: 10px;
}
.workspace .user-count .count-list li {
	width: 25%;
	display: inline-block;
	text-align: center
}

.workspace .user-count .count-list li h2{
	font-family: 'Verdana Negreta', 'Verdana Normal', 'Verdana';
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 5px;
}
.workspace .user-count .ing {
	color: #39a4f8
}
.workspace .user-count .delay {
	color: #FF8A80;
}
.workspace .user-count .done {
	color: #80C783;
}


.workspace-module-partake .module-title{
    height: 45px;
    line-height: 45px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: 700;
    color: #FFF; 
    background-color: #65bcff;
}
.workspace .moreLink {
	display: block;
	text-align:right;
	line-height:30px;
	background:#f9f9f9;
	margin-top:3px;
	padding-right: 10px;
}

/* 进度条颜色 */
.td-progress .ivu-progress-bg{
    background-color: #00cc33
}

</style>