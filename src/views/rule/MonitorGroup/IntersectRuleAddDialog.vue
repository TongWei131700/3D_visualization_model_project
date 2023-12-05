<template>
  <el-dialog id="intersect-rule-dialog" :show-close="true" :visible="isOpenIntersectRuleAddDialog" @close="handleClose"
    v-loading="loading" element-loading-text="正在添加中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" title="新增交集规则">

    <el-form ref="intersectRuleAddForm" class="intersect-rule-form" label-position="left" :model="intersectRuleAddForm"
      label-width="150px">
      <div class="content">

        <div class="form-layout-wrapper">
          <div class="form-rule">

            <el-row>
              <el-col :span="12">
                <el-form-item label="规则名称" prop="alarmRuleDTO.alarmName">
                  <el-input v-model="intersectRuleAddForm.alarmRuleDTO.alarmName" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="规则类型" prop="alarmRuleDTO.type">
                  <el-select v-model="intersectRuleAddForm.alarmRuleDTO.type" :disabled="true">
                    <el-option v-for="item in rulesType" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规则级别" prop="alarmRuleDTO.grade">
                  <el-input v-model="intersectRuleAddForm.alarmRuleDTO.grade" :disabled="true"/>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="12">
                  <el-form-item label="规则种类" prop="alarmRuleDTO.rules">
                      <el-select v-model="intersectRuleAddForm.alarmRuleDTO.rules" multiple>
                          <el-option v-for="item in rulesClass" :key="item.value" :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="14">

                <div class="form-input form-flex-display">
                  <el-card shadow="never" class="box-card">
                    <div class="output">
                      <div class="top_head">输入条件</div>

                      <div class="top_body">
                        <div class="cond-statements-left">
                          <el-button type="primary">AND</el-button>
                          <span>-------</span>
                        </div>

                        <div class="cond-statements">


                          <div>
                            <el-button size="mini" type="text" icon="el-icon-plus" @click="addExtraInput">
                              添加一类参数
                            </el-button>
                            <el-popover placement="top-start" title="" width="500" trigger="hover">
                              <el-alert title="每类规则相交" type="info" :closable="false">
                                <template slot='title'>

                                </template>
                              </el-alert>
                              <i slot="reference" style="margin-left: 5px" class="el-icon-info"></i>
                            </el-popover>
                          </div>

                          <div
                            v-if="intersectRuleAddForm.alarmRuleDTO.rules && intersectRuleAddForm.alarmRuleDTO.rules.length > 0">
                            <el-alert title="" type="info" :closable="false" :show-icon="false">
                              <template slot='title'>
                                <div v-for="(item, index) in intersectRuleAddForm.alarmRuleDTO.rules" :key="index"
                                  style="margin-top: 5px">
                                  <el-form-item label="参数种类" prop="alarmRuleDTO.rules">
                                    <el-select style="width: 200px" @change="currStationChange(index)"
                                      v-model="intersectRuleAddForm.alarmRuleDTO.rules[index]" placeholder="参数种类">
                                      <el-option v-for="item in rulesClass" :key="item.value" :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                  </el-form-item>
                                  <el-form-item label="参数详情" prop="alarmRuleDTO.jsonObject"
                                    v-if="intersectRuleAddForm.alarmRuleDTO.jsonObject[parseInt(intersectRuleAddForm.alarmRuleDTO.rules[index]) - 1] && intersectRuleAddForm.alarmRuleDTO.jsonObject[parseInt(intersectRuleAddForm.alarmRuleDTO.rules[index]) - 1].length > 0">
                                    <div
                                      v-for="(item, index) in intersectRuleAddForm.alarmRuleDTO.jsonObject[parseInt(intersectRuleAddForm.alarmRuleDTO.rules[index]) - 1]"
                                      :key="index" style="margin-top: 5px" :class="index ? 'indent' : ''">

                                      <el-select style="width: 200px" v-model="item.paramName" placeholder="参数名"
                                        :disabled="true">
                                        <el-option v-for="item in options1" :key="item.value" :label="item.label"
                                          :value="item.value">
                                        </el-option>

                                      </el-select>
                                      <span class="prefix-el-input">
                                        <el-input style="width: 110px" v-model="item.paramValue" placeholder="参数值" />
                                      </span>
                                      <!--根据选项确定单位-->
                                      <span>{{ item.paramName === 'distance' ? '米' : '' }}</span>
                                      <span>{{ item.paramName === 'wild' ? '米' : '' }}</span>
                                      <span>{{ item.paramName === 'peopleNumberThreshold' ? '人' : '' }}</span>
                                      <span>{{ item.paramName === 'seconds' ? '秒' : '' }}</span>
                                      <span>{{ item.paramName === 'ch2o' ? 'ug/m³' : '' }}</span>
                                      <span>{{ item.paramName === 'tvoc' ? 'ug/m³' : '' }}</span>
                                      <span>{{ item.paramName === 'pm2d5' ? 'ug/m³' : '' }}</span>
                                      <span>{{ item.paramName === 'pm10' ? 'ug/m³' : '' }}</span>
                                    </div>
                                  </el-form-item>

                                  <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C"
                                    @click="delExtraInput(index)">删除
                                  </el-button>
                                </div>

                                <!-- <el-form-item label="" prop="alarmRuleDTO.jsonObject">

                                    <div v-for="(item, index) in intersectRuleAddForm.alarmRuleDTO.jsonObject"
                                        :key="index" style="margin-top: 5px">

                                        <el-select style="width: 250px"
                                            v-model="item.paramName" placeholder="参数名">
                                            <el-option v-for="item in options1"
                                                :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input style="width: 250px"
                                            v-model="item.paramValue"
                                            placeholder="参数值" />


                                        <el-button size="mini" type="text"
                                            icon="el-icon-delete" style="color: #F56C6C"
                                            @click="delExtraInput(index)">删除
                                        </el-button>
                                    </div>
                                </el-form-item> -->
                              </template>
                            </el-alert>
                          </div>


                        </div>
                      </div>

                    </div>

                  </el-card>

                </div>

              </el-col>
              <el-col :span="10">
                <div class="form-output form-flex-display">
                  <el-card shadow="never" class="box-card">
                    <div class="output">
                      <div class="top_head">绑定语音</div>
                      <div class="top_body">
                        <div class="condition-type">
                          <el-form-item label="报警语音" prop="alarmRuleDTO.voiceId">
                            <el-select v-model="intersectRuleAddForm.alarmRuleDTO.voiceId" placeholder="请选择">
                              <el-option v-for="item in alarmVoiceOptions" :key="item.id" :label="item.ruleType"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </el-form-item>
                           <el-form-item label="触发次数" prop="alarmRuleDTO.triggerNum">
                            <el-input v-model="intersectRuleAddForm.alarmRuleDTO.triggerNum" />
                          </el-form-item>

                          <el-form-item label="最小报警间隔（秒）" prop="alarmRuleDTO.alarmInterval">
                            <el-input v-model="intersectRuleAddForm.alarmRuleDTO.alarmInterval" />
                          </el-form-item>
                          <!-- <div class="type-radio">
                            <el-form-item label="报警方式" prop="alarmRuleDTO.alertType">
                              <el-radio-group v-model="intersectRuleAddForm.alarmRuleDTO.alertType" @change="changeType">
                                <el-radio label="站内弹窗" class="type-radio-item" />
                                <el-radio label="邮件通知" class="type-radio-item" />
                                <el-radio label="手机短信" class="type-radio-item" />
                                <el-radio label="App通知" class="type-radio-item" />
                              </el-radio-group>
                            </el-form-item>
                          </div>
                          <div class="type-input">
                            <el-form-item label="联系方式" prop="alarmRuleDTO.contactNumber">
                              <el-input v-model="emailType" type="email" style="margin-bottom: 10px"
                                :disabled="isEmailDisabled" placeholder="输入需要报警的接收邮箱号码" />
                              <el-input v-model="telphone" style="margin-bottom: 10px" :disabled="isTelDisabled"
                                placeholder="输入需要报警的接收手机号码" />
                              <el-input v-model="appUser" style="margin-bottom: 10px" :disabled="isAppDisabled"
                                placeholder="输入需要报警的接收App用户名" />
                            </el-form-item>
                          </div> -->
                        </div>
                        <!-- <el-form-item label="报警触发动作" prop="alarmRuleDTO.isVideo">
                          <el-checkbox v-model="intersectRuleAddForm.alarmRuleDTO.isVideo">
                            是否录像
                          </el-checkbox>
                        </el-form-item>

                        <el-form-item label="录像时间间隔（秒）" prop="alarmRuleDTO.videoTime">

                          <el-input v-model="intersectRuleAddForm.alarmRuleDTO.videoTime"/>
                        </el-form-item>

                        <el-form-item label="触发次数" prop="alarmRuleDTO.triggerNum">
                          <el-input v-model="intersectRuleAddForm.alarmRuleDTO.triggerNum"/>
                        </el-form-item>

                        <el-form-item label="最小报警间隔（秒）" prop="alarmRuleDTO.alarmInterval">
                          <el-input
                            v-model="intersectRuleAddForm.alarmRuleDTO.alarmInterval"/>
                        </el-form-item> -->

                      </div>

                    </div>

                  </el-card>

                </div>
              </el-col>
            </el-row>

          </div>


        </div>

      </div>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isOpenIntersectRuleAddDialog = false">取 消</el-button>
      <el-button @click="resetForm('intersectRuleAddForm')">重置</el-button>
      <el-button type="primary" @click="submitForm('intersectRuleAddForm')">提交</el-button>
    </div>

  </el-dialog>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { addIntersectRule, allVoices } from '@/api/rule/RuleConfig'

