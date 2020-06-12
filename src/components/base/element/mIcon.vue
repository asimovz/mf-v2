<template>
    <i 
    :class="[defaultClass,fontClass]" 
    :style="{color:color,fontSize:size+'px'}"
    >
    </i> 
</template>
<script>
  export default{
    name: 'm-icon',
    props: {
      name: String,
      color: String,
      size: String,
      hover: String
    },
    data: function () {
      return {
        defaultClass: 'iconfont',
        fontClass: 'icon-' + this.name
      }
    },
    methods: {},
    mounted: function () {
    }
  }
</script>


