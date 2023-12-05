<template>
  <section id="Merge-rule-table">
    <avue-crud ref="crud" :option="monitorGroupOption" :data="monitorGroupData" :row-style="monitorGroupRowStyle"
      @selection-change="selectionChange"> <!--@expand-change="expandChanges">-->
      <!--<template slot="expand" slot-scope="scope">
        <el-table :data="scope.row.alarmTime" style="width: 100%;margin:10px">
          <el-table-column prop="startTime" label="开始日期" width="180">
          </el-table-column>
          <el-table-column prop="endTime" label="结束日期" width="180">
          </el-table-column>
          <el-table-column prop="alarmSt" label="开始时间" width="180">
          </el-table-column>
          <el-table-column prop="alarmEt" label="结束时间" width="180">
          </el-table-column>
          <el-table-column prop="dateType" label="时间类型" width="180">
            <template slot-scope="scope">
              <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple" v-if="scope.row.dateType === '0'">
                {{ '周末' }}
              </el-tag>
              <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
                v-else-if="scope.row.dateType === '1'">{{ '工作日' }}
              </el-tag>
              <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
                v-else-if="scope.row.dateType === '2'">{{ '节假日' }}
              </el-tag>
              <el-tag effect="plain" class="circle-tag" type="warning" v-else>{{ 'x' }}
              </el-tag>
            </template>
          </el-table-column>

        </el-table>-->
        <!--
        <template slot="alarmTime.dateType" slot-scope="scope">
          <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
            v-if="scope.row.alarmTime.dateType === '0'">
            {{ '周末' }}
          </el-tag>
          <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
            v-else-if="scope.row.alarmTime.dateType === '1'">{{ '工作日' }}
          </el-tag>
          <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
            v-else-if="scope.row.alarmTime.dateType === '2'">{{ '节假日' }}
          </el-tag>


          <el-tag effect="plain" class="circle-tag" type="warning" v-else>{{ 'x' }}
          </el-tag>

        </template> -->

      <!--</template>-->

      <template slot="alarmRuleDTO.alarmName" slot-scope="scope">
        {{ scope.row.alarmRuleDTO.alarmName }}
<!--        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"> {{ scope.row.alarmRuleDTO.alarmName }}
        </el-tag>-->
      </template>

      <template slot="alarmTime.date" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag
            v-if="scope.row.alarmTime[0].startTime === null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.alarmTime[0].startTime !== null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.alarmTime[0].startTime }}
          </el-tag>
          <span>|</span>
          <el-tag
            v-if="scope.row.alarmTime[0].endTime === null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.alarmTime[0].endTime !== null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.alarmTime[0].endTime }}
          </el-tag>
        </div>
      </template>
      <template slot="alarmTime.time" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag
            v-if="scope.row.alarmTime[0].alarmSt === null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.alarmTime[0].alarmSt !== null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.alarmTime[0].alarmSt }}
          </el-tag>
          <span>|</span>
          <el-tag
            v-if="scope.row.alarmTime[0].alarmEt === null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.alarmTime[0].alarmEt !== null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.alarmTime[0].alarmEt }}
          </el-tag>
        </div>
      </template>

      <template slot="alarmTime.dateType" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple" v-if="scope.row.alarmTime[0].dateType === '0'">{{ '周末' }}
        </el-tag>
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple" v-else-if="scope.row.alarmTime[0].dateType === '1'">{{ '工作日' }}
        </el-tag>
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple" v-else-if="scope.row.alarmTime[0].dateType === '2'">{{ '节假日' }}
        </el-tag>
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple" v-else-if="scope.row.alarmTime[0].dateType === '3'">{{ '每天' }}
        </el-tag>
        <el-tag effect="plain" class="circle-tag" type="warning" v-else>{{ 'x' }}
        </el-tag>
      </template>

      <template slot="alarmRuleDTO.alarmReceivers" slot-scope="scope">
