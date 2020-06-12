<template>
  <div class="workspace">
    <div v-for="item in modules">
      <div class="workspace-item" v-for="child in item">
        <component :is="child.module" v-if="child.module" :url="child.interface"></component>
      </div>
    </div>
  </div>
</template>

<script>
import userCount from "./userCount";
import partake from "./partake";
import task from "./task";
export default {
  name: "workspace",
  props: {
    option: Array,
    name: String,
    moduleUrl: String
  },
  components: {
    userCount,
    partake,
    task
  },
  data() {
    return {
      modules: [
        // [
        //   {
        //     module: "userCount",
        //     interface: "url"
        //   },
        //   {
        //     module: "task",
        //     interface: "url"
        //   }
        // ],
        // [
        //   {
        //     module: "partake",
        //     interface: "url"
        //   }
        // ]
      ]
    };
  },
  computed: {},
  created: function() {
    this.$root.$http.get(this.moduleUrl).then(response => {
			// console.log('modules data => ',response.data)
			this.modules = response.data
		}, error => {
      // error callback
      console.log('fetch modules fails')
		})
  },
  mounted: function() {},
  methods: {}
};
</script>
<style>
.workspace {
  display: flex;

}
.workspace > div {
  flex: 1;
  margin-right: 15px;
}
.workspace > div:first-child {
  flex: 1;
}
.workspace > div:last-child {
  margin-right: 0;
}
.workspace .workspace-item {
  box-shadow: 2px 2px 7px rgba(239, 239, 239, 0.5);
  background: #fff;
  margin-bottom: 15px;
}

@media (max-width: 1100px) {
  .workspace {
    flex-direction: column;
  }
  .workspace > div {
    margin-right: 0;
  }
}
</style>