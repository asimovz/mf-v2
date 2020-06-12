## 模板使用

```
<SceneConfig
      :data='{
        formAction:"",
        fields:{
          messageTemplateCode: {value: "", data: [{messageTemplateId: "", messageTemplateCode:"",messageTemplateNumber:"",messageTemplate:"",messageTemplateExample:""}], url: ""},

          whiteImgUrl: {value:""},
          identifyScene: {value:""},
          identifySceneWords: {value:""},

          manufacturerId: {value:"", data:[{value:1,label:"厂商01"},{value:2,label:"厂商02"}]},
          scenesArea: {value:"", url:""},
          scenesBtns: [
            {
              receiveNum:"", //电话号
              //发送短信用这个
              sendMessage:"",
              sendNum:"",
              //打开链接或者APP或者快应用用这个下面的信息关联显示
     	        linkId:"",

              btnName:"",
              btnType:"",
              btnRule:"",
              //下面可选
              deeplink:"",
              packageName:"",
              h5Url:""
            }
          ]
        },
        menuUrl:{
          App: {
            value:"",
            url:""
          },
          QuickApp: {
            value:"",
            url:""
          },
          H5: {
            value:"",
            url:""
          }
        }
      }'
      >
    </SceneConfig>
```