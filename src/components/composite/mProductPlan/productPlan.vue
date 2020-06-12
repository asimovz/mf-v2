
<template>
	<div class="product-plan">
		<div class="item-wrap clearfix" v-if="step==1">
			<template v-for="(item,index) in baseColData" v-if="!isEdit">
			<Row>
				<Col span="2" style="text-align: center" >{{item.name}}</Col>
				<Col span="12" class="col-data">
					<template v-for="(content,child) in item.dimValues" >
						<input type="checkbox" :value="content.value" v-model="bindColData[index]" @click="setColData(index,child,content,$event)">
						<span class="text">{{content.value}}</span>
					</template>
				</Col>
			</Row>
			<Row>
				<Col offset="2" span="12">
					<Button type="primary" @click.native="next">下一步</Button>
				</Col>
			</Row>
			</template>	
		</div>

		<div class="item-wrap" v-if="step==2">
			<div class="flex">
			<template v-for="(item,index) in baseRowData" v-if="showSelect(index)">
				<div class="multi-select">
					<div class="select-title">
						<span>{{item.name}}</span>
						<div style="padding:5px 10px 0 0">
							<m-input
								class="menu-search"
								name="menuSearch"
								icon="search"
								:delay="500"
								placeholder="搜索"
								size="small"
								@on-input-change="(arg) => searchTreeUpdate(arg, index)"></m-input>
						</div>
					</div>
					<div class="multi-select-scroll scrollbar">
						<ul class="multi-select-item ">
							<li :class="{'active':child==styleSelect[index]}" v-for="(content,child) in searchFilter(index, item.dimValues)" :key="child">
								<input  type="checkbox" :value="content.value" v-model="bindBaseData[index]" @click="setBaseData(index,child,content,$event)">
								<span class="text" @click="selectDeep(content.value,index,$event)">{{content.value}}</span>
							</li>
						</ul>
					</div>
				</div>
			</template>
			</div>
			<div class="tc mt10" v-if="!isConfirmed">
				<Button type="primary" @click.native="prev">上一步</Button>
				<Button style="margin:0 15px" type="success" @click.native="setPlan" >生成表格</Button>
				<Button type="text"  size="small" @click.native="cancelPlan"  v-if="!isEdit">重选</Button>
			</div>
		</div>


		<div class="div-table" v-show="this.tableData.length">
			<div class="column th">
				<span class="td noFlex flex-width" v-for="(name,index) in attachData" :key="name">{{name}}</span>
				<template v-for="(band,index) in columnData">
					<span class="td" :data-deep="index" :key="band">{{band}}</span>
				</template>
				<span class="td noFlex flex-width">总计</span>
			</div>
			<plan-item :list="tableData" :vList="fromList" :countData="countData"></plan-item>
			<div class="column column-bg footerTH">
				<span class="td noFlex flex-width" v-for="name in attachData"></span>
				<template v-for="count in countData">
					<span class="td"><input type="number" class="td-input" :value="count" readonly="readonly"></span>
				</template>
				<span class="td noFlex flex-width">{{allCount}}</span>
			</div>
		</div>
		<div class="tc mt10" v-show="this.tableData.length">
			<Button type="success" @click.native="savePlan">保存</Button>
		</div>

	</div>
</template>
<style>

</style>
<script>
import planItem from './planItem'

