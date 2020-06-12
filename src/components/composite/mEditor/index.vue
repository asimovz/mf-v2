<template>
	<textarea :name="name" :id="id" :form="form">{{currentContent}}</textarea>
	<!--<m-editor id="" content="" attach-upload-url="" attach-upload-path="" name=""></m-editor>-->
</template>
<script>
let $S = require('assets/js/script.js')
const jsArr = [
	"/static/js/CKEditor/ckeditor.js"
]

export default {
	name: 'm-editor',
	data() {
		return {
			editor: null,
			currentContent: this.content
		}
	},
	props: {
		id: {
			type: String,
			default: new Date().getTime() + ''
		},
		content: String,
		form: String,
		name: String,
		attachUploadUrl: String,
		attachUploadPath: {
			type: String,
			default: function() {
				return this.$root.moqui.dateFormat(new Date(), 'yyyy-M')
			}
		},
		toolbar: {
			type: Array
		},
		extraPlugins: {
			type: String
		}
	},
	created() {
		$S(jsArr,'ckeditor')
	},

	mounted() {

		$S.ready('ckeditor', () => {
			let uploadUrl = this.attachUploadUrl + '?attachUploadPath=' + this.attachUploadPath
			var ckeditorConfig = {
				filebrowserImageUploadUrl: uploadUrl,
				filebrowserFlashUploadUrl: uploadUrl,
			}
			if(this.extraPlugins) {
				ckeditorConfig.extraPlugins = this.extraPlugins
			}
			if(this.toolbar) {
				ckeditorConfig.toolbar = this.toolbar
			}
			
			CKEDITOR.replace(this.id, ckeditorConfig).on("change", () => {
				let data = this.getData()
				this.currentContent = this.getData()
				this.$emit("input",this.currentContent)
			})
			this.content && CKEDITOR.instances[this.id].setData(this.currentContent);
			// window['CKEDITOR'] = CKEDITOR
		})


	},
	methods: {
		getData() {
			return CKEDITOR.instances[this.id].getData();
		}
	},
	destroyed() {
		CKEDITOR.instances[this.id].destroy()
	}

}

</script>