<!--        <el-select v-model="scope.row.alarmRuleDTO.alarmReceivers" multiple placeholder="请选择">
          <el-option v-for="item in alertTypeOptions" :key="item.id" :label="item.contact"
                     :value="item.id">
          </el-option>
        </el-select>-->
        <el-tag v-for="item in alertOptions(scope.row.alarmRuleDTO.alarmReceivers)"
                :key="item.id" effect="plain" class="info-tag small-info-tag info-tag-orange tag-surround">
            {{item.contact}}
        </el-tag>
      </template>

      <!-- <template slot="alarmTime.startTime" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag v-if="scope.row.alarmTime.startTime === null" effect="plain" class="info-tag info-tag-purple">
            {{ '未设置' }}
          </el-tag>
          <el-tag v-if="scope.row.alarmTime.startTime !== null" effect="plain" class="info-tag info-tag-purple">
            {{ scope.row.alarmTime.startTime }}
          </el-tag>
          <span>|</span>
          <el-tag v-if="scope.row.alarmTime.endTime === null" effect="plain" class="info-tag info-tag-purple">
            {{ '未设置' }}
          </el-tag>
          <el-tag v-if="scope.row.alarmTime.endTime !== null" effect="plain" class="info-tag info-tag-purple">
            {{ scope.row.alarmTime.endTime }}
          </el-tag>
        </div>
      </template>
      <template slot="alarmTime.alarmEt" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag v-if="scope.row.alarmTime.alarmSt === null" effect="plain"
            class="info-tag small-info-tag info-tag-purple">
            {{ '未设置' }}
          </el-tag>
          <el-tag v-if="scope.row.alarmTime.alarmSt !== null" effect="plain"
            class="info-tag small-info-tag info-tag-purple">
            {{ scope.row.alarmTime.alarmSt }}
          </el-tag>
          <span>|</span>
          <el-tag v-if="scope.row.alarmTime.alarmEt === null" effect="plain"
            class="info-tag small-info-tag info-tag-purple">
            {{ '未设置' }}
          </el-tag>
          <el-tag v-if="scope.row.alarmTime.alarmEt !== null" effect="plain"
            class="info-tag small-info-tag info-tag-purple">
            {{ scope.row.alarmTime.alarmEt }}
          </el-tag>
        </div>
      </template>

      <template slot="alarmTime.dateType" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
          v-if="scope.row.alarmTime.dateType === '0'">
          {{ '周末' }}
        </el-tag>
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
          v-else-if="scope.row.alarmTime.dateType === '1'">{{ '工作日' }}
        </el-tag>
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-purple"
          v-else-if="scope.row.alarmTime.dateType === '2'">{{ '节假日' }}
        </el-tag>


        <el-tag effect="plain" class="circle-tag" type="warning" v-else>{{ 'x' }}
        </el-tag>

      </template>
       -->

      <!--<template slot="alarmRuleDTO.alarmInterval" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-orange">{{
          scope.row.alarmRuleDTO.alarmInterval
        }}s
        </el-tag>
      </template>-->
      <!-- <template slot="alarmRuleDTO.videoTime" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-orange" v-if="scope.row.alarmRuleDTO.isVideo">{{
          scope.row.alarmRuleDTO.videoTime
        }}s
        </el-tag>
        <el-tag effect="plain" class="circle-tag" type="warning" v-else>✖
        </el-tag>

      </template> -->
      <!--<template slot="alarmRuleDTO.triggerNum" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-orange">{{ scope.row.alarmRuleDTO.triggerNum }}
        </el-tag>
      </template>
      <template slot="alarmRuleDTO.grade" slot-scope="scope">
        <el-tag effect="plain" class="info-tag small-info-tag info-tag-orange">{{ scope.row.alarmRuleDTO.grade }}
        </el-tag>
      </template>-->


      <template slot-scope="scope" slot="menu">
        <el-button type="primary" icon="el-icon-edit" size="small" round @click="handleEditMonitor(scope.row)">编辑规则
        </el-button>
        <el-button v-if="scope.row.groupId !== 0" type="primary" icon="el-icon-delete" size="small" round
          @click="handleDeleteMonitor(scope.row)">删除
        </el-button>

      </template>
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddMonitor">新增规则
        </el-button>
        <el-button type="primary" icon="el-icon-delete" size="small" @click="delSelection">删除规则
        </el-button>
      </template>
    </avue-crud>


    <merge-rule-edit-dialog v-if="isOpenMergeRuleEditDialog" :monitor-group-config-form-data="editMonitorData"
      :is-open-merge-rule-edit-dialog="isOpenMergeRuleEditDialog" @closeDialog="isOpenMergeRuleEditDialog = false" @getOrRuleList="getOrRuleList"/>

    <merge-rule-add-dialog v-if="isOpenMergeRuleAddDialog" :merge-rule-add-form-data="editMonitorData"
      :is-open-merge-rule-add-dialog="isOpenMergeRuleAddDialog" @closeDialog="isOpenMergeRuleAddDialog = false" @getOrRuleList="getOrRuleList"/>

  </section>
