<template>
  <component :is="curComponent"></component>
</template>
<script>
import emptyComponent from "./emptyComponent";
export default {
  name: "dynamic-container",
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    dependsOn: Object,
    renderModes: {
      type: String,
      default: "covt"
    }
  },
  data: function() {
    return {
      curComponent: emptyComponent,
      curUrl: ""
    };
  },
  methods: {
    reload: function() {
      var saveUrl = this.curUrl;
      this.curUrl = "";
      var vm = this;
      setTimeout(function() {
        vm.curUrl = saveUrl;
      }, 20);
    },
    load: function(url) {
      if (this.curUrl === url) {
        this.reload();
      } else {
        this.curUrl = url;
      }
    }
  },
  watch: {
    curUrl: function(newUrl) {
      // console.log('curUrl====',this.curUrl)
      if (!newUrl || newUrl.length === 0) {
        console.info("in dynamic-container newUrl is empty, loading EmptyComponent and return");
        this.curComponent = emptyComponent;
        return;
      }

      let vm = this;
      let root = vm.$root;
      let urlInfo = { path: newUrl.split("?")[0] };
      let parameterStr = newUrl.split("?")[1].split("&");
      let dynamicParameters = {};
      parameterStr.map(function(val, index) {
        let paramObj = val.split("=");
        dynamicParameters[paramObj[0]] = paramObj[1];
      });

      if (typeof urlInfo.search === "undefined") urlInfo.search = "";

      let params = dynamicParameters;
      Object.keys(params).forEach(function(key, i) {
        if (i || urlInfo.search)
          urlInfo.search += "&" + key + "=" + params[key];
        else urlInfo.search += key + "=" + params[key];
      });

      if (this.renderModes) urlInfo.renderModes = this.renderModes;
      urlInfo.dynamicParams = true;
      console.info(
        "dynamic-container loadContainer curUrl " +
          newUrl +
          " urlInfo " +
          JSON.stringify(urlInfo)
      );
      this.$root.loadComponent(
        urlInfo,
        function(comp) {
          vm.curComponent = comp;
        },
        this.id
      );
    }
  },
  mounted: function() {
    let self = this;
    let root = this.$root;
    if (JSON.stringify(this.dependsOn) != "{}") {
      let dependsOnMap = this.dependsOn
      for (let doParm in dependsOnMap) {
        root.eventBus.$on(dependsOnMap[doParm]+'_value_change', result => {
          let param = {}
          if (typeof result == "string") {
            param[doParm] = result
          } else {
            param[doParm] = result[dependsOnMap[doParm]]
          }
          this.curUrl = self.url+'&'+ new URLSearchParams(param).toString()
        })
      }
    }
    this.$root.addContainer(this.id, this);
    this.curUrl = this.url;
  }
};
</script>
