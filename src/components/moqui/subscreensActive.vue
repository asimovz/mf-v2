<template>
      <component :is="activeComponent"></component>
      <!-- <div>
        <mCharts type="line" :data="line"></mCharts>
        <m-card>
          <m-ranking-list
            title="某排行"
            id="rank1"
            link
            dividerRight
            padding="0 10px"
            res-data-key="title"
            search-form="mTimeTab"
            :init-query-params="{a:1}"
            :data="[]">
          </m-ranking-list>
        </m-card>
        
      </div> -->
      
</template>

<script>
import notFound from './notFound'
import emptyComponent from './emptyComponent'

export default {
  name: 'subscreens-active',
  props: {
    parameters: Object
  },
  data () {
    return {
      activeComponent: emptyComponent,
      pathIndex: -1,
      pathName: null,
      line: {
        columns: ['日期', '发送量', '退定量', '接收量'],
        rows: []
      }
    }
  },

	// method instead of a watch on pathName so that it runs even when newPath is the same for non-static reloading
  methods: {
    loadActive: function () {
      var vm = this
      var root = vm.$root
      var pathIndex = vm.pathIndex
      var curPathList = root.currentPathList
      var newPath = curPathList[pathIndex]
      var pathChanged = (this.pathName !== newPath)
      this.pathName = newPath
      if (!newPath || newPath.length === 0) {
        console.info('in subscreens-active newPath is empty, loading EmptyComponent and returning true')
        this.activeComponent = emptyComponent
        return true
      }
      var fullPath = root.basePath + '/' + curPathList.slice(0, pathIndex + 1).join('/')
      if (!pathChanged && this.$root.moqui.componentCache.containsKey(fullPath)) {
				// no need to reload component
				// console.info("in subscreens-active returning false because pathChanged is false and componentCache contains " + fullPath);
        return false
      }
      var urlInfo = { path: fullPath }
      if (pathIndex === (curPathList.length - 1)) {
        var extra = root.extraPathList
        if (extra && extra.length > 0) { urlInfo.extraPath = extra.join('/') }
      }
      var search = root.currentSearch
      if (search && search.length > 0) { urlInfo.search = search }
      if (typeof root.bodyParameters !== 'undefined') {
        urlInfo.bodyParameters = root.bodyParameters
      } else {
        urlInfo.bodyParameters = {}
      }

      if (typeof this.parameters !== 'undefined') {
        let params = this.parameters
        let urlParams = []
        Object.keys(params).forEach(function (key, i) {
          if (urlInfo.search && urlInfo.search.indexOf(key) == -1) {
            urlParams.push(`${key}=${i}`)
          }
					// if(i||urlInfo.search) urlInfo.search += '&'+key +'='+params[key]
					// else urlInfo.search += key +'='+params[key]
        })
        if (typeof urlInfo.search === 'undefined') {
          urlInfo.search = urlParams.join('&')
        } else {
          urlInfo.search += '&' + urlParams.join('&')
        }
      }
      var navMenuItem = root.navMenuList[pathIndex + root.basePathSize]
      if (navMenuItem && navMenuItem.renderModes) { urlInfo.renderModes = navMenuItem.renderModes }
      console.info('subscreens-active loadActive pathIndex ' + pathIndex + ' pathName ' + vm.pathName + ' urlInfo ' + JSON.stringify(urlInfo))
      root.loadComponent(urlInfo, comp => {
        this.activeComponent = comp
      })
      return true
    }
  },
  mounted: function () {
    this.$root.addSubscreen(this)
    this.$root.setToolbar()
  }
}
</script>


