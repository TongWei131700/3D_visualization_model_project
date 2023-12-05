<template>
  <section id="monitor-group-table">
    <!--    分页切换后前面选择的数据如何保留，日后再做-->
    <avue-crud
      :data="contactData"
      :option="contactOption"
      :row-style="contactRowStyle"
      @selection-change='selectChange'
    >
      <template slot="telephoneNumber" slot-scope="scope">
        <div class="textHeight">{{ scope.row.telephoneNumber }}</div>
      </template>
      <template slot="emailNumber" slot-scope="scope">
        <div class="textHeight">{{ scope.row.emailNumber }}</div>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          icon="el-icon-delete"
          round
          size="small"
          type="primary"
          @click="handleDeleteContact(scope.row)"
        >删除
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="handleAddContact"
        >新增通知方式
        </el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          type="primary"
          @click="delSelection"
        >删除通知方式
        </el-button>
      </template>
    </avue-crud>
  </section>
</template>

<script>
import {mapMutations} from 'vuex'
import {deleteContact, deleteFewContact} from '@/api/rule/RuleConfig'

export default {
  name: "ContactReview",
  props: ['contactDataTemp'],
  data() {
    return {
      contactData: [],
      tempDeleteData: [] // 准备删除的联系方式
    }
  },
  watch: {
    contactDataTemp: {
      handler: function () {
        this.convertContact()
      },
      deep: true
    }
  },
  mounted() {
    this.convertContact()
  },
  computed: {
    // 表格配置相关选项
    contactOption() {
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
            label: '通知方式',
            prop: 'contactType'
          },
          {
            label: '号码',
            prop: 'contact',
          }
        ]
      }
    },
    // 表格行颜色控制
    contactRowStyle({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: 'rgba(127,255,170, .1)'
        }
      }
      return {
        backgroundColor: 'rgba(127,255,170, .17)'
      }
    },
  },
  methods: {
    ...mapMutations('RuleConfig', {
      updateContactFormVisible: 'updateContactFormVisible'
    }),
    handleDeleteContact(record) {
      console.log('+++++', record)
      let param = {}
      param.contact = record.contact
      param.status = "1"
      if (record.contactType == '手机号') param.type = '0'
      else if (record.contactType == '邮箱号') param.type = '1'
      deleteContact(param).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.$emit('refreshContact')
        }
      })
    },
    handleAddContact() {
      this.updateContactFormVisible(true)
    },
    delSelection() {
      if (this.tempDeleteData.length == 0) {
        this.$message({
          message: '请勾选至少一个选项',
          type: 'warning',
          duration: 1000
        })
        return
      }
      deleteFewContact(this.tempDeleteData).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '批量删除成功',
            type: 'success',
            duration: 1000
          })
          this.$emit('refreshContact')
        }
      })
    },
    // 转换props数据放入表格种
    convertContact() {
      this.contactData = []
      console.log('++++, ', this.contactDataTemp)
      for (let i = 0; i < this.contactDataTemp.length; i++) {
        if (this.contactDataTemp[i].type == 0) {
          this.contactData.push({
            contactType: '手机号',
            contact: `${this.contactDataTemp[i].contact}`
          })
        } else if (this.contactDataTemp[i].type == 1) {
          this.contactData.push({
            contactType: '邮箱号',
            contact: `${this.contactDataTemp[i].contact}`
          })
        }
      }
    },
    selectChange(record) {
      this.tempDeleteData = []
      for (let i = 0; i < record.length; i++) {
        if (record[i].contactType == '手机号') {
          this.tempDeleteData.push({
            type: '0',
            contact: `${record[i].contact}`,
            status: '1'
          })
        } else if (record[i].contactType == '邮箱号') {
          this.tempDeleteData.push({
            type: '1',
            contact: `${record[i].contact}`,
            status: '1'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.textHeight {
  line-height: 50px;
  font-size: 15px;
}
</style>
