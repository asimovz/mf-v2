<template>
  <div style="margin:10px">
    <div class="search-area" style="margin-bottom: 10px" v-if="searchable">
        <m-input ref="menuSearchBtn" class="menu-search" :value="searchValue" name="menuSearch"  icon="search" placeholder="搜索" @on-input-change="searchTreeUpdate"></m-input>
    </div>
    <Tree :data="data" 
          :multiple="multiple" 
          :expandAll="expandAll" 
          @on-select-change="selectChange" 
          :show-checkbox="showCheckbox" 
          @on-check-change="checkChange"
          ref="tree"
          :style="styles"
          class="scrollbar"
          :check-strictly="cascadeChildren"
    ></Tree>
    <input type="hidden" 
          :id="hiddenFormFieldId" 
          :name="hiddenFormFieldName" 
          v-if="hiddenFormFieldName && showCheckbox"
          :value="selectedValue">
  </div>
</template>
<style>
</style>
<script>
/**
* 树组件
* <m-tree
* id="DepartmentTree" [String: 标识]
* items="/apps/example/TreeTest/TreeDemo/getTreeNodeJson"  [String: 数据来源, method = 'GET', params = parameters]
* open-path=""  [String: 默认展开的节点]
* node-type="link"  [String: 节点类型(link, label), label表示文本类型；link表示点击该节点会触发$root.loadContainer(id, url),其中id = nodeOptions.dynamicLoadId; url = nodeOptions.linkUrl; params = nodeOptions.linkParamField]
* :node-options="{dynamicLoadId:'SinglePageContainer',linkUrl:'singlePageDemo',linkParamField:{'deptPartyId':'fromPartyId'}}"  [Object]
* :parameters="{'internalOrgId':'ORG_COCLOUD_CORP'}"  [Object]
* >
* </m-tree>
*/
import store from 'assets/js/localStorage'

