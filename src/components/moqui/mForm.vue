<template>
	<form :id="id" @submit.prevent="submitForm" :class="['aw-form',{'form-horizontal':!isOnlySubmit,'form-samll':small}]">
		<slot></slot>
	</form>
</template>
<style>


</style>
<script>
//1
export default {
	name: 'm-form',
	props: {
		id: {
			type: String
		},
		action: {
			type: String,
			required: true
		},
		method: {
			type: String,
			'default': 'POST'
		},
		target: String,
		submitMessage: String,
		submitReloadId: String,
		submitReloadList: String,
		submitReloadTree: String,
		reloadDialog: String,
		submitHideId: String,
		focusField: String,
		submitWithList: String,
		isSearchForm: {
			type: Boolean,
			default: false
		},
		noValidate: Boolean,
		formCallback:{
			type: Function,
			default: () => {}
		},
		small: {
			type: Boolean,
			default: false
		}
	},
	provide() {
		return {FormInstance:this}
	},
	data: function() {
		return {
			fieldsArrArr: {},
			fieldsArrChanged: {},
			isOnlySubmit:true, //只有按钮的表单 or  正常填写表单
			formData: null,
		}
	},

	methods: {
		resubmit(param) {
			let formBtnArr = Array.from(this.$el.querySelectorAll('button[type="submit"],button[type="button"]'))
			if(formBtnArr.length){
				formBtnArr.map(item => {
					if(param) {
						item.setAttribute("disabled",param)
						this.$root.eventBus.$emit("loading_button_flag" ,true)
					} else {
						item.removeAttribute("disabled")
						this.$root.eventBus.$emit("loading_button_flag" ,false)
					}
				})
			}
		},
		resetForm() {
			let resetField = async function f(data) {
				for (const field of data) {
					if(field.$children && field.$children.length > 0 && field.$el.tagName != "FORM") await f(field.$children)
					if(field.$props.hasOwnProperty("form")&&field.validate != undefined) {
						field.$validator.reset()
						field.resetValue()
					}
				}
			}
			let formField = [...Array.from(this.$children)]
			resetField(formField)
		},
		async validateField() {
			let validateField = async function f(data,isValue=[]) {
				for (const field of data) {
					if(field.$children && field.$children.length > 0 && field.$el.tagName != "FORM") await f(field.$children,isValue)
					if(field.$props && field.$props.hasOwnProperty("form") && field.validate != undefined) {
						let resp = await field.$validator.validate()
						isValue.push(resp)
					}
				}
				return isValue
			}
			let formField = this.$root.eventBus[this.id] ? [...Array.from(this.$children),...this.$root.eventBus[this.id]] : [...Array.from(this.$children)]
			let resp = await validateField(formField)
			let result = resp.find(item => item == false)
			return result == undefined ? true : result
		},
		async submitForm(param) {

			//判断是否回车提交，param是event事件，回车事件禁止提交
			if(param && param.toString() == "[object SubmitEvent]") return

			//验证表单字段
			let isValidate = await this.validateField()
			if(isValidate) {
				//表单内button置灰
				this.resubmit(true)	
				//获取formData
				let flag = await this.handleParams(param)
				if(flag) return
				if(this.isSearchForm){
					this.$root.eventBus.$emit("search_form_data_" + this.id ,this.formData)
					this.resubmit(false)
					return
				}
				//检测是否含有上传组件
				let fileNum = this.$el.querySelectorAll("[type='file']").length
				let postUrl = this.$root.appRootPath + this.action
				if(this.method == 'get'){
					if(this.target == '_blank')
						window.open(postUrl+'?'+new URLSearchParams(this.formData).toString())
					else
						window.location.href = postUrl+'?'+new URLSearchParams(this.formData).toString()
				}else{
					
					this.submit(postUrl)
				}
			}
		},

		async handleParams(param){
			this.formData = new FormData(this.$el);
			// formData.append('moquiSessionToken', this.$root.moquiSessionToken);
			$.each(this.fieldsArr, function(key, value) {
				this.formData.append(key, value);
			});

			for (var key of this.formData.keys()) {
				//表单元素中name为 _NA_ 占位标识的元素值移除
				if (key == '_NA_') {
					this.formData.delete(key);
				}

				// mFile中上传的元素全部转为file格式
				if (key == 'isupLoadFileNames') {
					let list = this.formData.get('isUploadedFile').split(",")
					let names = JSON.parse(this.formData.get('isupLoadFileNames'))
					for (let i=0;i<list.length;i++) {
						let file = list[i]
						let res = await this.$http({
							method: 'get',
							baseURL: '',
							url: file,
							responseType: 'blob',
							data: {}
						})
						this.formData.append(this.formData.get('upLoadName'), new File([res], names[i], {lastModified: Date.now()}));
					}
					this.formData.delete('isupLoadFileNames')
					this.formData.delete('upLoadName')
				}
			}

			if(param) {
				Object.keys(param).map(index => {
					this.formData.append(index, param[index]);
				})
			}

			//如果提交按钮带有数据，添加到this.formData中
			if(document.activeElement.tagName == 'BUTTON' && document.activeElement.form){
				this.formData.append(document.activeElement.name, document.activeElement.value)
			}

			//如果有同步提交表格数据的情况
			let checkError = false
			if(this.submitWithList){
				//获取表格选择的行数据
				let submitListArray = this.submitWithList.split(',')
				submitListArray.forEach((submitList)=>{
					if(moquiVue.gridFeedbackData[submitList+'_table'] && moquiVue.gridFeedbackData[submitList+'_table'].length > 0 ){
						this.formData.append(this.submitWithList , JSON.stringify(moquiVue.gridFeedbackData[submitList+'_table']))
					}else{
						this.handleNotice('表格中未选中任何记录！', 'danger')
						checkError = true
						this.resubmit(false)
					}
				})
			}
			return checkError
		},

		submit(postUrl,param){
			// let newParam = JSON.parse(JSON.stringify(this.formData))
			if(param) {
				Object.keys(param).map(index => {
					this.formData.append(index, param[index]);

				})
			}
			return this.$http.post(postUrl,this.formData).then(async response => {
				await this.handleResponse(response.data)
				//修正 iview 14+ 弹框关闭后不改变body样式的bug
				document.body.style.overflow = ''
				this.formCallback()
				this.resubmit(false)
			}, response => {
				let errorMsg = ""
				if(response.messages) errorMsg = response.messages
				else errorMsg = response.errors
				this.handleNotice('【后台错误】'+ errorMsg,'danger');
				this.resubmit(false)
			})
		},

		clearForm: function() {
			var jqEl = $(this.$el)
			jqEl.find(':radio, :checkbox').removeAttr('checked')
			jqEl.find('textarea, :text, select').val('').trigger('change')
		},

		submitConfirm(response){
			let {title = "确认提交", content = "继续提交？", submitUrl = this.$root.appRootPath + this.action, withParams='{"confirm":"true"}'} = response
			this.handleConfirm({
	        title,
	        content,
	        onOk: () => {
						this.submit(submitUrl,JSON.parse(withParams))
	        },
	        onCancel: () => {
	        	this.resubmit(false)
	        }
      })
		},
		handleResponse: async function(resp) {
			// console.info('m-form response ' + JSON.stringify(resp));
			//根据后台返回类型的不同，进行不同的操作
			if(resp.type === 'confirm'){
				this.submitConfirm(resp)
			}else if(resp.type == "write"){
				let el = document.getElementById(resp.id)
				let target = resp.target
				if(target == "textarea" || target == "input") {
					if(el.tagName != "TEXTAREA" && el.tagName != "INPUT") {
						el = el.querySelector(resp.target)
					}
					el.value = resp.results
				} else {
					el.innerHTML = resp.results
				}
			}
			if(resp.type !== 'confirm'){
				this.responseCb(resp)
			}
		},

		responseCb(resp){
			var notified = false;

			if (resp && this.$root.moqui.isPlainObject(resp)) {
				notified = this.$root.moqui.notifyMessages(resp.messageInfos, resp.errors);
				if (resp.screenUrl && resp.screenUrl.length > 0) {
					this.$root.setUrl(resp.screenUrl);
				} else if (resp.redirectUrl && resp.redirectUrl.length > 0) {
					window.location.href = resp.redirectUrl;
				}
			} else {
				console.warn('m-form no response or non-JSON response: ' + JSON.stringify(resp))
			}

			var hideId = this.submitHideId;
			if (hideId && hideId.length > 0) {
				$('#' + hideId).modal('hide');
			}
			var reloadId = this.submitReloadId;
			if (reloadId && reloadId.length > 0) {
				this.$root.reloadContainer(reloadId);
			}

			// 检查是否有无刷新提交&&外部是否存在弹出框
			if (document.getElementById(this.reloadDialog) != null && this.submitReloadList) {
				//清空表单数据
				this.clearForm()
				//关闭弹出框
				this.$root.eventBus.$emit("dynamic_visible_change_" + this.reloadDialog)
				//重载对应的表格
				this.$root.eventBus.$emit("table_reload_" + this.submitReloadList + '_table')
			}

			// 如果表单提交绑定了树重载，则发消息重载树结构
			if (this.submitReloadTree) {
				// console.log("reload_tree_" + this.submitReloadTree)
				this.$root.eventBus.$emit("reload_tree_" + this.submitReloadTree)
			}

			if(!(this.submitWithList && resp.type && (resp.type == "warning" || resp.type == "error"))){
				//带表格提交的场景下，提交完成后清空提交的表格数据
				moquiVue.gridFeedbackData = {}
			}

			var subMsg = this.submitMessage;
			if (subMsg && subMsg.length) {
				var responseText = resp; // this is set for backward compatibility in case message relies on responseText as in old JS
				this.handleNotice(message, 'success')
			} else if (!notified) {
				this.handleNotice(resp.messages, resp.type ||'success')
			}
		},
	},
  created() {
    if(!this.$root.eventBus.hasOwnProperty(this.id)) {
			this.$root.eventBus[this.id] = []
		}
  },
	mounted: function() {

		//兼容老的后端模板，后端模板更新form-item后可删除
		let input = this.$el.querySelector("input[type='text']")
		if(input) {
			this.isOnlySubmit = false
		}
		let selectpage = this.$el.querySelector(".v-selectpage")
		if(selectpage) {
			this.isOnlySubmit = false
		}

		this.$root.eventBus.$on("m_form_submit_" + this.id, result => {
			this.submitForm()
		})
	},
	beforeDestroy: function() {
		delete this.$root.eventBus[this.id]
		this.$root.eventBus.$off("m_form_submit_" + this.id)
		if (document.getElementById(this.reloadDialog) != null && this.submitReloadList) {
			this.$root.eventBus.$off("dynamic_visible_change_" + this.reloadDialog)
			this.$root.eventBus.$off("table_reload_" + this.submitReloadList + '_table')
		}
		if (this.submitReloadTree) {
			this.$root.eventBus.$off("tree_reload_" + this.submitReloadTree)
		}
		if(this.isSearchForm){
			this.$root.eventBus.$off("search_form_data_" + this.id)
		}
	}
}

</script>
