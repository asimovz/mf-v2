<template>
  <m-tabs v-model="activeTab" class="mTimeTab">
    <m-tabPane label="今天" name="today"></m-tabPane>
    <m-tabPane label="昨天" name="yesterday"></m-tabPane>
    <m-tabPane label="近7天" name="7days"></m-tabPane>
    <m-tabPane label="近30天" name="30days"></m-tabPane>
    <m-tabPane label="自定义时间段" name="customDays"></m-tabPane>
    <div slot="extra">
      <div v-show="activeTab === 'customDays'" style="float:left;margin-right:10px">
        <m-datePeriod v-model="rangeDate" placement="bottom-end" placeholder="选择时间范围"></m-datePeriod>
      </div>
      <slot></slot>
    </div>
  </m-tabs>
</template>

<script>
export default {
  name: 'mTimeTab',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeTab: 'today',
      rangeDate: ['', '']
    }
  },
  computed: {
    startDate () {
      let _date = ''
      switch (this.activeTab) {
        case 'today':
          _date = this.getDay()
          break
        case 'yesterday':
          _date = this.getDay(-1)
          break
        case '7days':
          _date = this.getDay(-7)
          break
        case '30days':
          _date = this.getDay(-30)
          break
        case 'customDays':
          _date = this.rangeDate[0] ? this.moqui.dateFormat(new Date(this.rangeDate[0]), 'yyyy-MM-dd') : ''
          break
      }
      return _date
    },
    endDate () {
      const endDate = this.rangeDate[1] ? this.rangeDate[1] : this.getDay()
      return this.activeTab === 'customDays' ? this.moqui.dateFormat(new Date(endDate), 'yyyy-MM-dd') : this.getDay()
    },
    rangeDateStr () {
      return `${this.startDate}${this.endDate}`
    }
  },
  watch: {
    startDate (v) {
      this.rangeDate[0] = v
    },
    endDate (v) {
      this.rangeDate[1] = v
    },
    rangeDateStr () {
      if (this.activeTab === 'customDays' && !this.rangeDate[0]) return
      this.broadcast()
    }
  },
  methods: {
    broadcast () {
      const eventNames = [
        `${this.id}_value_change`,
        `search_form_data_${this.id}` // m-table 中接收 search_form_data_ 前缀的事件
      ]
      eventNames.forEach(eventName => {
        this.$root.eventBus.$emit(eventName, {
          startDate: this.startDate,
          endDate: this.endDate
        })
      })
    },
    getDay (days = 0) {
      return this.moqui.dateFormat(this.getCurrentDay(days), 'yyyy-MM-dd')
    },
    getCurrentDay (days = 0) {
      const date = new Date()
      return new Date(date.setDate(date.getDate() + days))
    },

  }
}
</script>

<style lang="scss">
.mTimeTab {
  overflow: unset;
}
</style>
