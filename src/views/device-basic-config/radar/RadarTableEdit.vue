<template>
  <el-dialog id="device-config-dialog" :show-close="false" :title="getDialogTitle" :visible="isOpenEditDialog" center
    @close="handleClose">
    <el-form ref="form" :model="form" label-position="left" label-width="150px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达所属绑定组" prop="monitorName">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                :value="Number(item.value)" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达Ip">
            <el-input v-model="form.radarIp" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达设备号">
            <el-input v-model="form.radarSn" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达名称">
            <el-input v-model="form.radarName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达位置">
            <el-input v-model="form.location" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="雷达高度">
            <el-input
              v-model="form.radarHigh"
            />
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达是否启用">
            <el-select v-model="form.radarOnOff" placeholder="请选择">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="雷达在线状态">
            <el-select v-model="form.radarOnline" disabled placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="规则名称">
            <el-select v-model="form.ruleId" placeholder="已有规则">
              <el-option v-for="item in options3" :key="item.id" :label="item.alarmName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="规则是否启用">
            <el-select v-model="form.RulesOnOff" placeholder="请选择">
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value" />
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
import { validateIPv4 } from '@/utils/validate'
import { updateRadarInfo } from '@/api/device/BasicConfig'
import { getAllMonitorGroupIdName } from '@/api/device/BasicConfig'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { orRulesName,AddRuleBind } from '@/api/rule/RuleConfig'

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
        groupId: '',
        radarId: '',
        radarIp: '',
        radarSn: '',
        radarName: '',
        location: '',
        radarHigh: '',
        radarOnline: '',
        radarOnOff: '',
        ruleId: '',
        RulesOnOff: ''
      },
      options1: [{
        value: '1',
        label: '开启'
      }, {
        value: '0',
        label: '关闭'
      }],
      options4: [{
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
      }],
      options3: [{
        id: '1',
        alarmName: '规则一'
      }, {
        id: '2',
        alarmName: '规则二'
      }, {
        id: '3',
        alarmName: '规则三'
      }, {
        id: '4',
        alarmName: '规则4'
      }, {
        id: '5',
        alarmName: '规则5'
      }]
    }
  },
  computed: {
    ...mapGetters('BasicConfig', {
      monitorInfo: 'getmonitorInfo'
    }),
    getDialogTitle() {
      return `雷达- ${this.form.radarName} - 配置`
    },
    ruleConfigSearchBoxOption() {
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
      console.log(options)
      return options
    }
  },
  methods: {
    ...mapActions('BasicConfig', {
      getradarInfo: 'getAllRadarByActions'
    }),
    getExistRulesName() {
      orRulesName().then((res) => {
        if (res.code === 200) {
          console.log("成功获得已有并集规则");
          console.log(res.data);
          this.options3 = res.data;
        }
      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取已有并集规则失败'
        })
        this.loading = false
      })
    },
    handleSubmit() {
      const requestBody = {
        radarName: this.form.radarName,
        groupId: Number(this.form.groupId),
        radarId: this.form.radarId,
        radarSn: this.form.radarSn,
        // radarHigh: this.form.radarHigh,
        radarIp: this.form.radarIp,
        radarOnOff: this.form.radarOnOff,
        radarOnline: this.form.radarOnline,
        location: this.form.location,
        ruleId: this.form.ruleId,
        RulesOnOff: this.form.RulesOnOff,
      }
      const requestBody1 = {
        radarName: this.form.radarName,
        groupId: Number(this.form.groupId),
        radarId: this.form.radarId,
        radarSn: this.form.radarSn,
        // radarHigh: this.form.radarHigh,
        radarIp: this.form.radarIp,
        radarOnOff: this.form.radarOnOff,
        radarOnline: this.form.radarOnline,
        location: this.form.location
      }
      const requestBody2 = {

        radarSn: this.form.radarSn,
        ruleId: this.form.ruleId,
        RulesOnOff: this.form.RulesOnOff,

      }
      console.log(requestBody,requestBody1, requestBody2)
      this.$refs.form.validate((valid) => {
        if (valid) {
          AddRuleBind(requestBody2).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '雷达绑定规则成功'
            })

          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '雷达绑定规则失败'
            })
          })
          updateRadarInfo(requestBody1).then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '修改雷达配置成功'
            })

            this.getradarInfo()
            this.handleClose()
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '修改雷达配置失败'
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
    // Object.assign(this.form, this.editingInfo)
    console.log(this.form, "this.form");
    this.getExistRulesName()
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
