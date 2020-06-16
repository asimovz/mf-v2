var moqui = {
  isString: function(obj) {
    return typeof obj === 'string';
  },
  isBoolean: function(obj) {
    return typeof obj === 'boolean';
  },
  isNumber: function(obj) {
    return typeof obj === 'number';
  },
  isArray: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
  isFunction: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  },
  isPlainObject: function(obj) {
    return obj != null && typeof obj == 'object' && Object.prototype.toString.call(obj) === '[object Object]';
  },

  htmlEncode: function(value) {
    return $('<div/>').text(value).html();
  },
  htmlDecode: function(value) {
    return $('<div/>').html(value).text();
  },

  dateOffsets: [{
    id: '0',
    text: 'This'
  }, {
    id: '-1',
    text: 'Last'
  }, {
    id: '1',
    text: 'Next'
  }, {
    id: '-2',
    text: '-2'
  }, {
    id: '2',
    text: '+2'
  }, {
    id: '-3',
    text: '-3'
  }, {
    id: '-4',
    text: '-4'
  }, {
    id: '-6',
    text: '-6'
  }, {
    id: '-12',
    text: '-12'
  }],
  datePeriods: [{
    id: 'day',
    text: 'Day'
  }, {
    id: '7d',
    text: '7 Days'
  }, {
    id: '30d',
    text: '30 Days'
  }, {
    id: 'week',
    text: 'Week'
  }, {
    id: 'weeks',
    text: 'Weeks'
  }, {
    id: 'month',
    text: 'Month'
  }, {
    id: 'months',
    text: 'Months'
  }, {
    id: 'quarter',
    text: 'Quarter'
  }, {
    id: 'year',
    text: 'Year'
  }, {
    id: '7r',
    text: '+/-7d'
  }, {
    id: '30r',
    text: '+/-30d'
  }],
  emptyOpt: {
    id: '',
    text: '\u00a0'
  },

  loadScript: function(src) {
    // make sure the script isn't loaded
    var loaded = false;
    $('head script').each(function(i, hscript) {
      if (hscript.src.indexOf(src) !== -1) loaded = true;
    });
    if (loaded) return;
    // add it to the header
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  },
  loadStylesheet: function(href, rel, type) {
    if (!rel) rel = 'stylesheet';
    if (!type) type = 'text/css';
    // make sure the stylesheet isn't loaded
    var loaded = false;
    $('head link').each(function(i, hlink) {
      if (hlink.href.indexOf(href) !== -1) loaded = true;
    });
    if (loaded) return;
    // add it to the header
    var link = document.createElement('link');
    link.href = href;
    link.rel = rel;
    link.type = type;
    document.head.appendChild(link);
  },
  retryInlineScript: function(src, count) {
    try {
      eval(src);
    } catch (e) {
      src = src.trim();
      var retryTime = count <= 5 ? count * count * 100 : 'N/A';
      console.warn('inline script error ' + count + ' retry ' + retryTime + ' script: ' + src.slice(0, 80) + '...');
      console.warn(e);
      if (count <= 5) setTimeout(moqui.retryInlineScript, retryTime, src, count + 1);
    }
  },
  // return a function that delay the execution
  debounce: function(func, wait) {
    var timeout, result;
    return function() {
      var context = this,
        args = arguments,
        later;
      later = function() {
        timeout = null;
        result = func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      return result;
    };
  },
  // function to set columns across multiple tables to the same width
  makeColumnsConsistent: function(outerId) {
    var tableArr = $('#' + outerId + ' table');
    // console.log(tableArr);
    var widthMaxArr = [];
    var i, j, curTable, row, rowIdx;
    for (i = 0; i < tableArr.length; i++) {
      curTable = tableArr[i];
      if (!curTable.rows || curTable.rows.length === 0) continue;
      rowIdx = 0;
      row = curTable.rows[rowIdx];
      while (rowIdx < 5 && rowIdx < curTable.rows.length) {
        if ((!row.cells || row.cells.length <= 1) && curTable.rows.length > (rowIdx + 1)) {
          rowIdx++;
          row = curTable.rows[rowIdx];
        } else {
          break;
        }
      }
      if (!row.cells || row.cells.length === 0) continue;
      for (j = 0; j < row.cells.length; j++) {
        var curWidth = $(row.cells[j]).width();
        if (!widthMaxArr[j] || widthMaxArr[j] < curWidth) widthMaxArr[j] = curWidth;
      }
    }
    // console.log("Columns max widths: " + widthMaxArr);
    var numCols = widthMaxArr.length;
    var totalWidth = 0;
    for (i = 0; i < numCols; i++) totalWidth += widthMaxArr[i];
    var widthPercents = [];
    for (i = 0; i < numCols; i++) widthPercents[i] = (widthMaxArr[i] * 100) / totalWidth;
    // console.log("Columns " + numCols + ", percents: " + widthPercents);
    for (i = 0; i < tableArr.length; i++) {
      curTable = tableArr[i];
      if (!curTable.rows || curTable.rows.length === 0) continue;
      rowIdx = 0;
      row = curTable.rows[rowIdx];
      while (rowIdx < 5 && rowIdx < curTable.rows.length) {
        if ((!row.cells || row.cells.length <= 1) && curTable.rows.length > (rowIdx + 1)) {
          rowIdx++;
          row = curTable.rows[rowIdx];
        } else {
          break;
        }
      }
      if (!row.cells || row.cells.length === 0) continue;
      for (j = 0; j < row.cells.length; j++) {
        // console.log("setting table " + i + " row " + rowIdx + " col " + j + " to " + widthPercents[j]);
        row.cells[j].style.width = widthPercents[j] + '%';
      }
    }
  },

  downloadData: function download(data, filename, type) {
    var file = new Blob([data], {
      type: type
    });
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  },

  notifyNotification: function(jsonObj, fallback) {
    if (!jsonObj) return;
    var notificationOptions = {};
    //注意这里不用topic，因为 Notification 的options中 tag 有大小写的约束，大写的不认?? what fuck?
    if (jsonObj.notificationMessageId) {
      notificationOptions.tag = jsonObj.notificationMessageId
      notificationOptions.body = jsonObj.title
    }
    // consider options 'body' and 'icon' (icon URL, any way to use glyphicon class?)
    if (window.Notification && Notification.permission === "granted") {
      var notif = new Notification(jsonObj.topicDescription, notificationOptions);
      if (jsonObj.link && jsonObj.link.length) {
        notif.onclick = function() {
          window.open(moquiVue.appHost + jsonObj.link, '_blank')
        };
      }
      if (moquiVue) {
        moquiVue.addNotify(jsonObj.title, jsonObj.type);
      }
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function(status) {
        if (status === "granted") {
          var notif = new Notification(jsonObj.title, notificationOptions);
          if (jsonObj.link && jsonObj.link.length) notif.onclick = function() {
            window.open(jsonObj.link);
          };
          if (moquiVue) {
            moquiVue.addNotify(jsonObj.title, jsonObj.type);
          }
        } else {
          fallback(jsonObj);
        }
      });
    } else {
      fallback(jsonObj);
    }
  },

  /* NotificationClient, note does not connect the WebSocket until notificationClient.registerListener() is called the first time */
  NotifyOptions: function(message, url, type, icon) {
    // console.warn("notify options message: [" + message + "] encoded: " + moqui.htmlEncode(message));
    this.message = moqui.htmlEncode(message);
    if (url) this.url = url;
    if (icon) {
      this.icon = icon;
    } else {
      if (type === 'success') this.icon = 'glyphicon glyphicon-ok-sign';
      else if (type === 'warning') this.icon = 'glyphicon glyphicon-warning-sign';
      else if (type === 'danger') this.icon = 'glyphicon glyphicon-exclamation-sign';
      else this.icon = 'glyphicon glyphicon-info-sign';
    }
  },
  NotifySettings: function(type) {
    this.delay = 4000;
    this.offset = {
      x: 20,
      y: 60
    };
    this.placement = {
      from: 'top',
      align: 'right'
    };
    this.animate = {
      enter: 'animated fadeInDown',
      exit: ''
    }; // no animate on exit: animated fadeOutUp
    if (type) {
      this.type = type;
    } else {
      this.type = 'info';
    }
    this.template =
      '<div data-notify="container" class="notify-container col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>' +
      '<span data-notify="icon"></span> <span data-notify="message">{2}</span>' +
      '<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>';
  },
  notifyGrowl: function(jsonObj) {
    if (!jsonObj) return;
    if (moquiVue) {
      moquiVue.handleNotice(jsonObj.title, jsonObj.type);
    }
  },

  /* NotificationClient, note does not connect the WebSocket until notificationClient.registerListener() is called the first time */
  NotificationClient: function(webSocketUrl) {
    this.displayEnable = true;
    this.webSocketUrl = webSocketUrl;
    this.topicListeners = {};
    this.disableDisplay = function() {
      this.displayEnable = false;
    };
    this.enableDisplay = function() {
      this.displayEnable = true;
    };

    this.heartCheck = {
      classObj: this,
      timeout: 50 * 1000, //50s
      timeoutObj: null,
      reset: function() {
        clearInterval(this.timeoutObj);
        this.start();
      },
      start: function() {
        this.timeoutObj = setInterval(() => {
          this.classObj.webSocket.send("HeartBeat");
        }, this.timeout)
      }
    }

    this.initWebSocket = function() {
      let _self = this
      this.webSocket = new WebSocket(this.webSocketUrl);
      this.webSocket.clientObj = this;
      this.webSocket.onopen = function(event) {
        _self.heartCheck.start()
        this.clientObj.tryReopenCount = 0;
        var topics = [];
        for (var topic in this.clientObj.topicListeners) {
          topics.push(topic);
        }
        this.send("subscribe:" + topics.join(","));
      };
      this.webSocket.onmessage = function(event) {
        console.log(this.clientObj)
        _self.heartCheck.reset()
        var jsonObj = JSON.parse(event.data);
        var callbacks = this.clientObj.topicListeners[jsonObj.topic];
        if (callbacks) callbacks.forEach(function(callback) {
          callback(jsonObj, this)
        }, this);
        var allCallbacks = this.clientObj.topicListeners["ALL"];
        if (allCallbacks) allCallbacks.forEach(function(allCallbacks) {
          allCallbacks(jsonObj, this)
        }, this);
      };
      this.webSocket.onclose = function(event) {
        console.log(event, "websocket断开");
        setTimeout(this.clientObj.tryReopen, 30 * 1000, this.clientObj);
      };
      this.webSocket.onerror = function(event) {
        console.log(event, "websocket发生错误");
      };
    };
    this.tryReopen = function(clientObj) {
      if ((!clientObj.webSocket || clientObj.webSocket.readyState === WebSocket.CLOSED || clientObj.webSocket.readyState === WebSocket.CLOSING) &&
        (!clientObj.tryReopenCount || clientObj.tryReopenCount < 6)) {
        console.log("Trying WebSocket reopen, count " + clientObj.tryReopenCount);
        clientObj.tryReopenCount = (clientObj.tryReopenCount || 0) + 1;
        clientObj.initWebSocket();
        // no need to call this, onclose gets called when WS connect fails: setTimeout(clientObj.tryReopen, 30*1000, clientObj);
      }
    };
    this.displayNotify = function(jsonObj, webSocket) {
      if (!webSocket.clientObj.displayEnable) return; // console.log(jsonObj);
      if (jsonObj.title && jsonObj.showAlert === true) {
        moqui.notifyNotification(jsonObj, moqui.notifyGrowl);
      }
    };
    this.registerListener = function(topic, callback) {
      if (!this.webSocket) this.initWebSocket();
      if (!callback) callback = this.displayNotify;
      var listenerArray = this.topicListeners[topic];
      if (!listenerArray) {
        listenerArray = [];
        this.topicListeners[topic] = listenerArray;
        if (this.webSocket.readyState === WebSocket.OPEN) this.webSocket.send("subscribe:" + topic);
      }
      if (listenerArray.indexOf(callback) < 0) {
        listenerArray.push(callback);
      }
    };
  },
  /* Example Notification Listener Registration (note listener method defaults to displayNotify as in first example;
       you can register more than one listener method for the same topic):
   <#if ec.factory.serverContainer?has_content>
   <script>
   notificationClient.registerListener("ALL"); // register for all topics
   notificationClient.registerListener("MantleEvent", notificationClient.displayNotify);
   </script>
   </#if>
  */

  LruMap: function(limit) {
    this.limit = limit;
    this.valueMap = {};
    this.lruList = []; // end of list is least recently used
    this.put = function(key, value) {
      var lruList = this.lruList;
      var valueMap = this.valueMap;
      valueMap[key] = value;
      this._keyUsed(key);
      while (lruList.length > this.limit) {
        var rem = lruList.pop();
        valueMap[rem] = null;
      }
    };
    this.get = function(key) {
      var value = this.valueMap[key];
      if (value) {
        this._keyUsed(key);
      }
      return value;
    };
    this.containsKey = function(key) {
      return !!this.valueMap[key];
    };
    this._keyUsed = function(key) {
      var lruList = this.lruList;
      var lruIdx = -1;
      for (var i = 0; i < lruList.length; i++) {
        if (lruList[i] === key) {
          lruIdx = i;
          break;
        }
      }
      if (lruIdx >= 0) {
        lruList.splice(lruIdx, 1);
      }
      lruList.unshift(key);
    };
  },
  /**
   * 获取几天前，或几天后的日期
   * @param {number} days 偏移天数，支持负数, 默认值0，返回当前日期
   * @returns {Date}
   */
  getDay(days = 0) {
    const date = new Date()
    return new Date(date.setDate(date.getDate() + days))
  },
  dateFormat: function(value, fmt) { //author: meizz 
    if (value == "") return
    var date = new Date(value)
    var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

  },
  format: function(value, format, type) {
    // console.log('format ' + value + ' with ' + format + ' of type ' + type);
    // number formatting: http://numeraljs.com/ https://github.com/andrewgp/jsNumberFormatter http://www.asual.com/jquery/format/
    if (format && format.length) {
      format = format.replace(/a/, 'A').replace(/d/, 'D').replace(/y/, 'Y');
    } // change java date/time format to moment
    if (type && type.length) {
      type = type.toLowerCase();
      if (type === "date") {
        if (!format || format.length === 0) format = "YYYY-MM-DD";
        return moment(value).format(format);
      } else if (type === "time") {
        if (!format || format.length === 0) format = "HH:mm:ss";
        return moment(value).format(format);
      } else if (type === "timestamp") {
        if (!format || format.length === 0) format = "YYYY-MM-DD HH:mm";
        return moment(value).format(format);
      } else if (type === "bigdecimal" || type === "long" || type === "integer" || type === "double" || type === "float") {
        return value; // TODO format numbers
      } else {
        console.warn('format type unknown: ' + type);
      }
    }
    if (moqui.isNumber(value)) {
      return value; // TODO format numbers
    } else {
      // is it a number or any sort of date/time that moment supports? if anything else return as-is
      var momentVal = moment(value);
      if (momentVal.isValid()) {
        if (!format || format.length === 0) format = "YYYY-MM-DD HH:mm";
        return momentVal.format(format);
      }
      // TODO
      return value;
    }
  }
}
moqui.notifyOpts = {
  delay: 1500,
  timer: 250,
  offset: {
    x: 20,
    y: 60
  },
  placement: {
    from: 'top',
    align: 'right'
  },
  z_index: 1100,
  type: 'success',
  animate: {
    enter: 'animated fadeInDown',
    exit: ''
  }
}; // no animate on exit: animated fadeOutUp
moqui.notifyOptsInfo = {
  delay: 3000,
  timer: 250,
  offset: {
    x: 20,
    y: 60
  },
  placement: {
    from: 'top',
    align: 'right'
  },
  z_index: 1100,
  type: 'info',
  animate: {
    enter: 'animated fadeInDown',
    exit: ''
  }
}; // no animate on exit: animated fadeOutUp
moqui.notifyOptsError = {
  delay: 5000,
  timer: 250,
  offset: {
    x: 20,
    y: 60
  },
  placement: {
    from: 'top',
    align: 'right'
  },
  z_index: 1100,
  type: 'danger',
  animate: {
    enter: 'animated fadeInDown',
    exit: ''
  }
}; // no animate on exit: animated fadeOutUp



