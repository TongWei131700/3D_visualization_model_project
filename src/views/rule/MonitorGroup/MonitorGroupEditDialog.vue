<template>
  <el-dialog
    id="monitor-config-dialog"
    :show-close="false"
    :visible="isOpenMonitorGroupEditDialog"
    @close="handleClose"
  >
    <el-form
      ref="monitorGroupConfigForm"
      :model="monitorGroupConfigForm"
      class="monitor-config-form"
      label-position="left"
      label-width="220px"
    >
      <div class="form-layout-wrapper">
        <div class="form-left form-flex-display">
          <el-form-item label="最小报警间隔（秒）">
            <el-input
              v-model="monitorGroupConfigForm.alarmInterval"
            ></el-input>
          </el-form-item>
          <el-form-item label="录像时间间隔（秒）">
            <el-input
              v-model="monitorGroupConfigForm.recordInterval"
            ></el-input>
          </el-form-item>
          <el-form-item label="报警触发动作配置">
            <el-checkbox
              v-model="monitorGroupConfigForm.photographOnOff"
              label="拍照"
            ></el-checkbox>
            <el-checkbox
              v-model="monitorGroupConfigForm.recorderOnOff"
              label="录像"></el-checkbox>
          </el-form-item>
          <el-form-item label="绑定组启用状态">
            关
            <el-switch
              v-model="monitorGroupConfigForm.groupOnOff"
              active-color="#5b0eeb"
              inactive-color="#E4EBF5"
              style="margin: 0 15px"
            >
            </el-switch>
            开
          </el-form-item>
        </div>
        <div class="form-center form-flex-display">
          <form-clock></form-clock>
        </div>
        <div class="form-right form-flex-display">
          <el-form-item label="报警日期">
            <el-date-picker
              v-model="monitorGroupConfigForm.monitorAlarmDate"
              arrow-control
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              range-separator="至"
              start-placeholder="开始时间"
              type="datetimerange"
              unlink-panels>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="报警时间">
            <el-time-picker
              v-model="monitorGroupConfigForm.monitorAlarmTime"
              end-placeholder="结束时间"
              is-range
              placeholder="选择时间范围"
              range-separator="至"
              start-placeholder="开始时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-radio
              v-model="monitorGroupConfigForm.dateType"
              label="节假日"
            ></el-radio>
            <el-radio
              v-model="monitorGroupConfigForm.dateType"
              label="工作日"
            ></el-radio>
            <el-radio
              v-model="monitorGroupConfigForm.dateType"
              label="周末"></el-radio>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="circle" @click="submitMonitorRule">
        <span class="circle__btn">
          保存
        </span>
        <span class="circle__back-1"></span>
        <span class="circle__back-2"></span>
      </div>
      <div class="circle" style="margin-left: 100px" @click="handleClose">
        <span class="circle__btn">
          取消
        </span>
        <span class="circle__back-1"></span>
        <span class="circle__back-2"></span>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import {deepCopy} from '@/utils/utils'
import {mapActions} from 'vuex'
import {updateMonitorRule} from '@/api/rule/RuleConfig'
import FormClock from '@/components/rule/FormClock'

