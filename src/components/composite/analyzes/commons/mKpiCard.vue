<template>
  <div class="mKpiCard">
    <div class="item"
      v-for="(item, index) in kpis" :key="item.label"
      :style="{
        visibility: item.label !== undefined ? 'visible' : 'hidden',
        flex: `0 0 ${100 / colNum}%`
      }"
      :class="{'no-border': (index + 1) % colNum === 0}"
    >
      <div class="title">{{item.label}}</div>
      <div class="data">{{item.data === '' || isNaN(item.data) ? '--' : item.data}}</div>
      <div class="desc">{{item.desc || '&nbsp;'}}</div>
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
    searchForm: [String, Array],
    colNum: {
      type: Number,
      default: 4
    },
    initQueryParams: {
      type: Object,
      default () {
        return {}
      }
    },
    kpiCustomId: String,
    defaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
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
      const kpis =
      this.checked.length === 0 && this.defaultChecked.length === 0
      ? this.allKpis
      : this.allKpis.filter(item => this.checked.indexOf(item.label) >= 0)

      // 补空位
      let surplus = this.colNum - kpis.length % this.colNum
      while (surplus > 0 && surplus < this.colNum) {
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
  -webkit-font-smoothing: antialiased; 
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item{
    flex: 0 0 23%;
    padding: 0 15px;
    margin:8px 0;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      top:0;
      right: 20px;
      bottom:0;
      border-right: 1px solid #DCDFE6;
    }
    &.no-border{
      &::before{
        display: none;
      }
    }
    .title{
      line-height: 22px;
    }
    .data{
      color: #3C64B9;
      font-size: 30px;
      line-height: 38px;
      padding:4px 0;
      position: relative;
      left: 0;
      font-weight: 500;
    }
    .desc{
      color: #C0C4CC;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
