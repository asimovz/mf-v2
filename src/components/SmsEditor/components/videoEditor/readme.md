# 视频编辑组件

**配置项**

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| mediaData | 待编辑视频基本信息 | object | 可能包含的参数见如下片段 |
| visible | 是否显示 | boolean | 显示视频编辑dialog |

**事件**

| 事件名称 | 说明 | 回调参数 |
| :---  | :--- | :-- |
| close | 进Dialog 关闭的回调 | false |

**v-model 播放器会将那些信息同步至父组件？**

```json
{
  "src":"", // 视频文件地址
  "poster":"" // 海报图片地址（可选）
}
```

**示例**

```html
<videoConf
  :visible="visible"
  :mediaData="{src: 'x.mp4', poster: 'x.jpg'}"
  @close="visible = false">
</videoConf>
```