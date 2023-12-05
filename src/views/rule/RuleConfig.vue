<template>
  <div class="rule-config-wrapper hidden-scroll">
    <div class="rule-config-content">
      <header class="rule-config-tab">
        <avue-tabs :option="ruleConfigTabOption" @change="handleChange"/>
      </header>
      <!--      规则信息预览界面-->
      <div v-show="showRuleInformation">
        <section class="rule-config-search-box">
          <div class="search-box-title">请选择绑定组</div>
          <el-select v-model="searchBoxValue" filterable placeholder="请选择">
            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </section>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="绑定组">
                <monitor-group-rule-table :search-box-value="searchBoxValue"/>
              </el-tab-pane>

            </el-tabs>
          </div>
        </main>
      </div>
      <!--      基础规则界面-->
      <div v-show="showBasicRuleInformation">
        <section class="rule-config-search-box">
          <div class="search-box-title">请选择绑定组</div>
          <el-select v-model="searchBoxValue" filterable placeholder="请选择">
            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </section>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="绑定组">
                <BasicRule>

                </BasicRule>
              </el-tab-pane>

            </el-tabs>
          </div>
        </main>
      </div>
      <!--      交集规则预览界面-->
      <div v-show="showIntersectRuleInformation">
        <section class="rule-config-search-box">
          <div class="search-box-title">请选择绑定组</div>
          <el-select v-model="searchBoxValue" filterable placeholder="请选择">
            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </section>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="绑定组">
                <IntersectRule :search-box-value="searchBoxValue"></IntersectRule>

              </el-tab-pane>

            </el-tabs>
          </div>
        </main>
      </div>
      <!--      并集规则预览界面-->
      <div v-show="showMergeRuleInformation">
        <section class="rule-config-search-box">
          <div class="search-box-title">请选择绑定组</div>
          <el-select v-model="searchBoxValue" filterable placeholder="请选择">
            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </section>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="绑定组">
                <MergeRule :search-box-value="searchBoxValue"></MergeRule>


              </el-tab-pane>

            </el-tabs>
          </div>
        </main>
      </div>
      <!--      人脸信息预览界面-->
      <div v-show="showFaceRegister">
        <div class="face-register-button">
          <el-button icon="el-icon-plus" size="small" type="primary" @click="faceRegister">人脸注册</el-button>
        </div>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="注册信息">
                <el-table ref="singleTable" :cell-style="{ 'text-align': 'center' }" :data="tableData" :row-class-name="tableClass" border
                          header-cell-class-name="table_header" max-height="550"
                          style="width: 100%">
                  <el-table-column fixed label="姓名" prop="name"/>
                  <el-table-column label="年龄" prop="age"/>
                  <el-table-column label="邮箱" prop="email"/>
                  <el-table-column label="性别" prop="gender"/>
                  <el-table-column label="电话号码" prop="phoneNumber"/>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" type="text" @click.native.prevent="deleteRow(scope.$index, tableData)">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </main>
      </div>
      <!--    人脸识别界面-->
      <el-dialog :visible.sync="dialogFormVisible" title="人脸识别注册">
        <el-form ref="form" :model="form">
          <el-form-item :label-width="formLabelWidth" :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]" label="姓名" prop="name">
            <el-input v-model="form.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :rules="[
            { required: true, message: '年龄不能为空' },
            { type: 'number', message: '年龄必须为数字值' }
          ]" label="年龄" prop="age">
            <el-input v-model.number="form.age" autocomplete="off" type="age"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]" label="邮箱" prop="email">
            <el-input v-model="form.email" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :rules="[
            { required: true, message: '电话号码不能为空' },
            { type: 'number', message: '电话号码必须为数字值' }
          ]" label="电话号码" prop="phoneNumber">
            <el-input v-model.number="form.phoneNumber" autocomplete="off" type="age"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="性别">
            <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%;">
              <el-option label="男" value="1"/>
              <el-option label="女" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <input class="upload" type="file" @change="uploadPhoto($event)">
            <div v-show="showDivImg">
              <img :src="formInline.img" alt="" class="upload-img">
            </div>
          </el-form-item>
          <el-form-item style="margin-top: 2rem; text-align: center">
            <el-button class="submit" type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--      报警通知方式预览界面-->
      <div v-show="showContact">
        <section class="rule-config-search-box">
          <div class="search-box-title">请选择绑定组</div>
          <el-select v-model="searchBoxValue" filterable placeholder="请选择">
            <el-option v-for="item in ruleConfigSearchBoxOption" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </section>
        <main class="rule-config-info">
          <div class="info-body">
            <el-tabs type="border-card">
              <el-tab-pane label="绑定组">
                <ContactReview :contactDataTemp="contactData" @refreshContact='refreshContact'/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </main>
      </div>
      <!--      报警通知方式注册界面-->
      <el-dialog :visible.sync="contactFormVisible" title="添加通知方式" width="600px">
        <div v-show="showDialogNav">
          <div class="dialog-button1" @click="addPhone">
            <div class="dialog-button1-img-1"></div>
            <div class="dialog-button1-text">手机号</div>
          </div>
          <div class="dialog-button2" @click="addEmail">
            <div class="dialog-button1-img-2"></div>
            <div class="dialog-button2-text">邮箱号</div>
          </div>
          <div class="dialog-button2" @click="addApp">
            <div class="dialog-button1-img-3"></div>
            <div class="dialog-button2-text">APP账号</div>
          </div>
        </div>
        <el-form v-show="!showDialogNav" ref="contactForm" :model="contactForm">
          <el-form-item v-show="showRegisterContact == 1" :label-width="'80px'" :rules="[
            { required: true, message: '电话号码不能为空' }
          ]" label="电话号码"
                        prop="telephoneNumber">
            <el-input v-model="contactForm.telephoneNumber" autocomplete="off"/>
          </el-form-item>
          <el-form-item v-show="showRegisterContact == 2" :label-width="'80px'" :rules="[
            { required: true, message: '邮箱号不能为空' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]" label="邮箱号" prop="emailNumber">
            <el-input v-model="contactForm.emailNumber" autocomplete="off"/>
          </el-form-item>
          <el-form-item v-show="showRegisterContact == 3" :label-width="'100px'" label="APP账号：">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="禁用" disabled></el-checkbox>
              <el-checkbox label="选中且禁用" disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="margin-top: 2rem; text-align: center">
            <el-button class="submitRegister" type="primary" @click="onSubmitContact">立即添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import MonitorGroupRuleTable from '@/views/rule/MonitorGroup/MonitorGroupRuleTable'
