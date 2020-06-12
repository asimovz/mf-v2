<template>

	<div ref="selectBox" :class="['aw-tree-select','ivu-select-selection', {active: showClass.isActive}]" tabindex="-1"  @click="focus">
		<div class="tag-box">
			<div class="placeholder" v-if="labels.length == 0">{{placeholder}}</div>
			<template v-for="(item, index) in labels">
			<Tag :fade="false" :key="index" :name="JSON.stringify(item)" closable @on-close="handleTagDel(index)"> {{item.title || item.text}} </Tag>
			</template>
		</div>
		<input type="hidden" :name="name" :form="form" :value="selectValues">
		<div class="clear-btn">
			<Icon :type="arrowType"></Icon>
		</div>

	  	<div :class="['content-box', {'fade-in': showClass.fadeIn}, {'fade-out': showClass.fadeIn}]" ref="contentBox">
		    <div class="tree-box" ref="treeBox">
				<m-tree ref="tree" :expandAll="expandAll" :openPath="currentOpenPath" :show-checkbox="true" :multiple="multiple" :items="items"  :init-checked-nodes="value" :node-options="{}" node-type="label" :depends-on="dependsOn" :searchable="searchable" :parameters="parameters" @getData="getTreeData" @setSelectArr="getSelectArr" @clearData="clearData" :cascade-children="cascadeChildren" :max-height="maxHeight"></m-tree>
		    </div>
		</div>
	</div>
</template>
<script>
/*
<m-tree-select name="test" value='ORG_OP2_DEPT' :parameters="{}"  items="/apps/base/OrganizationInformation/FindPartyInformation/getTreeNodeJson" ></m-tree-select>
*/
const contains = (parentNode, childNode) => {
	if (parentNode && childNode) return parentNode.contains(childNode);
	return false;
};

export default {
	name: "m-tree-select",
	props: {
		value: String,
		form: String,
		name: String,
		items: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			default: {}
		},
		openPath: {
			type: String,
			default: ''
		},
		dependsOn: Object,
		multiple:{
			type:Boolean,
			default:true
		},
		expandAll:{
			type:Boolean,
			default:false
		},
		searchable:{
			type: Boolean,
			default: true
		},
		cascadeChildren:{
			type: Boolean,
			default: false
		},
    character: {
      type: String,
      default: ','
    },
		placeholder: {
      type: String,
      default: '请选择'
		}
	},
	data() {
		return {
			originData: [],
			selectNodes: [],
			selectValues: this.value,
			keyWord: null,
			showClear: false,
			showClass: {
				isActive: false,
				fadeIn: false,
				fadeOut: false
			},
			labels:[],
			boxStyle:{},
			maxHeight:245,
			currentOpenPath:""
		};
	},
	computed:{
		arrowType() {
			return this.showClass.isActive ? 'ios-arrow-up' : 'ios-arrow-down'
		}
	},
  model: {
    event: 'on-change'
  },
  watch: {
    selectValues(val){
      this.$emit('on-change', val)
    }
  },
	methods: {
		handleTagDel(index) {
			let newVal = this.selectValues.split(this.character)
			newVal.splice(index,1)
			this.labels.splice(index,1)
			this.selectValues = newVal.join(this.character)
			this.$refs.tree.cancelCheck(this.selectValues,this.labels)
		},
		setContentPos() {
			let contentBox = document.querySelector(".content-box")
			let posArr = this.$refs.selectBox.getBoundingClientRect()
			let top = posArr.top + this.$refs.selectBox.clientHeight
			let left = posArr.left
			contentBox.style.left = left + 'px';
			contentBox.style.top = top + 'px';
			contentBox.style.width = posArr.width + 'px';
    	},

		focus: function() {
			const vm = this;
			vm.showClass.isActive = true;
			vm.showClass.fadeIn = true;
			this.setContentPos()
		    document.addEventListener('click', this.documentHandler)
		},

		documentHandler(event) {
			let handleTarget = document.querySelector(".content-box")
			if(handleTarget) {
				let vm = this
				let isOf = this.$el.contains(event.target) || handleTarget.contains(event.target)
				if (!isOf){
					vm.showClass.isActive = false;
					vm.showClass.fadeIn = false;
					vm.showClass.fadeOut = true;
					document.removeEventListener('click', this.documentHandler)
				}
			}
			if(!handleTarget) document.removeEventListener('click', this.documentHandler)
		},

    clearData() {
			this.labels = ''
			this.selectValues = ''
		},

		getTreeData(data) {
			this.labels = data
			let box = document.querySelectorAll(".content-box")
			if(box.length > 1) {
				Array.from(box).map(item => {
					item.parentNode.removeChild(item)
				})
			}
			document.body.appendChild(this.$refs.contentBox)
    	},

		getSelectArr(data) {
			data.label.map((item,index) => {
				if(this.labels.includes(item)) {
					this.labels.push(item)
				}
			})


			this.labels = [...data.label]
			this.selectValues = data.value.join(this.character)
			this.$nextTick(function(){
				this.setContentPos()
			})
		}
  },

	beforeDestroy:function() {
		document.body.removeChild(this.$refs.contentBox)
		// document.body.removeChild(document.querySelector(".content-box"))
	}
};
</script>
<style scoped lang="scss">
.aw-tree-select {
	position: relative;
	width: 100%;
	min-height: 32px;
  max-height: 160px;
  padding:0 24px 0 8px;
  overflow-y: auto;
	.placeholder {
		color: #ccc;
		
	}
  .clear-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    line-height: initial;
    margin-top: -7px;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      color: #f07649;
    }
  }
  &:hover {
    border-color: #57a3f3;
  }
  &:focus,
  &.active {
    border-color: #57a3f3;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    outline: none;
  }

}

.content-box {
  min-width: 200px;
  height: 0;
  background-color: #fff;
  position: absolute;
  z-index: 2000;
  left: 0;
  top: 300;
  margin-top: 5px;
  // padding-left: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 2px 8px 0;
  width: 100%;
  max-height: 300px;
  overflow-y: hidden;
  &.fade-out {
    animation: fade-out 0.5s forwards;
  }
  &.fade-in {
    animation: fade-in 0.3s forwards;
  }
  .input-box {
    padding-top: 5px;
    padding-right: 10px;
    text-align: right;
  }
}
@keyframes fade-in {
  0% {
    height: auto;
    opacity: 0;
  }
  100% {
    height: auto;
    opacity: 1;
  }
}
@keyframes fade-out {
  0% {
    height: auto;
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    height: 0;
  }
}
</style>