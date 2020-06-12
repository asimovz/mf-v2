<template>
  <div style="display:inline">
    <el-date-picker
      v-model="selectDate"
      type="daterange"
      :picker-options="options"
      :placement="placement"
      :format="format"
      range-separator=""
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="changeDate"
      :size="currentSize"
      >
      </el-date-picker>
      <input type="hidden" :name="startDateName" :value="startDateTime">
      <input type="hidden" :name="endDateName" :value="endDateTime">
  </div>

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
      type: String
    }
  },
  computed: {
    currentSize() {
      if(this.size && this.size != "") {
        return this.size == "small" ? "mini" : this.size
      } else {
        return "small"
      }
    }
  },
  data() {
    return {
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      selectDate:[this.startDate,this.endDate],
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
  methods: {
    clear() {
      this.selectDate = []
    },
    changeDate(data){
      let newVal
      if(data) {
        this.startDateTime = new Date(data[0]).Format(this.format)
        this.endDateTime = new Date(data[1]).Format(this.format)
        newVal = [this.startDateTime,this.endDateTime]
      } else {
        newVal = []
      }
      this.$emit("on-ok",newVal)
      this.$emit("input",newVal)
      this.$emit("on-change",newVal)
    },
    setChangeDate (obj, result) {
      obj.$emit('pick', result, false)
      this.startDateTime = new Date(result[0]).Format(this.format)
      this.endDateTime = new Date(result[1]).Format(this.format)
    },
    getCurrentDate (date, type, num) {
      let sDate, eDate
      sDate = new Date()
      eDate = new Date()
      // if(!date){
      //   sDate = new Date()
      //   eDate = new Date()
      // }else{
      //   sDate = new Date(date.toString())
      //   eDate = new Date(date.toString())
      // }
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
<style lang="less">
.el-range-editor--mini.el-input__inner {
  height: 24px;
  line-height: 24px;
  padding: 0 0 0 6px;
}
.el-date-editor--daterange {
  width: 100% !important;
  
}
</style>