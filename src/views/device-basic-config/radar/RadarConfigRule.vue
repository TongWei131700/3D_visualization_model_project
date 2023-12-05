<template>
    <el-dialog id="radar-config-rule-dialog" :title="getDialogTitle" center :show-close="false"
        :visible="isConfigRuleDialogOpen" @close="handleClose">
        <el-form ref="form" :model="form" label-width="150px" label-position="left">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="雷达所属绑定组" prop="monitorName">
                        <el-select v-model="form.groupId" placeholder="请选择" disabled>
                            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                                :value="Number(item.value)" />
                        </el-select>
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
                        <el-input v-model="form.radarName" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="规则名称">
                        <el-select v-model="form.ruleId" placeholder="已有规则">
                            <el-option v-for="item in options" :key="item.id" :label="item.alarmName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="规则是否启用">
                        <el-select v-model="form.RulesOnOff" placeholder="请选择">
                            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="success" icon="el-icon-circle-check" @click="handleSubmit">
                提交
            </el-button>
            <el-button style="margin-left: 150px" type="primary" icon="el-icon-circle-close" @click="handleClose">
                取消
            </el-button>
        </span>
    </el-dialog>
</template>
  
<script>

import { AddRuleBind } from '@/api/rule/RuleConfig'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { orRulesName } from '@/api/rule/RuleConfig'

export default {
    name: 'RadarConfigRuleDialog',
    props: {
        editingInfo: {
            type: Object,
            default: () => { }
        },
        isConfigRuleDialogOpen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            form: {
                groupId: '',
                groupName: '',
                radarId: '',
                radarSn: '',
                radarName: '',
                ruleId:'',
                RulesOnOff:''
            },
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
            options1: [{
                value: '1',
                label: '开启'
            }, {
                value: '0',
                label: '关闭'
            }],

        }
    },
    computed: {
        ...mapGetters('BasicConfig', {
            monitorInfo: 'getmonitorInfo'
        }),
        getDialogTitle() {
            return `雷达- ${this.form.radarName} - 规则配置`
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
                    this.options = res.data;
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
            console.log(this.form);
            console.log("this.form");
            const requestBody = {

                radarSn: this.form.radarSn,
                ruleId: this.form.ruleId,
                RulesOnOff: this.form.RulesOnOff,

            }
            console.log(requestBody)
            this.$refs.form.validate((valid) => {
                if (valid) {
                    AddRuleBind(requestBody).then(() => {
                        this.$message({
                            duration: 1000,
                            type: 'success',
                            message: '雷达绑定规则成功'
                        })
                        this.handleClose()
                    }).catch(() => {
                        this.$message({
                            duration: 1000,
                            type: 'error',
                            message: '雷达绑定规则失败'
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
        console.log(this.form,"this.form");
        this.getExistRulesName()

    }
}
</script>
  
<style scoped>
/deep/ .el-select {
    width: 100%;
}

#radar-config-rule-dialog {
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
  