export default {
	name:'m-product-plan',
	components:{
		planItem
	},
	props: {
		planId: [Number,String],
		planAjaxController: String,
	},
	data() {
		return {
			step:1,

			baseRowData:[], //行原始数据
			bindBaseData:[], //绑定数据
			selectBaseData:[], //选择行数据
			deepData:[], // 行深度
			styleSelect:[], //选中数据样式

			baseColData:[], //列原始数据
			bindColData:[], //绑定列数据
			selectColData:[], // 选择列数据
			selectColLength:0,
			columnData:[], // 生成表格列数据
			valueList:[], // 列数据值数据
			attachData:[], //附加列数据
			
			tableData:[], //表格数据
			fromList:{}, //保存提交数据
			isConfirmed:false, //是否企划确认状态
			isEdit:false, //是否编辑状态 

			countData:[], //统计数据
			searchVal: {}, // 搜索关键值

		}
	},
	computed: {
		allCount() {
			if(this.countData.length > 0) {
				return this.countData.reduce((total,num)=>{
					return total + num
				})
			} else {
				return 0
			}

		}
	},
	created: function() {
		let urlParams = {
			params:{
				cmd: 'getPlanDimDef',
				planId: this.planId
			}
		}
		this.$root.$http.get(this.planAjaxController,urlParams).then(response => {
			let data = response.data
			this.baseRowData = data.rowDefs
			this.baseColData = data.colDefs
			if(data.isConfirmed == 'Y') {
				this.isConfirmed = true
			}

			if(data.planCfgJson) {
				console.log('planCfgJson===',JSON.parse(data.planCfgJson))
				let planCfgJson = JSON.parse(data.planCfgJson)
				this.selectBaseData = planCfgJson.tableData
				this.selectColData = planCfgJson.columnData
				this.fromList = planCfgJson.fromList
				this.isEdit = true
			}
			this.initPlan()

		}, error => {

		})

	},
	mounted: function() {

	},
	methods: {
		searchFilter(index, arr) {
			let val = this.searchVal[index] || ''
			val = val.toLowerCase()
			if (!!val) {
				return arr.filter(x => x.value.toLowerCase().includes(val) || val.includes(x.value.toLowerCase()))
			}
			return arr
		},
		searchTreeUpdate(...arg) {
			const [val, index] = arg
			this.$set(this.searchVal,index,val)
		},
		setCount() {
			let newArr = Array.from({length:this.selectColData.length}, v => 0);
			for (let key in this.fromList){
				let data = this.fromList[key].value
			    data.map((item,index)=>{
			    	newArr[index] += item
			    })
			}
			this.countData = [...newArr]
		},
		next() {
			if(this.selectColData.length > 0) {
				this.step = 2
			}
		},
		prev() {
			this.step = 1
			this.cancelPlan()
		},
		initPlan() {
			this.baseRowData.map(item=>{
				this.attachData.push(item.name)
				this.deepData.push(-1)
				this.styleSelect.push(-1)
				this.bindBaseData.push([])
			})

			this.baseColData.map((item,index)=>{
				this.bindColData.push([])
				if(this.isEdit) {
					this.selectColData.map(colItem=>{
						if(item.field == colItem.field) {
							this.bindColData[index].push(colItem.value)
						}
					})
				} else {
					this.selectColData.push()
				}
			})

			this.editInitPlan()
			console.log(this.bindBaseData,"======")

		},
		editInitPlan() {
			if(!this.isEdit) return
			this.step = 2
			let data = this.selectBaseData[0].name
			let rowData = this.baseRowData[0].dimValues
			let edit_defRow = {}
			rowData.forEach((item,index)=>{
				if(item.value == data) {
					edit_defRow['key'] = index
					edit_defRow['value'] = item.value
					return false
				}
			})
			this.selectBaseData.map(item=>{
				this.bindBaseData[0].push(item.name)
			})

			this.tableData = JSON.parse(JSON.stringify(this.selectBaseData))
			this.setDeepData(edit_defRow.value,0,true)

			this.valueList = Array.from({length:this.selectColData.length}, v => 0);
			this.countData = Array.from({length:this.selectColData.length}, v => 0);

			this.setCount() //计算合计

			this.bindColData.map(item=>{
				item.map(child=>{
					this.columnData.push(child)
				})
			})
		},
		setColData(index,child,content,el) {
			let isCheck = el.target.checked
			let data = this.selectColData
			content['field'] = this.baseColData[index].field
			if(isCheck) {
				this.selectColLength ++
				data.push(content)
			} else {
				this.selectColLength --
				this.selectColData = data.filter(item=>{
					return item.value != content.value
				})
			}
			this.valueList = Array.from({length:this.selectColLength}, v => 0);
			this.countData = Array.from({length:this.selectColLength}, v => 0);
		},
		showSelect(index) {
			if(index == 0) return true
			return index>0&&this.bindBaseData[index-1]&&this.bindBaseData[index-1].length&&this.deepData[index-1]>=0
		},
		getBindData(index) {
			let current
			let newDeep = [].concat(this.deepData).slice(0,index+1)
			if(newDeep.length == this.deepData.length) return
			newDeep.forEach((item,deepIndex) => {
				if(deepIndex == 0) {
					current = this.selectBaseData[item].children
				} else {
					if(typeof current[item] == "undefined"){

					}else{
						 current = current[item].children
					}
					
				}
			})
			if(current.length > 0) {
				let newIndex
				this.baseRowData[index+1].dimValues.map((item,index)=>{
					if(item.value == current[0].name) {
						newIndex = index
					}
				})
				this.styleSelect[index+1] = newIndex
			}
			this.bindBaseData[index+1] = current.map(item=>{
				return item.name
			})	
		},
		selectDeep(content,index,el) {
			let isCheck = el.target.previousElementSibling.checked
			this.setDeepData(content,index,isCheck)
		},
		setDeepData(content,index,isCheck) {
			let newIndex,deepValue
			this.baseRowData[index].dimValues.map((item,index)=>{
				if(item.value == content) {
					newIndex = index
				}
			})

			this.styleSelect.splice(index,1,newIndex)
			this.deepData[index] = this.bindBaseData[index].indexOf(content)

			if(isCheck) {
				deepValue = 0
			} else {
				deepValue = -1
			}
			for (let i = index+1; i <= this.deepData.length-1 ; i++) {
				this.deepData[i] = deepValue
			}
			
			if(isCheck) {
				for (let i = index; i <= this.deepData.length-1 ; i++) {
					this.getBindData(i)
				}
			} else {
				for (let i = index+1; i <= this.bindBaseData.length-1 ; i++) {
					this.bindBaseData[i] = []
				}
			}
			
		},

		setBaseData(index,child,odata,el){
			let data = odata.value
			let newData,current,currentField
			let isCheck = el.target.checked

	
			// 数据变动之前，所选内容在绑定数据中的index,用于删除所选数据中对应的数据
			let currentIndex = this.bindBaseData[index].indexOf(data) 

			//清空下级公共所选记录
			this.bindBaseData.map((item,key)=>{
				if(key>index){
					this.bindBaseData[key] = []
				}
			})


			if(index == this.deepData.length-1) {
				newData = {
					name:data,
					value:this.valueList,
					valueIndex:'',
					fieldDeep:[]
				}
			} else {
				newData = {
					name:data,
					children:[],
					fieldDeep:[]
				}
			}
			newData.fieldDeep.push({
				field:this.baseRowData[index].field,
				name:data,
				key:odata.key
			})

			this.$nextTick(function(){
				let newIndex
				this.baseRowData[index].dimValues.map((item,index)=>{
					if(item.value == data) {
						newIndex = index
					}
				})
				
				this.styleSelect.splice(index,1,newIndex)
				this.deepData[index] = this.bindBaseData[index].indexOf(data)

				let newDeep = [].concat(this.deepData).slice(0,index)
				if(newDeep.length == this.deepData.length) return

				newDeep.map((item,deepIndex) => {
					if(deepIndex == 0) {
						current = this.selectBaseData[item].children
						currentField = this.selectBaseData[item]
					} else {
						current = current[item].children
						currentField = currentField.children[item]
					}
					
				})

				if(typeof currentField != "undefined") {
					newData.fieldDeep = currentField.fieldDeep.concat(newData.fieldDeep)
				} else {
					current = this.selectBaseData
				}

				if(index == this.deepData.length-1) {
					let itemKey = this.styleSelect.join("_")
					newData.valueIndex = itemKey
					if(isCheck) {
						this.fromList[itemKey] = {
							field:newData.fieldDeep,
							value:[].concat(this.valueList)
						}
					} else {

						delete this.fromList[itemKey]
					}
				} else {
					if(!isCheck) {
						let itemKey = [...this.styleSelect].slice(0,index+1).join("_")
						for(let key in this.fromList){
							let matchKey = key.split("_").slice(0,index+1).join("_")
							if(matchKey == itemKey) {
								delete this.fromList[key]
							}
						}
					}
				}
	
				if(isCheck) {
					current.push(newData)
				} else {
					current.splice(currentIndex,1)

				}


			})
		},
		setPlan() {
			this.columnData = []
			this.bindColData.map(item=>{
				item.map(child=>{
					this.columnData.push(child)
				})
			})
			this.tableData = JSON.parse(JSON.stringify(this.selectBaseData))
			this.setCount()
		},
		cancelRow() {

		},
		cancelPlan() {
			this.deepData = []
			this.tableData = []
			this.bindBaseData = []
			this.selectBaseData = []
			this.attachData = []
			this.countData = Array.from({length:this.selectColLength}, v => 0);
			this.fromList = {}
			// this.columnData = []
			// this.valueList = []
			// this.bindColData = []
			// this.selectColLength = 0
			this.initPlan()
		},

		savePlan() {
			let params = []
			let data = this.fromList
			console.log(data,this.selectColData)
			for(let key in data){
				let item = data[key].field
				let value = data[key].value
				value.map((child,index)=>{
					let param = {}
					let field = this.selectColData[index]
					param['id'] = this.planId + '_' + key + '_' + index
					param['value'] = child
					item.map(itemValue=>{
						param[itemValue.field] = itemValue.key
					})
					param[field.field] = field.key
					params.push(param)
				})
			}
			//结果数据
			console.log(JSON.stringify(params))
			let postParams = {
				cmd:'savePlanDetailConf',
				planId: this.planId,
				planCfg: {tableData: this.tableData, columnData: this.selectColData,fromList:this.fromList},
				planDetails: params
			}
			this.$root.$http.post(this.planAjaxController, postParams).then(response => {
				if(response.data && response.data.type=='success'){
					this.handleNotice(response.data.messages, 'success')
				}
			}, error => {
				// error callback
			})
		},

	}
}

