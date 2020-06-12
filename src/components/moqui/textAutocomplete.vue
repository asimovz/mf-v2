<template>
    <div>
        <span>
            <input ref="acinput" :id="acId" :name="acName" :type="type" :value="valueText" :size="size"
                     :maxlength="maxlength" :disabled="disabled"
                     :class="allClasses" :data-vv-validation="validationClasses" :required="required" :pattern="pattern"
                     :data-toggle="tooltipToggle" :title="tooltip" autocomplete="off" :form="form">
            <input ref="hidden" :id="id" type="hidden" :name="name" :value="value" :form="form">
            <span ref="show" v-if="showValue" :id="showId" class="form-autocomplete-value">{{valueText}}</span>
        </span>
    </div>
</template>
<style>
</style>
<script>
  export default{
    name: 'text-autocomplete',
    props: {
      id: {type: String, required: true},
      name: {type: String, required: true},
      value: String,
      valueText: String,
      type: String,
      size: String,
      maxlength: String,
      disabled: Boolean,
      validationClasses: String,
      dataVvValidation: String,
      required: Boolean,
      pattern: String,
      tooltip: String,
      form: String,
      delay: {type: Number, 'default': 300},
      url: {type: String, required: true},
      dependsOn: Object,
      acParameters: Object,
      minLength: {type: Number, 'default': 1},
      showValue: Boolean,
      useActual: Boolean,
      skipInitial: Boolean
    },
    data: function () {
      return {delayTimeout: null}
    },
    computed: {
      acId: function () {
        return this.id + '_ac'
      }, acName: function () {
        return this.name + '_ac'
      },
      allClasses: function () {
        return 'form-control typeahead' + (this.validationClasses ? ' ' + this.validationClasses : '')
      },
      showId: function () {
        return this.id + '_show'
      }, tooltipToggle: function () {
        return this.tooltip && this.tooltip.length > 0 ? 'tooltip' : null
      }
    },
    methods: {
      fetchResults: function (query, syncResults, asyncResults) {
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout)
        }
        var vm = this
        this.delayTimeout = setTimeout(function () {
          var dependsOnMap = vm.dependsOn
          var parmMap = vm.acParameters
          var reqData = {term: query, moquiSessionToken: vm.$root.moquiSessionToken}
          for (var parmName in parmMap) {
            if (parmMap.hasOwnProperty(parmName)) reqData[parmName] = parmMap[parmName]
          }
          for (var doParm in dependsOnMap) {
            if (dependsOnMap.hasOwnProperty(doParm)) {
              var doValue = $('#' + dependsOnMap[doParm]).val()
              if (doValue) reqData[doParm] = doValue
            }
          }
          $.ajax({
            url: vm.url,
            type: "POST",
            dataType: "json",
            data: reqData,
            error: moqui.handleAjaxError,
            success: function (data) {
              var list = moqui.isArray(data) ? data : data.options
              asyncResults($.map(list, function (item) {
                return {label: item.label, value: item.value}
              }))
            }
          })
        }, this.delay)
      }
    },
    mounted: function () {
      var vm = this
      var acJqEl = $(this.$refs.acinput)
      var hidJqEl = $(this.$refs.hidden)
      var showJqEl = this.$refs.show ? $(this.$refs.show) : null
      acJqEl.typeahead({minLength: this.minLength, highlight: true, hint: false},
        {
          limit: 99, source: this.fetchResults, display: function (item) {
          return item.label
        }
        })
      acJqEl.bind('typeahead:select', function (event, item) {
        if (item) {
          this.value = item.value
          hidJqEl.val(item.value)
          hidJqEl.trigger("change")
          acJqEl.val(item.label)
          if (showJqEl && item.label) {
            showJqEl.html(item.label)
          }
          return false
        }
      })
      acJqEl.change(function () {
        if (!acJqEl.val()) {
          hidJqEl.val("")
          hidJqEl.trigger("change")
        }
        else if (this.useActual) {
          hidJqEl.val(acJqEl.val())
          hidJqEl.trigger("change")
        }
      })
      var dependsOnMap = this.dependsOn
      for (var doParm in dependsOnMap) {
        if (dependsOnMap.hasOwnProperty(doParm)) {
          $('#' + dependsOnMap[doParm]).change(function () {
            hidJqEl.val("")
            acJqEl.val("")
          })
        }
      }
      if (!this.skipInitial && hidJqEl.val()) {
        var parmMap = this.acParameters
        var reqData = {term: hidJqEl.val(), moquiSessionToken: this.$root.moquiSessionToken}
        for (var parmName in parmMap) {
          if (parmMap.hasOwnProperty(parmName)) reqData[parmName] = parmMap[parmName]
        }
        for (doParm in dependsOnMap) {
          if (dependsOnMap.hasOwnProperty(doParm)) {
            var doValue = $('#' + dependsOnMap[doParm]).val()
            if (doValue) reqData[doParm] = doValue
          }
        }
        $.ajax({
          url: this.url,
          type: "POST",
          dataType: "json",
          data: reqData,
          error: moqui.handleAjaxError,
          success: function (data) {
            var list = moqui.isArray(data) ? data : data.options
            var curValue = hidJqEl.val()
            for (var i = 0; i < list.length; i++) {
              if (list[i].value == curValue) {
                acJqEl.val(list[i].label)
                if (showJqEl) {
                  showJqEl.html(list[i].label)
                }
                break
              }
            }
          }
        })
      }
    }
  }
</script>

