<template>
	<span :id="id" class="m-select-wrap">
		<v-selectpage 
			:data="data"
			:key-field="keyField"
			:show-field="showFieldFunc"
			:search-field="searchField"
			:class="inputClasses"
			:tb-columns="columnData"
			:title="title"
			:placeholder="placeholder"
			:multiple="multiple"
			:max-select-limit="maxSelect"
			:pagination="pagination"
			:page-size="pageSize"
			:params="params"
			:result-format="resultFormat"
			:form="form"
      ref="selectPage"
			v-model="selectValue"
			v-validate="validate"
			:data-vv-as="fieldTitle"
			:data-vv-name="name"
			@values="setValue"
			>
		</v-selectpage>
		<input type="hidden" :name="name" :form="form" v-model="selectValue">		
		<span v-if="errors.has(name)" class="m-form-error-tip">
        {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
	</span>
</template>
<script>
/*

<m-select name="test" keyField="desc" form="haha" value="1" :column="showFields" :data="sample1" :multiple="true" :maxSelect="0" :pagination="true" :pageSize="3"></m-select>
name        组件名称
value       组件值
keyField    值对应的字段
form        组件form属性
column      表格模式下的列头  [{title: 'id',data: 'id'},{title: 'name',data: 'name'},{title: 'desc',data: 'desc'}]
data        选择的数据集     [{id:1 ,name:'The People\'s Republic of China',desc:'中华人民共和国'}]
multiple    是否多选 默认false
maxSelect   最多选择个数 默认0 不限
pagination  是否分页 默认false
pageSize    每页显示条数 默认10

*/
// import Vue from 'vue'
// import vSelectPage from './vSelectPage';

// Vue.use(vSelectPage,{
// 	// server side data loader
// 	dataLoad: function(vue, data, params){
// 		return new Promise((resolve, reject)=>{
// 			this.$http.post(data, params)
// 				.then(resp=>resolve(resp))
// 				.then(resp=>reject(resp));
// 		});
// 	}
// });


import vSelectPage from './vSelectPage';

export default {
	name:'m-select-table', //m-select-page
	components: {
		"v-selectpage": vSelectPage
	},
	props: {
		id: String,
		name: String,
		value: String,
		data: {
			type: Array | String,
			required: true
		},
		column: Array,
		multiple:{
			type: Boolean,
			default: false
		},
		maxSelect:{
			type: Number,
			default: 0
		},
		keyField:String,
		valueField: String,
		searchField: String,
		title:{
			type:String,
			default:'请选择'
		},
		placeholder:{
			type:String,
			default:'请选择'
		},
		pagination:{
			type: Boolean,
			default: false
		},
		pageSize:{
			type: Number,
			default: 10
		},
		/**
		 * server side querying params
		 */
		params: Object,
		dependsOn: String,
		form: String,
		fieldTitle: {
      type: String,
      default: ""
    },
    validate:[String,Object],
    validateMsg: String
	},
	data() {
		return {
			columnData: this.column.length > 0 ? this.column : null,
      selectValue: this.value,
      initState:true
		}
	},
	computed: {
		inputClasses: function(){
      return this.errors.has(this.name)?'v-selectpage ivu-form-item-error':'v-selectpage'
    }
	},
	created: function() {
	},
	mounted: function() {
		let root = this.$root

		if (typeof this.dependsOn != "undefined") {
      let depends = this.dependsOn.split(",");
      let that = this;
      depends.forEach(function(value, key) {
        root.eventBus.$on(value+'_value_change', result => {
        	if(!that.initState){
        		that.$refs.selectPage.picked = []
        	}
        	that.initState = false
          // 触发组件数据重载
          that.$refs.selectPage.populate(result)
        });
      });
    }
  },
  
	methods: {
		showFieldFunc(row){
			let showField = null
			if(this.valueField.indexOf("{") > -1)
				showField = JSON.parse(this.valueField.replace(/'/g,'"'))
			else
				showField = this.valueField

			if(typeof(showField) === 'string')
        return row[showField]
			if(typeof(showField) === 'object'){
				let appendStr = ''
				let appendFieldList = showField.appendFields.split(',')
				appendFieldList.forEach((entry)=>{
					appendStr =  appendStr + '    ' + row[entry]
				})
				if(row[showField.showType] == 'hex'){
					return `
						<span style="background-color:${row[showField.colorField]};width:100px;height:20px;display: inline-block;"></span>${appendStr}
					`
				}else if(row[showField.showType] == 'image'){
					return `
						<img src="${row[showField.colorField]}" width="100" height="20">${appendStr}
					`
				}else{
					return `
						<span style="background-color:${row[showField.colorField]};width:100px;height:20px;display: inline-block;"></span>${appendStr}
					`
				}
			}
    },
    
		resultFormat(resp){
			if(resp && resp.data) 
				return resp.data.values.gridResult;
    },
    
		setValue(data) {
			let newData = []
			data.map(item=>{
				newData.push(item[this.keyField])
			})
			this.selectValue = newData.join(",")
			this.$nextTick(()=>{
        let dynamicParams = {}
        dynamicParams[this.keyField] = this.selectValue
				this.$root.eventBus.$emit(this.id+'_value_change',dynamicParams)
			})
		}
	},

	beforeDestroy: function() {
		this.$root.eventBus.$off(this.id+'_value_change')
		if(this.validate){
			if(this.form){
				this.$root.eventBus.$off('form_validate'+this.form)
			}else{
				this.$root.eventBus.$off('form_validate'+this.id.split('_')[0])
			}
		}
	}
}
</script>
<style>
.ivu-form-item-error {
	border:1px solid #ed3f14;
}

.sp-results li {
	padding:10px 10px!important;
}
.sp-pagination {
	margin:4px 4px!important;
}
.sp-selected-tag {
	overflow: hidden
}
</style>