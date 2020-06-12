<template>
	<div class="aw-emoji-wrapper">
		<div class="aw-emoji-button" ref="button" @click="toogleEmoji">😃</div>
		<div class="aw-emoji-picker" :ref="pickName" v-show="showEmoji" :style="pickerStyle">
			<categories :data="categories" :current="currentCategory" @select="selectCategory" />
			<emojiList ref="emojiList" :data="mapEmojis" :current="currentCategory" @select="selectEmoji" />
		</div>
	</div>
</template>
<script>
import categories from "./categories"
import emojiList from "./emojiList"

export default {
  name: 'm-emoji-picker',
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
    	showEmoji: false,
      show: false,
    	pickerStyle: {},
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
    this.remoteEmoji()
  },
  mounted() {
    document.body.appendChild(this.$refs[this.pickName])
    window._clickoutsideContext ? window._clickoutsideContext : window._clickoutsideContext = {}
    window._clickoutsideContext[this.pickName] = this
  },
  beforeDestroy() {
    document.body.removeChild(this.$refs[this.pickName])
    delete window._clickoutsideContext[this.pickName]
  },
  methods: {
  	async toogleEmoji() {
      Object.keys(window._clickoutsideContext).forEach( key => {
        window._clickoutsideContext[key].showEmoji = false
      })
  		this.showEmoji = !this.showEmoji
      this.pickerStyle = this.setPickerPos()
      if(this.showEmoji) {
        document.onclick = (evt) => {
          let target = evt.target
          let picker = this.$refs[this.pickName]
          if(!(picker.contains(target) || this.$parent.$el.contains(target))) {
              this.showEmoji = false
              document.onclick = null
          }
        }
      }
  	},
  	selectEmoji(val) {
  		this.$emit("select",val)
  	},
  	selectCategory(val) {
  		this.currentCategory = val
  	},
  	remoteEmoji() {
      // let resp = emojiData.data
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
  	setPickerPos() {
  		let p_t = 5
  		let p_l = 25
	  	let pos = this.$parent.$el.getBoundingClientRect()
      // 滚动条滚动的距离
      let scrollTop = document.scrollingElement.scrollTop
	  	let top = pos.height + pos.top + p_t + scrollTop + "px"

	  	if(pos.width >= 320) {

	  		return {
	  			left: pos.right - 320 + "px",
	  			top:top
	  		}
	  	} else {
	  		return {
	  			left: pos.left + "px",
	  			top:top
	  		}
	  	}
  	}
  }
}
</script>
<style>
.aw-emoji-wrapper {
	position: relative;
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
  padding:10px 0;
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









