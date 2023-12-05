<template>
  <div class="alarm-list-container">
    <header class="alarm-list-head">
      报警列表
    </header>
    <div class="alarm-list-content">
      <el-radio-group
        v-model="radioBoxOptions"
        class="alarm-list-radio-box"
        size="medium"
        @change="queryAlarmList(0)"
      >
        <el-radio border label="unread">未读报警</el-radio>
        <el-radio border label="read">已读报警</el-radio>
        <el-radio border label="both">所有报警</el-radio>
      </el-radio-group>
      <avue-crud
        :data="alarmList"
        :option="alarmListOption"
        :page="alarmPageConfig"
        class="alarm-list-table"
        @current-change="currentChange"
      >
        <template slot="groupId" slot-scope="scope">
          {{ monitorListMap.get(scope.row.groupId) }}
        </template>
        <template slot="alarmDealStatus" slot-scope="scope">
          <el-tag v-if="scope.row.alarmDealStatus === '0'" size="mini" type="danger">未读</el-tag>
          <el-tag v-else size="mini" type="success">已读</el-tag>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            round
            size="small"
            type="success"
            @click.native.stop="selectAlarmItem(scope.row)"
          >查看
          </el-button>
        </template>
      </avue-crud>
    </div>
    <alarm-details
      v-if="showAlarmDetail"
      :alarm-detail="alarmDetail"
      @closeDealDialog="closeDealDialog"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import AlarmDetails from '@/views/alarm/components/AlarmDetails'
import {stringToDate, format} from '@/utils/timeUtils.js'

