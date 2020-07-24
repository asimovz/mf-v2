<template>
	<div class="toolbar-wrapper" style="margin-bottom:20px">

    <div :class="['toolbar-item',{'disabled':!isComposeDisabled}]" @click="composeGroup">
      <editor-icon name="zuhe" size="20" />&nbsp;组合
    </div>

    <div :class="['toolbar-item',{'disabled':!isSplitDisabled}]" @click="splitGroup">
      <editor-icon name="chaisan1" size="20" />&nbsp;打散
    </div>
    <div class="toolbar-item" @click="reset" :class="{disabled: resetDisabled}">
      <editor-icon name="shanchu" size="16" />&nbsp;清空
    </div>
    <div class="toolbar-item" :class="{disabled: saveDisabled}" @click="save">
      <editor-icon v-if="!saveLoading" name="baocun" size="16" />
      <i v-else class="el-icon-loading" style="font-size: 16px;"></i>&nbsp;保存<font v-if="saveLoading">中</font>
    </div>
    <el-popover placement="top" width="200" trigger="click">
      <div class="toolbar-item" slot="reference">
        <editor-icon name="bangzhu" size="20" />&nbsp;帮助
      </div>
      <div class="shortcut_title">
        <div class="title">快捷键</div>
      </div>
      <div class="shortcut">
        <div class="name">文本编辑</div>
        <div class="key">
          <div><kbd>鼠标双击</kbd></div>
        </div>
      </div>
      <div class="shortcut">
        <div class="name">多选</div>
        <div class="key">
          <div><kbd>Shift</kbd>+<kbd>鼠标单击</kbd></div>
        </div>
      </div>
      <div class="shortcut">
        <div class="name">拖动画布</div>
        <div class="key">
          <div><kbd>Space</kbd>+<kbd>鼠标拖拽</kbd></div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
	export default {
		name: 'btn-tools',
		components: {

		},
		props: {
			isComposeDisabled: {
				type: Boolean,
				default: false
			},
			isSplitDisabled: {
				type: Boolean,
				default: false
			},
			resetDisabled: {
				type: Boolean,
				default: false
			},
			saveDisabled: {
				type: Boolean,
				default: false
			},
			saveLoading: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {

			}
		},
		methods: {
			composeGroup(){
				this.$emit('on-compose-group')
			},
			splitGroup(){
				this.$emit('on-split-group')
			},
			reset(){
				this.$emit('on-reset')
			},
			save(){
				this.$emit('on-save')
			},
		},

		beforeCreate(){

		},
		
		mounted(){

		}
	}
</script>

<style lang="less">

</style>