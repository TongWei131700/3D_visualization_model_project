<template>
  <section id="monitor-group-table">
    <avue-crud
      :data="monitorGroupData"
      :option="monitorGroupOption"
      :row-style="monitorGroupRowStyle"
      @selection-change="selectionChange"
    >
      <template slot="monitorAlarmDate" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag
            v-if="scope.row.monitorAlarmDate[0] === null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.monitorAlarmDate[0] !== null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.monitorAlarmDate[0] }}
          </el-tag>
          <span>|</span>
          <el-tag
            v-if="scope.row.monitorAlarmDate[1] === null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.monitorAlarmDate[1] !== null"
            class="info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.monitorAlarmDate[1] }}
          </el-tag>
        </div>
      </template>
      <template slot="monitorAlarmTime" slot-scope="scope">
        <div class="flex-col-center">
          <el-tag
            v-if="scope.row.monitorAlarmTime[0] === null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.monitorAlarmTime[0] !== null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.monitorAlarmTime[0] }}
          </el-tag>
          <span>|</span>
          <el-tag
            v-if="scope.row.monitorAlarmTime[1] === null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ '未设置' }}
          </el-tag>
          <el-tag
            v-if="scope.row.monitorAlarmTime[1] !== null"
            class="info-tag small-info-tag info-tag-purple"
            effect="plain"
          >
            {{ scope.row.monitorAlarmTime[1] }}
          </el-tag>
        </div>
      </template>
      <template slot="dateType" slot-scope="scope">
        <el-tag
          class="info-tag small-info-tag info-tag-purple"
          effect="plain"
        >{{ scope.row.dateType }}
        </el-tag>
      </template>
      <template slot="alarmInterval" slot-scope="scope">
        <el-tag
          class="info-tag small-info-tag info-tag-orange"
          effect="plain"
        >{{ scope.row.alarmInterval }}s
        </el-tag>
      </template>
      <template slot="recordInterval" slot-scope="scope">
        <el-tag
          class="info-tag small-info-tag info-tag-orange"
          effect="plain"
        >{{ scope.row.recordInterval }}s
        </el-tag>
      </template>
      <template slot="recorderOnOff" slot-scope="scope">
        <el-tag
          v-if="scope.row.recorderOnOff === '1'"
          class="circle-tag"
          effect="plain"
          type="success"
        >✔
        </el-tag>
        <el-tag
          v-else
          class="circle-tag"
          effect="plain"
          type="warning"
        >✖
        </el-tag>
      </template>
      <template slot="groupOnOff" slot-scope="scope">
        <el-tag
          v-if="scope.row.groupOnOff === '1'"
          class="circle-tag"
          effect="plain"
          type="success"
        >✔
        </el-tag>
        <el-tag
          v-else
          class="circle-tag"
          effect="plain"
          type="warning"
        >✖
        </el-tag>
      </template>
      <template slot="photographOnOff" slot-scope="scope">
        <el-tag
          v-if="scope.row.photographOnOff === '1'"
          class="circle-tag"
          effect="plain"
          type="success"
        >✔
        </el-tag>
        <el-tag
          v-else
          class="circle-tag"
          effect="plain"
          type="warning"
        >✖
        </el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          icon="el-icon-edit"
          round
          size="small"
          type="primary"
          @click="handleEditMonitor(scope.row)"
        >编辑规则
        </el-button>
        <el-button
          v-if="scope.row.groupId !== 0"
          icon="el-icon-delete"
          round
          size="small"
          type="primary"
          @click="handleDeleteMonitor(scope.row)"
        >删除
        </el-button
        >
      </template>
      <template slot="menuLeft">
        <el-button
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="handleAddMonitor"
        >新增规则
        </el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          type="primary"
          @click="delSelection"
        >删除规则
        </el-button>
      </template>
    </avue-crud>
    <monitor-group-edit-dialog
      v-if="isOpenMonitorGroupEditDialog"
      :is-open-monitor-group-edit-dialog="isOpenMonitorGroupEditDialog"
      :monitor-group-config-form-data="editMonitorData"
      @closeDialog="isOpenMonitorGroupEditDialog = false"
    />
    <monitor-group-add-dialog
      v-if="isOpenMonitorGroupAddDialog"
      :is-open-monitor-group-add-dialog="isOpenMonitorGroupAddDialog"
      :monitor-group-config-form-data="editMonitorData"
      @closeDialog="isOpenMonitorGroupAddDialog = false"
    />
    <!-- <rule-add-dialog
      v-if="isOpenMonitorGroupAddDialog"
      :monitor-group-config-form-data="editMonitorData"
      :is-open-monitor-group-add-dialog="isOpenMonitorGroupAddDialog"
      @closeDialog="isOpenMonitorGroupAddDialog = false"
    /> -->
  </section>
</template>

