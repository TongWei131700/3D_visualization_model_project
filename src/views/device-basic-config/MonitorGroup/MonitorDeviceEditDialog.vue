<template>
  <el-dialog
    id="device-config-dialog"
    :show-close="false"
    :visible="isOpenEditDialog"
    center
    @close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label='哨兵组名称' prop="groupName">
            <el-input
              v-model="form.groupName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        icon="el-icon-circle-check"
        type="success"
        @click="handleSubmit"
      >
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
import {validateIPv4} from '@/utils/validate'
import {addMonitorGroupByName} from '@/api/device/BasicConfig'
import {mapActions} from 'vuex'

export default {
  name: 'MonitorDeviceEditDialog',
  props: {
    isOpenEditDialog: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      form: {
        groupName: '',
      }
    };
  },

  methods: {
    ...mapActions('BasicConfig', {
      getmonitorInfo: 'getAllMonitorGroupIdNameByActions',
    }),
    handleSubmit() {
      let requestBody = this.form.groupName
      this.$refs.form.validate((valid) => {
        if (valid) {
          addMonitorGroupByName(requestBody).then(() => {
            this.$message.success('添加哨兵组成功');
            this.getmonitorInfo();
            this.handleClose();
          }).catch(() => {
            this.$message.error('添加哨兵组失败');
          });
        } else {
          this.$message.error('请检查填写是否有误');
        }
      });
    },
    handleClose() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style scoped>
</style>
