<template>
  <div id="trace-date-time-picker">
    <div class="trace-date-time-picker-top">
      <trace-statistics/>
    </div>
    <div class="trace-date-time-picker-bottom">
      <el-form
        ref="dateTimePickerForm"
        :model="dateTimePickerForm"
        class="date-time-picker-form"
      >
        <el-form-item prop="selectedDate">
          <el-date-picker
            v-model="dateTimePickerForm.selectedDate"
            required
            :picker-options="pickerOptions"
            :rules="dateTimePickerFormRules"
            align="right"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item prop="groupId">
          <el-select
            v-model="dateTimePickerForm.groupId"
            clearable
            placeholder="请选择哨兵组信息"
          >
            <el-option
              v-for="item in monitorList"
              :key="item.monitorId"
              :label="item.monitorName"
              :value="item.monitorId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="submit-button-wrapper">
        <button @click="queryTrack">轨迹查询</button>
      </div>
    </div>
  </div>
</template>

<script>
import TraceStatistics from '../echarts/TraceStatistics'
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'TraceDateTimePicker',
  components: {TraceStatistics},
  data() {
    return {
      dateTimePickerForm: {
        selectedDate: [],
        groupId: null
      },
      options: []
    }
  },
  computed: {
    ...mapGetters('traceReplay', {
      monitorList: 'monitorList',
      startTimeAndEndTime: 'getStartTimeAndEndTime',
      floorlevel: 'getFloor'
    }),
    dateTimePickerFormRules() {
      return {
        selectedDate: [
          {
            type: 'datetimerange',
            required: true,
            message: '请填写时间范围',
            trigger: 'change'
          }
        ]
      }
    },
    pickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '24小时内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '48小时内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '72小时内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations('traceReplay', {
      updateStartTimeAndEndTime: 'updateStartTimeAndEndTime',
      setGroupId: 'SET_GROUP_ID',
      setmonitorlist: 'SET_MONITOR_LIST'
    }),
    ...mapActions('traceReplay', {
      getMonitorList: 'getGroupMonitorListByActions',
      getTrailPoints: 'getTrailPointsByActions',
      getTrailOneWeek: 'getTrailOneWeekByActions',
      setFloor: 'setFloor'
    }),
    monitorListOptions() {
      const options = this.monitorList.map((item) => item)
      console.log(options, 111111)
      if (options.length !== 0) this.dateTimePickerForm.groupId = options[0].monitorId
      else this.dateTimePickerForm.groupId = null
      this.setGroupId(this.dateTimePickerForm.groupId)
      // return options
    },
    queryTrack() {
      this.$refs.dateTimePickerForm.validate((valid) => {
        if (valid) {
          this.getTrailPoints({
            currentPage: 0,
            pageSize: 7,
            groupId: this.dateTimePickerForm.groupId,
            startTime: this.dateTimePickerForm.selectedDate[0],
            endTime: this.dateTimePickerForm.selectedDate[1]
          }).then(() => {
            this.$emit('closeDateTimePicker')
          })
        } else {
          this.$message.error('请填写时间范围')
        }
      })
    }
  },
  watch: {
    // 存入VueX中 方便List访问
    dateTimePickerForm: {
      deep: true,
      handler() {
        this.updateStartTimeAndEndTime({
          startTime: this.dateTimePickerForm.selectedDate[0],
          endTime: this.dateTimePickerForm.selectedDate[1]
        })
        this.setGroupId(this.dateTimePickerForm.groupId)
      }
    },
    groupId() {
      this.setGroupId(this.dateTimePickerForm.groupId)
    },
    monitorList() {
      this.monitorListOptions()
    },
    floorlevel() {
      console.log(this.floorlevel, 'Louceng111')
      this.getMonitorList(this.floorlevel)
      let level = null
      switch (this.floorlevel) {
        case '24F':
          level = 24
          break
        case '25F':
          level = 25
          break
        case '26F':
          level = 26
          break
      }
      if (level != null) {
        console.log(level, 'date')
        this.getTrailOneWeek(level)
      } else {
        console.log('直接请求')
        this.getTrailOneWeek()
      }
    }
  },
  created() {
    // 从VueX中拿到上次查询的时间
    // if (this.startTimeAndEndTime !== null) {
    //   this.dateTimePickerForm.selectedDate[0] = this.startTimeAndEndTime.startTime
    //   this.dateTimePickerForm.selectedDate[1] = this.startTimeAndEndTime.endTime
    // }
    // 获取哨兵组列表
    this.getMonitorList()
    console.log(this.floorlevel, 'create')
    this.getTrailOneWeek()
  },
  destroyed() {
    this.setmonitorlist([])
    this.setFloor('全部楼层显示')
  }
}
</script>

<style scoped>
.trace-date-time-picker-bottom /deep/ .el-date-editor {
  background: rgba(0, 255, 255, 0.3);
}

.trace-date-time-picker-bottom /deep/ .el-range-editor.el-input__inner {
  justify-content: center;
}

.trace-date-time-picker-bottom /deep/ .el-date-editor .el-range-input {
  background: transparent;
  color: #fff;
}

.trace-date-time-picker-bottom /deep/ .el-date-editor .el-range-separator {
  color: #fff;
}

.trace-date-time-picker-bottom /deep/ .el-input__inner {
  background: transparent;
  color: #fff;
}
</style>
<style lang="scss" scoped>
#trace-date-time-picker {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;

  .trace-date-time-picker-top {
    position: relative;
    width: 90%;
    height: 50%;
    box-shadow: 0 0 20px #19ba8b2b;
    outline: 1px solid #19ba8b2b;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 10px;
      height: 10px;
      border-top: 2px solid #46bee9;
      border-left: 2px solid #46bee9;
    }

    &::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      border-right: 2px solid #46bee9;
      border-bottom: 2px solid #46bee9;
    }
  }

  .trace-date-time-picker-bottom {
    position: relative;
    width: 90%;
    height: 40%;
    box-shadow: 0 0 20px #19ba8b2b;
    outline: 1px solid #19ba8b2b;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 10px;
      height: 10px;
      border-top: 2px solid #46bee9;
      border-left: 2px solid #46bee9;
    }

    &::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      border-right: 2px solid #46bee9;
      border-bottom: 2px solid #46bee9;
    }

    .date-time-picker-form {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 50%;
    }

    .submit-button-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 50%;

      button {
        width: 60%;
        height: 40%;
        border: none;
        background-color: rgba(0, 255, 255, 0.3);
        font-weight: 600;
        font-size: 1.2rem;
        color: #ffa500;
        cursor: pointer;
        border-radius: 30px;
      }
    }
  }
}
</style>
