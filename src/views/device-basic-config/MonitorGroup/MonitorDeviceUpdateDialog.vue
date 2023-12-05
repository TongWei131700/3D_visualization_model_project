<template>
  <el-dialog
    id="device-config-dialog"
    :show-close="false"
    :visible="isOpenEditDialog"
    center
    @close="handleClose"
  >
    <el-form ref="form" :model="form" label-position="left" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="绑定组名称" prop="groupName">
            <el-input v-model="form.groupName"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="绑定组启用状态" prop="groupName">
            <el-input v-model="form.groupOnOff" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="录像是否开启" prop="groupName">
            <el-input v-model="form.recorderOnOff" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="拍照是否开启" prop="groupName">
            <el-input v-model="form.photographOnOff" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报警时间间隔" prop="groupName">
            <el-input v-model="form.alarmInterval" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="录像时间间隔" prop="groupName">
            <el-input v-model="form.recordInterval" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-circle-check" type="success" @click="handleSubmit">
        提交
      </el-button>
      <el-button
        icon="el-icon-circle-close"
        style="margin-left: 150px"
        type="primary"
        @click="handleClose"
      >
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { validateIPv4 } from '@/utils/validate'
import {updateGroup} from "@/api/device/BasicConfig";
import {mapActions} from "vuex";

export default {
  name: "MonitorDeviceUpdateDialog",
  props: {
    isOpenEditDialog: {
      type: Boolean,
      default: false,
    },
    editingInfo: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      form: {
        groupId: "",
        groupName: "",
        groupOnOff: "",
        photographOnOff: "",
        recorderOnOff: "",
        alarmInterval: "",
        recordInterval: "",
      },
    };
  },

  methods: {
    ...mapActions("BasicConfig", {
      getmonitorInfo: "getAllMonitorGroupIdNameByActions",
      getRadarList: "getAllRadarByActions",
      getCamera: "getAllCameraByActions",
    }),
    handleSubmit() {
      let groupOnOff;
      if (this.form.groupOnOff === "关闭") {
        groupOnOff = "0";
      } else if (this.form.groupOnOff === "开启") {
        groupOnOff = "1";
      } else {
        groupOnOff = "";
      }
      const requestBody = {
        groupName: this.form.groupName,
        groupId: Number(this.form.groupId),
        groupOnOff: groupOnOff,
        photographOnOff: this.form.photographOnOff === "否" ? 0 : 1,
        recorderOnOff: this.form.recorderOnOff === "否" ? 0 : 1,
        alarmInterval: this.form.alarmInterval.substr(
          0,
          this.form.alarmInterval.length - 1
        ),
        recordInterval: this.form.recordInterval.substr(
          0,
          this.form.recordInterval.length - 1
        ),
      };
      console.log(requestBody);
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateGroup(requestBody)
            .then(() => {
              this.$message({
                duration: 1000,
                type: "success",
                message: "修改绑定组成功",
              });
              this.getmonitorInfo();
              this.getRadarList();
              this.getCamera();
              this.handleClose();
            })
            .catch(() => {
              this.$message({
                duration: 1000,
                type: "error",
                message: "修改绑定组失败",
              });
            });
        } else {
          this.$message({
            duration: 1000,
            type: "error",
            message: "请检查填写是否有误",
          });
        }
      });
    },
    handleClose() {
      this.$emit("closeDialog");
    },
  },
  created() {
    Object.assign(this.form, this.editingInfo);
  },
};
</script>
<style scoped>
#device-config-dialog {
  width: 60%;
  margin: auto;
}

/deep/ .el-form-item {
  margin-top: -5px;
}

/deep/ .el-input {
  width: 90%;
  margin-left: 5%;
}
</style>
