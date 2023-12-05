<template>
  <section id="sensor-Table">
    <avue-crud :data="sensorData" :option="sensorOption" :row-style="monitorGroupRowStyle">
      <template slot="sensorSn" slot-scope="scope">
        <el-tag class="sensor-tag" effect="plain">
          {{ scope.row.sensorSn }}
        </el-tag>
      </template>
      <template slot="sensorName" slot-scope="scope">
        <el-tag class="sensor-tag" effect="plain">
          {{ scope.row.sensorName }}
        </el-tag>
      </template>
      <template slot="sensorOnline" slot-scope="scope">
        <span v-if="scope.row.sensorOnline === '1'">{{ '在线' }}</span>
        <span v-else-if="scope.row.sensorOnline === '0'">{{ '离线' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="sensorOnOff" slot-scope="scope">
        <span v-if="scope.row.sensorOnOff === '1'">{{ '开启' }}</span>
        <span v-else-if="scope.row.sensorOnOff === '0'">{{ '关闭' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="sensorId" slot-scope="scope">
        <span v-if="scope.row.sensorId === null">{{ '暂未配置摄像头IP' }}</span>
        <span v-else>{{ scope.row.sensorId }}</span>
      </template>

      <template slot="menu" slot-scope="scope">
        <el-button icon="el-icon-edit" round size="small" type="primary" @click="handleEditBolt(scope.row)">编辑
        </el-button>
        <!-- <el-button type="primary" icon="el-icon-s-tools" size="small" round
          @click="handleConfigRuleMonitor(scope.row)">绑定雷达</el-button> -->
        <el-button icon="el-icon-delete" round size="small" type="primary" @click="handleDeleteSensor(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
    <sensor-edit-dialog v-if="isEditDialogOpen" :editing-info="editingBoltInfo" :is-open-edit-dialog="isEditDialogOpen"
      @closeDialog="isEditDialogOpen = false" @getSensorInfo="getSensorInfo"/>

  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SensorEditDialog from '@/views/device-basic-config/sensor/SensorTableEdit'
import { getAllSensor, deleteSensor } from '@/api/device/BasicConfig'

export default {
  name: 'SensorTable',
  components: { SensorEditDialog },
  props: {
    searchBoxValue: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      sensorData:[],
      editingBoltInfo: {},
      isEditDialogOpen: false,
      isConfigRuleDialogOpen: false,
    }
  },
  computed: {
    // ...mapGetters('BasicConfig', {
    //   sensorInfo: 'getSensorInfo'

    // }),
    // sensorData() {
    //   const sensor = []
    //   // this.sensorInfo.forEach((item) => {
    //   //   sensor.push(item)
    //   // })
    //   getAllSensor().then(res => {
    //     console.log(res);
    //     res.data.forEach((item) => {
    //       sensor.push(item)
    //     })
    //   })
    //   return sensor
    // },
    sensorOption() {
      return {
        align: 'center',
        border: true,
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        header: false,
        // menuWidth: "500",
        column: [
          {
            label: '传感器所属绑定组名',
            prop: 'groupName'
          },
          {
            label: '传感器设备号',
            prop: 'sensorSn'
          },
          {
            label: '传感器名称',
            prop: 'sensorName'
          },
          // {
          //   label: '传感器高度',
          //   prop: 'sensorHigh'
          // },
          {
            label: '传感器启用状态',
            prop: 'sensorOnOff'
          },
          {
            label: '传感器在线状态',
            prop: 'sensorOnline'
          }
        ]
      }
    }
  },
  mounted() {
    this.getSensorInfo()
  },
  methods: {
    // ...mapActions('BasicConfig', {
    //   getSensorInfo: 'getAllSensorByActions'
    // }),
    // 表格行颜色控制
    getSensorInfo() {
      getAllSensor().then(res => {
        console.log("aaa",res);
        this.sensorData = res.data
      })
    },
    monitorGroupRowStyle({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: 'rgba(127,255,170, .1)'
        }
      }
      return {
        backgroundColor: 'rgba(127,255,170, .17)'
      }
    },
    handleEditBolt(caremaRowData) {
      console.log(caremaRowData)
      this.editingBoltInfo = {
        groupId: caremaRowData.groupId,
        sensorId: caremaRowData.sensorId,
        groupName: caremaRowData.groupName,
        sensorSn: caremaRowData.sensorSn,
        sensorIp: caremaRowData.sensorIp,
        sensorName: caremaRowData.sensorName,
        sensorHigh: caremaRowData.sensorHigh,
        sensorOnline: caremaRowData.sensorOnline,
        sensorOnOff: caremaRowData.sensorOnOff
      }
      this.isEditDialogOpen = true
    },
    // handleConfigRuleMonitor(sensorRowData) {

    //   console.log("sensorRowData");
    //   console.log(sensorRowData);
    //   this.isConfigRuleDialogOpen = true;

    // },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDeleteSensor(SensorRowData) {
      const requestBody = SensorRowData.sensorSn
      this.openDelConfirm().then(() => {
        deleteSensor(requestBody).then(() => {
          this.$message({
            duration: 1000,
            type: 'success',
            message: '删除摄像机成功'
          })
          this.getSensorInfo()
        }).catch(() => {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '删除摄像机失败'
          })
        })
      })
    }
  }
}
</script>

<style scoped></style>