</template>

<script>
import MergeRuleEditDialog from '@/views/rule/MonitorGroup/MergeRuleEditDialog'
import MergeRuleAddDialog from '@/views/rule/MonitorGroup/MergeRuleAddDialog'
// import { mapGetters, mapActions } from 'vuex'
import {allContactor, deleteAlarmTimeById, deleteAlarmTimeByIds, getRuleList} from '@/api/rule/RuleConfig'
// import { log } from 'three'



export default {
  name: 'MergeRuleTable',
  components: { MergeRuleAddDialog, MergeRuleEditDialog },
  props: {
    searchBoxValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      monitorGroupData: [],
      isOpenMergeRuleEditDialog: false,
      isOpenMergeRuleAddDialog: false,
      // 传入编辑表单中的数据
      editMonitorData: {},
      // 批量删除的ID
      ids: [],
      alertTypeOptions: [{ id: 3, status: '1', type: '1', contact: 'fyved24@163.com' }, { id: 2, status: '1', type: '1', contact: 'fyved24@163.com' }],
    }
  },
  computed: {
    // ...mapGetters('RuleConfig', {
    //   monitorGroupRule: 'getMonitorList'
    // }),
    // 表格配置相关选项
    monitorGroupOption() {
      return {
        align: 'center',
        border: true,
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        header: true,
        addBtn: false,
        selection: true, // 开启多选功能
        // menuWidth:300,
        // expand: true, // 开启多选功能
        // defaultExpandAll:false,
        // expandRowKeys:[],
        rowKey: 'alarmRuleDTO.id',
        column: [
          {
            label: '规则名称',
            prop: 'alarmRuleDTO.alarmName'
          },
          {
            label: '报警日期',
            prop: 'alarmTime.date'
          },
          {
            label: '报警时间',
            prop: 'alarmTime.time'
          },
          {
            label: '时间类型',
            prop: 'alarmTime.dateType'
          },
          {
            label: '报警输出方式',
            prop: 'alarmRuleDTO.alarmReceivers'
          }
          // {
          //   label: '报警间隔',
          //   prop: 'alarmRuleDTO.alarmInterval'
          // },
          // {
          //   label: '录像间隔',
          //   prop: 'alarmRuleDTO.videoTime'
          // },

          // {
          //   label: '触发次数',
          //   prop: 'alarmRuleDTO.triggerNum'
          // },
          // {
          //   label: '级别',
          //   prop: 'alarmRuleDTO.grade'
          // }
        ]
      }
    },
    // // 表格中的数据
    // monitorGroupData() {
    //   const monitorGroupData = []
    //   getRuleList(2).then((res) => {
    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
    //     console.log(res.data);
    //     // monitorGroupData = res.data;
    //     res.data.forEach((i, index) => {
    //       // i.id=index
    //       console.log(i);
    //       for (let item of i.alarmTime) {
    //         item.dateType = (item.dateType).toString();
    //         item.mergeAlarmDate = []
    //         item.mergeAlarmTime = []
    //         item.mergeAlarmDate[0] = item.startTime
    //         item.mergeAlarmDate[1] = item.endTime
    //         item.mergeAlarmTime[0] = new Date('2021-11-18 ' + item.alarmSt).toString();
    //         item.mergeAlarmTime[1] = new Date('2021-11-18 ' + item.alarmEt).toString();
    //       }

    //       console.log(i);
    //       monitorGroupData.push(i)

    //     }
    //     )
    //     console.log(monitorGroupData);
    //   })


    //   return monitorGroupData
    // },

  },
  mounted(){
    this.getOrRuleList()
    this.getAllContactor()
  },
  methods: {
    getOrRuleList() {
      this.monitorGroupData = []
      getRuleList(2).then((res) => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(res.data);
        // monitorGroupData = res.data;
        res.data.forEach((i, index) => {
          // i.id=index
          console.log(i);
          for (let item of i.alarmTime) {
            item.dateType = (item.dateType).toString();
            item.mergeAlarmDate = []
            item.mergeAlarmTime = []
            item.mergeAlarmDate[0] = item.startTime
            item.mergeAlarmDate[1] = item.endTime
            item.mergeAlarmTime[0] = new Date('2021-11-18 ' + item.alarmSt).toString();
            item.mergeAlarmTime[1] = new Date('2021-11-18 ' + item.alarmEt).toString();
          }

          console.log(i);
          this.monitorGroupData.push(i)

        }
        )
        console.log(this.monitorGroupData);
      })

    },
    monitorGroupRowStyle({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: 'rgba(127,255,170, .1)'
        }
      }
      return {
        backgroundColor: 'rgba(127,255,170, .17)'
      }
    },
    expandChanges(row, expendList) {
      console.log(row, expendList);
      console.log('展开回调');
    },
    // 点击编辑 传入哨兵组整体信息
    handleEditMonitor(monitorData) {
      console.log("monitorData");
      console.log(monitorData);

      this.editMonitorData = monitorData
      console.log("this.editMonitorData");
      console.log(this.editMonitorData);
      this.isOpenMergeRuleEditDialog = true
    },
    // 点击新增规则
    handleAddMonitor() {
      this.editMonitorData = {}
      this.isOpenMergeRuleAddDialog = true
    },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDeleteMonitor(MonitorRowData) {
      // const requestBody = {
      //   id: MonitorRowData.alarmRuleDTO.id
      // }
      const requestBody = MonitorRowData.alarmRuleDTO.id

      console.log("删除", requestBody);
      this.openDelConfirm().then(() => {
        deleteAlarmTimeById(requestBody)
          .then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '删除规则成功'
            })
            // this.getAllMonitorGroupInfo()
            // location.reload()
            this.getOrRuleList()
          })
          .catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '删除规则失败'
            })
          })
      })

    },
    // // 批量删除
    delSelection() {
      if (this.ids.length !== 0) { // ids为之定义的数组属性值，在data()中定义
        this.$confirm('是否确认删除选中的所有记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // const requestBody = {
          //   ids: this.ids
          // }
          const requestBody = this.ids

          deleteAlarmTimeByIds(requestBody).then(data => {
            this.$message.success('删除成功')
            // this.getAllMergeRuleInfo()
            // location.reload()
            this.getOrRuleList()
          })

        })
      } else {
        this.$message.error('未选中任何项')
      }

    },
    // 选中的数据，每选中一次，执行一次
    selectionChange(item) {
      console.log(item)
      this.ids = [] // 每次清空
      item.forEach((items) => {
        this.ids.push(items.alarmRuleDTO.id)
      })
      console.log(this.ids)
    },
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
    alertOptions: function(options) {
      return this.alertTypeOptions.filter((item) => {
        console.log(options)
        if (options !== null) {
          if (options.includes(item.id)) return item
        } else return null
      })
    }
  }
}
</script>

<style scoped>
.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.two-row-tag {
  display: block;
  height: 50%;
}

.circle-tag {
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
}

.tag-surround {
  margin: 2px;
}

/deep/ .el-tag {
  width: 100%;
  height: 100%;
  line-height: 1.8rem;
}

/deep/ .el-table {
  max-height: 30%;
  overflow: auto;
}

/deep/ .small-info-tag {
  width: 70%;
}

/deep/ .info-tag-orange {
  border-color: #FF8C00 !important;
  color: #FF8C00 !important;
}

/deep/ .info-tag-purple {
  border-color: #9370DB !important;
  color: #9370DB !important;
}
</style>


