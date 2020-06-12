<template>
	<div style="flex:1">
		<div class="column" v-for="(item,index) in list">
			<div :class="['td','noFlex','flex-width',{'flex-width-widen':isOverFlow(item.name)}]">{{item.name}}</div> <!-- @dblclick="countColumn($event)"  -->
			<div class="col-right">
				<plan-item :deep="deepStr" :list="item.children" :vList="vList" :countData="countData" v-if="item.children"></plan-item>
				<template v-else>
					<span class="td" v-for="(num,numIndex) in item.value" >
						<input type="number" class="td-input" v-model="item.value[numIndex]"  @change="setChange(item.valueIndex,numIndex,$event)" min="0" @mouseenter="getfocus">
					</span>
					<span class="td noFlex flex-width count-bg">
						{{count(item.value)}}
					</span>
				</template>

			</div>
		</div>
	</div>
</template>
<script>
import planItem from './planItem.vue'
export default {
	name:'plan-item',
	components:{
		planItem
	},
	props: {
		list: Array,
		vList: Object,
		countData: Array,
		deep:{
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			deepStr: this.deep + 1,
			maxStringLen: 8
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
		
	},
	methods: {
		countColumn(el) {
			el.preventDefault()
			el.stopPropagation()
			let parent = el.target.parentNode,maxDiv
			let countArr = Array.from(parent.querySelectorAll(".count-bg"))
			if(countArr.length > 1) {
				let maxNum = 0
				let max = countArr.map(item => {
					maxNum += Number(item.innerText)
				})
				if(el.target.querySelector(".count-text")) {
					maxDiv = el.target.querySelector(".count-text")
				} else {
					maxDiv = document.createElement("div")
					maxDiv.className = 'count-text'
				}
				maxDiv.innerHTML = maxNum
				el.target.appendChild(maxDiv)
				console.log(maxNum)
			}
		},
		isOverFlow(str) {
			let arr = str.split("")
			if(arr.length >= this.maxStringLen) {
				let thTd = document.querySelectorAll(".th .td")[this.deepStr-1]
				thTd.classList.add("flex-width-widen")
				let footerTd = document.querySelectorAll(".footerTH .td")[this.deepStr-1]
				footerTd.classList.add("flex-width-widen")
				return true
			} else {
				return false
			}
			
		},
		count(arr) {
			return arr.reduce(function(prev, curr, idx, arr){
					return Number(prev) + Number(curr);
				});
		},
		setChange(index,itemIndex,el) {
			let value = Number(el.target.value)
			this.vList[index].value[itemIndex] = value
			this.setCount()
		},
		setCount() {
			this.countData.map((item,index)=>{
				this.countData.splice(index,1,0)
			})
			for (let key in this.vList){
				let data = this.vList[key].value
			    data.map((item,index)=>{
			    	let countNum = item + this.countData[index]
			    	this.countData.splice(index,1,countNum)
			    })
			}
		},
		getfocus(event) {
			event.target.focus()
		}
	}
}
</script>