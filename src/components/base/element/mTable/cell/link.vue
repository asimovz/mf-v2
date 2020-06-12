<template>
  <a :href="href"
      :target="target"
      v-if="(this.href.indexOf('http://') > -1 || this.href.indexOf('https://') > -1)&& isShow" >{{linkText}}</a>

  <a :href="linkHref" :target="target" :class="activeClass" v-else @click.prevent="go">{{linkText}}</a>
</template>

<script>

export default {
  name: "ag-link",
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      linkText:"",
      href: "",
      loadId:"",
      target:"",
      icon:'',
      btnType:'primary',
      targetDialog:"",
      isShow: true
    };
  },
  beforeMount() {
    let text =  this.params.props.linkText
    let textMap = this.params.props.textMap
    if(this.params.hasOwnProperty("data")){
      if(text){
        let keyArr = text.match(/^\$\{(.*)\}$/i)
        if(keyArr){
          if(textMap){
            this.linkText = this.params.data ? (this.params.data[textMap] ? this.params.data[textMap][keyArr[1]]: '') :null
          }else{
            this.linkText = this.params.data ? (this.params.data[keyArr[1]] || '') : null
          }
        }else{
          this.linkText = text || ''
        }
      }else{
        this.linkText = this.params.value
      }
      let linkParams = this.params.props.linkParamField
      var param = []
      if(linkParams != null){
        for(let key in linkParams){
          param.push(key + '=' + this.params.data[linkParams[key]])
        }
      }
      this.href = param.length > 0 ? this.params.props.transitionUrl + '?' + param.join('&') : this.params.props.transitionUrl + "?" + this.params.colName + "=" + this.params.value
      this.loadId = this.params.props.loadId || null
      this.target = this.params.props.target || null
      this.targetDialog = this.params.props.targetDialog || null
      this.btnType = this.params.props.btnType
    }else{
        this.isShow = false
    }
  },

  methods: {
      getValue() {
        return linkText
      },
      isPopup() {
      },
      isCancelBeforeStart() {
      },
      isCancelAfterEnd() {
      },
      go: function (event) {
        if (event.button !== 0) {
          return
        }
        if (this.loadId && this.loadId.length > 0) {
          this.params.context.$root.loadContainer(this.loadId, this.href)
        } else if(this.targetDialog && this.targetDialog.length > 0){
          this.params.context.$root.eventBus.$emit("dynamic_visible_change_"+this.targetDialog,{
            href: this.href,
            title: this.linkText,
          });
        }else {
          if (event.ctrlKey || event.metaKey) {
            window.open(this.linkHref, '_blank')
          } else {
            this.params.context.$root.setUrl(this.linkHref)
            this.params.context.$root.eventBus.$emit("updateAsideMenu",true,this.linkHref)
            window.history.pushState(null, 'title',this.linkHref)
          }
        }
      }
  },
  computed: {
    linkHref: function () {
      return this.params.context.$root.getLinkPath(this.href)
    },
    activeClass:function(){
      return this.btnType?('btn btn-sm btn-'+this.btnType):''
    }
  }
};
</script>
