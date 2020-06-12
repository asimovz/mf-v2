export default {
  methods: {
    async getData () {
      if (typeof this.data === 'string') {
        try {
          const { data } = await this.$root.$http.get(this.data, {
            params: Object.assign({}, this.initQueryParams, this.params)
          })
          this.chartData = data
        } catch (err) {
          console.log('get remote chart data error => ', err)
        }
      } else {
        this.chartData = this.data
      }
    },
    listenerMetrics () {
      this.$root.eventBus.$on(`${this.metricsForm}_value_change`, data => {
        let metrics = []
        const activeMetric = data[this.metricsForm]
        if (activeMetric === 'string') {
          metrics.push(activeMetric)
        } else {
          metrics = metrics.concat(activeMetric)
        }
        this.$set(this.innerSettings, 'metrics', metrics)
      })
    },
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
    }
  }
}
