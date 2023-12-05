
<template>
    <el-dialog id="merge-rule-dialog" :show-close="true" :visible="isOpenMergeRuleAddDialog" @close="handleClose"
        v-loading="loading" element-loading-text="正在添加中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" title="新增并集规则">

        <el-form ref="mergeRuleAddForm" class="merge-rule-form" label-position="left" :model="mergeRuleAddForm"
            label-width="150px">
            <div class="content">

                <div class="form-layout-wrapper">
                    <div class="form-rule">

                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="规则名称" prop="alarmRuleDTO.alarmName">
                                    <el-input v-model="mergeRuleAddForm.alarmRuleDTO.alarmName" />
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="8">
                                <el-form-item label="规则类型" prop="alarmRuleDTO.type">
                                    <el-select v-model="mergeRuleAddForm.alarmRuleDTO.type" :disabled="true">
                                        <el-option v-for="item in rulesType" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规则级别" prop="alarmRuleDTO.grade">
                                    <el-input v-model="mergeRuleAddForm.alarmRuleDTO.grade" :disabled="true" />
                                </el-form-item>
                                                        </el-col> -->
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div class="form-input form-flex-display">
                                    <el-card shadow="never" class="box-card">
                                        <div class="output">
                                            <div class="top_head">输入条件</div>
                                            <div class="top_body">
                                                <div class="cond-statements-left">
                                                    <el-button type="primary">OR</el-button>
                                                    <span>-------</span>
                                                </div>

                                                <div class="cond-statements">


                                                    <div>
                                                        <el-button size="mini" type="text" icon="el-icon-plus"
                                                            @click="addExtraInput">
                                                            添加一行</el-button>
                                                        <el-popover placement="top-start" title="" width="500"
                                                            trigger="hover">
                                                            <el-alert title="每行为一个已有规则，每条规则相并" type="info"
                                                                :closable="false">
                                                                <template slot='title'>

                                                                </template>
                                                            </el-alert>
                                                            <i slot="reference" style="margin-left: 5px"
                                                                class="el-icon-info"></i>
                                                        </el-popover>
                                                    </div>
                                                    <div
                                                        v-if="mergeRuleAddForm.alarmRuleDTO.rules && mergeRuleAddForm.alarmRuleDTO.rules.length > 0">
                                                        <el-alert title="" type="info" :closable="false" :show-icon="false">
                                                            <template slot='title'>

                                                                <!-- <el-form-item label="" prop="alarmRuleDTO.rules"> -->

                                                                <div v-for="(item, rulesindex) in mergeRuleAddForm.alarmRuleDTO.rules"
                                                                    :key="rulesindex" style="margin-top: 5px">
                                                                    <el-form-item label=""
                                                                        :prop="'alarmRuleDTO.rules.' + rulesindex">
                                                                        <el-select
                                                                            v-model="mergeRuleAddForm.alarmRuleDTO.rules[rulesindex]"
                                                                            placeholder="已有规则">
                                                                            <el-option v-for="item in options"
                                                                                :key="item.id" :label="item.alarmName"
                                                                                :value="item.id">
                                                                            </el-option>
                                                                        </el-select>
                                                                        <el-button size="mini" type="text"
                                                                            icon="el-icon-delete" style="color: #F56C6C"
                                                                            @click="delExtraInput(rulesindex)">删除
                                                                        </el-button></el-form-item>
                                                                </div>

                                                            </template>
                                                        </el-alert>
                                                    </div>


                                                </div>
                                            </div>

                                        </div>

                                    </el-card>

                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="form-output form-flex-display">
                                    <el-card shadow="never" class="box-card">
                                        <div class="output">
                                            <div class="top_head">报警输出</div>
                                            <div class="top_body">
                                                <div class="condition-type">
                                                    <el-form-item label="通知方式" prop="alarmRuleDTO.alarmReceivers">
                                                        <el-select v-model="mergeRuleAddForm.alarmRuleDTO.alarmReceivers"
                                                            multiple placeholder="请选择">
                                                            <el-option v-for="item in alertTypeOptions" :key="item.id"
                                                                :label="item.contact" :value="item.id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
