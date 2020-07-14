import Vue from 'vue'
import ElementUI from 'element-ui'
import 'static/element.css'

// const theme = $THEME['theme']
// if(theme == "imos") {
//   require('static/element.css')
// } else {
//   require('element-ui/lib/theme-chalk/index.css')
// }

import VueI18n from 'vue-i18n'

// 布局组件
import mRow from './mRow'
import mCol from './mCol'
// 兼容老模板版本
import Row from './Row'
import Col from './Col'

// 导航组件
import mStep from './mStep'
import mPage from './mPage'

// 基础组件
import mButton from './mButton'
import mButtonGroup from './mButtonGroup'
import mBadge from './mBadge'
import mCarousel from './mCarousel'
import mCarouselItem from './mCarouselItem'
import mIcon from './mIcon'

// 数据录入
import mInput from './mInput'
import mRadio from './mRadio'
import mCheckbox from './mCheckbox'
import mSelect from './mSelect'
import mDateTime from './mDateTime'
import mTimePicker from './mTimePicker'
import mDatePeriod from './mDatePeriod'
import mCollapse from './mCollapse'
import mColPanel from './mColPanel'
import mCascader from './mCascader'
import mTransfer from './mTransfer'
import mTreeSelect from './mTreeSelect'
import mHidden from './mHidden'
import mProgress from './mProgress'
import mFile from './mFile'
import mColor from './mColor'
import mSwitch from './mSwitch'

// 数据展示
import mTable from './mTable/'
import mTooltip from './mTooltip'
import mPopover from './mPopover'
import mTags from './mTags'
import mTree from './mTree'
import mTabs from './mTabs'
import mTabPane from './mTabPane'
import mCard from './mCard'
import mDropDown from './mDropDown'
import mDropDownItem from './mDropDownItem'
import containerBox from './containerBox'

// 反馈组件
import mLoading from './mLoad'
import mModal from './mModal'
import mDrawer from './mDrawer'

/*  ===== 第三方插件 ======== */

// 模态框拖动
import iviewExt from './directives'

// 表单字段验证插件
import VeeValidate from 'vee-validate'
import zh_CN from './utils/vee-zh_CN'
Vue.use(ElementUI)
Vue.use(VueI18n)

// 定义通知提醒框
Vue.prototype.handleNotice = function (msg = '操作成功!', type = 'info') {
  let title = '提醒'
  switch (type) {
    case 'success':
      title = '成功'
      break
    case 'warning':
      title = '警告'
      break
    case 'error':
    case 'danger':
      title = '错误'
      break
  }
  this.$notify({
    type: type === 'danger' ? 'error' : type,
    title: title,
    message: msg
  })
}

// 操作反馈信息 success/warning/info/error
Vue.prototype.handleMessage = function (message, type = 'info', duration = 1500) {
  this.$message({
    dangerouslyUseHTMLString: true,
    type,
    message,
    duration
  })
}

// 定义模态对话框，用于操作确认
Vue.prototype.handleConfirm = function (options) {
  this.$confirm(options.content, options.title, {
    dangerouslyUseHTMLString: true,
    type: options.type || 'info',
    callback: action => {
      action === 'confirm' ? options.onOk() : options.onCancel()
    }
  })
}
Vue.use(iviewExt)
const i18n_zh = new VueI18n({
  locale: 'zh_CN'
})

const config = {
  dictionary: {
    zh_CN
  },
  fieldsBagName: 'validFields',
  i18n: i18n_zh, // the vue-i18n plugin instance
  i18nRootKey: 'validation'  // the nested key under which the validation messsages will be located
}
Vue.use(VeeValidate, config)

const component = [
  mRow,
  mCol,
  mStep,
  mPage,
  mButton,
  mButtonGroup,
  mBadge,
  mInput,
  mRadio,
  mCheckbox,
  mSelect,
  mDateTime,
  mTimePicker,
  mDatePeriod,
  mCollapse,
  mColPanel,
  mCascader,
  mTransfer,
  mTreeSelect,
  mHidden,
  mProgress,
  mFile,
  mColor,
  mSwitch,
  mTooltip,
  mPopover,
  mTags,
  mTree,
  mTabs,
  mTabPane,
  mCard,
  mDropDown,
  mDropDownItem,
  mLoading,
  mModal,
  mDrawer,
  mTable,
  containerBox,
  Row,
  Col,
  mCarousel,
  mCarouselItem,
  mIcon
]

export default component