export default {
  name: 'MonitorGroupEditDialog',
  components: {FormClock},
  props: {
    isOpenMonitorGroupEditDialog: {
      type: Boolean,
      default: false
    },
    monitorGroupConfigFormData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      monitorGroupConfigForm: {
        groupId: 0,
        groupName: '',
        groupOnOff: true,
        recorderOnOff: true,
        photographOnOff: true,
        alarmOnOff: '1',
        alarmInterval: 20,
        recordInterval: 20,
        timeId: 0,
        monitorAlarmTime: [],
        monitorAlarmDate: [],
        dateType: 0
      }
    }
  },
  methods: {
    ...mapActions('RuleConfig', {
      monitorGroupRule: 'getAllMonitorGroupIdNameLocationByActions'
    }),
    submitMonitorRule() {
      // 编辑传入后台的数据
      let formParam = {}
      Object.assign(formParam, this.monitorGroupConfigForm)
      let dateType
      switch (formParam.dateType) {
        case '工作日':
          dateType = 0;
          break
        case '周末':
          dateType = 1;
          break
        case '节假日':
          dateType = 2;
          break
      }
      let group = {
        groupOnOff: formParam.groupOnOff ? '1' : '0',
        recorderOnOff: formParam.recorderOnOff ? '1' : '0',
        photographOnOff: formParam.photographOnOff ? '1' : '0',
        groupId: formParam.groupId,
        groupName: formParam.groupName,
        alarmInterval: formParam.alarmInterval,
        recordInterval: formParam.recordInterval
      }
      let alarmTime = {
        timeId: formParam.timeId,
        startTime: new Date(formParam.monitorAlarmDate[0]).getTime(),
        endTime: new Date(formParam.monitorAlarmDate[1]).getTime(),
        groupId: formParam.groupId,
        dateType: dateType,
        alarmSt: new Date(formParam.monitorAlarmTime[0]).getTime(),
        alarmEt: new Date(formParam.monitorAlarmTime[1]).getTime()
      }
      let editParam = {
        group: group,
        alarmTimes: alarmTime
      }
      console.log(editParam)
      updateMonitorRule(editParam).then(() => {
        this.monitorGroupRule()
        this.handleClose()
        this.$message({
          duration: 1000,
          type: 'success',
          message: `更新绑定组 ${formParam.groupName} 规则成功`
        })
      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: `更新绑定组 ${formParam.groupName} 规则失败`
        })
      })
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    formatDataToForm() {
      // 格式化启用状态
      this.monitorGroupConfigForm.groupOnOff = this.monitorGroupConfigForm.groupOnOff === '1'
      this.monitorGroupConfigForm.recorderOnOff = this.monitorGroupConfigForm.recorderOnOff === '1'
      this.monitorGroupConfigForm.photographOnOff = this.monitorGroupConfigForm.photographOnOff === '1'
    }
  },
  created() {
    // 一进入就格式化传入的monitorGroupConfigFormData为表单能接受的格式
    this.monitorGroupConfigForm = deepCopy(this.monitorGroupConfigFormData)
    this.formatDataToForm()
  }
}
</script>

<style lang="scss" scoped>
$primary-light: #8abdff;
$primary: #6d5dfc;
$primary-dark: #5b0eeb;
$white: #FFFFFF;
$greyLight-1: #E4EBF5;
$greyLight-2: #c8d0e7;
$greyLight-3: #bec8e4;
$greyDark: #9baacf;
#monitor-config-dialog {
  .monitor-config-form {
    padding: 20px 15px;

    .form-layout-wrapper {
      display: flex;
      width: 100%;
      height: 100%;

      .form-flex-display {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }

      .form-left {
        width: 35%;
      }

      .form-center {
        width: 30%;
      }

      .form-right {
        width: 35%;
      }
    }
  }

  .dialog-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>

<style scoped>
#monitor-config-dialog {
  --primary-light: #8abdff;
  --primary: #6d5dfc;
  --primary-dark: #5b0eeb;
  --white: #FFFFFF;
  --greyLight-1: #E4EBF5;
  --greyLight-2: #c8d0e7;
  --greyLight-3: #bec8e4;
  --greyDark: #9baacf;
}

.dialog-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15rem;
  height: 4rem;
  margin-top: 4rem;
  border-radius: 0.8rem;
  box-shadow: 0.8rem 0.8rem 1.4rem var(--greyLight-2), -0.2rem -0.2rem 1.8rem var(--white);
  background: var(--greyLight-1);
}

.dialog-title .el-icon-setting {
  margin-right: 0.5rem;
  font-size: 1.5rem;
  color: var(--primary);
}

.dialog-title span {
  font-size: 0.8rem;
  color: var(--greyDark)
}