<!--                                                    <el-form-item label="触发次数" prop="alarmRuleDTO.triggerNum">
                                                        <el-input v-model="mergeRuleAddForm.alarmRuleDTO.triggerNum" />
                                                    </el-form-item>

                                                    <el-form-item label="最小报警间隔（秒）" prop="alarmRuleDTO.alarmInterval">
                                                        <el-input v-model="mergeRuleAddForm.alarmRuleDTO.alarmInterval" />
                                                    </el-form-item>-->
                                                    <!-- <div class="type-radio">
                                                        <el-form-item label="报警方式" prop="alarmRuleDTO.alertType">
                                                            <el-radio-group
                                                                v-model="mergeRuleAddForm.alarmRuleDTO.alertType"
                                                                @change="changeType">
                                                                <el-radio label="站内弹窗" class="type-radio-item" />
                                                                <el-radio label="邮件通知" class="type-radio-item" />
                                                                <el-radio label="手机短信" class="type-radio-item" />
                                                                <el-radio label="App通知" class="type-radio-item" />
                                                            </el-radio-group>
                                                        </el-form-item>
                                                    </div>
                                                    <div class="type-input">
                                                        <el-form-item label="联系方式" prop="alarmRuleDTO.contactNumber">
                                                            <el-input v-model="emailType" type="email"
                                                                style="margin-bottom: 10px" :disabled="isEmailDisabled"
                                                                placeholder="输入需要报警的接收邮箱号码" />
                                                            <el-input v-model="telphone" style="margin-bottom: 10px"
                                                                :disabled="isTelDisabled" placeholder="输入需要报警的接收手机号码" />
                                                            <el-input v-model="appUser" style="margin-bottom: 10px"
                                                                :disabled="isAppDisabled" placeholder="输入需要报警的接收App用户名" />
                                                        </el-form-item>
                                                    </div> -->
                                                </div>
                                                <!-- <div class="alert-method">
                                                    <el-form-item label="报警内容" prop="alarmRuleDTO.contactNumber">
                                                        <div class="type-textarea">
                                                            <el-input v-model="mergeRuleAddForm.alarmRuleDTO.content"
                                                                type="textarea" placeholder="输入报警内容" />
                                                        </div>
                                                    </el-form-item>
                                                    </div> -->
                                                <!-- <el-form-item label="报警触发动作" prop="alarmRuleDTO.isVideo">
                                                    <el-checkbox v-model="mergeRuleAddForm.alarmRuleDTO.isVideo">
                                                        是否录像
                                                    </el-checkbox>
                                                </el-form-item>

                                                <el-form-item label="录像时间间隔（秒）" prop="alarmRuleDTO.videoTime">

                                                    <el-input v-model="mergeRuleAddForm.alarmRuleDTO.videoTime" />
                                                </el-form-item>

                                                <el-form-item label="触发次数" prop="alarmRuleDTO.triggerNum">
                                                    <el-input v-model="mergeRuleAddForm.alarmRuleDTO.triggerNum" />
                                                </el-form-item>

                                                <el-form-item label="最小报警间隔（秒）" prop="alarmRuleDTO.alarmInterval">
                                                    <el-input v-model="mergeRuleAddForm.alarmRuleDTO.alarmInterval" />
                                                                        </el-form-item> -->




                                            </div>

                                        </div>

                                    </el-card>

                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div class="form-alarm-time">
                                <el-card shadow="never" class="box-card">
                                    <div class="output">
                                        <div class="top_head">警戒时间范围
                                            <el-button size="mini" type="text" icon="el-icon-plus" @click="addTimeInput">
                                                添加一行时间</el-button>
                                        </div>

                                        <div class="alarm-time_body" v-for="(item, index) in mergeRuleAddForm.alarmTime"
                                            :key="index" style="margin-top: 5px">
                                            <el-row>

                                                <el-col :span="12">
                                                    <el-form-item label="时间类型" :prop="'alarmTime.' + index + '.dateType'">
                                                        <el-radio v-model="mergeRuleAddForm.alarmTime[index].dateType"
                                                            label="0">周末</el-radio>
                                                        <el-radio v-model="mergeRuleAddForm.alarmTime[index].dateType"
                                                            label="1">工作日</el-radio>
                                                        <el-radio v-model="mergeRuleAddForm.alarmTime[index].dateType"
                                                            label="2">节假日</el-radio>
                                                        <el-radio v-model="mergeRuleAddForm.alarmTime[index].dateType"
                                                            label="3">每天</el-radio>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="报警日期"
                                                        :prop="'alarmTime.' + index + '.mergeAlarmDate'">
                                                        <el-date-picker
                                                            v-model="mergeRuleAddForm.alarmTime[index].mergeAlarmDate"
                                                            type="datetimerange" arrow-control unlink-panels
                                                            range-separator="至" start-placeholder="开始时间"
                                                            end-placeholder="结束时间" placeholder="选择时间范围" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="报警时间"
                                                        :prop="'alarmTime.' + index + '.mergeAlarmTime'">
                                                        <el-time-picker
                                                            v-model="mergeRuleAddForm.alarmTime[index].mergeAlarmTime"
                                                            is-range range-separator="至" start-placeholder="开始时间"
                                                            end-placeholder="结束时间" placeholder="选择时间范围" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-button size="mini" type="text" icon="el-icon-delete"
                                                        style="color: #F56C6C" @click="delTimeInput(index)">删除
                                                    </el-button>
                                                </el-col>
                                            </el-row>

                                        </div>

                                    </div>

                                </el-card>

                            </div>

                        </el-row>
                    </div>



                </div>

            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isOpenMergeRuleAddDialog = false">取 消</el-button>
            <el-button @click="resetForm('mergeRuleAddForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('mergeRuleAddForm')">提交</el-button>

        </div>
    </el-dialog>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { addMergeRule, andRulesName, allContactor } from '@/api/rule/RuleConfig'
