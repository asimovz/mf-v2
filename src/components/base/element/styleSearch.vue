<template>
	<div class="style-search-box">
		<m-collapse style="margin-bottom: 10px">
		    <m-colPanel>
		        <span>{{title}}</span>
		        <p slot="content"><slot></slot></p>
		    </m-colPanel>
		</m-collapse>
	</div>
</template>
<script>
export default {
	name:'m-style-search',
	props: {
		title:String
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

	}
}
</script>
<style>
.style-search-box .ivu-collapse {
	border:none;
	background: #fff;
}
.style-search-box .form-horizontal {
	padding:0;
}
.style-search-box .ivu-collapse-header .ivu-icon {
	vertical-align: unset;
	margin-right: 8px !important;
}
.style-search-box .ivu-collapse-item-active > .ivu-collapse-header {
	border:none!important;
}

.style-search-box .ivu-collapse-item > .ivu-collapse-header {
    border:none;
    background-color: #FFF;
    margin:0 10px;
    padding-left: 0;
    transition:all 0s !important;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
</style>