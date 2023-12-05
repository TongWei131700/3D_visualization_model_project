<template>
  <el-dialog
    id="device-config-dialog"
    :show-close="false"
    :title="getDialogTitle"
    :visible="isOpenEditDialog"
    center
    @close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="180px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器所属绑定组">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option
                v-for="item in sensorConfigSearchBoxOption"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器Id">
            <el-input
              v-model="form.sensorId"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器设备号">
            <el-input
              v-model="form.sensorSn"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器IP">
            <el-input
              v-model="form.sensorIp"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器名称">
            <el-input
              v-model="form.sensorName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="传感器高度">
            <el-input
              v-model="form.sensorHigh"
            />
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器是否启用">
            <el-select v-model="form.sensorOnOff" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="传感器在线状态">
            <el-select v-model="form.sensorOnline" disabled placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button
        icon="el-icon-circle-check"
        type="success"
        @click="handleSubmit"
      >
        提交
      </el-button>
      <el-button
        icon="el-icon-circle-close"
        style="margin-left: 150px"
        type="primary"
        @click="handleClose"
      >
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { validateIPv4 } from '@/utils/validate'
import {updateSensorInfo} from '@/api/device/BasicConfig'
// import { getAllMonitorGroupIdName } from '@/api/device/BasicConfig'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

export default {
  name: 'SensorEditDialog',
  props: {
    editingInfo: {
      type: Object,
      default: () => {
      }
    },
    isOpenEditDialog: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      form: {
        groupId: 1,
        sensorId: 1,
        sensorSn: '',
        sensorIp: '',
        sensorName: '',
        sensorHigh: '',
        sensorOnOff: '',
        sensorOnline: ''
      },

      options1: [{
        value: '1',
        label: '开启'
      }, {
        value: '0',
        label: '关闭'
      }],
      options2: [{
        value: '1',
        label: '在线'
      }, {
        value: '0',
        label: '离线'
      }]
    }
  },
  computed: {
    ...mapGetters('BasicConfig', {
      monitorInfo: 'getmonitorInfo'
    }),
    sensorConfigSearchBoxOption() {
      const options = []
      const searchMonitor = []
      this.monitorInfo.forEach((value) => {
        if (searchMonitor.includes(value.groupId) === false) {
          searchMonitor.push(value.groupId)
          const obj = {
            value: value.groupId,
            label: value.groupName
          }
          options.push(obj)
        }
      })
      return options
    },
    getDialogTitle() {
      return `传感器- ${this.form.sensorName} - 配置`
    }
  },

  methods: {
    // ...mapActions('BasicConfig', {
    //   getSensorInfo: 'getAllSensorByActions'
    // }),
    handleSubmit() {
      const requestBody = {
        groupId: this.form.groupId,
        sensorName: this.form.sensorName,
        sensorId: this.form.sensorId,
        sensorSn: this.form.sensorSn,
        sensorIp: this.form.sensorIp,
        sensorHigh: this.form.sensorHigh,
        sensorOnOff: this.form.sensorOnOff,
        sensorOnline: this.form.sensorOnline
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateSensorInfo(requestBody).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '修改传感器配置成功'
            })
            this.$emit('getSensorInfo')
            // this.getSensorInfo()
            this.handleClose()
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '修改传感器配置失败'
            })
          })
        } else {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '请检查填写是否有误'
          })
        }
      })
    },
    handleClose() {
      this.$emit('closeDialog')
    }
  },
  created() {
    Object.assign(this.form, this.editingInfo)
  }
}
</script>

<style scoped>
/deep/ .el-select {
  width: 100%;
}

#device-config-dialog {
  width: 60%;
  margin: auto;
}

/deep/ .el-form-item {
  margin-top: -15px
}

/deep/ .el-input {
  width: 90%;
  margin-left: 5%;
}
</style>
