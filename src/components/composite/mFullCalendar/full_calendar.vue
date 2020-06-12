<template>
  <div>
    <div class="tool-box">
      <div class="tool-wrap">
        <div class="left">
          <h2 class="title">日历视图</h2>
        </div>
        <div class="middle calendar-title">
          <a class="prev" @click="prev">
            <Icon type="ios-arrow-back" />
          </a>
          <span class="bold">{{title}}</span>
          <a class="next" @click="next">
            <Icon type="ios-arrow-forward" />
          </a>
        </div>
        <div class="right">
          <ul class="nav">
            <li @click="today">今天</li>
            <li :class="{'current':currentView == 'month'}" @click="changeView('month')">月</li>
            <li
              :class="{'current':currentView == 'agendaWeek'}"
              @click="changeView('agendaWeek')"
            >星期</li>
            <li :class="{'current':currentView == 'agendaDay'}" @click="changeView('agendaDay')">日</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="calendar-view" id="calendar" ref="calendar"></div>
    <!-- 		<m-modal
		  id="eventDialog"
		  width="760"
		  height="600"
		  :title="eventTitle"
		  :url="eventUrl"
		  :openDialog="isShowEvent"
		  @on-change="changeModelVisible"
		>
    </m-modal>-->
  </div>
</template>
<script>
// import '../mPopover'
// import eventComponent from './event'
// import $S from './loadJs'
let $S = require("assets/js/script.js");
const jsArr = [
  "/static/js/calendar/fullcalendar.min.js",
  "/static/js/calendar/moment.min.js"
];
const statusColor = {
  WeApproved: "#dededf",
  WeInProgress: "#3BBF67",
  WeOnHold: "#F9C154",
  WeComplete: "#6EBEF4",
  WeCancelled: "#bbb2ff"
};

const $ = require("jquery");
export default {
  name: "m-full-calendar",
  props: {
    calendarAjaxController: String,
    id: [Number, String],
    extraParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      calendar: null,
      title: "",
      currentView: "",
      calendar_height: 0,
      eventList: [],
      isShowEvent: false,
      eventUrl: "",
      eventTitle: ""
    };
  },
  computed: {},
  created: function() {
    // this.eventList = [
    // 		{
    // 			title: 'All Day Event',
    // 			start: '2018-07-10',
    // 			color: '#70e0ce',
    // 		},
    // 		{
    // 			title: 'Long Event',
    // 			start: '2018-07-07',
    // 			end: '2018-07-08',
    // 			color: '#ACA6F9'
    // 		},
    // 		{
    // 			title: 'Long Event',
    // 			start: '2018-07-09',
    // 			end: '2018-07-11',
    // 			color: '#ACA6F9'
    // 		},
    // 		{
    // 			title: 'Long Event',
    // 			start: '2018-07-11',
    // 			color: '#ACA6F9'
    // 		},
    // 		{
    // 			title: 'Long Event',
    // 			start: '2018-07-12',
    // 			color: '#ACA6F9'
    // 		},
    // 		{
    // 			title: 'Long Event',
    // 			start: '2018-07-13',
    // 			color: '#ACA6F9'
    // 		},
    // 	]
  },
  mounted: function() {
    this.calendar = $("#calendar");
    let body_h = document.body.clientHeight;
    let calendar_top = this.$refs.calendar.offsetTop;
    this.calendar_height = body_h - 120;
    $S(jsArr, "fullcalendar");
    $S.ready("fullcalendar", () => {
      this.loadCalendar();
    });
  },
  methods: {
    loadEventList(start, end, timezone, callback) {
      let startDate = start.format();
      let endDate = end.format();
      let params = this.extraParams;
      params["start"] = startDate;
      params["end"] = endDate;
      let http = this.$root.$http;
      http.post(this.calendarAjaxController, params).then(
        response => {
          // for(var i = 0;i<response.data.length;i++){
          // 	let item = response.data[i]
          // 	item.color = '#70e0ce'
          // 	this.eventList.push(item)
          // }
          response.data.map(item => {
            item.backgroundColor = statusColor[item.statusId];
            item.borderColor = statusColor[item.statusId];
          });
          console.log(response.data);
          callback(response.data);
        },
        response => {}
      );
    },
    ok() {
      this.handleMessage(`Clicked ok`,"info")
    },
    cancel() {
      this.handleMessage(`Clicked cancel`,"info")
    },
    today() {
      this.calendar.fullCalendar("today");
      this.changeTitle();
    },
    prev() {
      this.calendar.fullCalendar("prev");
      this.changeTitle();
    },
    next() {
      this.calendar.fullCalendar("next");
      this.changeTitle();
    },
    getDate() {
      let moment = this.calendar.fullCalendar("getDate");
      let view = this.calendar.fullCalendar("getView");
    },
    changeTitle() {
      let view = this.calendar.fullCalendar("getView");
      this.title = view.title;
      this.currentView = view.type;
    },
    changeView(view) {
      this.calendar.fullCalendar("changeView", view);
      this.changeTitle();
    },
    selectCalendar(startDate, endDate, jsEvent, view) {
      let newStartDate = startDate.format();
      let newEndDate = endDate.subtract(1, "d").format();
      let isSame = moment(newStartDate).isSame(newEndDate);
      if (isSame) {
        console.log("=======单击日期", newStartDate);
      } else {
        console.log("=======选择日期范围", newStartDate, newEndDate);
      }
    },
    eventClick(calEvent, jsEvent, view, event) {
      console.log(calEvent.loadUrl);
      this.eventTitle = calEvent.title;
      this.eventUrl = calEvent.loadUrl;
      this.$root.setUrl(this.eventUrl);
      // this.isShowEvent = true
      // let eventEl = jsEvent.currentTarget
      // eventEl.setAttribute("data-popover",jsEvent.timeStamp)
      // this.$popover(jsEvent,{
      // 	isUpDown: false,
      // 	component:eventComponent,
      // 	data: {
      // 		url:calEvent.loadUrl
      // 	}
      // })
    },
    changeModelVisible(value) {
      this.isShowEvent = value;
    },
    loadCalendar() {
      let config = this.defaultConfig();
      this.calendar.fullCalendar(config);
      this.changeTitle();
    },
    defaultConfig() {
      return {
        header: false,
        height: this.calendar_height,
        contentHeight: "auto",
        aspectRatio: 1.2,

        allDayText: "全天",
        slotLabelFormat: "H:mm",
        slotDuration: "00:30:00",

        currentText: "今天",
        monthNames: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "7月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ],
        monthNamesShort: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "7月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ],
        dayNames: [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
        weekHeader: "周",
        firstDay: 0,
        isRTL: !1,
        showMonthAfterYear: !0,
        yearSuffix: "年",

        views: {
          month: {
            titleFormat: "YYYY年MM月"
          },
          week: {
            titleFormat: "YYYY年MM月DD日"
          },
          day: {
            titleFormat: "YYYY年MM月DD日"
          }
        },
        selectable: true,
        selectHelper: true,
        editable: true,
        select: this.selectCalendar,
        eventClick: this.eventClick,
        events: this.loadEventList,
        eventLimit: 3,
        dayPopoverFormat: "MM月DD日 dddd",
        eventLimitText: function(num) {
          return "更多任务 +" + num;
        }
      };
    }
  }
};
</script>
<style>
.calendar-view {
  background: #fff;
  margin-top: 50px;
}
.calendar-title .prev,
.calendar-title .next {
  display: inline-block;
  padding: 0 10px;
  color: #ccc;
}
.calendar-title .prev:hover,
.calendar-title .next:hover {
  color: #333;
}

