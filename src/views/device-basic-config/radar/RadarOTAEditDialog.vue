<template>
  <el-dialog id="device-config-dialog" :show-close="false" :title="getDialogTitle" :visible="isOpenEditDialog" center
    @close="handleClose">
    <el-form ref="form" :model="form" label-position="right" label-width="140px">

      <el-row>
        <el-col :span="24">
          <el-form-item label="文件服务器主机">
            <el-input v-model="form.host" />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="文件服务器端口">
            <el-input v-model="form.port" />
          </el-form-item>
        </el-col>

      </el-row>


      <el-row>
        <el-col :span="24">
          <el-form-item label="文件服务器URI">
            <el-input v-model="form.uri" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
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
import { updateRadarOTAInfo } from '@/api/device/BasicConfig'
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
        // host: "1.116.114.89",

        // port: "8999",

        // radarSn: "20 5 10 100 5",

        // uri: "/",
        host: "",

        port: "",

        radarSn: "",

        uri: "",

        type: ""
      },
      options: [{
        value: 1,
        label: '文件系统'
      }, {
        value: 0,
        label: '固件'
      }],
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
        host: this.form.host,

        port: this.form.port,

        radarSn: this.form.radarSn,

        uri: this.form.uri,

        type: this.form.type
      }
      console.log(requestBody)
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateRadarOTAInfo(requestBody).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '修改雷达OTA配置成功'
            })
            this.getradarInfo()
            this.handleClose()
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '修改雷达OTA配置失败'
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
