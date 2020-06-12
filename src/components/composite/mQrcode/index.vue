<template>
  <div class="qrcode-wrapper"></div>
</template>
<script>
/*
<m-qrcode text="内容" :size="256" color="#000000" bg-color="#FFFFFF" />
*/
import QRCode from 'assets/js/qrcode.min.js'
export default {
  name: 'm-qrcode',
  props: {
    text: {
      type: String,
      required: true
    },
    /** 大小 */
    size: {
      type: Number,
      default: 128
    },
    /** 线条颜色 */
    color: {
      type: String,
      default: '#000'
    },
    /** 背景色 */
    bgColor: {
      type: String,
      default: '#FFF'
    },
    /** 复杂度 */
    errorLevel: {
      type: String,
      validator: function (value) {
        return value === 'L' || value === 'M' || value === 'Q' || value === 'H'
      },
      default: 'H'
    }
  },

  watch: {
    text: function () {
      this.clear();
      this.makeCode(this.text);
    }
  },

  data() {
    return {
      qrCode: {}
    }
  },

  mounted() {
    this.qrCode = new QRCode(this.$el, {
      text: encodeURI(this.text),
      width: this.size,
      height: this.size,
      colorDark: this.color,
      colorLight: this.bgColor,
      // correctLevel: QRCode.CorrectLevel[this.errorLevel]
    });
  },

  methods: {
    clear: function () {
      this.qrCode.clear();
    },
    makeCode: function (text) {
      this.qrCode.makeCode(encodeURI(text));
    }
  }
}

</script>

<style scoped>
  .qrcode-wrapper{display: inline-block;}
</style>
