<template>
	<div class="phone-preview-wrapper">
		<div class="phone-preview_shell"></div>
		<div class="phone-preview_container">
			<div class="menu_wrapper">
				<div class="menu_keyboard">
<svg t="1568772437487" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2798" width="24" height="24"><path d="M511.996 993.802c-266.092 0-481.804-215.714-481.804-481.804 0-266.094 215.712-481.806 481.804-481.806s481.806 215.712 481.806 481.806c0 266.09-215.714 481.804-481.806 481.804z m0-905.365c-233.927 0-423.559 189.632-423.559 423.561s189.632 423.559 423.559 423.559c233.932 0 423.561-189.63 423.561-423.561 0.001-233.927-189.629-423.559-423.561-423.559z m248.927 500.152h-38.295c-10.57 0-19.15-8.58-19.15-19.15v-76.59c0-10.57 8.58-19.147 19.15-19.147h38.295c10.57 0 19.145 8.577 19.145 19.147v76.59c0 10.57-8.575 19.15-19.145 19.15z m0-172.333h-38.295c-10.57 0-19.15-8.578-19.15-19.147v-76.592c0-10.57 8.58-19.147 19.15-19.147h38.295c10.57 0 19.145 8.577 19.145 19.147v76.592c0 10.57-8.575 19.147-19.145 19.147zM607.738 588.589h-38.3c-10.57 0-19.145-8.58-19.145-19.15v-76.59c0-10.57 8.575-19.147 19.145-19.147h38.3c10.57 0 19.15 8.577 19.15 19.147v76.59c0 10.57-8.58 19.15-19.15 19.15z m0-172.333h-38.3c-10.57 0-19.145-8.578-19.145-19.147v-76.592c0-10.57 8.575-19.147 19.145-19.147h38.3c10.57 0 19.15 8.577 19.15 19.147v76.592c0 10.57-8.58 19.147-19.15 19.147z m134.04 268.072v19.15c0 10.57-8.58 19.15-19.15 19.15H301.367c-10.568 0-19.147-8.58-19.147-19.15v-19.15c0-10.57 8.58-19.145 19.147-19.145h421.261c10.57 0 19.15 8.575 19.15 19.145z m-287.224-95.739h-38.297c-10.57 0-19.147-8.58-19.147-19.15v-76.59c0-10.57 8.577-19.147 19.147-19.147h38.297c10.57 0 19.147 8.577 19.147 19.147v76.59c0 10.57-8.577 19.15-19.147 19.15z m0-172.333h-38.297c-10.57 0-19.147-8.578-19.147-19.147v-76.592c0-10.57 8.577-19.147 19.147-19.147h38.297c10.57 0 19.147 8.577 19.147 19.147v76.592c0 10.57-8.577 19.147-19.147 19.147zM301.367 588.589h-38.295c-10.57 0-19.147-8.58-19.147-19.15v-76.59c0-10.57 8.577-19.147 19.147-19.147h38.295c10.57 0 19.15 8.577 19.15 19.147v76.59c0 10.57-8.58 19.15-19.15 19.15z m0-172.333h-38.295c-10.57 0-19.147-8.578-19.147-19.147v-76.592c0-10.57 8.577-19.147 19.147-19.147h38.295c10.57 0 19.15 8.577 19.15 19.147v76.592c0 10.57-8.58 19.147-19.15 19.147z" fill="#8a8a8a" p-id="2799"></path></svg>
				</div>
				<ul class="menu_list">
					<li class="item" v-for="(menu,index) in data" :key="index">
						<span>{{menu.title}}</span>		
						<ul class="sub-menu">
							<li v-for="(child,childIndex) in menu.menu" :key="childIndex">{{child}}</li>
						</ul>
					</li>
				</ul>
			</div>


		</div>	
	</div>


</template>
<script>
export default {
	name:'phone-menu-preview',
	props: {
		data:Array
	},
	data() {
		return {

		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {
		show(evt) {
			let menus = Array.from(document.querySelectorAll('.sub-menu'))
			let sub = evt.currentTarget.querySelector(".sub-menu")
			menus.map(item => {
				item.style.display = "none"
			})
			sub.style.display = "block"
		}
	}
}
</script>
<style>
.phone-preview-wrapper {
	position: relative;
	width: 400px;
	height: 675px;

}
.phone-preview_shell {
	width: 100%;
	height: 100%;
	background: url(/static/images/x2.png) no-repeat;
	background-size: 100% ;
	position: absolute;
	z-index: 10;
	pointer-events: none;
}
.phone-preview_container {
	position: absolute;
	z-index: 8;
	top: 23px;
	left: 20px;
	right: 22px;
	bottom: 28px;
	overflow: hidden;
	border-radius: 0 0 35px 35px;
	border: 1px solid #edf0f4;
	border-top: none;

	/*background:url(/static/images/girl.jpeg) no-repeat #edf0f4;*/
	/*background-size: 132% ;*/
}
.menu_wrapper {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	position: absolute;
	bottom:0px;
	background: #FFF;
	padding:10px;

}
.menu_keyboard {
	margin: 0 8px 0 5px;
}
.menu_list {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex:1;
}
.menu_list .item {
	position: relative;
	flex:1;
	text-align: center;
	line-height: 32px;
	cursor: pointer;
	font-size: 14px;
}
.menu_list .item:after {
	content:"";
	position: absolute;
	left:0;
	top: 15%;
	height:70%;
	border-left: 1px solid #ccc;
}


.menu_list .item .sub-menu {
	width: 98%;
	position: absolute;
	bottom: 47px;
	left:50%;
	background: #fff;
	transform: translate(-50%);
	border-radius: 5px;
	border: 1px solid #eaeaea;
	padding:5px 0;
}

.menu_list .item .sub-menu li {
	line-height: 25px;
	white-space:nowrap;
}
</style>