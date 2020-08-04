import innerMenu, { menuPreview } from './innerMenu' // 菜单配置新增
import motionOptions from './motionOptions' // 动态增加动作类型
import brandEditor from './brandEditor' // 公众号品牌信息编辑
import brandListEditor from './brandListEditor' // 公众号菜单列表编辑
import sceneConfig from './sceneConfig' // 场景方案编辑组件
import msgConfig from './msgConfig' // 卡片方案编辑组件
import msgCardList from './msgCardList' // 5G消息卡片列表
import msgPreview from './msgPreview' // 5G消息卡片列表

import catDrawList from './catDraw/catDrawList' //5g消息编辑组件
import mAddShortcutButton from './mAddShortcutButton' //固定快捷按钮组件

const component = [
  motionOptions, innerMenu, menuPreview, brandEditor, brandListEditor, sceneConfig, msgConfig, msgCardList, msgPreview,mAddShortcutButton,catDrawList
]
export default component