<template>
  <section id="monitor-group-table">
    <avue-crud
      :data="monitorGroupData"
      :option="monitorGroupOption"
      :row-style="monitorGroupRowStyle"
    >
      <template slot="groupOnOff" slot-scope="scope">
        <!--        <span v-if="scope.row.groupOnOff === '1'">{{ "开启" }}</span>-->
        <!--        <span v-else-if="scope.row.groupOnOff === '0'">{{ "关闭" }}</span>-->
        <!--        <span v-else>{{ "未知" }}</span>-->
        <el-switch
          v-model="scope.row.groupOnOff"
          :width="50"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="switchChange(scope.row)">
        </el-switch>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          v-if="scope.row.groupId !== 0"
          icon="el-icon-edit"
          round
          size="small"
          type="primary"
          @click="handleUpdateMonitor(scope.row)"
        >编辑
        </el-button
        >
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
      <template slot="menuLeft" slot-scope="scope">
        <el-button
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="handleAddMonitor(scope.row)"
        >添加
        </el-button
        >
      </template>
    </avue-crud>
    <monitor-device-add-dialog
      v-if="isAddDialogOpen"
      :editing-info="addingMonitroInfo"
      :is-open-edit-dialog="isAddDialogOpen"
      @closeDialog="isAddDialogOpen = false"
    />
    <monitor-device-update-dialog
      v-if="isUpdateDialogOpen"
      :editing-info="updatingMonitroInfo"
      :is-open-edit-dialog="isUpdateDialogOpen"
      @closeDialog="isUpdateDialogOpen = false"
    />
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import {mapActions} from "vuex";
import MonitorDeviceAddDialog from "@/views/device-basic-config/MonitorGroup/MonitorDeviceAddDialog";
import MonitorDeviceUpdateDialog from "@/views/device-basic-config/MonitorGroup/MonitorDeviceUpdateDialog";
import {deleteGroup, updateGroup} from "@/api/device/BasicConfig";

export default {
  name: "MonitorGroupTable",
  components: {MonitorDeviceAddDialog, MonitorDeviceUpdateDialog},
  props: {
    searchBoxValue: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      addingMonitroInfo: {},
      isAddDialogOpen: false,
      updatingMonitroInfo: {},
      isUpdateDialogOpen: false,
    };
  },
  computed: {
    ...mapGetters("BasicConfig", {
      monitorInfo: "getmonitorInfo",
    }),
    monitorGroupData() {
      const monitorGroup = [];
      console.log(this.monitorInfo);
      this.monitorInfo.forEach((item) => {
        if (Number(item.groupOnOff) == 1) item.groupOnOff = true
        else item.groupOnOff = false
        monitorGroup.push(item);
      });
      console.log(monitorGroup);
      return monitorGroup;
    },
    monitorGroupOption() {
      return {
        align: "center",
        border: true,

        menuAlign: "center",
        delBtn: false,
        editBtn: false,
        header: true,
        addBtn: false,
        dialogDrag: true,
        column: [
          {
            label: "绑定组名",
            prop: "groupName",
          },
          {
            label: "是否启用",
            prop: "groupOnOff",
            formslot: true,
          },
        ],
      };
    },
  },

  methods: {
    ...mapActions("BasicConfig", {
      getmonitorInfo: "getAllMonitorGroupIdNameByActions",
      getRadarList: "getAllRadarByActions",
      getCamera: "getAllCameraByActions",
    }),
    switchChange(val) {
      let groupOnOff;
      if (val.groupOnOff) {
        groupOnOff = "1";
      } else {
        groupOnOff = "0";
      }
      let updateParam = {
        groupId: val.groupId,
        groupName: val.groupName,
        groupOnOff: groupOnOff,
        recorderOnOff: val.recorderOnOff,
        photographOnOff: val.photographOnOff,
        alarmInterval: val.alarmInterval,
        recordInterval: val.recordInterval,
      }
      updateGroup(updateParam)
        .then(() => {
          this.$message({
            duration: 1000,
            type: "success",
            message: "修改绑定组成功",
          });
          this.getmonitorInfo();
          this.getRadarList();
          this.getCamera();
        })
    },
    // 表格行颜色控制
    monitorGroupRowStyle({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: "rgba(127,255,170, .1)",
        };
      }
      return {
        backgroundColor: "rgba(127,255,170, .17)",
      };
    },
    handleAddMonitor() {
      this.isAddDialogOpen = true;
    },
    handleUpdateMonitor(MonitorRowData) {
      let groupOnOff;
      if (MonitorRowData.groupOnOff === "0") {
        groupOnOff = "关闭";
      } else if (MonitorRowData.groupOnOff === "1") {
        groupOnOff = "开启";
      } else {
        groupOnOff = "未知";
      }
      console.log(MonitorRowData);
      this.updatingMonitroInfo = {
        groupId: MonitorRowData.groupId,
        groupName: MonitorRowData.groupName,
        groupOnOff: groupOnOff,
        recorderOnOff: MonitorRowData.recorderOnOff === "0" ? "否" : "是",
        photographOnOff: MonitorRowData.photographOnOff === "0" ? "否" : "是",
        alarmInterval: MonitorRowData.alarmInterval + "s",
        recordInterval: MonitorRowData.recordInterval + "s",
      };
      this.isUpdateDialogOpen = true;
    },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },

    handleDeleteMonitor(MonitorRowData) {
      const requestBody = MonitorRowData.groupId;
      this.openDelConfirm().then(() => {
        deleteGroup(requestBody)
          .then(() => {
            this.$message({
              duration: 1000,
              type: "success",
              message: "删除绑定组成功",
            });
            this.getmonitorInfo();
            this.getRadarList();
            this.getCamera();
          })
          .catch(() => {
            this.$message({
              duration: 1000,
              type: "error",
              message: "删除绑定组失败",
            });
          });
      });
    },
  },
  destroyed() {
    console.log("删除了")
  },
};

</script>

<style scoped>
/deep/ .el-switch__core::before {
  content: "OFF";
  position: absolute;
  top: 0;
  right: 5px;
  color: #fff;
  font-size: 3px;
}

.is-checked /deep/ .el-switch__core::before {
  content: "ON";
  position: absolute;
  top: 0;
  left: -5px;
  color: #fff;
  font-size: 3px;
}
</style>
