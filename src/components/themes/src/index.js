import layout from './layout'
import logins from './login'
import './css/index.less'
import './css/blue.less'
import './css/dark.less'
import './css/imos.less'

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
		if (login['name'] === 'theme-login-dark') Vue.component('theme-login-imos', login)
	})
}

export default install