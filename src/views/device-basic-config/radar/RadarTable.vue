<template>
  <section id="radar-table">
    <avue-crud :data="radarData" :option="radarOption" :row-style="monitorGroupRowStyle">
      <template slot="radarSn" slot-scope="scope">
        <el-tag class="radar-tag" effect="plain">
          {{ scope.row.radarSn }}
        </el-tag>
      </template>
      <template slot="radarName" slot-scope="scope">
        <el-tag class="radar-tag" effect="plain">
          {{ scope.row.radarName }}
        </el-tag>
      </template>
      <template slot="radarOnOff" slot-scope="scope">
        <span v-if="scope.row.radarOnOff === '1'">{{ '开启' }}</span>
        <span v-else-if="scope.row.radarOnOff === '0'">{{ '关闭' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="radarOnline" slot-scope="scope">
        <span v-if="scope.row.radarOnline === '1'">{{ '在线' }}</span>
        <span v-else-if="scope.row.radarOnline === '0'">{{ '离线' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="radarIp" slot-scope="scope">
        <span v-if="scope.row.radarIp === null">{{ '暂未配置雷达IP' }}</span>
        <span v-else>{{ scope.row.radarIp }}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-dropdown>
          <el-button type="primary" icon="el-icon-edit" size="small" round>编辑
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleEditRadar(scope.row)">基本配置</el-dropdown-item>
            <el-dropdown-item @click.native="handleEditRadarParams(scope.row)">参数配置</el-dropdown-item>
            <el-dropdown-item @click.native="handleEditRadarOTA(scope.row)">OTA配置</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button v-if="scope.row.groupId !== 0" type="primary" icon="el-icon-s-tools" size="small" round
          @click="handleConfigRuleMonitor(scope.row)">配置规则</el-button> -->
        <el-button type="primary" icon="el-icon-edit" size="small" round @click="restart(scope.row)">重启
        </el-button>
        <el-button v-if="scope.row.groupId !== 0" type="primary" icon="el-icon-s-tools" size="small" round
          @click="handleSensorBindMonitor(scope.row)">绑定传感器</el-button>
        <el-button v-if="scope.row.groupId !== 0" type="primary" icon="el-icon-delete" size="small" round
          @click="handleDeleteRadar(scope.row)">删除</el-button>
      </template>
    </avue-crud>
    <radar-edit-dialog v-if="isEditDialogOpen" :editing-info="editingRadarInfo" :is-open-edit-dialog="isEditDialogOpen"
      @closeDialog="isEditDialogOpen = false" />
    <radar-params-edit-dialog v-if="isEditParamsDialogOpen" :editing-info="editingRadarParamsInfo"
      :is-open-edit-dialog="isEditParamsDialogOpen" @closeDialog="isEditParamsDialogOpen = false" />
    <radar-OTA-edit-dialog v-if="isEditOTADialogOpen" :editing-info="editingRadarOTAInfo"
      :is-open-edit-dialog="isEditOTADialogOpen" @closeDialog="isEditOTADialogOpen = false" />
    <!-- <radar-config-rule-dialog v-if="isConfigRuleDialogOpen" :editing-info="ConfigRuleInfo"
      :is-config-rule-dialog-open="isConfigRuleDialogOpen" @closeDialog="isConfigRuleDialogOpen = false" /> -->
    <Sensor-bind v-if="isSensorBindDialogOpen" :editing-info="SensorBindInfo"
      :is-sensor-bind-dialog-open="isSensorBindDialogOpen" @closeDialog="isSensorBindDialogOpen = false" />

  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RadarEditDialog from '@/views/device-basic-config/radar/RadarTableEdit'
import RadarParamsEditDialog from '@/views/device-basic-config/radar/RadarParamsEditDialog'
import RadarOTAEditDialog from '@/views/device-basic-config/radar/RadarOTAEditDialog'
import RadarConfigRuleDialog from '@/views/device-basic-config/radar/RadarConfigRule'
import SensorBind from '@/views/device-basic-config/radar/SensorBind'
import { deleteRadar, getSensorsListByRadarSn, restartRadar, getConfigByRadarSn, getOTAByRadarSn } from '@/api/device/BasicConfig'
import { getRulesByRadarSn } from '@/api/rule/RuleConfig'

export default {
  name: 'RadarTable',
  components: { RadarEditDialog, RadarParamsEditDialog, RadarOTAEditDialog, RadarConfigRuleDialog, SensorBind },
  props: {
    searchBoxValue: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ConfigRuleInfo: {},
      editingRadarInfo: {},
      editingRadarParamsInfo: {},
      editingRadarOTAInfo: {},
      isEditDialogOpen: false,
      isEditParamsDialogOpen: false,
      isEditOTADialogOpen: false,
      isConfigRuleDialogOpen: false,
      SensorBindInfo: {},
      isSensorBindDialogOpen: false,
    }
  },
  computed: {
    ...mapGetters('BasicConfig', {
      radarInfo: 'getradarInfo'
    }),
    radarData() {
      const radar = []
      this.radarInfo.forEach((item) => {
        radar.push(item)
      })
      return radar
    },
    radarOption() {
      return {
        align: 'center',
        border: true,
        menuAlign: 'center',
        menuWidth: "500",
        delBtn: false,
        editBtn: false,
        header: false,
        column: [
          {
            label: '雷达所属绑定组名',
            prop: 'groupName'
          },
          {
            label: '雷达IP',
            prop: 'radarIp'
          },
          {
            label: '雷达设备号',
            prop: 'radarSn'
          },
          {
            label: '雷达名称',
            prop: 'radarName'
          },
          {
            label: '雷达位置',
            prop: 'location'
          },
          // {
          //   label: '雷达高度',
          //   prop: 'radarHigh'
          // },
          {
            label: '雷达是否启用',
            prop: 'radarOnOff'
          },
          {
            label: '雷达在线状态',
            prop: 'radarOnline'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('BasicConfig', {
      getRadarInfo: 'getAllRadarByActions'
    }),
    // 表格行颜色控制
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
    restart(radarRowData) {
      const requestBody = radarRowData.radarSn
      restartRadar(requestBody).then(() => {
        this.$message({
          duration: 1000,
          type: 'success',
          message: '重启雷达成功'
        })
        this.getRadarInfo()
      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: '重启雷达失败'
        })
      })
    },
    handleEditRadar(radarRowData) {
      console.log(radarRowData)
      getRulesByRadarSn({ sn: radarRowData.radarSn }).then((res) => {
        if (res.code === 200) {
          console.log("成功获得已绑定并集规则");
          console.log(res.data);
          const ruleId = res.data.ruleId
          const RulesOnOff = res.data.onUse
          // this.ConfigRuleInfo = {
          //   groupId: radarRowData.groupId,
          //   radarId: radarRowData.radarId,
          //   groupName: radarRowData.groupName,
          //   radarSn: radarRowData.radarSn,
          //   radarName: radarRowData.radarName,
          //   ruleId: ruleId,
          //   RulesOnOff: RulesOnOff,
          // };
          this.editingRadarInfo = {
            groupId: radarRowData.groupId,
            radarId: radarRowData.radarId,
            groupName: radarRowData.groupName,
            radarIp: radarRowData.radarIp,
            radarSn: radarRowData.radarSn,
            radarName: radarRowData.radarName,
            location: radarRowData.location,
            // radarHigh: radarRowData.radarHigh,
            radarOnline: radarRowData.radarOnline,
            radarOnOff: radarRowData.radarOnOff,
            ruleId: ruleId,
            RulesOnOff: RulesOnOff,
          }
          this.isEditDialogOpen = true

          // this.isConfigRuleDialogOpen = true;
          // console.log(this.ConfigRuleInfo, this.isConfigRuleDialogOpen);
        }
      }).catch(() => {
        // this.ConfigRuleInfo = {
        //   groupId: radarRowData.groupId,
        //   radarId: radarRowData.radarId,
        //   groupName: radarRowData.groupName,
        //   radarSn: radarRowData.radarSn,
        //   radarName: radarRowData.radarName,
        // };
        this.editingRadarInfo = {
            groupId: radarRowData.groupId,
            radarId: radarRowData.radarId,
            groupName: radarRowData.groupName,
            radarIp: radarRowData.radarIp,
            radarSn: radarRowData.radarSn,
            radarName: radarRowData.radarName,
            location: radarRowData.location,
            // radarHigh: radarRowData.radarHigh,
            radarOnline: radarRowData.radarOnline,
            radarOnOff: radarRowData.radarOnOff,
          }
          this.isEditDialogOpen = true

        // this.isConfigRuleDialogOpen = true;
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取已绑定并集规则失败'
        })
        this.loading = false
      })
      // this.editingRadarInfo = {
      //   groupId: radarRowData.groupId,
      //   radarId: radarRowData.radarId,
      //   groupName: radarRowData.groupName,
      //   radarIp: radarRowData.radarIp,
      //   radarSn: radarRowData.radarSn,
      //   radarName: radarRowData.radarName,
      //   location: radarRowData.location,
      //   // radarHigh: radarRowData.radarHigh,
      //   radarOnline: radarRowData.radarOnline,
      //   radarOnOff: radarRowData.radarOnOff
      // }
      // this.isEditDialogOpen = true
    },
    handleEditRadarParams(radarRowData) {
      console.log(radarRowData)
      // this.editingRadarParamsInfo = {
      //   groupId: radarRowData.groupId,
      //   radarId: radarRowData.radarId,
      //   groupName: radarRowData.groupName,
      //   radarIp: radarRowData.radarIp,
      //   radarSn: radarRowData.radarSn,
      //   radarName: radarRowData.radarName,
      //   location: radarRowData.location,
      //   // radarHigh: radarRowData.radarHigh,
      //   radarOnline: radarRowData.radarOnline,
      //   radarOnOff: radarRowData.radarOnOff
      // }
      getConfigByRadarSn(radarRowData.radarSn).then(res => {
        if (res.code === 200) {
          console.log("成功获得雷达参数");
          console.log(res.data);
        }
        this.editingRadarParamsInfo = res.data
        this.isEditParamsDialogOpen = true
      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取雷达参数失败'
        })
        this.loading = false
      })
    },
    handleEditRadarOTA(radarRowData) {
      console.log(radarRowData)
      // this.editingRadarOTAInfo = {
      //   groupId: radarRowData.groupId,
      //   radarId: radarRowData.radarId,
      //   groupName: radarRowData.groupName,
      //   radarIp: radarRowData.radarIp,
      //   radarSn: radarRowData.radarSn,
      //   radarName: radarRowData.radarName,
      //   location: radarRowData.location,
      //   // radarHigh: radarRowData.radarHigh,
      //   radarOnline: radarRowData.radarOnline,
      //   radarOnOff: radarRowData.radarOnOff
      // }
      getOTAByRadarSn(radarRowData.radarSn).then(res => {
        if (res.code === 200) {
          console.log("成功获得雷达OTA参数");
          console.log(res.data);
        }
        this.editingRadarOTAInfo = res.data
        this.isEditOTADialogOpen = true
      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取雷达参数失败'
        })
        this.loading = false
      })
      // this.isEditOTADialogOpen = true
    },

    handleConfigRuleMonitor(radarRowData) {

      console.log("radarRowData");
      console.log(radarRowData);

      getRulesByRadarSn({ sn: radarRowData.radarSn }).then((res) => {
        if (res.code === 200) {
          console.log("成功获得已绑定并集规则");
          console.log(res.data);
          const ruleId = res.data.ruleId
          const RulesOnOff = res.data.onUse
          this.ConfigRuleInfo = {
            groupId: radarRowData.groupId,
            radarId: radarRowData.radarId,
            groupName: radarRowData.groupName,
            radarSn: radarRowData.radarSn,
            radarName: radarRowData.radarName,
            ruleId: ruleId,
            RulesOnOff: RulesOnOff,
          };
          this.isConfigRuleDialogOpen = true;
          console.log(this.ConfigRuleInfo, this.isConfigRuleDialogOpen);
        }
      }).catch(() => {
        this.ConfigRuleInfo = {
          groupId: radarRowData.groupId,
          radarId: radarRowData.radarId,
          groupName: radarRowData.groupName,
          radarSn: radarRowData.radarSn,
          radarName: radarRowData.radarName,
        };
        this.isConfigRuleDialogOpen = true;
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取已绑定并集规则失败'
        })
        this.loading = false
      })



    },
    handleSensorBindMonitor(radarRowData) {

      console.log("radarRowData");
      console.log(radarRowData);

      getSensorsListByRadarSn({ radarSn: radarRowData.radarSn }).then((res) => {
        console.log(res, "aaaaaaaaaaa");
        if (res.code === 200) {
          console.log("成功获得已绑定传感器");
          console.log(res.data);
          const sensorSn = []
          const sensorBind = []
          for (var item of res.data) {
            sensorSn.push(item.sensorSn)
            sensorBind.push(true)
          }
          console.log(sensorSn, "aaaaaaaaaaa");
          sensorSn.push("")
          sensorBind.push(false)
          // const sensorSn = res.data.sensorSn?res.data.sensorSn:""
          // const SensorsOnOff = res.data.SensorsOnOff?res.data.onUse:""
          this.SensorBindInfo = {
            groupId: radarRowData.groupId,
            radarId: radarRowData.radarId,
            groupName: radarRowData.groupName,
            radarSn: radarRowData.radarSn,
            radarName: radarRowData.radarName,
            sensorSn: sensorSn,
            sensorBind: sensorBind,
            // SensorsOnOff: SensorsOnOff,
          };
          this.isSensorBindDialogOpen = true;
          console.log(this.SensorBindInfo, this.isSensorBindDialogOpen, "bbbbbbbbbb");
        }
      }).catch(() => {
        this.SensorBindInfo = {
          groupId: radarRowData.groupId,
          radarId: radarRowData.radarId,
          groupName: radarRowData.groupName,
          radarSn: radarRowData.radarSn,
          radarName: radarRowData.radarName,
        };
        this.isSensorBindDialogOpen = true;
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取已绑定并集规则失败'
        })
        this.loading = false
      })



    },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDeleteRadar(RadarRowData) {
      const requestBody = RadarRowData.radarSn
      this.openDelConfirm().then(() => {
        deleteRadar(requestBody).then(() => {
          this.$message({
            duration: 1000,
            type: 'success',
            message: '删除雷达成功'
          })
          this.getRadarInfo()
        }).catch(() => {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '删除雷达失败'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.el-dropdown {
  vertical-align: top;
}

.el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
