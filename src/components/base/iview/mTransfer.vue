<template>
	<div style="display:inline-block">
		<input type="hidden" ref="input" :name="name" :value="targetKeys">
		<Transfer :data="data" :titles="titles" :operations="operations" :target-keys="targetKeys" :source="source" :target="target" :list-style="cssStyle" :render-format="renderFun"  :filterable="filterable" @on-change="handleChange">
		</Transfer>
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
			this.handleMessage(`数据错误`,"warning")
  	}
  	this.$root.$http.get(this.source).then(response => {
  	  this.data = response.data
  	}, err => {
			this.handleMessage(`数据错误`,"warning")
  	})
  	this.$root.$http.get(this.target).then(response => {
  	  this.targetKeys = response.data
  	}, err => {
			this.handleMessage(`数据错误`,"warning")
  	})
  },
  methods: {
    handleChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
    },
    renderFun (item) {
      return item.label + ' - ' + item.description;
    },

  }
}

</script>
