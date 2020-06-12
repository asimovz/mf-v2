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
  watch: {
    checked (v) {
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
    listener () {
      this.$root.eventBus.$on(`kpi_change_${this.kpiCardId}`, e => {
        this.checked = e.checked
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
