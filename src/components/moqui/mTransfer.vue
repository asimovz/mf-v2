<template>
	<div>
		<m-button @click.native="show" name="myButton" type="primary">{{buttonText}}</m-button>
		<m-modal v-model="visible" name="myModal" :width="width" :mask-closable="false" @on-ok="addTransferData">
			<span slot="footer" class="dialog-footer">
				<m-button @click.native="dialogVisible = false">取 消</m-button>
				<m-button type="primary" @click.native="addTransferData">确 定</m-button>
			</span>
			<m-transfer :source="data" :cssStyle="listStyle" :target="targetKeys" :titles="titles" :operations="operations" filterable :renderFun="renderFormat" :filter-method="filterMethod" @on-change="handleChange"></m-transfer>
		</m-modal>
	</div>
</template>
<script>
	export default {
		name:'m-transfer',
		data(){
			return {
				visible: false,
				targetKeys: [],
				listStyle: {
                	width: '280px',
                	height: '300px'
            	}
			}
		},
		props:{
			data:{type:Array,required:true},
			dataUrl:{type:String},
			submitUrl:{type:String,required:true},
			titles:{type:Array,required:true},
			operations:{type:Array,required:true},
			buttonText:{type:String,required:true},
			width: {type: Number | String ,default: 760},
      		height: {type: Number | String ,default: 600},

		},
		methods:{
			show:function(){
				this.visible = true
			},
			renderFormat:function(item){
				return item.label;
			},
			filterMethod (data, query) {
            	return data.label.indexOf(query) > -1;
        	},
        	handleChange (newTargetKeys) {
            	this.targetKeys = newTargetKeys;
        	},
        	addTransferData(){
        		var reqData = {artifactIds: this.targetKeys.toString()};
        		Object.assign(reqData,this.$root.currentParameters)
        		var self = this
        		this.$root.$http.post(this.submitUrl,reqData).then(response =>{
        			self.visible = false;
        			self.targetKeys=[];
        			if(response.data || response.status == 200){
                		var responseData = response.data
                		this.handleNotice(responseData.messages || "添加成功!", responseData.type || 'success')
                		if (responseData.screenUrl && responseData.screenUrl.length > 0) {
                  			this.$root.setUrl(responseData.screenUrl);
                		} else if (responseData.redirectUrl && responseData.redirectUrl.length > 0) {
                  			window.location.href = responseData.redirectUrl;
                		}
              		}

        		},response =>{
        			this.handleNotice('出错了', 'danger')
        		})
        	}
		}
	}
</script>