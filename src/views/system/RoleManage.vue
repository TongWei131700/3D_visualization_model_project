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
                   v-auth="`system:role:add`">新增</el-button>
      </template>
      <div slot="menu" slot-scope="{size, type, row, index}">
        <el-button :type="type" :size="size" icon="el-icon-edit" v-if="!row.admin" v-auth="`system:role:edit`" @click="$refs.crud.rowEdit(row, index)">编辑</el-button>
        <el-button :type="type" :size="size" icon="el-icon-delete" v-if="!row.admin" v-auth="`system:role:delete`" @click="">删除</el-button>
      </div>
    </avue-crud>
  </div>
</template>

<script>

import {queryRole, getPermCascade, addRole, editRole} from "../../api/system/user";

export default {
  name: "RoleManage",
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
        editBtn: false,
        delBtn: false,
        addBtn: false,
        column: [
          {
            label: '编号',
            prop: 'roleId',
            addDisplay: false,
            editDisabled: true,
          },
          {
            label: '角色名称',
            prop: 'roleName',
            rules: [{
              required: true,
              message: "请输入角色名称",
              trigger: "blur"
            }],
            editDisabled: true,
          },
          {
            label: '角色标识',
            prop: 'roleStr',
            rules: [{
              required: true,
              message: "请输入角色标识",
              trigger: "blur"
            }],
            editDisabled: true,
          },
          {
            label: '创建时间',
            prop: 'createTime',
            editDisplay: false,
            addDisplay: false,
          },
          {
            label: '权限',
            prop: 'perms',
            multiple: true,
            type: 'cascader',
            props: {
              // label: 'roleName',
              // value: 'roleId',
            },
            dicData: [],
            // hide: true,
            tags: true,
            hide: true,
            editDisplay: true,
            addDisplay: true,
          }
        ]
      },
    }
  },
  mounted() {
    getPermCascade().then(res => {
      if (res.code === 200) {
        this.option.column[4].dicData = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    onLoad(page) {
      queryRole(this.page.currentPage, page.pageSize).then(res => {
        if (res.code === 200) {
          this.data = res.data.records
          this.page.total = res.data.total
          this.data.forEach(role => {
            role.perms = []
            role.permIds.forEach(permId => role.perms.push([null, permId]))
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    rowSave(form, done, loading) {
      const param = {
        roleName: form.roleName,
        roleStr: form.roleStr,
        permIds: form.perms.map(p => p[1]),
      }
      addRole(param).then(res => {
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
    rowUpdate(form, index, done, loading) {
      const param = {
        roleId: form.roleId,
        roleName: form.roleName,
        roleStr: form.roleStr,
        permIds: form.perms.map(p => p[1]),
      }
      editRole(param).then(res => {
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
  }
}
</script>

<style scoped>

</style>
