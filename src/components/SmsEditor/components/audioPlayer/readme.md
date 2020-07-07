# 音频播放器

**配置项**

| 属性 | 功能 | 类型 | 说明 |
| :---  | :--- | :-- | :-- |
| src | 音频文件地址 | string | - |
| muted | 默认静音？ | boolean | undefined |


```html
  <audioPlayer
    :options="{
      muted: true,
      src: 'https://img.tukuppt.com/newpreview_music/09/00/41/5c89232d12af919710.mp3'
    }"
  />
```