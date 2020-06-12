<template>
	<div style="display:inline-block">
		<input type="hidden" ref="input" :name="name" :value="targetKeys">
		<el-transfer :data="data" :titles="titles" :button-texts="operations" v-model="targetKeys" :source="source" :target="target" :style="cssStyle" :render-content="renderFun" :filter-method="filterMethod" :filterable="filterable" @change="handleChange">
		</el-transfer>
	</div>
</template>
<script>
export default {
  name: 'm-transfer',
  props: {
		name: String,
		source: String,
  	target: String,
  	filterable:null,
    titles:Array,
    operations:Array,
    renderFun: {
      type: Function,
      default: () => {
        return <span>{ item.label } - { item.description }</span>
      }
    },
    filterMethod: Function,
  	cssStyle: {
  		type: Object,
  		default () {
  			return {
				width: '250px',
				height: '300px'
			}
  		}
  	}
  },
  data() {
    return {
      data: [],
      targetKeys: []
    }
  },
  computed: {
  	moveValue: function () {
  		return this.targetKeys
  	}
  },
  created: function () {
  	if(!this.source){
			this.handleMessage("数据错误","info")
  	}
  	this.$root.$http.get(this.source).then(response => {
  	  this.data = response.data
  	}, err => {
			this.handleMessage("数据错误","info")
  	})
  	this.$root.$http.get(this.target).then(response => {
  	  this.targetKeys = response.data
  	}, err => {
			this.handleMessage("数据错误","info")
  	})
  },
  methods: {
		//  !! 此处修改为el 对应的 render-content 和 change事件
    handleChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
      this.$emit('on-change', newTargetKeys)
		},
  }
}

</script>
