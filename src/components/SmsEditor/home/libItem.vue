<template>
  <div :class="['lib-item', { 'lib-item--checked': data.checked, 'lib-item--audio': type === 'audio'}]">
    <span v-if="showRemove" class="lib-remove el-icon-error" @click.stop="remove(data.id)"></span>
    <div class="lib-preview">
      <img :src="data.uri" v-if="type === 'image'"  />
      <template v-else-if="type === 'video'">
        <img v-if="data.poster" :src="data.poster"  />
        <video v-else :src="data.uri"></video>
      </template>
      <template v-else>
        <!-- @click.native="audioClick" -->
        <widget-audio :showPlusBtn="true" :data="data" @click.native.stop>
          <div class="lib-add el-icon-plus" @click.stop="audioAdd()"></div>
        </widget-audio>
      </template>
      <div class="lib-name ">{{shortName(data.name)}}</div>
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
    type: String,
    showRemove: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    shortName(name){
      return name.substr(0, 10)
    },
    audioAdd(data) {
      this.$emit('on-add')
    },
    remove(id){
    	this.$emit('on-remove', id)
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
