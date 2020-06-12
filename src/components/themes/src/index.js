import layout from './layout'
import logins from './login'
import './index.less'
import './blue.less'
import './dark.less'

let themeList = {
	dark: {
		isTabNav: false
	},
	blue: {
		isTabNav: true
	}
}

const install = (Vue) => {
	Vue.component('theme-body', layout)
	Vue.prototype.$themeList = themeList
	logins.forEach(login => {
		Vue.component(login['name'], login)
	})
}

export default install