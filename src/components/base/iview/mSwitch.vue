<template>
  <span
    tabindex="0"
    :class="wrapClasses"
    :style="wrapStyles"
    @click="toggle"
    @keydown.space="toggle"
  >
    <input type="hidden" :name="name" :value="currentValue" />
    <span :class="innerClasses" v-if="trueText&&falseText">
      <span name="open" v-if="currentValue === trueValue">{{trueText}}</span>
      <span name="close" v-if="currentValue === falseValue">{{falseText}}</span>
    </span>
  </span>
</template>
<script>
/*

<m-switch name="isUse" size="large" true-text="开启" false-text="关闭" true-value="1" false-value="0" true-color="#13ce66" false-color="#ff4949">
*/
const prefixCls = "aw-switch";
export default {
  name: "m-switch",
  props: {
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default' //large, small
    },
    name: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    trueColor: {
      type: String
    },
    falseColor: {
      type: String
    },
    trueText: {
      type: String
    },
    falseText: {
      type: String
    },
    beforeChange: Function
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  computed: {
    itemDisabled () {
        let state = this.disabled;
        return state;
    },
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-loading`]: this.loading
        }
      ];
    },
    wrapStyles() {
      let style = {};
      if (this.trueColor && this.currentValue === this.trueValue) {
        style["border-color"] = this.trueColor;
        style["background-color"] = this.trueColor;
      } else if (this.falseColor && this.currentValue === this.falseValue) {
        style["border-color"] = this.falseColor;
        style["background-color"] = this.falseColor;
      }
      return style;
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    }
  },
  methods: {
    handleToggle() {
      const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue;
      this.currentValue = checked;
      this.$emit("input", checked);
      this.$emit("on-change", checked);
    },
    toggle(event) {
      event.preventDefault();
      if (this.itemDisabled || this.loading) {
        return false;
      }
      if (!this.beforeChange) {
        return this.handleToggle();
      }
      const before = this.beforeChange();
      if (before && before.then) {
        before.then(() => {
          this.handleToggle();
        });
      } else {
        this.handleToggle();
      }
    }
  },
  watch: {
    value(val) {
      if (val !== this.trueValue && val !== this.falseValue) {
        throw "Value should be trueValue or falseValue.";
      }
      this.currentValue = val;
    }
  }
};
</script>
<style lang="less">

.aw-switch {
  display: inline-block;
  width: 44px;
  height: 22px;
  line-height: 20px;
  border-radius: 22px;
  vertical-align: middle;
  border: 1px solid #ccc;
  background-color: #ccc;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: all .2s ease-in-out
}

.aw-switch-loading {
    opacity: .4
}

.aw-switch-inner {
    color: #fff;
    font-size: 12px;
    position: absolute;
    left: 23px
}

.aw-switch-inner i {
    width: 12px;
    height: 12px;
    text-align: center;
    position: relative;
    top: -1px
}

.aw-switch:after {
    content: "";
    width: 18px;
    height: 18px;
    border-radius: 18px;
    background-color: #fff;
    position: absolute;
    left: 1px;
    top: 1px;
    cursor: pointer;
    transition: left .2s ease-in-out,width .2s ease-in-out
}

.aw-switch:active:after {
    width: 26px
}

.aw-switch:before {
    content: "";
    display: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: transparent;
    position: absolute;
    left: 3px;
    top: 3px;
    z-index: 1;
    border: 1px solid #2d8cf0;
    border-color: transparent transparent transparent #2d8cf0;
    -webkit-animation: switch-loading 1s linear;
    animation: switch-loading 1s linear;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite
}

.aw-switch-loading:before {
    display: block
}

.aw-switch:focus {
    outline: 0
}

.aw-switch:focus:hover {
    box-shadow: none
}

.aw-switch-small {
    width: 28px;
    height: 16px;
    line-height: 14px
}

.aw-switch-small:after {
    width: 12px;
    height: 12px
}

.aw-switch-small:active:after {
    width: 14px
}

.aw-switch-small:before {
    width: 10px;
    height: 10px;
    left: 2px;
    top: 2px
}

.aw-switch-small.aw-switch-checked:after {
    left: 13px
}

.aw-switch-small.aw-switch-checked:before {
    left: 14px
}

.aw-switch-small:active.aw-switch-checked:after {
    left: 11px
}

.aw-switch-large {
    width: 56px
}

.aw-switch-large:active:after {
    width: 26px;
    width: 30px
}

.aw-switch-large.aw-switch-checked:after {
    left: 35px
}

.aw-switch-large.aw-switch-checked:before {
    left: 37px
}

.aw-switch-large:active.aw-switch-checked:after {
    left: 23px
}

.aw-switch-checked {
    border-color: #2d8cf0;
    background-color: #2d8cf0
}

.aw-switch-checked .aw-switch-inner {
    left: 7px
}

.aw-switch-checked:after {
    left: 23px
}

.aw-switch-checked:before {
    left: 25px
}

.aw-switch-checked:active:after {
    left: 15px
}

.aw-switch-disabled {
    cursor: not-allowed;
    opacity: .4
}

.aw-switch-disabled:after {
    background: #fff;
    cursor: not-allowed
}

.aw-switch-disabled .aw-switch-inner {
    color: #fff
}

.aw-switch-disabled.aw-switch-checked {
    border-color: #2d8cf0;
    background-color: #2d8cf0;
    opacity: .4
}

.aw-switch-disabled.aw-switch-checked:after {
    background: #fff
}

.aw-switch-disabled.aw-switch-checked .aw-switch-inner {
    color: #fff
}

@-webkit-keyframes switch-loading {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@keyframes switch-loading {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}
</style>
