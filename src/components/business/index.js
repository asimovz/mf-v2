import innerMenu, { menuPreview } from './innerMenu' // 菜单配置新增
import motionOptions from './motionOptions' // 动态增加动作类型
import brandEditor from './brandEditor' // 公众号品牌信息编辑
import brandListEditor from './brandListEditor' // 公众号菜单列表编辑
import sceneConfig from './sceneConfig' // 场景方案编辑组件
import msgConfig from './msgConfig' // 卡片方案编辑组件
import msgCardList from './msgCardList' // 5G消息卡片列表

const component = [
  motionOptions, innerMenu, menuPreview, brandEditor, brandListEditor, sceneConfig, msgConfig, msgCardList
]

export default component