.fc-widget-header {
  border-bottom: 1px solid #f3f3f3 !important;
}
.fc-widget-header span {
  font-size: 14px;
}
.fc .fc-day-header {
  border: none;
  line-height: 40px;
  background-color: #fff;
}
.fc-event {
  padding: 2px 8px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 3px;
  box-shadow: 2px 2px 6px #e2e2e2;
  background: #8cabf3;
  border-color: #8cabf3;
}
.fc-h-event {
  border-radius: 20px;
}
.fc-v-event {
  border-radius: 7px;
}

.fc-ltr .fc-time-grid .fc-event-container {
  margin-right: 1px;
}

.fc td,
.fc th {
  border-style: none;
}

.fc td.fc-day {
  border: 1px solid #f3f3f3;
}

.fc-today {
  background-color: transparent;
}
.fc-unthemed td.fc-today {
  background-color: transparent;
}

.fc-day-number {
  font-family: "Verdana";
  font-size: 12px;
  font-weight: 500;
  color: #676767;
  padding: 5px !important;
  margin: 3px;
}
.fc-today .fc-day-number {
  background-color: #6789ed;
  color: #fff;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  text-align: center;
}
.fc-ltr .fc-axis {
  width: 70px !important;
  padding-right: 10px;
  background-color: #fff;
}

.fc td.fc-sat,
.fc td.fc-sun {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOUlEQVQYlX3NMQ4AIAgEwZVE/v9eLLAzYk5oZ3OMzEzERSwArEMZ3Og+a/BiWVB4gh8CWIflhUKADV79GPs3srweAAAAAElFTkSuQmCC");
}

a.fc-more {
  display: inline-block;
  text-align: right;
  width: 94%;
}

.fc-popover {
  box-shadow: 0 7px 21px rgba(0, 0, 0, 0.1);
  border: none !important;
}
.fc-popover .fc-header {
  background-color: #fff !important;
  text-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
}
.fc-ltr .fc-popover .fc-header .fc-title {
  float: none;
  margin: 4px auto;
}
.fc-popover .fc-event {
  margin: 3px auto 5px;
}
</style>