import BasicRule from '@/views/rule/MonitorGroup/BasicRule'
import IntersectRule from '@/views/rule/MonitorGroup/IntersectRule'
import MergeRule from '@/views/rule/MonitorGroup/MergeRule'
import ContactReview from "./MonitorGroup/ContactReview";
import {registerFaceRecognise, getAllFaceUser, deleteUserFaceInfo} from '@/api/device/BasicConfig'
import {AddContact, allContactor} from '@/api/rule/RuleConfig'
import {isvalidMobile, isvalidEmail} from '@/utils/validate'

export default {
  name: 'RuleConfig',
  components: {
    MonitorGroupRuleTable,
    BasicRule,
    IntersectRule,
    MergeRule,
    ContactReview
  },
  data() {
    return {
      // 用于修改表格的颜色
      currentRow: null,
      searchBoxValue: -1,
      showRuleInformation: true,
      showBasicRuleInformation: false,
      showIntersectRuleInformation: false,
      showMergeRuleInformation: false,
      showFaceRegister: false,
      dialogFormVisible: false,
      showContact: false,
      contactFormVisible: false,
      showDialogNav: true,
      showRegisterContact: 0,
      form: {
        name: '',
        age: '',
        email: '',
        sex: '',
        file: '',
        phoneNumber: ''
      },
      contactForm: {
        telephoneNumber: '',
        emailNumber: ''
      },
      formLabelWidth: '120px',
      showDivImg: false,
      formInline: {
        img: ''
      },
      tableData: [],
      contactData: [], // 存储联系人
      checkList: [] // 存储勾选的APP账号
    }
  },
  created() {
    // 获取哨兵组信息，所有设备的规则以及球机跟随策略
    this.initRuleConfigInfo()
  },
  mounted() {
    this.getAllContactor()
    //12.4新部署时出现bug，应文超请求，先注释掉，留给后来人优化吧！！！！！！
    // this.getFaceInfo()
  },
  computed: {
    ...mapGetters('RuleConfig', {
      monitorList: 'getGroupList',
      getContactFormVisible: 'getContactFormVisible'
    }),
    // 页面头部Tab标签配置选项
    ruleConfigTabOption() {
      return {
        column: [{
          label: '规则信息预览'
        },
          //  {
          //   label: '基础规则预览'
          // },
          {
            label: '交集规则预览'
          }, {
            label: '并集规则预览'
          }, {
            label: '通知方式预览'
          }]
        // , {
        //   label: '人脸信息预览'
        // }]

      }
    },
    // 页面搜索框下拉菜单配置选项 会随着VueX中monitorList的变化而变化
    ruleConfigSearchBoxOption() {
      const options = [
        {
          value: -1,
          label: '不限'
        }
      ]
      const searchMonitor = []
      this.monitorList.forEach((value) => {
        if (searchMonitor.includes(value.groupId) === false) {
          searchMonitor.push(value.groupId)
          const obj = {
            value: value.groupId,
            label: value.groupName
          }
          options.push(obj)
        }
      })
      console.log(searchMonitor)
      return options
    }
  },
  watch: {
    getContactFormVisible(val) {
      if (val) this.contactFormVisible = true
      else this.contactFormVisible = false
      this.showDialogNav = true
      this.contactForm.telephoneNumber = ''
      this.contactForm.emailNumber = ''
    },
    contactFormVisible(val) {
      if (this.getContactFormVisible != val) this.updateContactFormVisible(val)
      this.showDialogNav = true
      this.contactForm.telephoneNumber = ''
      this.contactForm.emailNumber = ''
    }
  },
  methods: {
    ...mapActions('RuleConfig', {
      getMonitorList: 'getAllMonitorGroupIdNameLocationByActions',
      getGroupList: 'getAllMonitorGroupIdByActions',
    }),
    ...mapMutations('RuleConfig', {
      updateContactFormVisible: 'updateContactFormVisible'
    }),
    // 偶数加背景色
    tableClass({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        // 奇数行，序号不能被2整除
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    async initRuleConfigInfo() {
      // 获取所有哨兵组信息
      await this.getMonitorList()
      // 获取搜索哨兵组信息
      await this.getGroupList()
    },
    // 注册获取人脸用户信息
    getAllFaceUser,
    deleteUserFaceInfo,
    // 保存人脸成员信息函数
    getFaceInfo() {
      this.tableData = []
      this.getAllFaceUser().then(res => {
        console.log('res', res)
        const length = res.data.length
        for (let i = 0; i < length; i++) {
          const paramData = {
            name: `${res.data[i].name}`,
            age: `${res.data[i].age}`,
            email: `${res.data[i].email}`,
            gender: `${res.data[i].gender}`,
            phoneNumber: `${res.data[i].phoneNumber}`,
            id: `${res.data[i].id}`
          }
          this.tableData.push(paramData)
        }
      })
    },
    handleChange(column) {
      // console.log('column', column.label)
      if (column.label === '规则信息预览') {
        this.showRuleInformation = true
        this.showBasicRuleInformation = false
        this.showIntersectRuleInformation = false
        this.showMergeRuleInformation = false
        this.showContact = false
      }

      // if (column.label === '基础规则预览') {
      //   this.showRuleInformation = false
      //   this.showBasicRuleInformation = true
      //   this.showIntersectRuleInformation = false
      //   this.showMergeRuleInformation = false
      // }
      if (column.label === '交集规则预览') {
        this.showRuleInformation = false
        this.showBasicRuleInformation = false
        this.showIntersectRuleInformation = true
        this.showMergeRuleInformation = false
        this.showContact = false
      }
      if (column.label === '并集规则预览') {
        this.showRuleInformation = false
        this.showBasicRuleInformation = false
        this.showIntersectRuleInformation = false
        this.showMergeRuleInformation = true
        this.showContact = false
      }
      if (column.label === '通知方式预览') {
        this.showRuleInformation = false
        this.showBasicRuleInformation = false
        this.showIntersectRuleInformation = false
        this.showMergeRuleInformation = false
        this.showContact = true
      }
      // else this.showFaceRegister = true
    },
    // 以base64获取文件
    uploadPhoto(e) {
      // 利用fileReader对象获取file
      const file = e.target.files[0]
      const filesize = file.size
      const filename = file.name
      // 2,621,440   2M
      if (filesize > 2101440) {
        // 图片大于2MB

      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        const imgcode = e.target.result
        this.formInline.img = imgcode
        // console.log('this.formInline.img', this.formInline.img);
        this.form.file = this.formInline.img
        if (this.formInline.img) this.showDivImg = true
      }
    },
    // 提交注册表单
    onSubmit() {
      // console.log('this.form', JSON.stringify(this.form));
      let allowSubmit = true
      if (this.form.name === '' || this.form.age === '' || this.form.email === '' || this.form.sex === '' || this.form.file === '' || this.form.phoneNumber === '') allowSubmit = false
      if (!allowSubmit) {
        this.$message({
          message: '请填写完整信息',
          type: 'warning',
          duration: 2000
        })
        return
      }
      registerFaceRecognise(this.form).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            message: '人脸识别注册成功',
            type: 'success',
            duration: 1000
          })
          this.dialogFormVisible = false
          this.getFaceInfo()
        } else {
          this.$message({
            message: `${res.message}`,
            type: 'warning'
          })
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error('注册过程发生错误！！！')
      })
    },
    // 人脸识别注册按钮
    faceRegister() {
      // console.log("123");
      this.formInline.img = ''
      this.dialogFormVisible = true
      this.showDivImg = false
    },
    // 删除表格数据
    deleteRow(index, rows) {
      // rows.splice(index, 1);
      // console.log('index', index)
      console.log('rows', rows)
      const deleteID = Number(rows[0].id)
      console.log('deleteID', deleteID, index)
      this.deleteUserFaceInfo(deleteID).then(res => {
        console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.getFaceInfo()
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmitContact() {
      let param = {}
      if (this.showRegisterContact == 1) {
        param.type = '0' // 代表注册类型：手机
        let valid = isvalidMobile(this.contactForm.telephoneNumber)
        if (!valid) {
          this.$message({
            message: '请输入正确的手机号码',
            type: 'warning',
            duration: 1000
          })
          return
        } else param.contact = this.contactForm.telephoneNumber
      } else if (this.showRegisterContact == 2) {
        param.type = '1' // 代表注册类型：邮件
        let valid = isvalidEmail(this.contactForm.emailNumber)
        if (!valid) {
          this.$message({
            message: '请输入正确的邮箱格式',
            type: 'warning',
            duration: 1000
          })
          return
        } else param.contact = this.contactForm.emailNumber
      }
      else if (this.showRegisterContact == 3) {
        this.contactFormVisible = false
        return;
      }
      param.status = '1'
      AddContact(param).then(res => {
        this.$message({
          message: '注册成功',
          type: 'success',
          duration: 1000
        })
        this.getAllContactor()
        this.contactFormVisible = false
      }).catch(err => {
      })
    },
    // 添加手机联系方式
    addPhone() {
      this.showDialogNav = false
      this.showRegisterContact = 1
    },
    // 是否添加邮箱联系方式
    addEmail() {
      this.showDialogNav = false
      this.showRegisterContact = 2
    },
    // 是否添加app联系方式
    addApp() {
      this.showDialogNav = false
      this.showRegisterContact = 3
    },
    // 获取所有通知联系人
    getAllContactor() {
      allContactor().then(res => {
        if (res.code == 200) {
          this.contactData = res.data
        }
      })
    },
    refreshContact() {
      this.getAllContactor()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-config-wrapper {
  height: 100%;
  background-color: #fff;

  .rule-config-content {
    width: 95%;
    margin: 0 auto;

    .rule-config-tab {
      font-size: 1.2rem;
    }

    .rule-config-search-box {
      display: flex;
      justify-content: left;
      align-items: center;

      .search-box-title {
        width: 150px;
        height: 40px;
        line-height: 40px;
        background-color: rgba(222, 225, 230, .9);
        text-align: center;
      }
    }

    .tag-legend {
      height: 60px;
      padding: 15px;
      margin-top: 20px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .tag-legend-title {
        font-size: 16px;

        .el-icon-picture-outline-round {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .tag-legend-body {
        .tag-margin-left {
          margin-left: 30px;
        }
      }
    }

    .rule-config-info {
      margin-top: 20px;
      padding: 20px 15px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .info-title {
        font-size: 16px;

        .el-icon-info {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .info-body {
        padding: 20px 10px;
      }
    }
  }
}
</style>

<style scoped>
.rule-config-wrapper {
  --infoTagFontColor: #909399;
  --radarTagFontColor: #FF8C00;
  --ptzTagFontColor: #32CD32;
  --boltTagFontColor: #9370DB;
}

.face-register-button {
  margin-top: 15px;
  margin-left: 3px;
}

.face-info {
  margin-top: 20px;
  padding: 10px;
}

.upload {
  margin-left: 120px;
}

.upload-img {
  margin-left: 120px;
  width: 50%;
  height: 50%;
}

.submit {
  width: calc(100% - 120px);
  margin-left: 80px;
}

.submitRegister {
  width: calc(100% - 120px);
}

/deep/ .el-dialog {
  background: #F2F2F2 !important;
}

.dialog-button1 {
  position: relative;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  width: 70%;
  height: 80px;
  margin-left: 15%;
  color: #333;
  font-family: Arial, PingFang SC, Hiragino Sans GB, STHeiti, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.dialog-button1:hover {
  width: 72%;
  margin-left: 14%;
  cursor: pointer;
}

.dialog-button1-img-1 {
  position: absolute;
  width: 10%;
  height: 50%;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%);
  background-image: url(../../assets/images/ruleConfig/phone.png);
  background-repeat: no-repeat;
  background-position: 0% 0%;
  background-size: cover;
  opacity: 0.8;
}

.dialog-button1-text {
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(0, -50%);
}

.dialog-button2 {
  position: relative;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  width: 70%;
  height: 80px;
  margin-left: 15%;
  margin-top: 40px;
  color: #333;
  font-family: Arial, PingFang SC, Hiragino Sans GB, STHeiti, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.dialog-button2:hover {
  width: 72%;
  margin-left: 14%;
  cursor: pointer;
}

.dialog-button1-img-2 {
  position: absolute;
  width: 10%;
  height: 50%;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%);
  background-image: url(../../assets/images/ruleConfig/email.png);
  background-repeat: no-repeat;
  background-position: 0% 0%;
  background-size: cover;
  opacity: 0.8;
}

.dialog-button2-text {
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(0, -50%);
}

.dialog-button1-img-3 {
  position: absolute;
  width: 10%;
  height: 50%;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%);
  background-image: url(../../assets/images/ruleConfig/app.png);
  background-repeat: no-repeat;
  background-position: 0% 0%;
  background-size: cover;
  opacity: 0.8;
}

/deep/ .info-tag {
  border-color: var(--infoTagFontColor);
  color: var(--infoTagFontColor);
}

/deep/ .radar-tag {
  border-color: var(--radarTagFontColor);
  color: var(--radarTagFontColor);
}

/deep/ .ptz-tag {
  border-color: var(--ptzTagFontColor);
  color: var(--ptzTagFontColor);
}

/deep/ .bolt-tag {
  border-color: var(--boltTagFontColor);
  color: var(--boltTagFontColor);
}

/*修改el-table表头文字格式*/
/deep/ .table_header {
  color: rgba(0, 0, 0, .85) !important;
  text-align: center !important;
}

/deep/ .even-row {
  background-color: rgba(127, 255, 170, .17);
}

/deep/ .odd-row {
  background-color: rgba(127, 255, 170, .1);
}
/*修改el-form的label样式*/
/deep/ .el-form-item__label {
  font-size: 16px;
}
</style>