moqui.notifyMessages = function(messages, errors, validationErrors, respObj) {
  var notified = false;
  if (messages) {
    if (moqui.isArray(messages)) {
      for (var mi = 0; mi < messages.length; mi++) {
        var messageItem = messages[mi];
        if (moqui.isPlainObject(messageItem)) {
          var msgType = messageItem.type;
          if (!msgType || !msgType.length) msgType = 'info';
          moquiVue.handleNotice(messageItem.message, msgType);
        } else {
          moquiVue.handleNotice(messageItem, 'info');
        }
        notified = true;
      }
    } else {
      moquiVue.handleNotice(messages, 'info');
      notified = true;
    }
  }
  if (errors) {
    if (moqui.isArray(errors)) {
      for (var ei = 0; ei < errors.length; ei++) {
        moquiVue.handleNotice(errors[ei], 'danger');
        notified = true;
      }
    } else {
      moquiVue.handleNotice(errors, 'danger');
      notified = true;
    }
  }
  if (validationErrors) {
    if (moqui.isArray(validationErrors)) {
      for (var vei = 0; vei < validationErrors.length; vei++) {
        moqui.notifyValidationError(validationErrors[vei]);
        notified = true;
      }
    } else {
      moqui.notifyValidationError(validationErrors);
      notified = true;
    }
  }
  return notified;
};
moqui.notifyValidationError = function(valError) {
  var message = valError;
  if (moqui.isPlainObject(valError)) {
    message = valError.message;
    if (valError.fieldPretty && valError.fieldPretty.length) message = message + " (for field " + valError.fieldPretty + ")";
  }
  moquiVue.handleNotice(message, 'danger');
};
moqui.handleAjaxError = function(jqXHR, textStatus, errorThrown) {
  var resp = jqXHR.responseText;
  var respObj;
  try {
    respObj = JSON.parse(resp);
  } catch (e) { /* ignore error, don't always expect it to be JSON */ }
  console.warn('ajax ' + textStatus + ' (' + jqXHR.status + '), message ' + errorThrown /*+ '; response: ' + resp*/ );
  // console.error('respObj: ' + JSON.stringify(respObj));
  var notified = false;
  if (respObj && moqui.isPlainObject(respObj)) {
    notified = moqui.notifyMessages(respObj.messages, respObj.errors, respObj.validationErrors, respObj);
  } else if (resp && moqui.isString(resp) && resp.length) {
    notified = moqui.notifyMessages(resp);
  }

  // reload on 401 (Unauthorized) so server can remember current URL and redirect to login screen
  if (jqXHR.status === 401) {
    if (moquiVue) {
      window.location.href = moquiVue.currentLinkUrl;
    } else {
      window.location.reload(true);
    }
  } else if (jqXHR.status === 0) {
    if (errorThrown.indexOf('abort') < 0) {
      var msg = 'Could not connect to server';
      moquiVue.handleNotice(msg, 'danger');
    }
  } else if (!notified) {
    var errMsg = 'Error: ' + errorThrown + ' (' + textStatus + ')';
    moquiVue.handleNotice(errMsg, 'danger');
  }
}
moqui.componentCache = new moqui.LruMap(50);