export default {
  name: 'IntersectRuleAddDialog',

  props: {
    isOpenIntersectRuleAddDialog: {
      type: Boolean,
      default: false
    },
    // monitorGroupConfigFormData: {
    //     type: Object,
    //     default: () => {
    //     }
    // }
  },

  data() {

    return {

      intersectRuleAddForm: {
        alarmRuleDTO: {
          // alarmInterval: '',
          alarmName: '',
          grade: 1,
          id: '',
          // isVideo: true,
          rules: [],
          // triggerNum: '',
          type: "2",
          // videoTime: ''

          // alertType: "",
          // contactNumber: "",
          voiceId: "",
          jsonObject: [
            [{
              paramName: 'distance',
              paramValue: ''
            }]
            ,
            [{
              paramName: 'wild',
              paramValue: ''
            }, {
              paramName: 'peopleNumberThreshold',
              paramValue: ''
            }]
            ,
            [{
              paramName: 'wild',
              paramValue: ''
            }, {
              paramName: 'peopleNumberThreshold',
              paramValue: ''
            }, {
              paramName: 'seconds',
              paramValue: ''
            }]
            ,
            []
            ,
            // 此处存储有毒气体的参数
            [{
              paramName: 'ch2o',
              paramValue: '-1'
            }, {
              paramName: 'tvoc',
              paramValue: '-1'
            }, {
              paramName: 'pm2d5',
              paramValue: '-1'
            }, {
              paramName: 'pm10',
              paramValue: '-1'
            }]
          ],
        },

      },
      rulesType: [{
        value: '1',
        label: '交集规则'
      }, {
        value: '2',
        label: '并集规则'
      }],
      rulesClass: [{
        value: '1',
        label: '有人靠近雷达'
      }, {
        value: '2',
        label: '有人员聚集'
      }, {
        value: '3',
        label: '有人员持续聚集'
      }, {
        value: '4',
        label: '有人打架'
      }, {
        value: '5',
        label: '有害气体含量'
      }],

      timeDisplay: false,
      loading: false,
      isEmailDisabled: true, // 禁用邮件
      isTelDisabled: true, // 禁用电话
      isAppDisabled: true, // 禁用App
      appUser: '',
      emailType: "",
      telphone: "",

      options1: [{
        value: 'distance',
        label: '破坏雷达的距离'
      }, {
        value: 'wild',
        label: '聚集规则里人员的距离'
      }, {
        value: 'peopleNumberThreshold',
        label: '聚集人员数量阈值'
      }, {
        value: 'seconds',
        label: '聚集时间规则里聚集时间的阈值'
      }],

      alarmVoiceOptions: []
    };
  },
  mounted() {
    this.getAllVoice()
  },
  methods: {
    ...mapActions('RuleConfig', {
      monitorGroupRule: 'getAllMonitorGroupIdNameLocationByActions',
      getGroupIdName: 'getAllMonitorGroupIdNameByActions',
      getGroupList: 'getAllMonitorGroupIdByActions'
    }),
    async initRuleConfigInfo() {
      await this.getGroupIdName()
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    // 获取所有语音
    getAllVoice() {
      allVoices().then(res => {
        if (res.code == 200) {
          this.alarmVoiceOptions = res.data
          console.log("成功获得已有语音");
          console.log(this.alarmVoiceOptions);
        }
      })
    },
    currStationChange(index, val) {
      console.log('currStationChange', val)
      // this.intersectRuleAddForm.alarmRuleDTO.jsonObject.splice(index, 1)
      // switch (parseInt(this.intersectRuleAddForm.alarmRuleDTO.rules[index])) {
      //     case 1:
      //         this.intersectRuleAddForm.alarmRuleDTO.jsonObject.push([{
      //             paramName: 'distance',
      //             paramValue: ''
      //         }])
      //         break;
      //     case 2:
      //         this.intersectRuleAddForm.alarmRuleDTO.jsonObject.push([{
      //             paramName: 'wild',
      //             paramValue: ''
      //         }, {
      //             paramName: 'peopleNumberThreshold',
      //             paramValue: ''
      //         }])
      //         break;
      //     case 3:
      //         this.intersectRuleAddForm.alarmRuleDTO.jsonObject.push([{
      //             paramName: 'wild',
      //             paramValue: ''
      //         }, {
      //             paramName: 'peopleNumberThreshold',
      //             paramValue: ''
      //         }, {
      //             paramName: 'seconds',
      //             paramValue: ''
      //         }])
      //         break;
      //     default:
      //         this.intersectRuleAddForm.alarmRuleDTO.jsonObject.push([])

      // }
      // this.intersectRuleAddForm.alarmRuleDTO.jsonObject.push(this.rulesParam[parseInt(this.intersectRuleAddForm.alarmRuleDTO.rules[index]) - 1])


      console.log(this.intersectRuleAddForm.alarmRuleDTO.jsonObject)


    },
    addExtraInput() {
      this.intersectRuleAddForm.alarmRuleDTO.rules.push('')
    },
    /** 根据数组索引删除一行键值对 */
    delExtraInput(index) {

      for (var param of this.intersectRuleAddForm.alarmRuleDTO.jsonObject[parseInt(this.intersectRuleAddForm.alarmRuleDTO.rules[index]) - 1]) {
        console.log(param);
        param.paramValue = ""

      }
      this.intersectRuleAddForm.alarmRuleDTO.rules.splice(index, 1)

      console.log("删除");
      console.log(this.intersectRuleAddForm.alarmRuleDTO.jsonObject);

    },
    // // 改变报警通知方式
    // changeType() {
    //   if (this.intersectRuleAddForm.alarmRuleDTO.alertType === '邮件通知') {
    //     this.isEmailDisabled = false
    //     this.isTelDisabled = true
    //     this.isAppDisabled = true
    //     this.telphone = ''
    //   } else if (this.intersectRuleAddForm.alarmRuleDTO.alertType === '手机短信') {
    //     this.isEmailDisabled = true
    //     this.isTelDisabled = false
    //     this.isAppDisabled = true

    //     this.emailType = ''
    //   } else if (this.intersectRuleAddForm.alarmRuleDTO.alertType === 'App通知') {
    //     this.isEmailDisabled = true
    //     this.isTelDisabled = true
    //     this.isAppDisabled = false
    //     this.appUser = ''
    //   } else {
    //     this.isEmailDisabled = true
    //     this.isTelDisabled = true
    //     this.isAppDisabled = true
    //     this.emailType = ''
    //     this.telphone = ''
    //     this.appUser = ''

    //   }
    // },
    addTime() {
      this.timeDisplay = true
    },
    deleteTime() {
      this.timeDisplay = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          // console.log(this.intersectRuleAddForm);
          // if (this.intersectRuleAddForm.alarmTime.intersectAlarmDate && this.intersectRuleAddForm.alarmTime.intersectAlarmTime) {
          //     this.intersectRuleAddForm.alarmTime.startTime = new Date(this.intersectRuleAddForm.alarmTime.intersectAlarmDate[0]).getTime();
          //     this.intersectRuleAddForm.alarmTime.endTime = new Date(this.intersectRuleAddForm.alarmTime.intersectAlarmDate[1]).getTime();

          //     this.intersectRuleAddForm.alarmTime.alarmSt = new Date(this.intersectRuleAddForm.alarmTime.intersectAlarmTime[0]).getTime();
          //     this.intersectRuleAddForm.alarmTime.alarmEt = new Date(this.intersectRuleAddForm.alarmTime.intersectAlarmTime[1]).getTime();

          // }
          console.log(this.intersectRuleAddForm);
          // switch (this.intersectRuleAddForm.alarmRuleDTO.alertType) {
          //   case '站内通知':
          //     this.intersectRuleAddForm.alarmRuleDTO.alertType = '0'
          //     break
          //   case '邮件通知':
          //     this.intersectRuleAddForm.alarmRuleDTO.alertType = '1'
          //     this.intersectRuleAddForm.alarmRuleDTO.contactNumber = this.emailType
          //     break
          //   case '手机短信':
          //     this.intersectRuleAddForm.alarmRuleDTO.alertType = '2'
          //     this.intersectRuleAddForm.alarmRuleDTO.contactNumber = this.telphone
          //     break
          //   case 'App通知':
          //     this.intersectRuleAddForm.alarmRuleDTO.alertType = '3'
          //     this.intersectRuleAddForm.alarmRuleDTO.contactNumber = this.appUser
          //     break
          // }
          addIntersectRule(this.intersectRuleAddForm).then((res) => {
            if (res.code === 200) {
              this.$message({
                duration: 3000,
                type: 'success',
                message: '添加交集规则成功'
              })
              this.monitorGroupRule()
              this.getGroupList()
              this.handleClose()

              this.loading = false
              // location.reload()
              this.$emit('getAndRuleList')

            }
          }).catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '添加交集规则失败'
            })
            this.loading = false
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      // Object.assign(this.$data.formName, this.$options.data().formName)
      this.$refs[formName].resetFields();
    }
  },
  computed: {
    ...mapGetters('RuleConfig', {
      monitorList1: 'getGroupIdName'
    }),
    // 页面搜索框下拉菜单配置选项 会随着VueX中monitorList的变化而变化
    ruleConfigSearchBoxOption() {
      console.log(this.monitorList1);
      const options = []
      const searchMonitor = []
      this.monitorList1.forEach((value) => {
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
    }
  },

  created() {
    // this.formatDataToForm()
    this.initRuleConfigInfo()
    // 一进入就格式化传入的monitorGroupConfigFormData为表单能接受的格式
    // this.monitorGroupConfigForm = deepCopy(this.monitorGroupConfigFormData)
  }

}
</script>
<style scoped>
#monitor-config-dialog {
  font: 1em sans-serif;
}

