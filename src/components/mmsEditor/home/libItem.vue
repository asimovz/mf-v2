<template>
  <div :class="['lib-item', { 'lib-item--checked': data.checked, 'lib-item--audio': type === 'audio'}]">
    <span class="lib-remove el-icon-error" @click.stop="remove(data.resourceId)"></span>
    <div class="lib-preview">
      <img :src="data.uri" v-if="type === 'image'" crossorigin="*" />
      <template v-else-if="type === 'video'">
        <img v-if="data.poster" :src="data.poster" crossorigin="*" />
        <video v-else :src="data.uri"></video>
      </template>
      <template v-else>
        <!-- @click.native="audioClick" -->
        <widget-audio :showPlusBtn="true" :data="data">
          <div class="lib-add el-icon-plus" @click.stop="audioAdd()"></div>
        </widget-audio>
      </template>
      <div class="lib-name2">{{ data.name }}</div>
    </div>
  </div>
</template>
<script>
import widgetAudio from '../components/widget-comps/audio.vue'

export default {
  name: 'libItem',
  components: {
    widgetAudio
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: String
  },
  data() {
    return {

    }
  },
  methods: {
    audioAdd(data) {
      this.$emit('on-add')
    },
    remove(){
    	this.$emit('on-remove')
    }
  },

  beforeCreate() {

  },

  mounted() {

  }
}

</script>
<style lang="less">
</style>
