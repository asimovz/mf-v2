<template> </template>
<style></style>
<script>
export default {
  name: "m-editable",
  data() {
    return {};
  },
  props: {
    id: { type: String, required: true },
    labelType: { type: String, default: "span" },
    labelValue: { type: String, required: true },
    url: { type: String, required: true },
    urlParameters: { type: Object, default: {} },
    parameterName: { type: String, default: "value" },
    widgetType: { type: String, default: "textarea" },
    loadUrl: String,
    loadParameters: Object,
    indicator: { type: String, default: "Saving" },
    tooltip: { type: String, default: "Click to edit" },
    cancel: { type: String, default: "Cancel" },
    submit: { type: String, default: "Save" }
  },
  mounted: function() {
    var reqData = $.extend(
      {
        moquiSessionToken: this.$root.moquiSessionToken,
        parameterName: this.parameterName
      },
      this.urlParameters
    );
    var edConfig = {
      indicator: this.indicator,
      tooltip: this.tooltip,
      cancel: this.cancel,
      submit: this.submit,
      name: this.parameterName,
      type: this.widgetType,
      cssclass: "editable-form",
      submitdata: reqData
    };
    if (this.loadUrl && this.loadUrl.length > 0) {
      var vm = this;
      edConfig.loadurl = this.loadUrl;
      edConfig.loadtype = "POST";
      edConfig.loaddata = function(value) {
        return $.extend(
          {
            currentValue: value,
            moquiSessionToken: vm.$root.moquiSessionToken
          },
          vm.loadParameters
        );
      };
    }
    $(this.$el).editable(this.url, edConfig);
  },
  render: function(createEl) {
    return createEl(this.labelType, {
      attrs: { id: this.id, class: "editable-label" },
      domProps: { innerHTML: this.labelValue }
    });
  }
};
</script>
