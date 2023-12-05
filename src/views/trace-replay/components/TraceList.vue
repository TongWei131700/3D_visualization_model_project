<template>
  <div id="trace-list">
    <header class="trace-list-header">
      <i class="el-icon-arrow-left return-key" @click="returnToDateTimePicker"/>
      <h4 class="list-title">轨迹列表</h4>
    </header>
    <div class="trace-list-item-wrapper">
      <ul v-if="page.total!== 0" class="trace-list-content">
        <li
          v-for="(item,index) in trailPoints.records"
          :key="item.tid"
          class="trace-list-item"
        >
          <trace-list-item
            :group-name="monitorListMap.get(item.groupId)"
            :list="item"
            :location="item.location"
            :serial-number-offset="index"
            :trace-duration="Math.abs(item.traceDuration)"
            :trace-time="item.traceTime"
          />
        </li>
      </ul>
      <div v-else class="no-item-wrapper">
        <trace-no-item/>
      </div>
    </div>
    <div class="trace-list-pagination">
      <el-pagination
        v-show="page.total !== 0"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :pager-count="5"
        :total="page.total"
        layout="prev, pager, next, jumper"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import TraceListItem from './TraceListItem'
import {mapActions, mapGetters} from 'vuex'
import TraceNoItem from './TraceNoItem'

export default {
  name: 'TraceList',
  components: {TraceNoItem, TraceListItem},
  data() {
    return {
      page: {
        total: 0,
        currentPage: 0,
        pageSize: 1
      }
    }
  },
  mounted() {
    console.log(this.pagination, 4444444)
  },
  computed: {
    ...mapGetters('traceReplay', {
      monitorListMap: 'monitorListMap',
      trailPoints: 'getTrailPointsData',
      pagination: 'getPagination',
      startTimeAndEndTime: 'getStartTimeAndEndTime',
      groupId: 'groupId'
    }),
    ...mapGetters('traceReplay', {
      Floor: 'getFloor'
    })
  },
  watch: {
    pagination() {
      this.page = this.pagination
    },
    Floor() {
      console.log(this.Floor, '+++++++++++')
      // this.getMonitorList(this.Floor)
      this.getMonitorList()
      // let level = null;
      // switch (this.Floor) {
      //   case "24F":
      //     level = 24;
      //     break;
      //   case "25F":
      //     level = 25;
      //     break;
      //   case "26F":
      //     level = 26;
      //     break;
      // }
      // if (level != null) {
      //   console.log(level,"ssss");
      //   this.getTrailOneWeek(level);
      // } else this.getTrailOneWeek();
      this.returnToDateTimePicker()
    }
  },
  methods: {
    ...mapActions('traceReplay', {
      getTrailPoint: 'getTrailPointsByActions',
      getMonitorList: 'getGroupMonitorListByActions'
      // getTrailOneWeek: "getTrailOneWeekByActions",
    }),
    returnToDateTimePicker() {
      this.$emit('openDateTimePicker')
    },
    changePage(curPage) {
      this.getTrailPoint({
        currentPage: curPage - 1,
        pageSize: 7,
        groupId: this.groupId,
        startTime: this.startTimeAndEndTime.startTime,
        endTime: this.startTimeAndEndTime.endTime
      })
    }
  }
}
</script>

<style scoped>
.trace-list-header /deep/ .el-icon-arrow-left:before {
  display: block;
  height: 100%;
  width: 100%;
  margin: 5px;
  font-size: 40px;
}

.trace-list-pagination .el-pagination {
  text-align: center;
}
</style>
<style lang="scss" scoped>
#trace-list {
  width: 100%;
  height: 100%;

  .trace-list-header {
    position: relative;
    height: 50px;
    font-weight: 400;
    font-size: 24px;
    color: #fff;
    background-color: #6398f8;

    .return-key {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 50px;
      height: 50px;
    }

    .list-title {
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
  }

  .trace-list-item-wrapper {
    height: calc(100% - 100px);
    background-color: #f2f2f2;

    .trace-list-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;

      .trace-list-item {
        height: 25%;
      }
    }

    .no-item-wrapper {
      height: 100%;
    }
  }

  .trace-list-pagination {
    height: 50px;
    background-color: #f2f2f2;
  }
}
</style>