// const baseColData1 = [
// 	{
// 		field:'boduan',
// 		name:'波段',
// 		dimValues:[
// 			{
// 				key:'dong1',
// 				value:'冬一波'
// 			},
// 			{
// 				key:'dong2',
// 				value:'冬二波'
// 			},
// 			{
// 				key:'dong3',
// 				value:'冬三波'
// 			}
// 		]
// 	},
// 	{
// 		field:'price',
// 		name:'价格带',
// 		dimValues:[
// 			{
// 				key:'100',
// 				value:'0~199'
// 			},
// 			{
// 				key:'200',
// 				value:'200~499'
// 			}

// 		]
// 	},
// ]

// const baseRowData1 = [
// 	{
// 		field:'brand',
// 		name:'品牌',
// 		dimValues:[
// 			{
// 				key:'CbEsey',
// 				value:'逸阳'
// 			},
// 			{
// 				key:'muran',
// 				value:'慕然'
// 			},
// 			{
// 				key:'yipin',
// 				value:'衣品'
// 			}
// 		]
// 	},

// 	{
// 		field:'productType',
// 		name:'产品类别',
// 		dimValues:[
// 			{
// 				key:'niuzai',
// 				value:'牛仔'
// 			},
// 			{
// 				key:'huaqian',
// 				value:'化纤'
// 			},
// 			{
// 				key:'neida',
// 				value:'内搭'
// 			}
// 		]
// 	},
// 	{
// 		field:'style',
// 		name:'版型',
// 		dimValues:[
// 			{
// 				key:'dadi',
// 				value:'打底裤'
// 			},
// 			{
// 				key:'qianbi',
// 				value:'铅笔裤'
// 			},
// 			{
// 				key:'zhitong',
// 				value:'直筒裤'
// 			}
// 		]
// 	},
// 	{
// 		field:'size',
// 		name:'裤长',
// 		dimValues:[
// 			{
// 				key:'sanfen',
// 				value:'三分裤'
// 			},
// 			{
// 				key:'sifen',
// 				value:'四分裤'
// 			},
// 			{
// 				key:'wufen',
// 				value:'五分裤'
// 			}
// 		]
// 	},

// ]
</script>
