<template>
  <div class="alarm-page-wrapper">
    <div class="alarm-page-content">
      <section class="alarm-page-search-box">
        <div class="search-box-content">
          <div class="search-box-title">请选择位置</div>
          <el-select v-model="searchBoxValue.checkedMonitorId" filterable placeholder="请选择">
            <el-option
              v-for="item in monitorListOptions"
              :key="item.monitorId"
              :label="item.monitorName"
              :value="item.monitorId"
            />
          </el-select>
        </div>
        <div class="search-box-content">
          <div class="search-box-title">请选择时间范围</div>
          <el-date-picker
            v-model="searchBoxValue.selectedDate"
            :picker-options="pickerOptions"
            align="right"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </div>
      </section>
      <main class="alarm-list-wrapper">
        <alarm-list
          :checked-monitor-id="searchBoxValue.checkedMonitorId"
          :selected-date="searchBoxValue.selectedDate"
        />
      </main>
    </div>
    <div class="alarm-background">
      <celestial-background/>
    </div>
  </div>
</template>

<script>

import CelestialBackground from '@/components/celestial-background/CelestialBackground'
import AlarmList from '@/views/alarm/components/AlarmList'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'AlarmIndex',
  components: {AlarmList, CelestialBackground},
  data() {
    return {
      searchBoxValue: {
        checkedMonitorId: 0,
        selectedDate: []
      }
    }
  },
  mounted() {
    this.initInfo()
  },
  computed: {
    ...mapGetters('alarm', [
      'monitorList'
    ]),
    monitorListOptions() {
      const options = this.monitorList.map(item => item)
      options.unshift({monitorId: 0, monitorName: '不限'})
      return options
    },
    pickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '24小时内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '48小时内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '72小时内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    ...mapActions('alarm', {
      getMonitorList: 'getMonitorListByActions',
      getAlarmList: 'getAlarmListByActions'
    }),
    initInfo() {
      this.getMonitorList()
      this.getAlarmList({
        curPage: 0,
        pageSize: 8,
        status: 'unread',
        groupId: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-page-wrapper {
  position: relative;
  height: 100%;

  .alarm-page-content {
    width: 95%;
    height: 100%;
    margin: 0 auto;

    .alarm-page-search-box {
      display: flex;
      // justify-content: space-around;
      align-items: center;
      height: 15%;
      color: #fff;

      .search-box-content {
        display: inline-flex;

        .search-box-title {
          width: 150px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(0, 255, 255, .5);
          text-align: center;
        }
      }
    }

    .alarm-list-wrapper {
      height: 85%;
    }
  }

  .alarm-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -200;
  }
}
</style>