/deep/ .el-dialog {

  width: 90%;
}

/deep/ .element {
  margin-left: 0;
}

/deep/ .el-input__inner {
  width: 250px;
}

/deep/ .el-date-editor .el-range-separator {
  width: 20px;
}

/deep/ .el-range-editor.el-input__inner {
  width: 400px;
}

/deep/ .cond-statements .el-form-item__content {
  width: 600px;
  margin-left: 10px !important;
}

/deep/ .cond-statements .el-form-item__label {
  width: 80px !important;
}

/deep/ .cond-statements .el-input__inner {
  width: 200px !important;
}

.content {
  width: 100%;
  background-color: rgb(249, 249, 249);

}

.monitor-config-form {}

.form-layout-wrapper {
  /* position: relative; */
  width: 100%;
  overflow-y: auto;
  height: 600px;

}

.form-rule {
  padding: 20px;

}

.form-input {
  float: left;
  width: 95%;
  /* padding: 20px; */
  /* width: 40%; */
  height: 500px;

  /* background-color: #fff; */
}


.form-output {
  float: left;
  height: 500px;
  width: 95%;
  margin-left: 5%;

}

.form-alarm-time {
  width: 100%;
  margin-top: 20px;
}

.box-card {
  width: 100%;
  height: 100%;
}

.top_head {
  font: 400;
  font: 30px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #EBEEF5;
}

.top_body {
  margin-top: 20px;
  height: 380px;
  overflow: auto;

}

.alarm-time_body {
  margin-top: 20px;
  height: 50px;
}

.cond-statements-left {
  float: left;
}

.cond-statements {
  float: left;
  border: 1px dashed #409EFF;

}


.dialog-footer {
  margin-top: 5px;
  margin-bottom: 20px;
}

/*增加缩进，与label的宽度保持一致*/
.indent {
  margin-left: 70px;
}

/* .form-flex-display {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
} */

/deep/ .prefix-el-input .el-input__inner {
  width: 100px !important;
}
</style>
