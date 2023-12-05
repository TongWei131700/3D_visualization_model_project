<template>
  <div>
    <avue-crud :data="data"
      :option="option"
      :page.sync="page"
      ref="crud"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @row-save="rowSave"
      @row-update="rowUpdate"
    >
      <template slot-scope="scope" slot="menuLeft">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="small"
                   @click.stop="$refs.crud.rowAdd()"
                   v-auth="`system:user:add`">新增</el-button>
      </template>
      <div slot="menu" slot-scope="{size, type, row, index}">
        <el-button :type="type" :size="size" icon="el-icon-edit" v-if="!row.admin" v-auth="`system:user:edit`" @click="$refs.crud.rowEdit(row, index)">编辑</el-button>
        <el-button :type="type" :size="size" icon="el-icon-key" v-if="!row.admin" v-auth="`system:user:reset_pwd`" @click="resetPwd(row.userId)">重置密码</el-button>
      </div>
    </avue-crud>
  </div>
</template>

<script>
import {queryUser, editUser, addUser, queryRole, resetPassword} from "../../api/system/user";

export default {
  name: "UserManage",
  data() {
    return {
      page: {
        pageSize: 10,
        pageCount: 1,
      },
      data: [],
      option: {
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: '用户名',
            prop: 'userName',
            rules: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            }],
            editDisabled: true,
          },
          {
            label: '手机号',
            prop: 'phone',
          },
          {
            label: '邮箱',
            prop: 'email',
          },
          {
            label: '角色',
            prop: 'roleIds',
            multiple: true,
            type: 'select',
            props: {
              label: 'roleName',
              value: 'roleId',
            },
            dicData: [],
          },
          {
            label: '创建时间',
            prop: 'createTime',
            editDisplay: false,
            addDisplay: false,
          },
        ]
      },
    }
  },
  mounted() {
    queryRole(1, 1000).then(res => {
      this.option.column[3].dicData = res.data.records
    })
  },
  methods: {
    onLoad(page) {
      queryUser(this.page.currentPage, page.pageSize).then(res => {
        if (res.code === 200) {
          this.data = res.data.records
          this.page.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    rowSave(form, done, loading) {
      const formData = {
        userName: form.userName,
        roleIds: form.roleIds,
        phone: form.phone,
        email: form.email,
      }
      addUser(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.onLoad(this.page)
          done();
          this.$alert('系统为用户生成的随机密码为：' + res.msg + '<br/> 请在登录后第一时间修改密码',
            '用户密码',
            {
              dangerouslyUseHTMLString: true
            });
        } else {
          this.$message.error(res.msg)
          loading();
        }
      }).catch(err => {
        loading();
      })
    },
    rowUpdate(form, index, done, loading) {
      const formData = {
        userId: form.userId,
        userName: form.userName,
        roleIds: form.roleIds,
        phone: form.phone,
        email: form.email,
      }
      editUser(formData).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.onLoad(this.page)
          done();
        } else {
          this.$message.error(res.msg)
          loading();
        }
      }).catch(err => {
        loading();
      })
    },
    refreshChange() {
      this.page.currentPage = 1
      this.onLoad(this.page)
    },
    resetPwd(userId) {
      this.$confirm('确认重置用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(userId).then(res => {
          this.$alert('系统为用户生成的随机密码为：' + res.msg + '<br/> 请在登录后第一时间修改密码',
            '用户密码',
            {
              dangerouslyUseHTMLString: true
            });
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