export default {
  name: 'AlarmList',
  components: {AlarmDetails},
  props: {
    checkedMonitorId: {
      type: Number,
      default: 0
    },
    selectedDate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      /* 展示选项 */
      radioBoxOptions: 'unread',
      /* 是否弹窗显示报警详情 */
      showAlarmDetail: false,
      /* 弹窗显示报警详情 */
      alarmDetail: null
    }
  },
  computed: {
    ...mapGetters('alarm', ['monitorListMap', 'alarmList', 'alarmPageConfig']),
    alarmListOption() {
      return {
        size: 'small',
        align: 'center',
        menu: true,
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        header: false,
        border: true,
        column: [
          {
            label: '报警时间',
            prop: 'alarmTime'
          },
          {
            label: '报警地点',
            prop: 'alarmLocation'
          },
          {
            label: '报警组',
            prop: 'groupId'
          },
          {
            label: '报警内容',
            prop: 'alarmDescription'
          },
          {
            label: '已读/未读 状态',
            prop: 'alarmDealStatus'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations('traceReplay', {
      updateCheckWarningInfo: 'updateCheckWarningInfo'
    }),
    /* 映射vuex中请求报警列表的方法 */
    ...mapActions('alarm', {
      getAlarmList: 'getAlarmListByActions',
      readSomeMessages: 'readSomeMessagesByActions'
    }),
    /* 发送新的请求 获得报警列表 */
    queryAlarmList(currentPage) {
      const queryParams = {
        curPage: currentPage,
        pageSize: 8,
        status: this.radioBoxOptions,
        groupId: this.checkedMonitorId
      }
      if (this.selectedDate !== null && this.selectedDate.length !== 0) {
        Object.assign(queryParams, {
          startTime: this.selectedDate[0],
          endTime: this.selectedDate[1]
        })
      }
      this.getAlarmList(queryParams)
    },
    /* 点击对应页码请求报警列表 */
    currentChange(pageIndex) {
      this.queryAlarmList(pageIndex)
    },
    /* 点击查看报警信息详情（照片和录像） */
    selectAlarmItem(alarmDetail) {
      console.log("alarmDetail",alarmDetail);
      // this.alarmDetail = alarmDetail
      // this.showAlarmDetail = true
      if (alarmDetail.alarmDealStatus === '0') {
        this.readSomeMessages([alarmDetail.alarmId])
      }
      let warningInfo = {}
      let addSecond = 30; // 模拟30秒
      let rawdate = stringToDate(alarmDetail.alarmTime);
      let startDate = new Date(rawdate.setSeconds(rawdate.getSeconds() - addSecond));
      let startRes = format(startDate, "yyyy-MM-dd hh:mm:ss")
      warningInfo.startTime = startRes
      let endDate = new Date(rawdate.setSeconds(rawdate.getSeconds() + addSecond));
      let endRes = format(endDate, "yyyy-MM-dd hh:mm:ss")
      warningInfo.endTime = endRes
      warningInfo.groupId = alarmDetail.groupId
      warningInfo.alarmLocation = alarmDetail.groupName // 临时修改，将groupName代替原来的alarmLocation
      this.updateCheckWarningInfo(warningInfo)
      this.$router.push('/trace_replay')
    },
    /* 关闭处理对话框（子组件自定义事件） */
    closeDealDialog() {
      this.showAlarmDetail = false
    }
  },
  watch: {
    checkedMonitorId() {
      this.queryAlarmList(0)
    },
    selectedDate() {
      this.queryAlarmList(0)
    }
  },
  created() {
    if (this.$route.query.id !== undefined) {
      this.selectAlarmItem({alarmId: this.$route.query.id})
    }
  }
}
</script>

<style scoped>
.alarm-list-radio-box /deep/ .el-badge__content.is-fixed {
  right: 3rem;
}

/deep/ .el-radio.is-bordered.is-checked,
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #13ce66 !important;
}

/deep/ .el-radio__input.is-checked .el-radio__inner {
  background: #13ce66;
}

/deep/ .el-radio {
  color: #fff;
}

/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #13ce66 !important;
}

/deep/ .el-card,
/deep/ .el-card__body {
  height: 100%;
}

/deep/ .el-card__body .el-form {
  height: 85%;
}

/deep/ .el-card__body .el-form .el-table,
/deep/ .el-card__body .el-form .el-table .el-table__fixed-right {
  height: 100%;
}

/deep/ .el-table__body-wrapper,
/deep/ .el-table__fixed-right .el-table__fixed-body-wrapper {
  height: calc(100% - 36px);
}

/deep/ .el-table__body-wrapper table,
/deep/ .el-table__body-wrapper table tbody,
/deep/ .el-table__fixed-body-wrapper,
/deep/ .el-table__fixed-body-wrapper table,
/deep/ .el-table__fixed-body-wrapper table tbody {
  height: 100%;
}

/deep/ .el-table__body-wrapper table tbody tr,
/deep/ .el-table__fixed-body-wrapper table tbody tr {
  height: 12.5% !important;
}

/deep/ .el-table__fixed-body-wrapper table tbody tr td {
  border-bottom: none;
}

/deep/ .el-table__fixed-body-wrapper {
  top: 36px !important;
}

/deep/ .el-card,
/deep/ .el-table,
/deep/ .el-table tr,
/deep/ .el-table tr th,
/deep/ .avue-crud__pagination,
/deep/ .el-pager li,
/deep/ .el-pagination button {
  background-color: transparent;
  color: #fff;
}

/deep/ .el-table {
  border-radius: 12px;
}

/deep/ .el-table tr.hover-row td {
  background: rgba(228, 238, 118, 0.3);
}

/deep/ .el-pager li,
/deep/ .el-pagination button {
  border: 0.5px solid #fff;
}

/deep/ .el-table .cell {
  line-height: 1.2rem;
}

/deep/ .avue-crud table td {
  padding: 6px 0;
}

/deep/ .avue-crud__pagination {
  padding-top: 15px;
  padding-bottom: 10px;
  text-align: center;
}

</style>
<style lang="scss" scoped>
.alarm-list-container {
  padding: 15px;
  width: 100%;
  height: 100%;
  color: #fff;

  .alarm-list-head {
    height: 10%;
    background-image: url("~@/assets/images/alarm/page-title.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 1.5rem;
    text-align: center;
    text-shadow: 0 0 10px #ff0;
    letter-spacing: 1rem;
  }

  .alarm-list-content {
    display: flex;
    flex-direction: column;
    height: 90%;
    padding: 5px 10px 10px 15px;
    background-image: url('~@/assets/images/alarm/content.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .alarm-list-radio-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 15%;
    }

    .alarm-list-table {
      height: 85%;
    }
  }
}
</style>
