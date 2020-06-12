<template>
	<div class="shrink-box">
		<div class="search-area" style="text-algin:center;margin:0px 10px 10px 10px" >
		    <m-input ref="menuSearchBtn" class="menu-search" name="menuSearch"  icon="search" placeholder="搜索菜单" @on-input-change="searchMenu"></m-input>
		</div>
		<div class="menu-box">
			<Menu ref="sideMenu" :active-name="activeName" :open-names="setOpenNames" style="width:auto"  @on-select="changeMenu" accordion>
				<template v-for="(item,index) in menuData.children">
					<Submenu :name="item.name" :key="item.name" v-if="item.children.length>0" >
						<template slot="title">
						    <Icon type="document-text"></Icon>
						    {{item.title}}
						</template>
						<MenuItem :name="child.name" :key="child.name" v-for="child in item.children">
							<m-link :href="child.path" @click.native="openChange(child.path,item.title,child.title)">
								<Icon type="document-text"></Icon> {{child.title}}
							</m-link>
						</MenuItem>
					</Submenu>
					<MenuItem :name="item.name" v-else >
						<m-link :href="item.path" @click.native="openChange(item.path,item.title)">
							<Icon type="document-text"></Icon> {{item.title}}
						</m-link>
					</MenuItem>
				</template>
			</Menu>
		</div>
		<i class="arrow" :style="styles"></i>
	</div>
</template>
<script>
//import store from '@/assets/js/localStorage'
export default {
	name:'shrink-menu',
	props:{
		menuData: Object,
		top: Number,
		level: Number,
		activeName: String,
		openNames: String
	},
	data () {
		return {
			selfState: false,
			menuList: this.menuData.children,
			oldMenuData:null

		}
	},
	computed: {
		setOpenNames () {
			let data = []
			data.push(this.openNames)
			return data
		},
		styles () {
			let style = {};
			if (this.top) {
			  style['top'] = `${this.top-5}px`;
			}
			return style;
		}
	},
	mounted:function() {
		this.oldMenuData = this.menuData
	},
	methods: {
		changeMenu (active) {
		    // store.set('menuCurrentState',active)
		    //console.log(active)
		},
		openChange (path,ptitle,ctitle) {
			let crumb = []
			let currentPath = path.split("/").filter(item => {
				return item != ""
			}).slice(1)
			crumb.push(this.menuData.title)
			crumb.push(ptitle)
			if(ctitle){
				crumb.push(ctitle)
			}else{
				if(!this.menuData.isSearch){
					currentPath.push(currentPath[1])
				}
			}
			this.$root.eventBus.currentCrumb = JSON.stringify(crumb)
			// store.set('currentCrumb',JSON.stringify(crumb))
			// store.set('currentPath',JSON.stringify(currentPath))
			
			this.$emit("updateMenuApp",currentPath)
		},
		searchMenu (value) {
			if (value == "") {
				this.$emit("restoreSearch",this.oldMenuData)
			} else {
				this.$emit("searchMenuUpdate",value)
			}
		}
	},
	updated () {
	    this.$nextTick(() => {
	        if (this.$refs.sideMenu) {
	            this.$refs.sideMenu.updateOpened()
	            this.$refs.sideMenu.updateActiveName()
	        }
	    });
	}
}


</script>
<style >


</style>