export default {
    name: 'MergeRuleAddDialog',
    props: {
        isOpenMergeRuleAddDialog: {
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
            mergeRuleAddForm: {
                alarmRuleDTO: {
                    alarmInterval: '',
                    alarmName: '',
                    grade: 1,
                    id: '',
                    // isVideo: true,
                    jsonObject: [[{
                        paramName: '',
                        paramValue: ''
                    }]],
                    rules: [],
                    alarmReceivers: [],
                    // contactNumber: "",
                    triggerNum: '',
                    type: "2",
                    // videoTime: ''
                },
                alarmTime: [{
                    alarmEt: {
                        date: 0,
                        day: 0,
                        hours: 0,
                        minutes: 0,
                        month: 0,
                        seconds: 0,
                        time: 0,
                        timezoneOffset: 0,
                        year: 0
                    },
                    alarmSt: {
                        date: 0,
                        day: 0,
                        hours: 0,
                        minutes: 0,
                        month: 0,
                        seconds: 0,
                        time: 0,
                        timezoneOffset: 0,
                        year: 0
                    },
                    dateType: '',
                    endTime: "2022-11-11T08:18:58.820Z",
                    groupId: '',
                    ruleId: '',
                    startTime: "2022-11-11T08:18:58.820Z",
                    timeId: '',
                    mergeAlarmDate: '',
                    mergeAlarmTime: '',
                }]
            },
            rulesType: [{
                value: '1',
                label: '交集规则'
            }, {
                value: '2',
                label: '并集规则'
            }],
            timeDisplay: false,
            loading: false,
            isEmailDisabled: true, // 禁用邮件
            isTelDisabled: true, // 禁用电话
            isAppDisabled: true, // 禁用App
            appUser: '',
            emailType: "",
            telphone: "",
            // extraList: [{}],
            options: [{
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
            }],
            alertTypeOptions: [{ id: 3, status: '1', type: '1', contact: 'fyved24@163.com' }, { id: 2, status: '1', type: '1', contact: 'fyved24@163.com' }],

        };
    },
    mounted() {
        this.getAllContactor()
    },
    methods: {
        ...mapActions('RuleConfig', {
            monitorGroupRule: 'getAllMonitorGroupIdNameLocationByActions',
            getGroupIdName: 'getAllMonitorGroupIdNameByActions',
            getGroupList: 'getAllMonitorGroupIdByActions'
        }),
        // 获取所有通知联系人
        getAllContactor() {
            allContactor().then(res => {
                if (res.code == 200) {
                    this.alertTypeOptions = res.data
                    console.log("成功获得已有通知方式");
                    console.log(this.alertTypeOptions);
                }
            })
        },
        async initRuleConfigInfo() {
            await this.getGroupIdName()
        },
        handleClose() {
            this.$emit('closeDialog')
        },
        addExtraInput() {
            this.mergeRuleAddForm.alarmRuleDTO.rules.push("")
        },
        /** 根据数组索引删除一行键值对 */
        delExtraInput(index) {
            this.mergeRuleAddForm.alarmRuleDTO.rules.splice(index, 1)
        },
        addTimeInput() {
            this.mergeRuleAddForm.alarmTime.push({})
        },
        /** 根据数组索引删除一行键值对 */
        delTimeInput(index) {
            this.mergeRuleAddForm.alarmTime.splice(index, 1)
        },
        // // 改变报警通知方式
        // changeType() {
        //     if (this.mergeRuleAddForm.alarmRuleDTO.alertType === '邮件通知') {
        //         this.isEmailDisabled = false
        //         this.isTelDisabled = true
        //         this.isAppDisabled = true
        //         this.telphone = ''
        //         this.appUser = ''
        //     } else if (this.mergeRuleAddForm.alarmRuleDTO.alertType === '手机短信') {
        //         this.isEmailDisabled = true
        //         this.isTelDisabled = false
        //         this.isAppDisabled = true
        //         this.appUser = ''
        //         this.emailType = ''
        //     } else if (this.mergeRuleAddForm.alarmRuleDTO.alertType === 'App通知') {
        //         this.isEmailDisabled = true
        //         this.isTelDisabled = true
        //         this.isAppDisabled = false
        //         this.emailType = ''
        //         this.telphone = ''
        //     } else {
        //         this.isEmailDisabled = true
        //         this.isTelDisabled = true
        //         this.isAppDisabled = true
        //         this.emailType = ''
        //         this.telphone = ''
        //         this.appUser = ''

        //     }
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
                    console.log(this.mergeRuleAddForm);
                    // switch (this.mergeRuleAddForm.alarmRuleDTO.alertType) {
                    //     case '站内通知':
                    //         this.mergeRuleAddForm.alarmRuleDTO.alertType = '0'
                    //         break
                    //     case '邮件通知':
                    //         this.mergeRuleAddForm.alarmRuleDTO.alertType = '1'
                    //         this.mergeRuleAddForm.alarmRuleDTO.contactNumber = this.emailType
                    //         break
                    //     case '手机短信':
                    //         this.mergeRuleAddForm.alarmRuleDTO.alertType = '2'
                    //         this.mergeRuleAddForm.alarmRuleDTO.contactNumber = this.telphone
                    //         break
                    //     case 'App通知':
                    //         this.mergeRuleAddForm.alarmRuleDTO.alertType = '3'
                    //         this.mergeRuleAddForm.alarmRuleDTO.contactNumber = this.appUser
                    //         break
                    // }
                    for (let item of this.mergeRuleAddForm.alarmTime) {
                        if (item.mergeAlarmDate && item.mergeAlarmTime) {
                            item.startTime = new Date(item.mergeAlarmDate[0]).getTime();
                            item.endTime = new Date(item.mergeAlarmDate[1]).getTime();
                            item.alarmSt = new Date(item.mergeAlarmTime[0]).getTime();
                            item.alarmEt = new Date(item.mergeAlarmTime[1]).getTime();

                        }
                    }

                    console.log(this.mergeRuleAddForm);

                    addMergeRule(this.mergeRuleAddForm).then((res) => {
                        if (res.code === 200) {
                            this.$message({
                                duration: 3000,
                                type: 'success',
                                message: '添加并集规则成功'
                            })
                            this.monitorGroupRule()
                            this.getGroupList()
                            this.handleClose()
                            this.loading = false
                            // location.reload()
                            this.$emit('getOrRuleList')

                        }
                    }).catch(() => {
                        this.$message({
                            duration: 1000,
                            type: 'error',
                            message: '添加并集规则失败'
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
        },
        getExistRulesName() {
            andRulesName().then((res) => {
                if (res.code === 200) {
                    console.log("成功获得已有规则");
                    console.log(res.data);
                    this.options = res.data;
                }
            }).catch(() => {
                this.$message({
                    duration: 1000,
                    type: 'error',
                    message: '获取已有规则失败'
                })
                this.loading = false
            })
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
        this.getExistRulesName()
        this.initRuleConfigInfo()

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
    margin-left: 10px !important;
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
    height: 800px;

}

.form-rule {
    padding: 20px;

}

.form-input {
    float: left;
    width: 95%;
    /* padding: 20px; */
    /* width: 40%; */
    height: 400px;

    /* background-color: #fff; */
}

.form-output {
    float: left;
    height: 400px;
    width: 95%;
    /* margin-top: 20px; */
}

.form-output {
    float: left;
    height: 400px;
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
    height: 300px;
    overflow: auto;

}

.alarm-time_body {
    margin-bottom: 20px;
    height: 140px;
    padding: 20px 20px;
    background-color: rgb(249, 249, 249);
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

/* .form-flex-display {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
} */
</style>
