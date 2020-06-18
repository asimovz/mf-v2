<template>
  <el-popover class="mCustomKpis" placement="bottom-end" :width="450">
    <m-button :text="name" slot="reference"></m-button>
    <div class="content">
      <m-checkbox v-model="checked" :options="options"></m-checkbox>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'mCustomKpis',
  props: {
    id: {
      type: String,
      default: ''
    },
    kpiCardId: String,
    name: {
      type: String,
      default: '自定义维度'
    }
  },
  data () {
    return {
      checked: [],
      options: []
    }
  },
  computed: {
    // 存储自定位维度的storage标记，地址+id保证唯一性
    storageKey () {
      return `custom_kpis_${this.id}_checked_by_${encodeURIComponent(location.href)}`
    }
  },
  watch: {
    checked (v) {
      localStorage.setItem(this.storageKey, JSON.stringify(v))
      this.broadcast()
    }
  },
  created () {
    this.$nextTick(() => {
      this.listener()
    })
  },
  methods: {
    broadcast () {
      this.$root.eventBus.$emit(`custom_kpi_data_${this.id}`, this.checked)
    },
    /**
     * 所有选项中是否包含本地已选数据？
     */
    diff (localChecked, options) {
      return localChecked.length !== 0 && localChecked.every(item => JSON.stringify(options).indexOf(item) >= 0)
    },
    listener () {
      this.$root.eventBus.$on(`kpi_change_${this.kpiCardId}`, e => {
        const storage = localStorage.getItem(this.storageKey)
        const localChecked = /^\[.*\]$/.test(storage) ? JSON.parse(storage) : []

        this.checked = this.diff(localChecked, e.data) ? localChecked : e.checked
        this.options = e.data
      })
    }
  },
  beforeDestroy () {
    this.$root.eventBus.$off(`kpi_change_${this.kpiCardId}`)
  }
}
</script>

<style lang="scss">
.mCustomKpis {
  .content{
    white-space: normal;
    line-height: 2;
  }
}
</style>
