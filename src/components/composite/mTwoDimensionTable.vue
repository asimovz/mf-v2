<template>
	<div>
		<div class="div-table">
			<div class="column th">
				<span class="td td-bg noFlex flex-width cell-slash-line">
					<em class="left-cell">{{row.name}}</em>
					<em class="right-cell">{{column.name}}</em>
				</span>
				<template v-for="columnItem in columnData">
					<span class="td td-bg">{{columnItem.label}}</span>
				</template>
			</div>
			<div class="column" v-for="cell in tableList">
				<span class="td noFlex flex-width td-bg">{{cell.name}}</span>
				<span class="td" v-for="(inputValue,inputIndex) in cell.valueList">
					<input type="text" class="td-input"  @mouseenter="getfocus" v-model="cell.valueList[inputIndex]">
				</span>
			</div>

		</div>
		<br>
		<Row>
			<Col span="12">
				<Button v-if="showSaveBtn" type="success" @click.native="save">保存</Button>
			</Col>
		</Row>
	</div>
</template>
<script>
// <m-tow-dimension id="10000" :row="colorData" :column="sizeData"></m-tow-dimension>
export default {
	name:'m-tow-dimension',
	props: {
		id: [String,Number],
		column: Object,
		row: Object,
		valueData: Array,
		submitUrl: String,
		showSaveBtn: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			columnData: this.column.data,
			rowData: this.row.data,
			tableList:[]
		}
	},
	computed: {

	},
	mounted: function() {
		if(this.valueData.length > 0) {
			this.tableList = JSON.parse(JSON.stringify(this.valueData))
		} else {
			this.rowData.map((item,index)=>{
				this.tableList.push({
					key:item.value,
					name:item.label,
					valueList:Array.from({length:this.columnData.length}, v => 0)
				})
			})
		}
	},

	methods: {
		save() {
			let params = {
				id:this.id,
				data:[],
				tableList:this.tableList
			}
			this.tableList.map((item,key)=>{
				let list = item.valueList
				list.map((child,index)=>{
					let param = {}
					param[this.row.field] = item.key
					param[this.column.field] = this.columnData[index].value
					param['value'] = child
					params.data.push(param)
				})
			})
			this.$root.$http.post(this.submitUrl,params).then(response =>{
        		if(response.data || response.status == 200){
                	var responseData = response.data
                	this.handleNotice(responseData.messages || "保存成功!", responseData.type || 'success')
                	if (responseData.screenUrl && responseData.screenUrl.length > 0) {
                  		this.$root.setUrl(responseData.screenUrl);
                	} else if (responseData.redirectUrl && responseData.redirectUrl.length > 0) {
                  			window.location.href = responseData.redirectUrl;
                	}
              	}

        		},response =>{
        			this.handleNotice('出错了', 'danger')
        		})

		},
		getfocus(event) {
			event.target.focus()
		}
	}
}
// sizeData:{
//     name:'尺码',
//     field:'size',
//     data:[
//         {
//             label:'S',
//             value:'S'
//         },
//         {
//             label:'M',
//             value:'M'
//         },
//         {
//             label:'L',
//             value:'L'
//         },
//         {
//             label:'XL',
//             value:'XL'
//         },
//     ]
// },
// colorData:{
//     name:'颜色',
//     field:'color',
//     data:[
//         {
//             label:'yellow',
//             value:'黄色'
//         },
//         {
//             label:'red',
//             value:'红色'
//         },
//         {
//             label:'black',
//             value:'黑色'
//         },
//         {
//             label:'#fffff',
//             value:'白色'
//         },
//     ]
// },
</script>
