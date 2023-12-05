<template>
  <section id="Intersect-rule-table">
    <avue-crud :data="monitorGroupData" :option="monitorGroupOption" :row-style="monitorGroupRowStyle"
      @selection-change="selectionChange">
      <template slot="alarmRuleDTO.alarmName" slot-scope="scope">
        {{ scope.row.alarmRuleDTO.alarmName }}
        <!--<el-tag class="info-tag small-info-tag info-tag-purple" effect="plain"> {{ scope.row.alarmRuleDTO.alarmName }}
        </el-tag>-->
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

        <el-tag effect="plain" class="circle-tag" type="warning" v-else>✖
        </el-tag>

      </template> -->

      <template slot="alarmRuleDTO.alarmInterval" slot-scope="scope">
        <el-tag class="info-tag small-info-tag info-tag-orange" effect="plain">{{
          scope.row.alarmRuleDTO.alarmInterval
        }}s
        </el-tag>
      </template>
      <!-- <template slot="alarmRuleDTO.videoTime" slot-scope="scope">
        <el-tag v-if="scope.row.alarmRuleDTO.isVideo" class="info-tag small-info-tag info-tag-orange" effect="plain">{{
            scope.row.alarmRuleDTO.videoTime
          }}s
        </el-tag>
        <el-tag v-else class="circle-tag" effect="plain" type="warning">✖
        </el-tag>

      </template> -->
      <template slot="alarmRuleDTO.triggerNum" slot-scope="scope">
        <el-tag class="info-tag small-info-tag info-tag-orange" effect="plain">{{ scope.row.alarmRuleDTO.triggerNum }}
        </el-tag>
      </template>

      <template slot="alarmRuleDTO.rules1" slot-scope="scope">
        <el-tag v-if="scope.row.alarmRuleDTO.rules.indexOf(1) >= 0" class="circle-tag" effect="plain" type="success">✔
        </el-tag>
        <el-tag v-else class="circle-tag" effect="plain" type="warning">✖
        </el-tag>
      </template>
      <template slot="alarmRuleDTO.rules2" slot-scope="scope">
        <el-tag v-if="scope.row.alarmRuleDTO.rules.indexOf(2) >= 0" class="circle-tag" effect="plain" type="success">✔
        </el-tag>
        <el-tag v-else class="circle-tag" effect="plain" type="warning">✖
        </el-tag>
      </template>
      <template slot="alarmRuleDTO.rules3" slot-scope="scope">
        <el-tag v-if="scope.row.alarmRuleDTO.rules.indexOf(3) >= 0" class="circle-tag" effect="plain" type="success">✔
        </el-tag>
        <el-tag v-else class="circle-tag" effect="plain" type="warning">✖
        </el-tag>
      </template>
      <template slot="alarmRuleDTO.rules4" slot-scope="scope">
        <el-tag v-if='scope.row.alarmRuleDTO.rules.indexOf(4) >= 0' class="circle-tag" effect="plain" type="success">✔
        </el-tag>
        <el-tag v-else class="circle-tag" effect="plain" type="warning">✖
        </el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button icon="el-icon-edit" round size="small" type="primary" @click="handleEditMonitor(scope.row)">编辑规则
        </el-button>
        <el-button v-if="scope.row.groupId !== 0" icon="el-icon-delete" round size="small" type="primary"
          @click="handleDeleteMonitor(scope.row)">删除
        </el-button>

      </template>
      <template slot="menuLeft">
        <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAddMonitor">新增规则
        </el-button>
        <el-button icon="el-icon-delete" size="small" type="primary" @click="delSelection">删除规则
        </el-button>
      </template>
    </avue-crud>
    <intersect-rule-edit-dialog v-if="isOpenIntersectRuleEditDialog"
      :is-open-intersect-rule-edit-dialog="isOpenIntersectRuleEditDialog"
      :monitor-group-config-form-data="editMonitorData" @closeDialog="isOpenIntersectRuleEditDialog = false"  @getAndRuleList="getAndRuleList"/>
    <intersect-rule-add-dialog v-if="isOpenIntersectRuleAddDialog" :intersect-rule-add-form-data="editMonitorData"
      :is-open-intersect-rule-add-dialog="isOpenIntersectRuleAddDialog"
      @closeDialog="isOpenIntersectRuleAddDialog = false"  @getAndRuleList="getAndRuleList"/>

  </section>
