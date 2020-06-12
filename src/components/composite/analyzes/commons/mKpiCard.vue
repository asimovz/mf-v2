<template>
  <div class="mKpiCard">
    <div class="item" v-for="item in kpis" :key="item.label" :style="{visibility: item.label ? 'visible' : 'hidden', 'background': background }">
      <strong class="title">{{item.label}}</strong>
      <div class="main-wrap">
        <div class="main">
          {{item.data}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mKpiCard',
  props: {
    id: {
      type: String,
      default: ''
    },
    background: {
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
    kpiCustomId: String,
    defaultChecked: Array,
    data: [Array, String]
  },
  data () {
    return {
      checked: [],
      allKpis: [],
      params: {},
      searchForms: []
    }
  },
  computed: {
    kpis () {
      const kpis = this.allKpis.filter(item => this.checked.indexOf(item.label) >= 0)

      // 补空位
      let surplus = 4 - kpis.length % 4
      while (surplus > 0 && surplus < 4) {
        kpis.push({})
        surplus--
      }

      return kpis
    },
    dimensions () {
      return this.allKpis.map(item => {
        return {
          label: item.label,
          value: item.value
        }
      })
    }
  },
  watch: {
    params: {
      deep: true,
      handler (v) {
        this.getData(v)
      }
    },
    dimensions () {
      if (this.kpiCustomId) {
        this.broadcast()
      }
    }
  },
  created () {
    this.checked = JSON.parse(JSON.stringify(this.defaultChecked))
    this.getData()
    this.$nextTick(() => {
      if (this.searchForm) {
        this.listenerSearch()
      }
      if (this.kpiCustomId) {
        this.listenerCustom()
      }
    })
  },
  methods: {
    listenerSearch () {
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
    listenerCustom () {
      this.$root.eventBus.$on(`custom_kpi_data_${this.kpiCustomId}`, data => {
        this.checked = data
      })
    },
    broadcast () {
      this.$root.eventBus.$emit(`kpi_change_${this.id}`, {
        data: this.dimensions,
        checked: this.checked
      })
    },
    async getData (date = {}) {
      if (typeof this.data === 'string') {
        try {
          const { data } = await this.$root.$http.get(this.data, {
            params: Object.assign({}, this.initQueryParams, this.params)
          })
          this.allKpis = data
        } catch (err) {
          console.log('mKpiCard request err', err)
        }
      } else {
        this.allKpis = this.data
      }
    }
  },
  beforeDestroy () {
    this.searchForms.forEach(item => {
      this.$root.eventBus.$off(`${item}_value_change`)
    })
    this.$root.eventBus.$off(`custom_kpi_data_${this.kpiCustomId}`)
  }
}
</script>

<style lang="scss">
.mKpiCard {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item{
    flex: 0 0 23%;
    font-size: .8em;
    padding: 0 1em;
    text-align: center;
    margin:10px 0;
    line-height: 1.75;
    border-radius: 0 15px 0 15px;
    color:#909399;
    background:rgba(64, 160, 255, 0.08);
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
    position: relative;
    &:hover{
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
    }
    .title{
      color: #fff;
      font-weight: normal;
      font-size: 1em;
      position: absolute;
      top:0;
      left: 0;
      background:rgba(99, 108, 145,.5);
      padding: 0 10px;
      line-height: 30px;
      border-radius: 0 0 8px 0;
      box-shadow: 1px 1px 3px rgba(0,0,0,.1);
    }
    .main-wrap{
      padding:40px 1.5em 10px;
      text-align: center;
      .main{
        color: #40b1e3;
        font-size: 2em;
      }
      p{
        margin:0;
      }
      .footer{
        display: flex;
        & > * {
          flex:1
        }
      }
      strong{
        color: #2f74ff;
        font-size: 1.2em;
      }
    }
  }
}
</style>