moqui.shortName = function(name) {
  let reg = /[a-zA-Z]+.*/.test(name)
  let short
  if (reg) {
    short = name.split("").slice(0, 2).join("")
  } else {
    if (name.length >= 3) {
      short = name.split("").slice(-2).join("")
    } else {
      short = name
    }
  }
  return short
}
moqui.getNowDate = function() {
  var date = new Date();
  var sign1 = "-";
  var sign2 = ":";
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
  var week = weekArr[date.getDay()];
  // 给一位数数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes;
  return currentdate;
}

moqui.getDate = function() {
  var date = new Date();
  var sign1 = "-";
  var sign2 = ":";
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
  var week = weekArr[date.getDay()];
  // 给一位数数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate = year + sign1 + month + sign1 + day;
  return currentdate;
}


/*---- 20190806 edit start by huanghe ----*/
moqui.isStatic = function(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  )
}

moqui.isPrimitive = function(value) {
  return moqui.isStatic(value) || typeof value === 'symbol'
}
moqui.isLength = function(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}
moqui.isArrayLike = function(value) {
  return value != null && moqui.isLength(value.length) && !moqui.isFunction(value);
}

moqui.isEmpty = function(value) {
  if (value == null) {
    return true;
  }
  if (moqui.isArrayLike(value)) {
    return !value.length;
  } else if (moqui.isPlainObject(value)) {
    for (let key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

moqui.getRawType = function(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

moqui.compact = function(array) {
  var index = -1,
    length = array == null ? 0 : array.length,
    resIndex = 0,
    result = [];
  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

moqui.clones = function(value, deep) {
  if (moqui.isPrimitive(value)) {
    return value
  }
  if (moqui.isArrayLike(value)) { //是类数组
    value = Array.prototype.slice.call(value)
    return value.map(item => deep ? moqui.clone(item, deep) : item)
  } else if (moqui.isPlainObject(value)) { //是对象
    let target = {},
      key;
    for (key in value) {
      value.hasOwnProperty(key) && (target[key] = deep ? moqui.clone(value[key], deep) : value[key])
    }
  }
  let type = moqui.getRawType(value)
  switch (type) {
    case 'Date':
    case 'RegExp':
    case 'Error':
      value = new window[type](value);
      break;
  }
  return value
}

moqui.clone = function(val1) {
  return JSON.parse(JSON.stringify(val1))
}

moqui.merges = function(obj1, obj2) {
  var key;
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
      merge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
  }
  return obj1;
}

moqui.merge = function(obj1, obj2) {
  return Object.assign({}, obj1, obj2)
}

moqui.startsWith = function(string, target, position) {
  const {
    length
  } = string
  position = position == null ? 0 : position
  if (position < 0) {
    position = 0
  } else if (position > length) {
    position = length
  }
  target = `${target}` // es6中模板字符`xxxxx`,在字符串中嵌入变量，例如：`xx${变量}xx`
  return string.slice(position, position + target.length) == target
}

moqui.trimStart = function(str, spa = '') {
  if (!str.split(spa).length) {
    return str
  } else {
    let str_arr = str.split('')
    let _i = spa.split('').findIndex(el => {
      return str_arr.indexOf(el) > -1
    })
    return str.replace(spa[_i], '')
  }
}

/*---- 20190806 edit end ----*/



if (!window.define) window.define = function(name, deps, callback) {
  if (!moqui.isString(name)) {
    callback = deps;
    deps = name;
    name = null;
  }
  if (!moqui.isArray(deps)) {
    callback = deps;
    deps = null;
  }
  if (moqui.isFunction(callback)) {
    return callback();
  } else {
    return callback
  }
};

export default moqui