<template>
	<span :class="['meiconfont', iconClas]" :style="iconStyle"></span>
</template>

<script>

	import '../../assets/css/iconfont.css'
	
	/**	<editor-icon name="shipin" size="16px" color="blue" />
	 * 		name: icon 名
	 * 	 	size: 大小
	 * 	 	color: 颜色
	 */

	export default {
		name: 'editor-icon',
		props: {
			name: {
				type: String,
				default: '',
				required: true
			},
			size: {
				type: [String, Number],
			},
			color: {
				type: String
			},
		},
		computed: {
			iconClas(){
				return `meicon-${this.name}`
			},
			fontSize(){
				return typeof this.size === 'string' ? (this.size.split('px')[0] + 'px') : `${this.size}px`
			},
			iconStyle(){
				return {
					color: this.color,
					fontSize: this.fontSize
				}
			}
		},
	}
</script>