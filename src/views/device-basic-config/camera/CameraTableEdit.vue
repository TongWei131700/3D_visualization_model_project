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
          <el-form-item label="摄像头所属绑定组">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option
                v-for="item in cameraConfigSearchBoxOption"
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
          <el-form-item label="摄像头Id">
            <el-input
              v-model="form.cameraId"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头设备号">
            <el-input
              v-model="form.cameraSn"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头IP">
            <el-input
              v-model="form.cameraIp"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头名称">
            <el-input
              v-model="form.cameraName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头高度">
            <el-input
              v-model="form.cameraHigh"
            />
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头是否启用">
            <el-select v-model="form.cameraOnOff" placeholder="请选择">
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
          <el-form-item label="摄像头在线状态">
            <el-select v-model="form.cameraOnline" disabled placeholder="请选择">
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
import {updateCaremaInfo} from '@/api/device/BasicConfig'
// import { getAllMonitorGroupIdName } from '@/api/device/BasicConfig'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'

export default {
  name: 'CameraEditDialog',
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
        cameraId: 1,
        cameraSn: '',
        cameraIp: '',
        cameraName: '',
        cameraHigh: '',
        cameraOnOff: '',
        cameraOnline: ''
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
    cameraConfigSearchBoxOption() {
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
      return `摄像头- ${this.form.cameraName} - 配置`
    }
  },

  methods: {
    ...mapActions('BasicConfig', {
      getcameraInfo: 'getAllCameraByActions'
    }),
    handleSubmit() {
      const requestBody = {
        groupId: this.form.groupId,
        cameraName: this.form.cameraName,
        cameraId: this.form.cameraId,
        cameraSn: this.form.cameraSn,
        cameraIp: this.form.cameraIp,
        cameraHigh: this.form.cameraHigh,
        cameraOnOff: this.form.cameraOnOff,
        cameraOnline: this.form.cameraOnline
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateCaremaInfo(requestBody).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '修改摄像头配置成功'
            })
            this.getcameraInfo()
            this.handleClose()
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '修改摄像头配置失败'
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
