<template>
  <div class="trace-list-item-content">
    <div class="item-top">
      <div class="item-serial-number">
        <h4>{{ (page.currentPage - 1) * page.pageSize + serialNumberOffset + 1 }}</h4>
      </div>
      <div class="item-detail">
        <h4 class="item-monitor-name">{{ groupName }}</h4>
        <h4 class="item-trace-time">{{ traceTime | filterTime }}</h4>
        <h4 class="item-trace-duration">{{ `持续约 ${traceDuration} s` }}</h4>
        <el-button icon="el-icon-video-play" size="mini" type="primary" @click="handleReplay">回放</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'TraceListItem',
  data() {
    return {
      page: {
        currentPage: 0,
        pageSize: 0,
      }
    }
  },
  props: {
    list: {},
    traceTime: {
      type: String,
      default: '未知的时间'
    },
    traceDuration: {
      type: Number,
      default: 0
    },
    groupName: {
      type: String,
      default: '未知报警组'
    },
    location: {
      type: String,
      default: '未知位置'
    },
    serialNumberOffset: {
      type: Number
    }
  },
  computed: {
    ...mapGetters('traceReplay', {
      pagination: 'getPagination',
      monitorListMap: 'monitorListMap',
      getTrailPointsInfo: 'getTrailPointsInfo'
    })
  },
  watch: {
    pagination() {
      this.page = this.pagination
    }
  },
  methods: {
    ...mapActions('traceReplay', {
      updateTrailPointsInfoByAction: 'updateTrailPointsInfoByAction'
    }),
    ...mapMutations('traceReplay', {
      updateTrailPointsInfo: 'updateTrailPointsInfo'
    }),
    filterTime(timeWithT) {
      return timeWithT.replace(/T/, ' ')
    },
    async handleReplay() {
      this.updateTrailPointsInfo([])
      let param = {}
      param.startTime = this.filterTime(this.list.traceTime)
      let rawdate = this.stringToDate(param.startTime);
      let addSecond = this.list.traceDuration;
      let resDate = new Date(rawdate.setSeconds(rawdate.getSeconds() + addSecond));
      let res = this.format(resDate, "yyyy-MM-dd hh:mm:ss")
      param.endTime = res
      param.groupId = this.list.groupId
      await this.updateTrailPointsInfoByAction(param)
    },
    // 字符串转日期Date
    stringToDate(strDate) {
      let tempStrs = strDate.split(" ");
      let dateStrs = tempStrs[0].split("-");
      let year = parseInt(dateStrs[0], 10);
      let month = parseInt(dateStrs[1], 10) - 1;
      let day = parseInt(dateStrs[2], 10);
      let timeStrs = tempStrs[1].split(":");
      let hour = parseInt(timeStrs [0], 10);
      let minute = parseInt(timeStrs[1], 10);
      let second = parseInt(timeStrs[2], 10);
      let date = new Date(year, month, day, hour, minute, second);
      return date;
    },
    // 日期Date格式化为字符串
    format(date, fmt) {
      let o = {
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
      for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
            (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  },
  filters: {
    filterTime(timeWithT) {
      return timeWithT.replace(/T/, ' ')
    }
  }
}
</script>

<style scoped>
/deep/ .el-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.item-bottom .el-icon-location-information::before {
  font-size: 1rem;
  color: #1e9fff;
}
</style>
<style lang="scss" scoped>
.trace-list-item-content {
  height: 90%;
  background-color: #fff;
  box-shadow: 2px 2px 2px #dcdcdc;

  .item-top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80%;

    .item-serial-number {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30%;
      height: 80%;

      h4 {
        background-image: linear-gradient(135deg, deeppink, dodgerblue);
        font-size: 2rem;
        font-weight: bold;
        background-clip: text;
        box-decoration-break: clone;
        color: transparent;
      }
    }

    .item-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 60%;
      height: 100%;

      .item-monitor-name {
        font-weight: 400;
        font-size: 1.2rem;
        letter-spacing: 0.1rem;
      }

      .item-trace-time, .item-trace-duration {
        font-weight: 700;
        font-size: 0.8rem;
        letter-spacing: 0.1rem;
        color: #cfcfcf;
      }
    }
  }

  .item-bottom {
    display: flex;
    align-items: center;
    height: 20%;
    padding: 0 15px;
    border-top: 1px solid #dcdcdc;

    .item-monitor-location {
      margin-left: 1rem;
      font-weight: 400;
      font-size: 0.9rem;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
