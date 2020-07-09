<template>
  <div class="addshortcutbutton">
    <childContent v-if="showData" v-for="(item,index) in items"
                  :key="index"
                  :index="index"
                  :items="items"
                  :data="item"
                  @deleteIndex="del"
                  @uploadData="getData">
    </childContent>
    <div @click="add" v-if="items.length<10" class="addButton">
      + 添加快捷按钮
    </div>
    <div v-if="items.length==10" class="addButton grayBTN">
      + 快捷按钮和设置中的固定按钮总和不能超过10个
    </div>
    <input type="hidden" :id="id" :form="form" :name="name" :value="data"/>
  </div>
</template>
<script>
import childContent from './childContent'

export default {
  name: 'm-addshortcutbutton',
  props: {
    data:{},
    name: {
      type: String,
      default:''
    },
    form: {
      type: String,
      default:''
    },
    id: {
      type: String,
      default:''
    }
  },
  data () {
    return {
      items: [],
      showData:false
    }
  },
  created(){
    if(this.data!=null && this.data.length>0){
      this.showData = true,
      this.items = this.data
    }
  },
  computed: {

  },
  components: {
    childContent
  },
  methods: {
    add(){
      this.showData = true,
      this.items.push({type: 'reply', description: ''})
    },
    del(index){
      this.items.splice(index, 1)
      this.data.splice(index, 1)
    },
    getData(val) {
      let index = val.index
      this.items[index] = val.data
      this.data[index] = val.data
    }
  }
}
</script>
<style lang='less' scoped>

.addshortcutbutton{
  min-height: 46px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;
}
.addButton{
  height: 46px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #DCDFE6;
}

.grayBTN{
  cursor: default;
  color: #a9aab1;
}

</style>

