<template>
    <el-dialog id="sensor-bind" :title="getDialogTitle" center :show-close="false" :visible="isSensorBindDialogOpen"
        @close="handleClose">
        <el-form ref="form" :model="form" label-width="150px" label-position="left">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="雷达所属绑定组" prop="monitorName">
                        <el-select v-model="form.groupId" placeholder="请选择" disabled>
                            <el-option v-for="item in sensorConfigSearchBoxOption" :key="item.value" :label="item.label"
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
                <el-button size="mini" type="text" icon="el-icon-plus" @click="addSensor">
                    添加一个传感器
                </el-button>
                <div v-for="(item, index) in form.sensorSn" :key="index">
                    <el-col :span="14">
                        <el-form-item label="传感器名称">
                            <el-select v-model="form.sensorSn[index]" placeholder="已有传感器">
                                <el-option v-for="item in sensorOptions" :key="item.sensorSn" :label="item.sensorName"
                                    :value="item.sensorSn">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" v-if="form.sensorSn[index]">
                        <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C"
                            @click="handleSubmit(index)">新增绑定
                        </el-button>
                    </el-col>
                    <el-col :span="3">

                        <el-button v-if="form.sensorBind[index]" size="mini" type="text" icon="el-icon-delete"
                            style="color: #F56C6C" @click="delSensor(index)">删除已绑定传感器</el-button>
                        <el-button v-else size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C"
                            @click="delNewSensor(index)">取消新增传感器

                        </el-button>
                    </el-col>
                </div>


            </el-row>
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="传感器是否启用">
                        <el-select v-model="form.SensorsOnOff" placeholder="请选择">
                            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>

        <span slot="footer" class="dialog-footer">
            <!-- <el-button type="success" icon="el-icon-circle-check" @click="handleSubmit">
                提交
            </el-button> -->
            <el-button style="margin-left: 150px" type="primary" icon="el-icon-circle-close" @click="handleClose">
                取消
            </el-button>
        </span>
    </el-dialog>
</template>
  
<script>

import { setSensorBind, deleteSensorBind } from '@/api/device/BasicConfig'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { getAllSensor } from '@/api/device/BasicConfig'

export default {
    name: 'RadarSensorBindDialog',
    props: {
        editingInfo: {
            type: Object,
            default: () => { }
        },
        isSensorBindDialogOpen: {
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
                sensorSn: [""],
                sensorBind: [],
                // SensorsOnOff: ''
            },
            sensorOptions: [{
                sensorSn: '1',
                alarmName: '传感器一'
            }, {
                sensorSn: '2',
                alarmName: '传感器二'
            }, {
                sensorSn: '3',
                alarmName: '传感器三'
            }, {
                sensorSn: '4',
                alarmName: '传感器4'
            }, {
                sensorSn: '5',
                alarmName: '传感器5'
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
            return `雷达- ${this.form.radarName} - 传感器配置`
        },
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
            console.log(options)
            return options
        }
    },
    methods: {
        ...mapActions('BasicConfig', {
            getradarInfo: 'getAllRadarByActions'
        }),
        getExistSensorsName() {
            getAllSensor().then(res => {
                console.log("成功获得已有传感器");
                console.log("aaa", res);
                this.sensorOptions = res.data;
            }).catch(() => {
                this.$message({
                    duration: 1000,
                    type: 'error',
                    message: '获取已有传感器失败'
                })
                this.loading = false
            })
        },
        addSensor() {
            this.form.sensorSn.push('')
            this.form.sensorBind.push(false)
        },
        /** 根据数组索引删除一行键值对 */
        delNewSensor(index) {
            this.form.sensorSn.splice(index, 1)
            this.form.sensorBind.splice(index, 1)
            console.log("删除");
        },
        /** 删除已绑定传感器 */
        delSensor(index) {
            const requestBody = {

                radarSn: this.form.radarSn,
                sensorSn: this.form.sensorSn[index],
            }
            deleteSensorBind(requestBody).then(() => {
                this.$message({
                    duration: 1000,
                    type: 'success',
                    message: '删除已绑定传感器成功'
                })
                this.form.sensorSn.splice(index, 1)
                this.form.sensorBind.splice(index, 1)
                // this.handleClose()
            }).catch(() => {
                this.$message({
                    duration: 1000,
                    type: 'error',
                    message: '删除已绑定传感器失败'
                })
            })
            console.log("删除");
        },
        handleSubmit(index) {
            console.log(this.form);
            console.log("this.form");
            const requestBody = {

                radarSn: this.form.radarSn,
                sensorSn: this.form.sensorSn[index],
            }
            console.log(requestBody)
            this.$refs.form.validate((valid) => {
                if (valid) {
                    setSensorBind(requestBody).then((res) => {
                        console.log(res);
                        this.$message({
                            duration: 1000,
                            type: 'success',
                            message: '雷达绑定传感器成功'
                        })
                        
                        this.form.sensorBind[index]=true
                        this.handleClose()
                    }).catch(() => {
                        this.$message({
                            duration: 1000,
                            type: 'error',
                            message: '雷达绑定传感器失败'
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
        console.log(this.form, "this.form");
        this.getExistSensorsName()

    }
}
</script>
  
<style scoped>
/deep/ .el-select {
    width: 100%;
}

#radar-config-sensor-dialog {
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
  