<template>
  <div class="mRankingList"
  :class="{
    'is-link': link !== undefined,
    'divider-right': dividerRight !== undefined
  }"
  :style="{padding: padding}"
  >
    <div class="title" v-if="title">{{title}}</div>
    <ol>
      <li v-for="(item, index) in items" :key="index" :class="{'active': activeIndex === index}" @click="clickHandler(item, index)">
        <i :class="{pro: index < 3}">{{index + 1}}</i>
        <p class="bd">{{item.title}}<span v-if="false">{{item.desc}}</span></p>
        <p class="ft">{{dataLabel || item.desc}}<span class="data">{{item.data}}</span></p>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'mRankingList',
  props: {
    title: {
      type: String,
      default: ''
    },
    dataLabel: {
      type: String,
      default: ''
    },
    link: {},
    dividerRight: {},
    resDataKey: String,
    padding: {
      type: String,
      default: '0'
    },
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
      activeIndex: '',
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
    clickHandler (rowData, index) {
      this.activeIndex = index
      if (!this.resDataKey) return

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
  position: relative;
  .title{
    padding: 0 0 10px 10px;
  }
  ol{
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
  
  li{
    display: flex;
    align-items: center;
    padding: 9px 10px;
    margin: 1px 0;
    border-radius: 5px;
    .bd{
      flex:1;
      padding: 0 .6em;
      color:rgba(48, 49, 51, 0.85);
    }
    .ft{
      color: #C0C4CC;
      .data{
        color: #3C64B9;
        padding-left: .5em;
      }
    }
  }
  &.divider-right{
    ol{
      &::after{
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        top: 2.5em;
        border-right: 1px solid #dcdfe6;
      }
      
    }
  }
  &.is-link{
    li{
      cursor: pointer;
      &:hover,&.active{
        background:#f5f7fa;
        i{
          &::after{
            background: #f5f7fa;
          }
        }
      }
    }
  }
  i{
    color: #fff;
    width: 18px;
    line-height: 18px;
    text-align: center;
    background: #DCDFE6;
    border-radius: 100%;
    font-size: 12px;
    font-style: normal;
    &.pro{
      background: #3C64B9;
    }
  }
}
</style>
