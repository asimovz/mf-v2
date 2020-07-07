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
    <div v-if="items.length==10" class="addButton gray">
      + 快捷按钮和设置中的固定按钮总和不能超过10个
    </div>
    <input type="hidden" name="addshortcutbutton" :value="data"/>
  </div>
</template>
<script>
import childContent from './childContent'

export default {
  name: 'm-addshortcutbutton',
  props: ['data'],
  data () {
    return {
      items: [{}],
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
    del(index) {
      this.items.splice(index, 1)
    },
    getData(val) {
      let index = val.index
      this.items[index] = val.data
      this.data[index] = val.data
      console.log('I got the data 里面:', JSON.stringify(this.items))
    }
  }
}
</script>
<style lang='less' scoped>

.addshortcutbutton{
  width: 580px;
  min-height: 46px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;
}
.addButton{
  width: 580px;
  height: 46px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #DCDFE6;
}
.gray{
  cursor: default;
  color: #a9aab1;
}
.SceneConfig {
  display: flex;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  & > div {
    &:last-child {
      padding-left: 30px;
      flex: 1;
    }
  }
  .form-horizontal {
    padding: 0;
    margin: 0;
  }
  // .ivu-form-item,
  .btn-push {
    margin-bottom: 15px;
  }
  .scene-template {
    .btn-wrap {
      width: 45%;
      min-width: 410px;
      text-align: right;
    }
  }
  .scene-field {
    .btn-wrap {
      width: 66.7%;
      padding-right: 20px;
      min-width: 300px;
      text-align: right;
    }
  }
  .scene-button {
    .btn-wrap {
      text-align: right;
    }
  }
  .upload-file {
    font-size: 12px;
    background: #f2f2f2;
    position: relative;
    min-height: 450px;
    text-align: center;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    p {
      margin-bottom: 1em;
    }
    &:hover {
      opacity: 0.8;
    }
    .btn {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }
    i {
      font-size: 2em;
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
    }
  }
  .img-preview {
    background: #f2f2f2;
    min-height: 450px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .btn-push-item {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 15px 15px 0 15px;
    border-radius: 5px;
    position: relative;
    .close-item {
      position: absolute;
      top: 0;
      right: 0;
      padding: 5px 8px;
      cursor: pointer;
      font-size: 18px;
      background: #f1f1f1;
      border-radius: 0 5px 0 0;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  // 自定义按钮样式   防止m-button的默认提交
  .btnClass {
    display: inline-block;
    margin-bottom: 0;
    outline: 0;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    user-select: none;
    padding: 5px 15px 6px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #fff;
    border-color: #dcdee2;
  }
  .btnClass:hover {
    color: #747b8b;
    background-color: #fff;
    border-color: #e3e5e8;
  }
  .btn-primary {
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .btn-primary:hover {
    color: #fff;
    background-color: #57a3f3;
    border-color: #57a3f3;
  }
  .field-del {
    color: #57a3f3;
    padding: 3px 0 0 12px;
  }
  .field-del:hover {
    cursor: pointer;
  }
}
</style>
<style lang='less'>
.scene-template .aw-form-item_label {
  width: 10% !important;
  min-width: 120px;
}
.scene-template .aw-form-item_content {
  width: 36% !important;
  min-width: 300px;
}
.scene-button .aw-form-item_label {
  width: 100px !important;
}
.scene-button .aw-form-item_content {
  // width: 500px !important;
}
.scene-button .scene-two {
  display: flex;
}
.scene-button .scene-two>.aw-form-item_label {
  width: 0 !important;
  padding: 0;
}
.scene-button .scene-two .scene-left .aw-form-item_label{
  width: 100px !important;
}
.scene-button .scene-two .scene-right .aw-form-item_label{
  width: 70px !important;
}
.scene-button  .scene-two>.aw-form-item_content {
  width: 700px  !important;
}
.scene-button  .scene-two .aw-form-item>.aw-form-item_content {
  width: 47% !important;
}
.scene-button .aw-form-item_content .m-select-wrap{
  width: 98%;
}


.field-add {
  .aw-form-item_label {
    text-align: left !important;
    width: auto !important;
  }

}
.item-mr {
  margin-right: 10px;
}
// .field-item .aw-form-item_label {
//   width: 0;
// }
// .field-item .aw-form-item_content {
//   display: flex;
//   .field-key {
//     width: 30%;
//     padding-right: 30px;
//   }
//   .item-mr {
//     flex: 1;
//   }
// }
// .field-item .m-form-error-tip {
//   top: 0;
// }
</style>
