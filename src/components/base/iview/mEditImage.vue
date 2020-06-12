<template>
	<div class="edit-img-wrap">
		<div class="eidt-handle-box">
			<m-button text="确定" @click.native="getCutImgData"></m-button> <m-button text="取消" type="text" @click.native="cancel"></m-button>
		</div>
		<div class="edit-cropper-box">
			<vue-cropper ref="cropper" 
			:img="option.img" 
			:output-size="option.size" 
			:output-type="option.outputType" 
			:info="true" 
			:full="option.full"
			:can-move="option.canMove" 
			:can-move-box="option.canMoveBox" 
			:fixed-box="option.fixedBox" 
			:original="option.original"
			:auto-crop="option.autoCrop" 
			:auto-crop-width="option.autoCropWidth" 
			:auto-crop-height="option.autoCropHeight" 
			:center-box="option.centerBox"
			:high="option.high"
			>
			</vue-cropper>
		</div>
    <div>
      <input type="file" name="upload" @change="uploadSelect" >
      <button @click="getCutImgData">点击截图</button>
      	<form id="test">
      			<input type="hidden" id="imgData" name="url" v-model="imgData">	
      	</form>
      	

      
    </div>
	</div>
</template>
<script>
import { VueCropper }  from 'vue-cropper' 
export default {
  name: 'm-edit-image',
  components: {
  	VueCropper
  },
  props: {
  	url: String,
  	outType: {
  		type: String,
  		default: "webp"
  	},
  	compress: {
  		type: Number,
  		default:1
  	}

  },

  data() {
    return {
        option: {
          img: "",
          size: this.compress,
          full: false,
          outputType: this.outType,
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 200,
          autoCropHeight: 150,
          centerBox: false,
          high: true
        },
        imgData:""
    }
  },


  mounted() {

  },
  methods: {
 dataURLToBlob(dataurl){
 	var arr = dataurl.split(',');
 	var mime = arr[0].match(/:(.*?);/)[1];
 	var bstr = atob(arr[1]);
 	var n = bstr.length;
 	var u8arr = new Uint8Array(n);
 	while(n--){
 		u8arr[n] = bstr.charCodeAt(n);
 	}
 	return new Blob([u8arr], {type:mime});
 },
    uploadSelect(event) {
      let inputDOM = event.target;
      let file = inputDOM.files[0]
      var url = URL.createObjectURL(file)
      
      this.option.img = url
    },
    getCutImgData() {
    	this.$refs.cropper.getCropBlob((data) => {
    		let url = window.URL.createObjectURL(data)
    		this.imgData = data

    		// var formData = new FormData(document.getElementById('test'))
    		// var img = formData.get("url"); 
    		// console.log(img,data)
    		
var postUrl = "/apps/cim/Customer/CustomerDetail/updateCustomerInfo"
var fd = new FormData();
fd.append('filetitle', "filetitle");//文件名：string
fd.append('filedata', data);//文件内容：blob
var vm = this.$root
vm.$http.post(postUrl,fd).then(response => {
	console.log(response.data)
}, response => {
	console.log(response.errors)
})

    		// this.$emit("getData",data)
    	})
    },
    cancel() {
    	this.$emit("cancel")
    }
  },

}

//
</script>
<style>
.edit-img-wrap {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	z-index: 999;
	background: #fff;
}
.eidt-handle-box {
	padding:10px;
	text-align: right;
	height: 50px;
}
.edit-cropper-box {
  width: 100vw;
  flex: 1
}
.edit-cropper-box .vue-cropper {
	padding:20px;
}

	    
</style>