/deep/ .el-dialog {
  width: 80%;
  /*height: 70%;*/
  background: var(--greyLight-1);
  border-radius: 3rem;
  box-shadow: 0.8rem 0.8rem 1.4rem var(--greyLight-2), -0.2rem -0.2rem 1.8rem var(--white);
}

/deep/ .el-dialog .el-dialog__header {
  height: 10%;
}

/deep/ .el-dialog .el-form-item {
  width: 100%;
  margin-bottom: 40px;
}

/deep/ .el-dialog .el-form-item .el-form-item__label {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--primary);
}

/deep/ .el-dialog .el-form-item .el-select,
/deep/ .el-date-editor--timerange.el-input__inner {
  width: 100%;
}

/deep/ .el-date-editor--datetimerange.el-input__inner {
  width: 100%;
}

/deep/ .el-input .el-input__inner {
  width: calc(100% - 10px);
  border-radius: 1rem;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
  background: none;
  color: var(--greyDark);
}

/deep/ .el-input .el-input__inner:focus {
  border: none;
  outline: none;
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
}

/deep/ .el-switch .el-switch__core {
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  background: rgba(255, 255, 255, 0);
  border-radius: 0.8rem;
}

/deep/ .el-range-editor {
  border-radius: 1rem;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

/deep/ .el-range-editor,
/deep/ .el-range-editor .el-range-input {
  background: none;
  color: var(--greyDark);
}

/deep/ .el-range-editor .el-range-separator {
  padding: 0;
}

/deep/ .el-range-editor .el-range-input {
  width: 50%;
}

/deep/ .el-dialog--center .el-dialog__body {
  padding: 10px 25px;
}

/deep/ .el-checkbox .el-checkbox__input {
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  cursor: pointer;
  border-radius: 0.4rem;
  width: 1.3rem;
  height: 1.3rem;
}

/deep/ .el-checkbox .el-checkbox__input .el-checkbox__inner {
  border: none;
  background: var(--greyLight-1);
}

/deep/ .el-checkbox .el-checkbox__input .el-checkbox__inner::after {
  left: 0.5rem;
  width: 5px;
  color: var(--primary)
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
  color: #409EFF;
  position: absolute;
  top: 2px;
  left: 3px;
  border: 3px solid #409EFF;
  border-top: none;
  border-left: none;
}

/deep/ .el-radio .el-radio__input {
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  cursor: pointer;
  border-radius: 0.4rem;
  width: 1.3rem;
  height: 1.3rem;
}

/deep/ .el-radio .el-radio__input .el-radio__inner {
  border: none;
  background: var(--greyLight-1);
}

/deep/ .el-radio .el-radio__input .el-radio__inner::after {
  left: 0.5rem;
  width: 5px;
  color: var(--primary)
}

/deep/ .el-radio__input.is-checked .el-radio__inner::after {
  background: #409EFF;
  width: 5px;
  height: 5px;
  position: absolute;
  top: 9px;
  left: 7px;
}

/* BUTTON  */
.circle {
  grid-column: 2/3;
  grid-row: 4/6;
  width: 9rem;
  height: 100%;
  justify-self: center;
  border-radius: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
}

.circle__btn {
  grid-row: 1/2;
  grid-column: 1/2;
  width: 6rem;
  height: 6rem;
  display: flex;
  margin: 0.6rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 2rem;
  color: var(--primary);
  z-index: 300;
  background: var(--greyLight-1);
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  cursor: pointer;
  position: relative;
}

.circle__back-1, .circle__back-2 {
  grid-row: 1/2;
  grid-column: 1/2;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  filter: blur(1px);
  z-index: 100;
}

.circle__back-1 {
  box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
  background: linear-gradient(to bottom right, var(--greyLight-2) 0%, var(--white) 100%);
  -webkit-animation: waves 4s linear infinite;
  animation: waves 4s linear infinite;
}

.circle__back-2 {
  box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
  -webkit-animation: waves 4s linear 2s infinite;
  animation: waves 4s linear 2s infinite;
}

@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

</style>
