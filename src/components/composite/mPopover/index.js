import Vue from 'vue'
import popover from './popover'

const PopoverConstructor = Vue.extend(popover)
const pop = function(event,options) {
	if(document.querySelector(".popover-wrap")){
		document.body.removeChild(document.querySelector(".popover-wrap"))
	}
	let _root = this.$root
	const popComp = new PopoverConstructor({
		data: {
			isUpDown: typeof options.isUpDown != 'undefined' ? options.isUpDown : true,
			width:options.width,
			vueRoot: _root,
			el:event,
			curComponent:options.component,
			opData:options.data,
			show: true
		}
	})
	popComp.vm = popComp.$mount()
    document.body.appendChild(popComp.vm.$el)	
    return popComp.vm
}

Vue.prototype.$popover = pop








