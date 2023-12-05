<template>
  <el-dialog id="device-config-dialog" :show-close="false" :title="getDialogTitle" :visible="isOpenEditDialog" center
    @close="handleClose">
    <el-form ref="form" :model="form" label-position="right" label-width="140px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="AllocationParam">
            <el-input v-model="form.AllocationParam" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="GatingParam">
            <el-input v-model="form.GatingParam" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="PointCloudEn">
            <el-input v-model="form.PointCloudEn" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SceneryParam">
            <el-input v-model="form.SceneryParam" />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item label="StateParam">
            <el-input v-model="form.StateParam" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="VariationParam">
            <el-input v-model="form.VariationParam" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="adc">
            <el-input v-model="form.adc" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="adcbuf">
            <el-input v-model="form.adcbuf" />
          </el-form-item>
        </el-col>


      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="cfar">
            <el-input v-model="form.cfar" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="channel">
            <el-input v-model="form.channel" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="chirp1">
            <el-input v-model="form.chirp1" />
          </el-form-item>
        </el-col> <el-col :span="12">
          <el-form-item label="chirp2">
            <el-input v-model="form.chirp2" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="dfeDataOutputMode">
            <el-input v-model="form.dfeDataOutputMode" />
          </el-form-item>
        </el-col> <el-col :span="12">
          <el-form-item label="doa">
            <el-input v-model="form.doa" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="frame">
            <el-input v-model="form.frame" />
          </el-form-item>
        </el-col> <el-col :span="12">
          <el-form-item label="guiMonitor">
            <el-input v-model="form.guiMonitor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="lowPower">
            <el-input v-model="form.lowPower" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="profile">
            <el-input v-model="form.profile" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="radarSn">
            <el-input v-model="form.radarSn" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="tracking">
            <el-input v-model="form.tracking" />
          </el-form-item>
        </el-col>
      </el-row>



    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-circle-check" type="success" @click="handleSubmit">
        提交
      </el-button>
      <el-button icon="el-icon-circle-close" style="margin-left: 150px" type="primary" @click="handleClose">
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { validateIPv4 } from '@/utils/validate'
import { updateRadarParamsInfo } from '@/api/device/BasicConfig'
// import { getAllMonitorGroupIdName } from '@/api/device/BasicConfig'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'RadarEditDialog',
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
        AllocationParam: "",
        GatingParam: "",
        PointCloudEn: "",
        SceneryParam: "",
        StateParam: "",
        VariationParam: "",
        adc: "",
        adcbuf: "",
        cfar: "",
        channel: "",
        chirp1: "",
        chirp2: "",
        dfeDataOutputMode: "",
        doa: "",
        frame: "",
        guiMonitor: "",
        lowPower: "",
        profile: "",
        radarSn: "",
        tracking: ""
      },
      // form: {}
    }
  },
  computed: {
    ...mapGetters('BasicConfig', {
      monitorInfo: 'getmonitorInfo'
    }),
    getDialogTitle() {
      return `雷达- ${this.form.radarName} - 参数配置`
    },

  },
  methods: {
    ...mapActions('BasicConfig', {
      getradarInfo: 'getAllRadarByActions'
    }),
    handleSubmit() {
      const requestBody = {
        AllocationParam: this.form.AllocationParam,
        GatingParam: this.form.GatingParam,
        PointCloudEn: this.form.PointCloudEn,
        SceneryParam: this.form.SceneryParam,
        StateParam: this.form.StateParam,
        VariationParam: this.form.VariationParam,
        adc: this.form.adc,
        adcbuf: this.form.adcbuf,
        cfar: this.form.cfar,
        channel: this.form.channel,
        chirp1: this.form.chirp1,
        chirp2: this.form.chirp2,
        dfeDataOutputMode: this.form.dfeDataOutputMode,
        doa: this.form.doa,
        frame: this.form.frame,
        guiMonitor: this.form.guiMonitor,
        lowPower: this.form.lowPower,
        profile: this.form.profile,
        radarSn: this.form.radarSn,
        tracking: this.form.tracking,
      }
      console.log(requestBody)
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateRadarParamsInfo(requestBody).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '修改雷达参数配置成功'
            })
            this.getradarInfo()
            this.handleClose()
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '修改雷达参数配置失败'
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
