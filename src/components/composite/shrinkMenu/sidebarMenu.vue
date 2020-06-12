<template>
    <div>
        <div class="page-sidebar">
            <div class="user-box">
                <div class="userIcon"></div>
                <img src="/static/images/logo.png" width="40" alt="">
               <!--  <h3 class="name">逸阳</h3>
                <p class="job">设计师</p> -->
            </div>
            <ul class="app-navList" >
                <li v-for="(item,index) in menuData" :class="{active:(item.name==appActive)}" ref="item" @click="shrinkEnter(index,$event,true)"  >
                    <m-link :href="item.path" @click.native="openChange(item.path,item.title)">
                            {{item.title}}
                    </m-link>
                </li>
            </ul>
        </div>
        
        <transition name="slide-fade">
            <shrink-menu ref="shrink" :activeName="activeName" :openNames="openNames" :level="level" :menuData="childData" :visibile="shrinkState" v-if="shrinkState" :top="top"  @mouseenter.native="setShrinkState" @mouseleave.native="shrinkLeave" @searchMenuUpdate="searchMenuUpdate" @updateMenuApp="updateMenuApp" @restoreSearch="restoreSearch">
            </shrink-menu>
        </transition>
    </div>
</template>
<script>
//import store from '@/assets/js/localStorage'
import shrinkMenu from './mShrinkMenu'
import searchJson from '@/assets/js/searchJson'
export default {
    name: 'sidebar-menu',
    components: {
        shrinkMenu
    },
    data() {
        return {
            childData:[],
            level: 0,
            menuData: null,
            shrinkState: false,
            top: 0,
            currentPath:['','',''],
            urlPathArr:[],
            timer:null
        }
    },
    computed: {
        activeName () {
            return this.currentPath[2]
        },
        openNames () {
            return this.currentPath[1]
        },
        appActive () {
            return this.currentPath[0]
        }
    },
    methods: {
        shrinkEnter(data, event) {
            this.shrinkState = true
            this.setItemArrowTop(data)  
            this.childData = this.menuData[data]
            document.body.onmouseleave = ()=>{
                this.shrinkState = false
                document.body.onmouseleave = null
            }
        },
        shrinkLeave(event) {
            clearTimeout(this.timer)
            //防止连续点击元素内部触发mouseleave,mouseout事件
            let _parent = event.relatedTarget
            if (_parent!==null){
                this.shrinkState = false
            }
        },
        setShrinkState() {
            this.shrinkState = true
        },
        setItemArrowTop (num) {
            let item = this.$refs.item[num]
            this.top = item.offsetTop+item.offsetHeight/2
        },
        searchMenuUpdate (value) {
            let showStyle = "list"
            let menuList = this.$root.eventBus.menuList
            let param = {}
            let self = this
            param['title'] = [value]
            let initParam = {param:param,data:menuList,rule:'like',result:showStyle}
            searchJson.init(initParam,function(data){
                let result
                if(showStyle=="list"){
                    result = [{
                        isSearch:true,
                        children:data
                    }]
                }else{
                    result = data
                }
                self.childData = result[0]
            })
        },
        restoreSearch (value) {
            this.childData = value
        },
        updateMenuApp (value) {
            this.$emit("updateCrumb")
            this.currentPath = value
        },
        openChange (path,ptitle) {
            let crumb = []
            let currentPath = path.split("/").filter(item => {
                return item != ""
            }).slice(1)
            crumb.push(ptitle)
            this.$root.eventBus.currentCrumb = JSON.stringify(crumb)
            // store.set('currentCrumb',JSON.stringify(crumb))
            // store.set('currentPath',JSON.stringify(currentPath))
            this.updateMenuApp(currentPath)
        },
        getUrlPath() {
            let currentUrl = window.location.pathname.split("/")
            currentUrl = currentUrl.slice(2)
            this.matchPath(this.$root.eventBus.menuList[0].children,currentUrl)
            this.$root.eventBus.currentCrumb = JSON.stringify(this.urlPathArr)

            let getCurrentPath = JSON.parse(JSON.stringify(currentUrl))
            if(getCurrentPath.length == 2) {
                getCurrentPath.push(getCurrentPath[1])
            }

            this.updateMenuApp(getCurrentPath)
        },
        matchPath: function(data,key,deep=0) {
            let self = this
            let isMatch = false
            let isParent = false
            data.forEach(function(val,index){
                if (!val.children || val.children.length == 0 ) {
                    if(key[deep] == val.name) {
                        self.urlPathArr.push(val.title)
                        isMatch = true
                        return true
                    } else {
                        return false
                    }
                } else {
                    isParent = key[deep] == val.name
                    if(isParent) {
                        deep++
                        self.urlPathArr.push(val.title)
                        let parentMatch = self.matchPath(val.children,key,deep)
                    }
                }
                
            })
            return isMatch
        },
        debounce (action,time) {
            clearTimeout(this.timer)
            this.timer = setTimeout(function(){
                action()
            },time)
        },
    },
    created:function () {
        //获取菜单
        this.$http.get("/getMenuItems").then(response => {
          let newMenuData = response.data
          this.$root.eventBus.menuList = newMenuData
          this.menuData = this.$root.eventBus.menuList[0].children
          this.getUrlPath()
        }, err => {

        })
    }
}
</script>