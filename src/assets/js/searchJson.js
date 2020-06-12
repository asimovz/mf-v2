let searchJson = {
	init: function(par, callback) {
	    this.param = par.param
	    this.searchData = []
	    this.resultData = []
	    this.rule = par.rule
	    this.result = par.result?par.result:'list'
	    this.deepCopy(par.data)

	    if(this.result == "list") {
	    	this.searchList(this.searchData)
	    	callback(this.resultData)
	    }
	    if(this.result == "tree") {
	    	this.searchTree(this.searchData)
	    	this.filter(this.searchData)
	    	callback(this.searchData)
	    }
	},

	getParam: function(data) { //匹配条件
	    var condition
	    var that = this
	    var paramArr = this.param
	    for(let item in paramArr){
	    	let val = paramArr[item]
    		var p = data[item].toLowerCase()
    		condition = true
    		val.map(function(val,index){
    			val = val.toLowerCase()
    			switch (that.rule) {
    			    case 'equals':
    			        condition = condition && (p != val)
    			        break
    			    case 'like':
    			        condition = condition && (p.indexOf(val) < 0)
    			        break
    			}
    		})
	    }
	    return condition
	},
	deepCopy: function(data) { //深度复制
	    var searchData = JSON.stringify(data);
	    this.searchData = JSON.parse(searchData);
	},
	searchList: function(data){
		var self = this
	    data.map(function(val,index){
	    	let data = val
	    	if (!val.children || val.children.length == 0) {
		       if (!self.getParam(val)) {
		           self.resultData.push(val)
		       }
	    	} else {
    		    self.searchList(val.children)
	    	}
	    })
	},
	searchTree: function(data) {
	    var isDel = []
	    var delArr = []
	    var isDeep = []
	    var self = this
	    data.map(function(val,index){
	    	let data = val
	    	if (!val.children || val.children.length == 0 ) {
		       if (self.getParam(val)) {
		           isDel.push(index)
		       }
	    	} else {
    		    // if(self.getParam(val)){ //如果匹配则不检查下级
    		    delArr = self.searchTree(val.children)
    		    if (delArr.length > 0) {
    		    	delArr.map(function(delVal,delIndex){
    		    		val.children.splice(delVal, 1)
    		    	})
    		    }
    		    if (val.children.length == 0 && self.getParam(val)) {
    		        isDel.push(index)
    		    }
	    	}
	    	
	    })
	    return isDel.reverse()
	},
	filter: function(data) {
	    var isDel = []
	    var self = this
	    data.map(function(val,index){
	    	if (self.getParam(val)) {
	    	    if (val.children.length == 0) {
	    	        isDel.push(index)
	    	    }
	    	}
	    })

	    isDel = isDel.reverse()
	    if (isDel.length > 0) {
	    	isDel.map(function(delVal,delIndex){
	    		data.splice(delVal, 1)
	    	})
	    }
	}
}

export default searchJson