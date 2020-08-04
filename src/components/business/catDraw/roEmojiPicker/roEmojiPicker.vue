<template>
	<div class="aw-emoji-wrapper">
		<div class="aw-emoji-picker" :ref="pickName"  :style="pickerStyle">
			<categories :data="categories" :current="currentCategory" @select="selectCategory" />
			<emojiList ref="emojiList" :data="mapEmojis" :current="currentCategory" @select="selectEmoji" />
		</div>
	</div>
</template>
<script>
import categories from "../../../base/element/mEmojiPicker/categories"
import emojiList from "../../../base/element/mEmojiPicker/emojiList"

export default {
  name: 'ro-emoji-picker',
  components: {
	categories,
	emojiList
  },
  props: {
  	category: {
  		type: String,
  		default: 'Peoples'
  	},
    name: String
  },
  data() {
    return {
      pickName: `emojiPicker_${this.name}`,
    	pickerStyle: {	},
    	mapEmojis:{},
    	emojiRemoteUrl: "/static/js/emojis.json", //循环中会每次去发起请求json数据
    	categories: [
			  { name: "Peoples", zh: "人物" },
			  { name: "Nature", zh: "自然" },
			  { name: "Foods", zh: "食物" },
			  { name: "Activity", zh: "活动" },
			  { name: "Objects", zh: "物体" },
			  { name: "Places", zh: "地点" },
			  { name: "Symbols", zh: "符号" },
			  { name: "Flags", zh: "旗帜" }
			],
    	currentCategory: this.category
    }
  },
  created() {
    this.remoteEmoji()  //获取本地数据
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  	selectEmoji(val) {
  		this.$emit("selectEmoji",val)
  	},
  	selectCategory(val) {
  		this.currentCategory = val
  	},
  	remoteEmoji() {
	  	this.$http.get(this.emojiRemoteUrl).then( resp => {
		    resp.data.data.map( emoji => {
		      const _category = emoji.category;
		      if (!this.mapEmojis[_category]) {
		        this.$set(this.mapEmojis, _category, [emoji]);
		      } else {
		        this.mapEmojis[_category].push(emoji);
		      }
		    })
	  	})
  	},
  }
}
</script>
<style lang='less' scoped>
.aw-emoji-wrapper {
	position: relative;
	
		width: 320px;
		height: 278px;
}
.aw-emoji-button {
	cursor: pointer;
}
.aw-emoji-picker {
  text-rendering: optimizeLegibility;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  background: #fff;
  overflow: hidden;
  width: 320px;
  user-select: none;
  padding: 0;
  position: absolute;
  z-index: 100
}
.aw-emoji-close {
	position: absolute;
  right: 6px;
  top: 4px;
  cursor: pointer;
  color: #ccc;
}

</style>









