<template>
  <ol class="mRankingList">
    <li v-for="(item, index) in items" :key="index" @click="clickHandler(item)">
      <i>{{index + 1}}</i>
      <p class="bd"><strong>{{item.title}}</strong><span>{{item.desc}}</span></p>
      <p>{{dataLabel}} <strong>{{item.data}}</strong></p>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'mRankingList',
  props: {
    dataLabel: {
      type: String,
      default: '数据量'
    },
    resDataKey:String,
    id: {
      type: String,
      default: ''
    },
    searchForm: [String, Array],
    initQueryParams: {
      type: Object,
      default () {
        return {}
      }
    },
    data: [Array, String]
  },
  data () {
    return {
      items: [],
      params: {},
      searchForms: []
    }
  },
  watch: {
    params: {
      deep: true,
      handler (v) {
        this.getData(v)
      }
    }
  },
  created () {
    this.getData()
    if (this.searchForm) {
      this.$nextTick(() => {
        this.listener()
      })
    }
  },
  methods: {
    clickHandler(rowData){
      if(!this.resDataKey) return

      this.$root.eventBus.$emit(`${this.id}_value_change`, {
        [this.resDataKey]: rowData[this.resDataKey]
      })
    },
    listener () {
      if (typeof this.searchForm === 'string') {
        this.searchForms.push(this.searchForm)
      } else {
        this.searchForms = this.searchForm
      }
      this.searchForms.forEach(item => {
        this.$root.eventBus.$on(`${item}_value_change`, data => {
          this.params = Object.assign({}, this.params, data)
        })
      })
    },
    async getData () {
      if (typeof this.data === 'string') {
        try {
          const { data } = await this.$root.$http.get(this.data, {
            params: Object.assign({}, this.initQueryParams, this.params)
          })
          this.items = data
        } catch (err) {
          console.log('mKpiCard request err', err)
        }
      } else {
        this.items = this.data
      }
    }
  },
  beforeDestroy () {
    this.searchForms.forEach(item => {
      this.$root.eventBus.$off(`${item}_value_change`)
    })
  }
}
</script>

<style lang="scss">
.mRankingList{
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  li{
    color: #C0C4CC;
    display: flex;
    align-items: center;
    padding: .5em 0;
    & + li {
      border-top: 1px solid #EBEEF5;
    }
    strong{
      color:#606266;
    }
    .bd{
      flex:1;
      padding: 0 1em;
      span{
        color: #C0C4CC;
        display: block;
        font-size: 12px;
      }
    }
  }
  i{
    color: #fff;
    background: #40b1e3;
    padding: .5em 1.8em .5em .7em;
    border-radius: 3px;
    line-height: 1;
    position: relative;
    font-size: 1.2em;
    font-weight: 500;
    overflow: hidden;
    &::after{
      width:50px;
      height: 30px;
      content: "";
      position: absolute;
      background: #fff;
      top:-5px;
      right:-25px;
      transform: rotate(60deg);
    }
  }
}
</style>