</template>

<script>
import IntersectRuleEditDialog from '@/views/rule/MonitorGroup/IntersectRuleEditDialog'
import IntersectRuleAddDialog from '@/views/rule/MonitorGroup/IntersectRuleAddDialog'
// import { mapGetters, mapActions } from 'vuex'
import { deleteAlarmTimeById, deleteAlarmTimeByIds, getRuleList } from '@/api/rule/RuleConfig'
// import { log } from 'three'


export default {
  name: 'IntersectRuleTable',
  components: { IntersectRuleAddDialog, IntersectRuleEditDialog },
  props: {
    searchBoxValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isOpenIntersectRuleEditDialog: false,
      isOpenIntersectRuleAddDialog: false,
      // 传入编辑表单中的数据
      editMonitorData: {},
      // 批量删除的ID
      ids: [],
      monitorGroupData:[]
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
        column: [
          {
            label: '规则名称',
            prop: 'alarmRuleDTO.alarmName'
          },
          // {
          //   label: '报警日期',
          //   prop: 'alarmTime.startTime',
          //   width: '120px'
          // },
          // {
          //   label: '报警时间',
          //   prop: 'alarmTime.alarmEt'
          // },
          // {
          //   label: '时间类型',
          //   prop: 'alarmTime.dateType'
          // },
          {
            label: '报警间隔',
            prop: 'alarmRuleDTO.alarmInterval'
          },
          // {
          //   label: '录像间隔',
          //   prop: 'alarmRuleDTO.videoTime'
          // },

          {
            label: '触发次数',
            prop: 'alarmRuleDTO.triggerNum'
          },
          {
            label: '破坏雷达规则',
            prop: 'alarmRuleDTO.rules1'
          },
          {
            label: '聚集规则',
            prop: 'alarmRuleDTO.rules2'
          },
          {
            label: '聚集时间',
            prop: 'alarmRuleDTO.rules3'
          },
          {
            label: '打架',
            prop: 'alarmRuleDTO.rules4'
          }
        ]
      }
    },
    // 表格中的数据
    // monitorGroupData() {
    //   const monitorGroupData = []
    //   // let intersectRuleForm = {
    //   //   alarmRuleDTO: {
    //   //     alarmInterval: '10',
    //   //     alarmName: '1',
    //   //     grade: 1,
    //   //     id: '1',
    //   //     isVideo: true,
    //   //     jsonObject: [
    //   //       [{
    //   //         paramName: 'distance',
    //   //         paramValue: '10'
    //   //       }]
    //   //       ,
    //   //       [{
    //   //         paramName: 'wild',
    //   //         paramValue: '10'
    //   //       }, {
    //   //         paramName: 'peopleNumberThreshold',
    //   //         paramValue: '5'
    //   //       }]
    //   //       ,
    //   //       [{
    //   //         paramName: 'wild',
    //   //         paramValue: ''
    //   //       }, {
    //   //         paramName: 'peopleNumberThreshold',
    //   //         paramValue: ''
    //   //       }, {
    //   //         paramName: 'seconds',
    //   //         paramValue: ''
    //   //       }]
    //   //       ,
    //   //       []
    //   //     ],
    //   //     rules: [1,2],
    //   //     triggerNum: '1',
    //   //     type: "1",
    //   //     videoTime: '1'
    //   //   },
    //   //   alarmTime: {
    //   //     alarmEt:  "08:18:58",
    //   //     alarmSt:  "08:18:58",
    //   //     dateType: '1',
    //   //     endTime: "2022-11-11",
    //   //     groupId: '1',
    //   //     ruleId: '1',
    //   //     startTime: "2022-11-11",
    //   //     timeId: '1',
    //   //     intersectAlarmDate: ['2022-11-11','2022-11-11'],
    //   //     intersectAlarmTime: ['2022-11-11T08:18:58.820Z','2022-11-11T08:18:58.820Z'],
    //   //   }
    //   // }
    //   // monitorGroupData.push(intersectRuleForm)
    //   getRuleList(1).then((res) => {
    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
    //     console.log(res.data);

    //     res.data.forEach((i) => {
    //         // console.log(i);
    //         console.log(i);
    //         // i.alarmTime.dateType = (i.alarmTime.dateType).toString();
    //         // i.alarmTime.intersectAlarmDate = []
    //         // i.alarmTime.intersectAlarmTime = []
    //         // i.alarmTime.intersectAlarmDate[0] = i.alarmTime.startTime
    //         // i.alarmTime.intersectAlarmDate[1] = i.alarmTime.endTime
    //         // i.alarmTime.intersectAlarmTime[0] = new Date('2021-11-18 ' + i.alarmTime.alarmSt).toString();
    //         // i.alarmTime.intersectAlarmTime[1] = new Date('2021-11-18 ' + i.alarmTime.alarmEt).toString();
    //         console.log(i);
    //         monitorGroupData.push(i)

    //       }
    //     )
    //     console.log(monitorGroupData);
    //   })


    //   return monitorGroupData
    // },

  },
  mounted(){
    this.getAndRuleList()
  },
  methods: {
    getAndRuleList() {
      this.monitorGroupData = []
      getRuleList(1).then((res) => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(res.data);

        res.data.forEach((i) => {
          // console.log(i);
          console.log(i);
          // i.alarmTime.dateType = (i.alarmTime.dateType).toString();
          // i.alarmTime.intersectAlarmDate = []
          // i.alarmTime.intersectAlarmTime = []
          // i.alarmTime.intersectAlarmDate[0] = i.alarmTime.startTime
          // i.alarmTime.intersectAlarmDate[1] = i.alarmTime.endTime
          // i.alarmTime.intersectAlarmTime[0] = new Date('2021-11-18 ' + i.alarmTime.alarmSt).toString();
          // i.alarmTime.intersectAlarmTime[1] = new Date('2021-11-18 ' + i.alarmTime.alarmEt).toString();
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
    // 点击编辑 传入哨兵组整体信息
    handleEditMonitor(monitorData) {
      console.log("monitorData");
      console.log(monitorData);
      // monitorData.alarmTime.dateType=(monitorData.alarmTime.dateType).toString();
      // monitorData.alarmTime.intersectAlarmDate=[]
      // monitorData.alarmTime.intersectAlarmTime=[]
      // monitorData.alarmTime.intersectAlarmDate[0] = monitorData.alarmTime.startTime
      // monitorData.alarmTime.intersectAlarmDate[1] = monitorData.alarmTime.endTime
      // monitorData.alarmTime.intersectAlarmTime[0] = new Date('2021-11-18 '+monitorData.alarmTime.alarmSt).toString();
      // monitorData.alarmTime.intersectAlarmTime[1] = new Date('2021-11-18 '+monitorData.alarmTime.alarmEt).toString();
      this.editMonitorData = monitorData
      console.log("this.editMonitorData");
      console.log(this.editMonitorData);
      this.isOpenIntersectRuleEditDialog = true

    },
    // 点击新增规则
    handleAddMonitor() {
      this.editMonitorData = {}
      this.isOpenIntersectRuleAddDialog = true
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
            this.getAndRuleList()
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
            location.reload()
            // this.getAllIntersectRuleInfo()
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
