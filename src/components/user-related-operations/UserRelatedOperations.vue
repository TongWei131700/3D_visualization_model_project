<template>
  <div>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item icon="el-icon-edit-outline" @click.native="dialogFormVisible=true">修改密码</el-dropdown-item>
    <el-dropdown-item
      divided
      icon="el-icon-circle-close"
      @click.native="logOut"
    >退出系统
    </el-dropdown-item>
  </el-dropdown-menu>
    <el-dialog title="修改密码" :visible="dialogFormVisible" :append-to-body="true" width="600px" :show-close="false">
      <el-form :model="form" ref="form" :rules="rules2" :label-position="'right'" label-width="80px">
        <el-form-item label="当前密码" prop="oldPwd">
          <el-input v-model="form.oldPwd" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPwd">
          <el-input v-model="form.repeatPwd" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitModifyPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { modifyPassword } from "../../api/system/user"

export default {
  name: 'UserRelatedOperations',
  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else {
        callback();
      }
    };
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.oldPwd !== '') {
          this.$refs.form.validateField('repeatPwd');
        }
        callback()
      }
    };
    const checkRepeatPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      dialogFormVisible: false,
      rules2: {
        oldPwd: [
          { validator: validateOldPass, trigger: 'blur' }
        ],
        newPwd: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        repeatPwd: [
          { validator: checkRepeatPass, trigger: 'blur' }
        ]
      },
      form: {
        oldPwd: '',
        newPwd: '',
        repeatPwd: '',
      }
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('user/logOut')
    },

    submitModifyPwd() {
      console.log('aaaa')
      this.$refs.form.validate((valid) => {
        if (valid) {
          modifyPassword(this.form.oldPwd, this.form.newPwd).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              // 关闭对话框
              this.cancel()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false;
        }
      });
    },

    cancel() {
      this.dialogFormVisible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
