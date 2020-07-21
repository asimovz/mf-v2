# 视频播放器组件

**配置项**

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| v-model | 同步视频的基本信息 | object | 可能包含的参数见如下片段 |
| showMediaInfo | 是否显示视频基本信息 | any | default: undefined |
| showFastBtns | 是否显示10s快进快退按钮 | any | default: undefined |
| hoverPlay | 鼠标划过播放，离开暂停 | boolean | default: false |
| pointerEvents | 视频区域是否可以作为鼠标事件的target | boolean | default: true |
| options | videojs 配置 | object | 详见videojs配置手册 |


**v-model 播放器会将那些信息同步至父组件？**

```json
{
  "playerWidth":"", // 播放器宽度
  "playerHeight":"", // 播放器高度
  "videoWidth":"", // 视频实际宽度
  "videoHeight":"", // 视频实际高度
  "duration":0, // 视频总时长
  "currentTime":0, // 当前播放进度所在时间
  "src":"a.mp4", // 视频文件地址
  "poster":"" // 视频海报
}
```

**方法**

| 方法 | 说明 | 参数 |
| :---  | :--- | :-- |
| gotoTime(s) | 进度跳转至指定时间（s）,并暂停视频。`currentTime` 发生变化时，将自动调用 | 秒 |
| cropPreview([2,20]) | 预览指定时间范围的视频片段 | 时间分为数组 `[2, 20]` |
| replay() | 手动重置播放，内部也会根据监听视频地址变化自动重置 | - |
| showPoster() | 显示海报 | - |
| hidePoster() | 隐藏海报 | - |

**示例**

```html
<videoPlayer
  ref="videoPlayer"
  showMediaInfo
  showFastBtns
  v-model="mediaInfo"
  :options="videoOptions" />
```