<script>
import MonitorGroupEditDialog from '@/views/rule/MonitorGroup/MonitorGroupEditDialog'
import MonitorGroupAddDialog from '@/views/rule/MonitorGroup/MonitorGroupAddDialog'
import RuleAddDialog from '@/views/rule/MonitorGroup/RuleAddDialog'
import {mapGetters, mapActions} from 'vuex'
import {deleteAlarmTimeBytimeId, deleteAlarmTimeBytimeIds} from '@/api/rule/RuleConfig'

export default {
  name: 'MonitorGroupRuleTable',
  components: {MonitorGroupEditDialog, MonitorGroupAddDialog, RuleAddDialog},
  props: {
    searchBoxValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isOpenMonitorGroupEditDialog: false,
      isOpenMonitorGroupAddDialog: false,
      // 传入编辑表单中的数据
      editMonitorData: {},
      // 批量删除的ID
      ids: []
    }
  },
  computed: {
    ...mapGetters('RuleConfig', {
      monitorGroupRule: 'getMonitorList'
    }),
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
        column: [
          {
            label: '绑定组名',
            prop: 'groupName'
          },
          {
            label: '报警日期',
            prop: 'monitorAlarmDate',
            width: '150px'
          },
          {
            label: '报警时间',
            prop: 'monitorAlarmTime'
          },
          {
            label: '时间类型',
            prop: 'dateType'
          },
          {
            label: '报警间隔',
            prop: 'alarmInterval'
          },
          {
            label: '录像间隔',
            prop: 'recordInterval'
          },
          {
            label: '开启录像',
            prop: 'recorderOnOff'
          },
          {
            label: '开启拍照',
            prop: 'photographOnOff'
          },
          {
            label: '启用状态',
            prop: 'groupOnOff'
          }
        ]
      }
    },
    // 表格中的数据
    monitorGroupData() {
      const monitorGroupData = []
      this.monitorGroupRule.forEach((rulesInMonitor) => {
        console.log(rulesInMonitor)
        if (this.searchBoxValue === -1 || this.searchBoxValue === rulesInMonitor.groupId) {
          monitorGroupData.push(rulesInMonitor)
        }
      })
      return monitorGroupData
    }
  },
  methods: {
    ...mapActions('RuleConfig', {
      getAllMonitorGroupInfo: 'getAllMonitorGroupIdNameLocationByActions'
    }),
    // 表格行颜色控制
    monitorGroupRowStyle({rowIndex}) {
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
      this.isOpenMonitorGroupEditDialog = true
      // 处理一些可能由null导致的错误
      const monitorAlarmTime = []
      // 获取默认的年月日
      const ss = new Date().getFullYear() + '-0' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' '
      monitorAlarmTime[0] = monitorData.monitorAlarmTime[0] === null ? '1970-7-01 00:00:00' : ss + monitorData.monitorAlarmTime[0]
      monitorAlarmTime[1] = monitorData.monitorAlarmTime[1] === null ? '1970-7-01 23:59:59' : ss + monitorData.monitorAlarmTime[1]
      const monitorAlarmDate = []
      monitorAlarmDate[0] = monitorData.monitorAlarmDate[0] === null ? '2021-7-27 00:00:00' : monitorData.monitorAlarmDate[0]
      monitorAlarmDate[1] = monitorData.monitorAlarmDate[1] === null ? '2021-7-27 23:59:59' : monitorData.monitorAlarmDate[1]
      this.editMonitorData = {
        groupId: monitorData.groupId,
        groupName: monitorData.groupName,
        monitorAlarmTime,
        monitorAlarmDate,
        alarmInterval: monitorData.alarmInterval,
        groupOnOff: monitorData.groupOnOff,
        recordInterval: monitorData.recordInterval,
        recorderOnOff: monitorData.recorderOnOff,
        photographOnOff: monitorData.photographOnOff,
        dateType: monitorData.dateType,
        timeId: monitorData.timeId
      }
    },
    // 点击新增规则
    handleAddMonitor() {
      this.editMonitorData = {}
      this.isOpenMonitorGroupAddDialog = true
    },
    // 删除单个数据
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDeleteMonitor(MonitorRowData) {
      const requestBody = MonitorRowData.timeId
      this.openDelConfirm().then(() => {
        deleteAlarmTimeBytimeId(requestBody)
          .then(() => {
            this.$message({
              duration: 1000,
              type: 'success',
              message: '删除规则成功'
            })
            this.getAllMonitorGroupInfo()
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
    // 批量删除
    delSelection() {
      if (this.ids.length !== 0) { // ids为之定义的数组属性值，在data()中定义
        this.$confirm('是否确认删除选中的所有记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAlarmTimeBytimeIds(String(this.ids)).then(data => {
            this.$message.success('删除成功')
            this.getAllMonitorGroupInfo()
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
        this.ids.push(items.timeId)
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
