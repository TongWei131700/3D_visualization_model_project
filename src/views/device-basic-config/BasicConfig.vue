<template>
  <div class="basic-config-wrapper hidden-scroll">
    <div class="basic-config-content">
      <header class="basic-config-tab">
        <avue-tabs :option="basicConfigTabOption"/>
      </header>

      <section class="tag-legend">
        <span class="tag-legend-title">
          <span>标签图例</span>
          <i class="el-icon-picture-outline-round"/>
        </span>
        <span class="tag-legend-body">
          <el-tag class="tag-margin-left info-tag" effect="plain">普通信息</el-tag>
          <el-tag class="tag-margin-left radar-tag" effect="plain">雷达信息</el-tag>
          <el-tag class="tag-margin-left camera-tag" effect="plain">摄像头信息</el-tag>
          <el-tag class="tag-margin-left sensor-tag" effect="plain">传感器信息</el-tag>
        </span>
      </section>
      <main class="basic-config-info">
        <div class="info-body">
          <el-tabs type="border-card">
            <el-tab-pane label="绑定组">
              <monitor-group-table :search-box-value="searchBoxValue"/>
            </el-tab-pane>
            <el-tab-pane label="雷达">
              <radar-table :search-box-value="searchBoxValue"/>
            </el-tab-pane>
            <el-tab-pane label="摄像头">
              <camera-table :search-box-value="searchBoxValue"/>
            </el-tab-pane>
            <el-tab-pane label="传感器">
              <sensor-table :search-box-value="searchBoxValue"/>
            </el-tab-pane>

          </el-tabs>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import MonitorGroupTable from '@/views/device-basic-config/MonitorGroup/MonitorGroupTable'
import RadarTable from '@/views/device-basic-config/radar/RadarTable'
import CameraTable from '@/views/device-basic-config/camera/CameraTable'
import SensorTable from '@/views/device-basic-config/sensor/SensorTable'

export default {
  name: 'BasicConfig',
  components: {
    MonitorGroupTable,
    RadarTable,
    CameraTable,
    SensorTable
  },
  data() {
    return {
      searchBoxValue: '0'
    }
  },
  created() {
    this.initBasicConfigInfo()
  },
  computed: {
    ...mapGetters('BasicConfig', {
      monitorInfo: 'getmonitorInfo',
      radarInfo: 'getradarInfo',
      cameraInfo: 'getcameraInfo'
    }),
    // 页面头部Tab标签配置选项
    basicConfigTabOption() {
      return {
        column: [{
          label: '设备基本信息预览'
        }]
      }
    }

  },
  methods: {
    ...mapActions('BasicConfig', {
      getmonitorInfo: 'getAllMonitorGroupIdNameByActions',
      getradarInfo: 'getAllRadarByActions',
      getcameraInfo: 'getAllCameraByActions'
    }),
    async initBasicConfigInfo() {
      await this.getmonitorInfo()
      await this.getradarInfo()
      await this.getcameraInfo()
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-config-wrapper {
  height: 100%;
  background-color: #fff;

  .basic-config-content {
    width: 95%;
    margin: 0 auto;

    .basic-config-tab {
      font-size: 1.2rem;
    }

    .basic-config-search-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .search-box-title {
        width: 150px;
        height: 40px;
        line-height: 40px;
        background-color: rgba(222, 225, 230, .9);
        text-align: center;
      }
    }

    .tag-legend {
      height: 60px;
      padding: 15px;
      margin-top: 20px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .tag-legend-title {
        font-size: 16px;

        .el-icon-picture-outline-round {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .tag-legend-body {
        .tag-margin-left {
          margin-left: 30px;
        }
      }
    }

    .basic-config-info {
      margin-top: 20px;
      padding: 20px 15px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .info-title {
        font-size: 16px;

        .el-icon-info {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .info-body {
        padding: 20px 10px;
      }
    }
  }
}
</style>

<style scoped>
.basic-config-wrapper {
  --infoTagFontColor: #909399;
  --radarTagFontColor: #FF8C00;
  --ptzTagFontColor: #32CD32;
  --boltTagFontColor: #9370DB;
}

/deep/ .info-tag {
  border-color: var(--infoTagFontColor);
  color: var(--infoTagFontColor);
}

/deep/ .radar-tag {
  border-color: var(--radarTagFontColor);
  color: var(--radarTagFontColor);
}

/deep/ .camera-tag {
  border-color: var(--boltTagFontColor);
  color: var(--boltTagFontColor);
}
/deep/ .sensor-tag {
  /* border-color: var(--boltTagFontColor);
  color: var(--boltTagFontColor); */
}

</style>
