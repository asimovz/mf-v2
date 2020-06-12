import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './iview.less'
import VueI18n from 'vue-i18n'
Vue.use(iView)
Vue.use(VueI18n)

//布局组件
import mRow from './mRow'
import mCol from './mCol'

//导航组件
import mPage from './mPage'
import mStep from './mStep'


//基础组件
import mButton from './mButton'
import mBadge from './mBadge'
import mIcon from './mIcon'


//数据录入
import mInput from './mInput'
import mRadio from './mRadio'
import mCheckbox from './mCheckbox'
import mSwitch from './mSwitch'
import mSelect from './mSelect'
import mDateTime from './mDateTime'
import mTimePicker from './mTimePicker'
import mDatePeriod from './mDatePeriod'
import mFile from './mFile'
import mColor from './mColor'
import mCascader from './mCascader'
import mTransfer from './mTransfer'
import mHidden from './mHidden'
import mTreeSelect from './mTreeSelect'


//数据展示
import mTooltip from './mTooltip'
import mPopover from './mPopover'
import mCollapse from './mCollapse/'
import mTree from './mTree'
import mTags from './mTags'
import {mTabs, mTabPane} from './mTabs/'
import containerBox from './containerBox'


//反馈组件
import mLoading from './mLoad'
import mModal from './mModal'
import mDrawer from './mDrawer'
//handleNotice,handleMessage,handleConfirm
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
  this.$Notice[type]({
    type: type,
    title: title,
    desc: msg,
    duration: 2
  })  
}

// 操作反馈信息 success/warning/info/error
Vue.prototype.handleMessage = function (content, type = 'info', duration = 1.5) {
  this.$Message[type]({
    content,
    duration
  })
}

// 定义模态对话框，用于操作确认
Vue.prototype.handleConfirm = function (options) {
  this.$Modal.confirm(options)
}




//兼容后端旧模板
import agDynamicDialog from './agDynamicDialog'
import agDynamicDrawer from './agDynamicDrawer'



/*  ===== 第三方插件 ======== */ 

//模态框拖动
import iviewExt from './directives'
Vue.use(iviewExt)

//表单字段验证插件
import VeeValidate from 'vee-validate'
import zh_CN from './utils/vee-zh_CN'
const i18n_zh = new VueI18n({
	locale: 'zh_CN',
})

const config = {
  dictionary: {
    zh_CN
  },
  fieldsBagName: 'validFields',
  i18n: i18n_zh , // the vue-i18n plugin instance
  i18nRootKey: 'validation' ,// the nested key under which the validation messsages will be located
};
Vue.use(VeeValidate, config);

const component = [
  mRow,
  mCol,
  mPage,
  mStep,
  mButton,
  mBadge,
  mIcon,
  mInput,
  mRadio,
  mCheckbox,
  mSwitch,
  mSelect,
  mDateTime,
  mTimePicker,
  mDatePeriod,
  mFile,
  mColor,
  mCascader,
  mTransfer,
  mHidden,
  mTreeSelect,
  mTooltip,
  mPopover,
  mCollapse,
  mCollapse.mColPanel,
  mTree,
  mTabs,
  mTabPane,
  mTags,
  mLoading,
  mModal,
  mDrawer,
  agDynamicDialog,
  agDynamicDrawer,
  containerBox
]

export default component
