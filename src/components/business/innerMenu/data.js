const actionData = [
  {
    label: 'MENU',
    value: 'MENU',
    placeholder: '',
    opts: []
  },
  {
    label: 'SEND_SMS_OLD',
    value: 'SEND_SMS_OLD',
    placeholder: '发送指令',
    opts: [
      {name: 'sendTo', type: 'input', placeholder: 'sendTo', required: true},
      {name: 'sms', type: 'input', placeholder: 'sms', required: true},
      {name: 'SP', type: 'select', value: 'cmm, cuu, ccc', r_type: '1', placeholder: 'SP', required: true, sp: [
          {label: 'cm', value: 'cm', placeholder: '移动'},
          {label: 'cu', value: 'cu', placeholder: '联通'},
          {label: 'cc', value: 'cc', placeholder: '电信'}
        ]
      },
      {name: 'desc', type: 'selectTable', placeholder: 'desc'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal'}
    ]
  },
  {
    label: 'SEND_SMS',
    value: 'SEND_SMS',
    placeholder: '发送指令',
    opts: [
      {name: 'sendTo', type: 'input', placeholder: 'sendTo', required: true},
      {name: 'sms', type: 'input', placeholder: 'sms', required: true},
      {name: 'SP', type: 'select', r_type: '1', value: 'cmm, cuu, ccc', placeholder: 'SP'},
      {name: 'SPS', type: 'select', r_type: '0', value: '/apps/a/b', placeholder: 'SP'},
      {name: 'desc', type: 'selectTable', r_type: '0', value: '/apps/a/b', placeholder: 'desc'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal'}
    ]
  },
  {
    label: 'OPEN_URL',
    value: 'OPEN_URL',
    placeholder: '打开网页',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', value: 'aaa', required: true},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true}
    ]
  },
  {
    label: 'DOWNLOAD',
    value: 'DOWNLOAD',
    placeholder: '下载APP',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', required: true},
      {name: 'extend', type: 'input', placeholder: 'extend(只读)'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: 'CALL',
    value: 'CALL',
    placeholder: '拨打电话',
    opts: [
      {name: 'phoneNum', type: 'input', placeholder: 'phoneNum', required: true},
      {name: 'extendVal', type: 'input', placeholder: 'extendVal'},
    ]
  },
  {
    label: 'OPEN_APP',
    value: 'OPEN_APP',
    placeholder: '打开APP具体页面',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', required: true},
      {name: 'extend', type: 'input', placeholder: 'extend(只读)'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: 'OPEN_MAP',
    value: 'OPEN_MAP',
    placeholder: '打开地图',
    opts: [
      {name: 'extend', type: 'input', placeholder: 'extend', required: true},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal'},
    ]
  },
  {
    label: 'OPEN_MAP_LIST',
    value: 'OPEN_MAP_LIST',
    placeholder: '打开地图列表',
    opts: [
      {name: 'extend', type: 'input', placeholder: 'extend', required: true},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal'},
    ]
  },
  {
    label: 'ZFB_REPAYMENT',
    value: 'ZFB_REPAYMENT',
    placeholder: '支付宝还款',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', required: true},
      {name: 'extend', type: 'input', placeholder: 'extend(只读)'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: 'RECHARGE',
    value: 'RECHARGE',
    placeholder: '话费充值',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', required: true},
      {name: 'extend', type: 'input', placeholder: 'extend'},
      {name: 'SP', type: 'select', placeholder: 'SP', required: true, sp: [
          {label: 'cm', value: 'cm', placeholder: '移动'},
          {label: 'cu', value: 'cu', placeholder: '联通'},
          {label: 'cc', value: 'cc', placeholder: '电信'}
        ]
      },
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: 'WEB_TRAFFIC_ORDER',
    value: 'WEB_TRAFFIC_ORDER',
    placeholder: '流量充值',
    opts: [
      {name: 'SP', type: 'select', placeholder: 'SP', required: true, sp: [
          {label: 'cm', value: 'cm', placeholder: '移动'},
          {label: 'cu', value: 'cu', placeholder: '联通'},
          {label: 'cc', value: 'cc', placeholder: '电信'}
        ]
      },
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal'},
    ]
  },
  {
    label: 'CONVERSATION_TYPE',
    value: 'CONVERSATION_TYPE',
    placeholder: '信用卡账单、行程流水等需要提取短信关键字做传参的查询服务',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val', required: true},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', required: true},
      {name: 'desc', type: 'input', placeholder: 'desc', required: true},
    ]
  },
  {
    label: 'EX_CALL_RECHARGE',
    value: 'EX_CALL_RECHARGE',
    placeholder: '话费充值拓展(目前努比亚使用)',
    opts: []
  },
  {
    label: 'EX_TRAFFIC_RECHARGE',
    value: 'EX_TRAFFIC_RECHARGE',
    placeholder: '流量充值拓展(目前努比亚使用)',
    opts: []
  },
  {
    label: 'EX_EXPRESS_QUERY',
    value: 'EX_EXPRESS_QUERY',
    placeholder: '快递查询拓展(目前努比亚使用)',
    opts: []
  },
  {
    label: 'EX_DOWNLOAD',
    value: 'EX_DOWNLOAD',
    placeholder: '下载APP拓展(暂无使用)',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val'},
      {name: 'extend', type: 'input', placeholder: 'extend(只读)'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: 'EX_OPEN_APP',
    value: 'EX_OPEN_APP',
    placeholder: '打开APP拓展(暂无使用)',
    opts: [
      {name: 'url_val', type: 'selectTable', placeholder: 'url_val'},
      {name: 'extend', type: 'input', placeholder: 'extend(只读)'},
      {name: 'extendVal', type: 'textarea', placeholder: 'extendVal', hidden: true},
    ]
  },
  {
    label: '上传图片',
    value: 'UPLOAD_IMG',
    placeholder: '上传图片',
    opts: []
  },
  {
    label: '视频播放',
    value: 'PLAY_VEDIO',
    placeholder: '视频播放',
    opts: []
  }
]

const standardAct = [
  {
    label: 'OPEN_FAST',
    value: 'open_fast',
    placeholder: '打开快应用',
    opts: [

      {label: 'viewUrl', placeholder: '快应用deeplink链接(必填)', required: true},
      {label: 'appName', placeholder: '快应用引擎包名(只读)'}
    ]
  },
  {
    label: 'OPEN_APP',
    value: 'open_app',
    placeholder: '打开APP',
    opts: [
      {label: 'viewUrl', placeholder: '应用具体页面链接(选填)', required: true},
      {label: 'appName', placeholder: '应用包名(只读)'},
      {label: 'className', placeholder: 'className(选填)', hidden: true},
      {label: 'flags', placeholder: 'flags(选填)', hidden: true},
      {label: 'actionName', placeholder: 'actionName(选填)', hidden: true},
      {label: 'extras', placeholder: 'extras(选填)', hidden: true},
      {label: 'type', placeholder: 'type(选填)', hidden: true},
    ]
  },
  {
    label: 'OPEN_MARKET',
    value: 'open_market',
    placeholder: '打开厂商应用市场',
    opts: [
      {label: 'appName', placeholder: '应用包名(必填)', required: true}
    ]
  },
  {
    label: 'OPEN_H5',
    value: 'open_h5',
    placeholder: '打开链接',
    opts: [
      {label: 'viewUrl', placeholder: 'H5链接(必填)', required: true}
    ]
  }
]

const defaultStandard = {
  services: [
    {label: 'OPEN_FAST', service_type: 'open_fast'},
    {label: 'OPEN_APP', service_type: 'open_app'},
    {label: 'OPEN_MARKET', service_type: 'open_market'},
    {label: 'OPEN_H5', service_type: 'open_h5'}
  ],
  corner: 'corner'
}

export {
  actionData,
  standardAct,
  defaultStandard
}