export default {
    name: 'm-tree',
    props: {
        id: {
            type: String,
            default: new Date().getTime() + ''
        },
        items: {
            type: String,
            required: true
        },
        openPath: {
            type: String,
            default: ''
        },
        initCheckedNodes: {
            type: String,
            default: ''
        },
        expandAll: {
            type: Boolean,
            default: false
        },
        nodeType: {
            type: String,
            default: 'label'
        },
        nodeOptions: {
            type: Object,
            default: {}
        },
        parameters: {
            type: Object,
            default: {}
        },
        multiple: {
            type: Boolean,
            default: false
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        hiddenFormFieldName: String,
        dependsOn: Object,
        searchable:{
            type: Boolean,
            default: true
        },
        cascadeChildren:{
            type: Boolean,
            default: false
        },
        maxHeight: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            data: [],
            oldData:[],
            ajaxData:[],
            currentOpenPath: this.openPath,
            hiddenFormFieldId: this.id + '_hiddenFormFieldId',
            selectedValue: this.initCheckedNodes,
            searchValue:'',
            timer:null,
            styles:{}

        }
    },
    mounted() {
        let self = this;
        // console.log("reload_tree_" + this.id+' init')
        this.$root.eventBus.$on("reload_tree_" + this.id, () => {
            //console.log('getSelectedNodes===',store.get('currentTreeNodeId'))
            this.openPath = store.get('currentTreeNodeId')
            store.remove('currentTreeNodeId')
            this._loadData()
        })
        if(this.dependsOn){
            let dependsOnMap = this.dependsOn
            for (let doParm in dependsOnMap) {
                this.$root.eventBus.$on(dependsOnMap[doParm]+'_value_change',result =>{
                    let param = {}
                    param[doParm] = result[dependsOnMap[doParm]]
                    if(param[doParm] != ''){
                        Object.assign(self.parameters, param);
                        store.remove('currentTreeNodeId')
                        this.$emit("clearData")
                        self._loadData()
                    }
                })
            }
        }

        let bodyHeight = document.body.getBoundingClientRect().height
        let tree = this.$refs.tree.$el.getBoundingClientRect()
        let height = this.maxHeight == 0 ? (bodyHeight - tree.top - 30) : this.maxHeight
        this.styles = {
            'overflow': 'auto',
            'max-height': height+'px'
        }
    },
    
    created() {
        this._loadData()
    },

    methods: {
        cancelCheck(value,data){
            let openPath = []
            data.map(item => {
                if(item.parentNodeId) {
                   openPath.push(item.parentNodeId)     
                }
            })
            this.selectedValue = value
            this.data = this.toTree(this.ajaxData, openPath,false,this.selectedValue)
        },
      /**
       * 无层级数据 -> 层级数据
       * @param data
       * @param expands
       * @returns {Array}
       */
        toTree(data, expands,expandAll,selected) {
            var map = {}
            let that = this
            data = JSON.parse(JSON.stringify(data))
            data.forEach(function (item) {
                if (expands.indexOf(item.nodeId) !== -1) {
                    item.expand = true
                }

                if(that.showCheckbox){
                    if (selected.indexOf(item.nodeId) !== -1) {
                        item.checked = true
                    }
                }
                if(item.nodeId == expands[expands.length - 1]) {
                    item.selected = true
                }

                if(expandAll) {
                    item.expand = true
                }
                item.title = item.text
                delete item.children
                delete item.text
                map[item.nodeId] = item
            })
            var tree = []
            data.forEach(function (item, index, arr) {
                item, index, arr
                var parent = map[item.parentNodeId]
                if(parent) {
                    parent.children ? parent.children : parent.children = []
                    parent.children.push(item)
                } else {
                    tree.push(item)
                }
            })
            return tree
        },

        selectChange(item) {
            if(!item || item.length === 0 || !item[0].bizData) return false
            let bizData = item[0].bizData
            store.set('currentTreeNodeId',item[0].nodeId)
            if (this.nodeType === 'link') {
                var param = []
                for (let key in this.nodeOptions.linkParamField) {
                    param.push(key + '=' + bizData[this.nodeOptions.linkParamField[key]])
                }
                let url = param.length > 0 ? this.nodeOptions.linkUrl + '?' + param.join('&') : this.nodeOptions.linkUrl
                //另外一种方式：这里是否通过事件总线通知方式，让对应的组件如dynamic-container自己去加载页面或者触发数据获取
                //如果不是container类型的组件，而是其它‘静态’组件，触发获取数据的方法；
                this.$root.loadContainer(this.nodeOptions.dynamicLoadId, url)
            }
        },

        checkChange(nodes) {
            
            let nodeIdArr = []
            let nodeLabel = []
            let openPath = []
            nodes.forEach(({nodeId,title,parentNodeId}) => {
                nodeIdArr.push(nodeId)
                nodeLabel.push({
                    title:title,
                    parentNodeId:parentNodeId
                })
                if(parentNodeId) openPath.push(parentNodeId)
            })
            this.$emit("setSelectArr",{label:nodeLabel,value:nodeIdArr})
            this.selectedValue =  nodeIdArr.join(',')
            this.currentOpenPath = openPath.join(",")
        },

        _loadData() {
            let openPath = this.openPath.split(',')
            this.$http.get(this.items, {params: this.parameters}).then(res => {
                let nodeDataPlain = res.data
                this.ajaxData = res.data

                //根据初始化值判断父节点是否展开
                let openParentIds = []
                let selectTreeItem = res.data.filter(item => {
                    if(this.initCheckedNodes.includes(item.nodeId) && item.parentNodeId) {
                        openParentIds.push(item.parentNodeId)
                    }
                    return this.initCheckedNodes.includes(item.nodeId)
                })
                if(openParentIds.length > 0) {
                    openPath = [...new Set(openParentIds)]
                }

                this.data = this.toTree(this.ajaxData, openPath,this.expandAll,this.initCheckedNodes)
                this.oldData = JSON.parse(JSON.stringify(this.data))
                this.$emit("getData",selectTreeItem) 
                // 加载默认节点数据
                if (openPath.length > 0) {
                    let openNodeId = openPath[openPath.length - 1]
                    let openNode = nodeDataPlain.filter(el => {
                        return el.nodeId == openNodeId
                    })
                    openNode && this.selectChange(openNode)
                }
            })
        },
        searchTreeUpdate (value) {
            let searchData = JSON.parse(JSON.stringify(this.data))
            this.debounce(()=>{
                if(value == "") {
                    this.data = JSON.parse(JSON.stringify(this.oldData))
                } else {
                    this.searchTree(searchData,value)
                    this.data = searchData
                }
            },500)
        },
        searchTree: function(data,searchKey) {
            var self = this
            let isExpand = false
            let parentExpand = false
            searchKey = searchKey.toLowerCase()
            data.map(function(val,index){
                if(val.title) {
                    let itemValue = val.title.toLowerCase()
                    if (!val.children || val.children.length == 0 ) {
                        // 优化搜索，包含与被包含的情况均考虑
                        if(itemValue.includes(searchKey) || searchKey.includes(itemValue)) {
                            isExpand = true
                            val.selected = true
                        } else {
                            val.selected = false
                        }
                    } else {
                        parentExpand = self.searchTree(val.children,searchKey)
                        val.selected = itemValue.includes(searchKey) || searchKey.includes(itemValue)
                        val.expand = parentExpand
                        // 如果父项名字匹配搜索，也应该展开
                        if(parentExpand || val.selected) {
                            isExpand = true
                        }
                    }    
                }
            })
            return isExpand
        },
        debounce (action,time) {
            clearTimeout(this.timer)
            this.timer = setTimeout(function(){
                action()
            },time)
        },

    },

    beforeDestroy: function() {
        //清除localStorage中多余的数据
        store.remove('currentTreeNodeId')
        if(this.dependsOn){
            let dependsOnMap = this.dependsOn
            for (let doParm in dependsOnMap) {
                this.$root.eventBus.$off(dependsOnMap[doParm]+'_value_change')
            }
        }
        this.$root.eventBus.$off("reload_tree_" + this.id)
    }
  }
  
</script>
<style>
.ivu-tree-arrow i {
    font-size: 14px !important;
}
</style>

