<template>
    <DatePicker
      ref="daterange"
      type="datetimerange" 
      placement="bottom-end" 
      placeholder="请选择日期" 
      style="width: 100%"
      :size="size" 
      :value="selectDate" 
      :format="format" 
      :transfer="true" 
      :clearable="true" 
      :confirm="true" 
      :editable="false" 
      @on-change="changeDate"
      @on-ok="ok"
      @on-clear="clear"
      />
</template>
<script>
Date.prototype.Format = function(fmt) {           
  var o = {           
  "M+" : this.getMonth()+1, //月份           
  "d+" : this.getDate(), //日           
  "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
  "H+" : this.getHours(), //小时           
  "m+" : this.getMinutes(), //分           
  "s+" : this.getSeconds(), //秒           
  "q+" : Math.floor((this.getMonth()+3)/3), //季度           
  "S" : this.getMilliseconds() //毫秒           
  };           
  var week = {           
  "0" : "/u65e5",           
  "1" : "/u4e00",           
  "2" : "/u4e8c",           
  "3" : "/u4e09",           
  "4" : "/u56db",           
  "5" : "/u4e94",           
  "6" : "/u516d"          
  };           
  if(/(y+)/.test(fmt)){           
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
  }           
  if(/(E+)/.test(fmt)){           
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
  }           
  for(var k in o){           
      if(new RegExp("("+ k +")").test(fmt)){           
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
      }           
  }           
  return fmt;           
}
export default {
  name: 'm-datePeriod',
  props: {
    startDateName: String,
    endDateName: String,
    startDate: String,
    endDate: String,
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },  
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      options: {
        shortcuts: [
          {
            text: '前一周',
            onClick: (picker) => {
                let date = this.getCurrentDate(picker.minDate, 'prev', 7)
                this.setChangeDate(picker, date)
            }
          },
          {
            text: '后一周',
            onClick: (picker) => {
                let date = this.getCurrentDate(picker.minDate, 'next', 7)
                this.setChangeDate(picker, date)
            }
          },
          {
            text: '前一月',
            onClick: (picker) => {
                let date = this.getCurrentDate(picker.minDate, 'prev', 30)
                this.setChangeDate(picker, date)
            }
          },
          {
            text: '后一月',
            onClick: (picker) => {
                let date = this.getCurrentDate(picker.minDate, 'next', 30)
                this.setChangeDate(picker, date)
            }
          },
        ]
      }
    }
  },
  computed: {
    selectDate() {
      return this.startDateTime == "" ? [] : [this.startDateTime,this.endDateTime]
    }
  },
  methods: {
    clear() {
      this.startDateTime = ""
      this.endDateTime = ""
      this.$emit("on-clear",this.selectDate)
    },
    ok() {
      this.$emit("on-ok",this.selectDate)
    },
    changeDate(data){
      if(data[0] != "") {
        this.startDateTime = new Date(data[0]).Format(this.format)
        this.endDateTime = new Date(data[1]).Format(this.format)
      } else {
        this.startDateTime = ""
        this.endDateTime = ""
      }      
      this.$emit("on-change",this.selectDate)
      this.$emit("input",this.selectDate)
    },
    setChangeDate (obj, result) {
      obj.$emit('on-pick', result, false)
      this.startDateTime = new Date(result[0]).Format(this.format)
      this.endDateTime = new Date(result[1]).Format(this.format)

    },
    getCurrentDate (date, type, num) {
      let sDate, eDate
      if(!date){
        sDate = new Date()
        eDate = new Date()
      }else{
        sDate = new Date(date.toString())
        eDate = new Date(date.toString())
      }
      if(type == "next"){
        eDate.setTime(eDate.getTime() + 3600 * 1000 * 24 * num)
      }else {
        sDate.setTime(sDate.getTime() - 3600 * 1000 * 24 * num)
      }
      return [sDate, eDate]
    }
  }
}

</script>
