import Vue from 'vue'
import App from './App'
import axios from './axios'
import moquiComponents from './components'
import moqui from './assets/js/moquiLibs'
import _L from 'accredit'

import "./assets/css/main.less"

window['CKEDITOR_BASEPATH'] = process.env.NODE_ENV === 'production' ? __webpack_define_cdn__ + '/static/js/CKEditor/' : '/static/js/CKEditor/'
Vue.use(moquiComponents)

Vue.prototype.$http = axios
Vue.prototype.moqui = moqui
Vue.filter('decodeHtml', moqui.htmlDecode)
Vue.filter('format', moqui.dateFormat)


// import { smsEditor, locale } from './components/mmsEditor/library.core.js'
// import './components/mmsEditor/style/bundle.css'

import { smsEditor, locale } from './components/smsEditor'

// import {smsEditor,locale} from './SmsEditor'

// import {smsEditor,locale} from '../compile/dist/library.core.js'
Vue.use(smsEditor, {
  http(url, data, config = {}){
    return new Promise((resolve, reject) => {
      axios.post(url, data, {...config})
      .then(res => {
        if(res.status === 200){
          return resolve(res.data)
        }
      })
      .catch(err => reject(err))
    })
  }
})



window.moquiVue = new Vue({
  el: '#app',
  template:'<App />',
  components: {
    App
  },
  data: {
    eventBus: new Vue(),
    localeMap: { 'zh': 'zh-cn' },
    basePath: "",
    linkBasePath: "",
    currentPathList: [],
    extraPathList: [],
    activeSubscreens: [],
    currentParameters: {},
    bodyParameters: null,
    navMenuList: [],
    navHistoryList: [],
    navPlugins: [],
    notifyHistoryList: [],
    lastNavTime: Date.now(),
    loading: 0,
    activeContainers: {},
    moquiSessionToken: "",
    appHost: "",
    appRootPath: "",
    changePwdUrl:"",
    userId: "",
    locale: "en",
    gridFeedbackData: {},
    notificationClient: null,
    operator:{},
    axiosRequest:[],
    themeConfig: $THEME
  },
  methods: {
    setToolbar() {
      // if(document.querySelector(".toolbar,.tool-box")){
      //   document.querySelector(".page-con").style.paddingTop = "100px"
      // }else {
      //   document.querySelector(".page-con").style.paddingTop = "50px"
      // }
    },
    setUrl: function (url, bodyParameters) {

      // always set bodyParameters, setting to null when not specified to clear out previous
      this.bodyParameters = bodyParameters;
      // make sure any open modals are closed before setting current URL
      // $('.modal.in').modal('hide');
      url = this.getLinkPath(url);
      // console.info('setting url ' + url + ', cur ' + this.currentLinkUrl);
      if (this.currentLinkUrl === url && url !== this.linkBasePath) {
        this.reloadSubscreens(); /* console.info('reloading, same url ' + url); */
      } else {
        var href = url;
        var ssIdx = href.indexOf('://');
        if (ssIdx >= 0) {
          var slIdx = href.indexOf('/', ssIdx + 3);
          if (slIdx === -1) return;
          href = href.slice(slIdx);
        }
        var splitHref = href.split("?");
        // clear out extra path, to be set from nav menu data if needed
        this.extraPathList = [];
        // set currentSearch before currentPath so that it is available when path updates
        if (splitHref.length > 1 && splitHref[1].length > 0) { this.currentSearch = splitHref[1]; } else { this.currentSearch = ""; }
        this.currentPath = splitHref[0];


        // with url cleaned up through setters now get current screen url for menu
        var srch = this.currentSearch;
        var screenUrl = this.currentPath + (srch.length > 0 ? '?' + srch : '');
        if (!screenUrl || screenUrl.length === 0) return;
        console.info("current URL changing to " + screenUrl);
        this.lastNavTime = Date.now();
        // TODO: somehow only clear out activeContainers that are in subscreens actually reloaded? may cause issues if any but last screen have dynamic-container
        this.activeContainers = {};
        // update menu, which triggers update of screen/subscreen components
        var vm = this;
        var menuDataUrl = this.appRootPath && this.appRootPath.length && screenUrl.indexOf(this.appRootPath) === 0 ?
          this.appRootPath + "/menuData" + screenUrl.slice(this.appRootPath.length) : "/menuData" + screenUrl;

        this.$http.get(menuDataUrl).then(response => {
          this.navMenuList = response.data
        }, err => {

        })
      }
    },
    setParameters: function (parmObj) {
      if (parmObj) { this.$root.currentParameters = $.extend({}, this.$root.currentParameters, parmObj); }
      this.$root.reloadSubscreens();
    },
    addSubscreen: function (saComp) {

      var pathIdx = this.activeSubscreens.length;
      // console.info('addSubscreen idx ' + pathIdx + ' pathName ' + this.currentPathList[pathIdx]);
      saComp.pathIndex = pathIdx;
      // setting pathName here handles initial load of subscreens-active; this may be undefined if we have more activeSubscreens than currentPathList items
      saComp.loadActive();
      this.activeSubscreens.push(saComp);
    },
    reloadSubscreens: function () {
      // console.info('reloadSubscreens currentParameters ' + JSON.stringify(this.currentParameters) + ' currentSearch ' + this.currentSearch);
      var fullPathList = this.currentPathList
      var activeSubscreens = this.activeSubscreens
      console.info("reloadSubscreens currentPathList " + JSON.stringify(this.currentPathList));
      if (fullPathList.length === 0 && activeSubscreens.length > 0) {
        activeSubscreens.splice(1); activeSubscreens[0].loadActive()
        return
      }

      for (var i = 0; i < activeSubscreens.length; i++) {
        if (i >= fullPathList.length) break;
        // always try loading the active subscreen and see if actually loaded
        var loaded = activeSubscreens[i].loadActive();
        // clear out remaining activeSubscreens, after first changed loads its placeholders will register and load
        if (loaded) activeSubscreens.splice(i + 1);
      }
    },
    // all container components added with this must have reload() and load(url) methods
    addContainer: function (contId, comp) { this.activeContainers[contId] = comp; },
    reloadContainer: function (contId) {
      var contComp = this.activeContainers[contId];
      if (contComp) { contComp.reload(); } else { console.error("Container with ID " + contId + " not found, not reloading"); }
    },
    loadContainer: function (contId, url) {
      //容器动态加载内容时拼接参数
      var splitHref = url.split("?");
      if (splitHref.length > 1 && splitHref[1].length > 0) { this.currentSearch = splitHref[1]; } else { this.currentSearch = ""; }

      var contComp = this.activeContainers[contId];
      if (contComp) { contComp.load(url); } else { console.error("Container with ID " + contId + " not found, not loading url " + url); }
    },
    addNavPlugin: function (url) { var vm = this; moqui.loadComponent(this.appRootPath + url, function (comp) { vm.navPlugins.push(comp); }) },
    addNotify: function (message, type) {
      var histList = this.notifyHistoryList.slice(0);
      var nowDate = new Date();
      var nh = nowDate.getHours(); if (nh < 10) nh = '0' + nh;
      var nm = nowDate.getMinutes(); if (nm < 10) nm = '0' + nm;
      // var ns = nowDate.getSeconds(); if (ns < 10) ns = '0' + ns;
      histList.unshift({ message: message, type: type, time: (nh + ':' + nm) }); //  + ':' + ns
      while (histList.length > 25) { histList.pop(); }
      this.notifyHistoryList = histList;
    },
    switchDarkLight: function () {
      var jqBody = $("body"); jqBody.toggleClass("bg-dark"); jqBody.toggleClass("bg-light");
      var currentStyle = jqBody.hasClass("bg-dark") ? "bg-dark" : "bg-light";
      $.ajax({
        type: 'POST', url: (this.appRootPath + '/apps/setPreference'), error: moqui.handleAjaxError,
        data: { moquiSessionToken: this.moquiSessionToken, preferenceKey: 'OUTER_STYLE', preferenceValue: currentStyle }
      });
    },
    showScreenDocDialog: function (docIndex) {
      $("#screen-document-dialog").modal("show");
      $("#screen-document-dialog-body").load(this.currentPath + '/screenDoc?docIndex=' + docIndex);
    },
    stopProp: function (e) { e.stopPropagation(); },
    getNavHref: function (navIndex) {
      if (!navIndex) navIndex = this.navMenuList.length - 1;
      var navMenu = this.navMenuList[navIndex];
      if (navMenu.extraPathList && navMenu.extraPathList.length) {
        var href = navMenu.path + '/' + navMenu.extraPathList.join('/');
        var questionIdx = navMenu.pathWithParams.indexOf("?");
        if (questionIdx > 0) { href += navMenu.pathWithParams.slice(questionIdx); }
        return href;
      } else {
        return navMenu.pathWithParams || navMenu.path;
      }
    },
    getLinkPath: function (path) {
      if (this.appRootPath && this.appRootPath.length && path.indexOf(this.appRootPath) !== 0) path = this.appRootPath + path;
      if (path.indexOf(this.basePath) === 0) path = path.replace(this.basePath, this.linkBasePath);
      return path;
    },
    loadComponent: function (urlInfo, callback, divId) {
      var path, extraPath, search, bodyParameters, ajaxType, renderModes;
      if (typeof urlInfo === 'string') {
        var questIdx = urlInfo.indexOf('?')
        if (questIdx > 0) {
          path = urlInfo.slice(0, questIdx)
          search = urlInfo.slice(questIdx + 1)
        } else {
          path = urlInfo
        }
      } else {
        path = urlInfo.path
        extraPath = urlInfo.extraPath
        search = urlInfo.search
        this.currentSearch = search
        bodyParameters = urlInfo.bodyParameters;
        renderModes = urlInfo.renderModes;
      }
      if (bodyParameters && Object.keys(bodyParameters).length>0) {
        ajaxType = "POST"
      } else {
        ajaxType = "GET"
      }
      // check cache
      // console.info('component lru ' + JSON.stringify(moqui.componentCache.lruList));
      var cachedComp = this.moqui.componentCache.get(path);
      if (cachedComp && !urlInfo.dynamicParams) {
        console.info('found cached component for path ' + path);
        callback(cachedComp); return;
      }
      // prep url
      var url = path
      var isJsPath = (path.slice(-3) === '.js')
      if (!isJsPath && urlInfo.renderModes && urlInfo.renderModes.indexOf("js") >= 0) {
        // screen supports js explicitly so do that
        url += '.js';
        isJsPath = true;
      }

      if (!isJsPath) url += '.covt';
      if (extraPath && extraPath.length > 0) url += ('/' + extraPath);
      if (search && search.length > 0) url += ('?' + search);

      console.info("loadComponent " + url + (divId ? " id " + divId : ''));
      this.$http({
        method: ajaxType,
        url: url,
        data:bodyParameters
      }).then(response => {
        //console.info('response ==> ', response.data);
        if (!response.data) {
          callback(moquiComponents.notFound)
        }

        // if(response.headers["cache-control"] == undefined){
        //   return
        // }

        var isServerStatic = (response.headers["cache-control"].indexOf("max-age") >= 0)

        if (this.moqui.isString(response.data) && response.data.length > 0) {
          if (isJsPath || response.data.slice(0, 7) === 'define(') {
            console.info("loaded JS from " + url + (divId ? " id " + divId : ""));
            var jsCompObj = eval(response.data);
            if (jsCompObj.template) {
              if (isServerStatic) {
                this.moqui.componentCache.put(path, jsCompObj);
              }
              callback(jsCompObj);
            } else {
              var htmlUrl = (path.slice(-3) === '.js' ? path.slice(0, -3) : path) + '.covt';
              var that = this
              //如果界面中包含了js，继续请求covt或者js的时候，入参需要进行补全
              if (search && search.length > 0) htmlUrl += ('?' + search);
              this.$http.get(htmlUrl).then(response => {
                jsCompObj.template = response.data;
                if (isServerStatic) {
                  that.moqui.componentCache.put(path, jsCompObj);
                }
                callback(jsCompObj);
              }, response => {
                that.moqui.handleLoadError
              })
            }
          } else {
            var templateText = response.data.replace(/<script/g, '<m-script').replace(/<\/script>/g, '</m-script>').replace(/<link/g, '<m-stylesheet');
            console.info("loaded HTML template from " + url + (divId ? " id " + divId : "") /*+ ": " + templateText*/);
            // using this fixes encoded values in attributes and such that Vue does not decode (but is decoded in plain HTML),
            // but causes many other problems as all needed encoding is lost too: moqui.decodeHtml(templateText)
            var compObj = {
              template: '<div' + (divId && divId.length > 0 ? ' id="' + divId + '"' : '') + '>' + templateText + '</div>'
            };
            if (isServerStatic) {
              this.moqui.componentCache.put(path, compObj);
            }
            callback(compObj);
          }
        }
        else if (moqui.isPlainObject(response.data)) {
          if (response.data.screenUrl && response.data.screenUrl.length > 0) {
            this.$root.setUrl(response.data.screenUrl);
          }
          else if (response.data.redirectUrl && response.data.redirectUrl.length > 0) {
            window.location.replace(response.data.redirectUrl);
          }
        }
        else {
          callback(moquiComponents.notFound);
        }
      },error => {
        this.moqui.handleLoadError
      })

      if(_L.settings) _L.settings.code = this.LCODE
      _L.run()
    },
    objToSearch: function (obj) {
      var search = ''
      if (moqui.isPlainObject(obj))
        $.each(obj, function (key, value) {
          search = search + (search.length > 0 ? '&' : '') + key + '=' + value;
        });
      return search
    },
    searchToObj: function (search) {
      if (!search || search.length === 0) { return {}; }
      var newParams = {};
      var parmList = search.split("&");
      for (var i = 0; i < parmList.length; i++) {
        var parm = parmList[i]; var ps = parm.split("=");
        if (ps.length > 1) {
          var key = ps[0]; var value = ps[1]; var exVal = newParams[key];
          if (exVal) { if (moqui.isArray(exVal)) { exVal.push(value); } else { newParams[key] = [exVal, value]; } }
          else { newParams[key] = value; }
        }
      }
      return newParams;
    },
    setTransitionUrl: function (url) {
      let root = this.$root
      return root.basePath + "/" + root.currentPathList.join("/") + "/" + url
    },
  },
  watch: {
    navMenuList: function (newList) {
      if (newList.length > 0) {
        var cur = newList[newList.length - 1];
        var par = newList.length > 1 ? newList[newList.length - 2] : null;
        // if there is an extraPathList set it now
        if (cur.extraPathList) this.extraPathList = cur.extraPathList;
        // make sure full currentPathList and activeSubscreens is populated (necessary for minimal path urls)
        // fullPathList is the path after the base path, menu and link paths are in the screen tree context only so need to subtract off the appRootPath (Servlet Context Path)
        var basePathSize = this.basePathSize;
        var fullPathList = cur.path.split('/').slice(basePathSize + 1);
        console.info('nav updated fullPath ' + JSON.stringify(fullPathList) + ' currentPathList ' + JSON.stringify(this.currentPathList) + ' cur.path ' + cur.path + ' basePathSize ' + basePathSize);
        this.currentPathList = fullPathList;
        this.reloadSubscreens();

        // update history and document.title
        var newTitle = (par ? par.title + ' - ' : '') + cur.title;
        var curUrl = cur.pathWithParams; var questIdx = curUrl.indexOf("?");
        if (questIdx > 0) {
          var excludeKeys = ["pageIndex", "orderBySelect", "orderByField", "moquiSessionToken"];
          var parmList = curUrl.substring(questIdx + 1).split("&");
          curUrl = curUrl.substring(0, questIdx);
          var dpCount = 0;
          var titleParms = "";
          for (var pi = 0; pi < parmList.length; pi++) {
            var parm = parmList[pi];
            if (curUrl.indexOf("?") === -1) { curUrl += "?"; } else { curUrl += "&"; }
            curUrl += parm;
            // from here down only add to title parms
            if (dpCount > 3) continue; // add up to 4 parms to the title
            var eqIdx = parm.indexOf("=");
            if (eqIdx > 0) {
              var key = parm.substring(0, eqIdx);
              var value = parm.substring(eqIdx + 1);
              if (key.indexOf("_op") > 0 || key.indexOf("_not") > 0 || key.indexOf("_ic") > 0 || excludeKeys.indexOf(key) > 0 || key === value) continue;
              if (titleParms.length > 0) titleParms += ", ";
              titleParms += decodeURIComponent(value);
              dpCount++;
            }
          }
          if (titleParms.length > 0) {
            if (titleParms.length > 70) titleParms = titleParms.substring(0, 70) + "...";
            newTitle = newTitle + " (" + titleParms + ")";
          }
        }
        var navHistoryList = this.navHistoryList;
        for (var hi = 0; hi < navHistoryList.length;) {
          if (navHistoryList[hi].pathWithParams === curUrl) { navHistoryList.splice(hi, 1); } else { hi++; }
        }
        navHistoryList.unshift({ title: newTitle, pathWithParams: curUrl, image: cur.image, imageType: cur.imageType });
        while (navHistoryList.length > 25) { navHistoryList.pop(); }
        document.title = newTitle;
      }
    },
    currentPathList: function (newList) {
      var lastPath = newList[newList.length - 1];
    }
  },
  computed: {
    currentPath: {
      get: function () {
        var curPath = this.currentPathList
        var extraPath = this.extraPathList
        return this.basePath + (curPath && curPath.length > 0 ? '/' + curPath.join('/') : '') +
          (extraPath && extraPath.length > 0 ? '/' + extraPath.join('/') : '')
      },
      set: function (newPath) {
        if (!newPath || newPath.length === 0) {
          this.currentPathList = []
          return
        }
        if (newPath.slice(newPath.length - 1) === '/') newPath = newPath.slice(0, newPath.length - 1)
        if (newPath.indexOf(this.linkBasePath) === 0) {
          newPath = newPath.slice(this.linkBasePath.length + 1)
        } else if (newPath.indexOf(this.basePath) === 0) {
          newPath = newPath.slice(this.basePath.length + 1)
        }
        this.currentPathList = newPath ? newPath.split('/') : ''
      }
    },
    currentLinkPath: function () {
      var curPath = this.currentPathList
      var extraPath = this.extraPathList
      return this.linkBasePath + (curPath && curPath.length > 0 ? '/' + curPath.join('/') : '') +
        (extraPath && extraPath.length > 0 ? '/' + extraPath.join('/') : '')
    },
    currentSearch: {
      get: function () {
        return this.objToSearch(this.currentParameters)
      },
      set: function (newSearch) {
        this.currentParameters = this.searchToObj(newSearch)
      }
    },
    currentLinkUrl: function () {
      var srch = this.currentSearch
      return this.currentLinkPath + (srch.length > 0 ? '?' + srch : '')
    },
    basePathSize: function() {
      return this.basePath.split('/').length - this.appRootPath.split('/').length
    },
    ScreenTitle: function () {
      return this.navMenuList.length > 0 ? this.navMenuList[this.navMenuList.length - 1].title : ""
    }
  },

})

export default moquiVue
