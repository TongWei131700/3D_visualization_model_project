<template>
  <el-dialog id="monitor-config-dialog" v-loading="loading" :show-close="false"
             :visible="isOpenMonitorGroupAddDialog" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading"
             element-loading-text="正在添加中"
             @close="handleClose">
    <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" class="demo-dynamic" label-width="100px">

      <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" :label="'域名' + index"
                    :prop="'domains.' + index + '.value'" :rules="{
                    required: true, message: '域名不能为空', trigger: 'blur'
                }">

        <el-transfer v-model="domain.value" :data="data2" :filter-method="filterMethod" filter-placeholder="请输入"
                     filterable>
        </el-transfer>
        <el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="addDomain">新增域名</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import {deepCopy} from '@/utils/utils'
import {mapActions, mapGetters} from 'vuex'


export default {
  name: 'RuleAddDialog',
  data() {
    const generateData2 = _ => {
      const data = [];
      const cities = ['聚集', '夜晚', '速度高', '声音大', '南京', '西安', '成都'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          // pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      data2: generateData2(),

      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      dynamicValidateForm: {
        domains: [{
          value: []
        }],
      },
      loading: false

    };
  },
  props: {
    isOpenMonitorGroupAddDialog: {
      type: Boolean,
      default: false
    },

  },
  computed: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dynamicValidateForm);
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: [],
        key: Date.now()
      });
    },
    handleClose() {
      this.$emit('closeDialog')
    },

  },

}
</script>

<style lang="scss" scoped>
$primary-light: #8abdff;
$primary: #6d5dfc;
$primary-dark: #5b0eeb;
$white: #FFFFFF;
$greyLight-1: #E4EBF5;
$greyLight-2: #c8d0e7;
$greyLight-3: #bec8e4;
$greyDark: #9baacf;

#monitor-config-dialog {
  .monitor-config-form {
    padding: 20px 15px;

    .form-layout-wrapper {
      display: flex;
      width: 100%;
      height: 100%;

      .form-flex-display {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }

      .form-left {
        width: 35%;
      }

      .form-center {
        width: 30%;
      }

      .form-right {
        width: 35%;
      }
    }
  }

  .dialog-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>

<style scoped>
.dialog-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15rem;
  height: 4rem;
  margin-top: 4rem;
  border-radius: 0.8rem;
  box-shadow: 0.8rem 0.8rem 1.4rem var(--greyLight-2), -0.2rem -0.2rem 1.8rem var(--white);
  background: var(--greyLight-1);
}

.dialog-title .el-icon-setting {
  margin-right: 0.5rem;
  font-size: 1.5rem;
  color: var(--primary);
}

.dialog-title span {
  font-size: 0.8rem;
  color: var(--greyDark)
}


/* BUTTON  */
.circle {
  grid-column: 2/3;
  grid-row: 4/6;
  width: 9rem;
  height: 100%;
  justify-self: center;
  border-radius: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
}

.circle__btn {
  grid-row: 1/2;
  grid-column: 1/2;
  width: 6rem;
  height: 6rem;
  display: flex;
  margin: 0.6rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 2rem;
  color: var(--primary);
  z-index: 300;
  background: var(--greyLight-1);
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  cursor: pointer;
  position: relative;
}

.circle__back-1,
.circle__back-2 {
  grid-row: 1/2;
  grid-column: 1/2;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  filter: blur(1px);
  z-index: 100;
}

.circle__back-1 {
  box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
  background: linear-gradient(to bottom right, var(--greyLight-2) 0%, var(--white) 100%);
  -webkit-animation: waves 4s linear infinite;
  animation: waves 4s linear infinite;
}

.circle__back-2 {
  box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
  -webkit-animation: waves 4s linear 2s infinite;
  animation: waves 4s linear 2s infinite;
}

@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
