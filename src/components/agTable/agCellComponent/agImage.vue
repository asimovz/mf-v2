<template>
  <img
    ref="img"
    @mouseenter="show"
    @mouseleave="hide"
    :src="imgUrl"
    :alt="alt"
    :id="id"
    :width="width"
    :height="height"
    :class="style"
  />
</template>
<script>
export default {
  name: "ag-image",
  data() {
    return {
      id: "",
      hover: false,
      imgUrl: "",
      alt: "",
      width: "",
      height: 28,
      style: "",
      imgDiv: null
    };
  },
  beforeMount() {
    this.id = this.params.props.id;
    this.hover = this.params.props.hover;
    this.alt = this.params.props.alt;
    this.width = this.params.props.width;
    this.height = this.params.props.height;
    this.style = this.params.props.style;
    if (this.params.props.urlType === "plain") {
      this.imgUrl = this.params.value;
    } else {
      this.imgUrl =
        this.params.props.transitionUrl +
        "?" +
        this.params.colDef.field +
        "=" +
        this.params.value;
    }
  },
  mounted() {
    this.params.context.componentParent.gridOptions.api.resetRowHeights(
      this.height * 1 + 2
    );
  },
  methods: {
    show(evt) {
      if (!this.hover) return;

      //原始宽高
      let imgOriginHeight = this.$refs.img.naturalHeight
      let imgOriginWidth = this.$refs.img.naturalWidth

      //屏幕宽高
      let bodyRect = document.body.getBoundingClientRect();
      let bodyHeight = bodyRect.height;
      let bodyWidth = bodyRect.width;
      let scrollHeight = document.documentElement.scrollTop;

      //设置图片宽高
      let imgWidth,imgHeight
      if(imgOriginWidth >= imgOriginHeight) {
       imgWidth = imgOriginWidth > bodyWidth/2 ? 500 : imgOriginWidth;
       imgHeight = parseInt(imgOriginHeight * imgWidth / imgOriginWidth) ;
      } else {
       imgHeight = imgOriginHeight > bodyHeight/2 ? 400 : imgOriginHeight
       imgWidth = parseInt(imgOriginHeight * imgHeight / imgOriginHeight) ;
      }

      let el = evt.target;
      let pos = el.getBoundingClientRect();
      let parentWidth = el.parentNode.getBoundingClientRect().width;

      let offsetX = parentWidth > pos.width ? pos.width + 10 : parentWidth;
      offsetX = offsetX + pos.x;
      let offsetY = pos.top + scrollHeight;


      if (offsetX + imgWidth > bodyWidth) {
        offsetX = pos.x - imgWidth - 10;
      }
      if (offsetY + imgHeight > bodyHeight) {
        offsetY = offsetY - imgHeight + this.height;
      }

      this.imgDiv = document.createElement("div");
      this.imgDiv.style.cssText = `position: absolute;left:${offsetX}px;top:${offsetY}px;z-index:999;background: #ffffff;border-radius: 8px;box-shadow: 0px 0px 16px 0px rgba(0,0,0,.15);padding:16px`;
      this.imgDiv.innerHTML = `<img src='${this.imgUrl}' width="${imgWidth}" />`;
      document.body.appendChild(this.imgDiv);
    },
    hide() {
      this.hover && document.body.removeChild(this.imgDiv);
    }
  }
};
</script>
