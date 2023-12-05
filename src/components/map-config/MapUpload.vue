<template>
  <el-dialog :before-close="handleClose" :title="title" :visible.sync="upLoadVisible" center width="40%">
    <el-form v-show="showUploadBox" ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" class="upload-box"
             label-width="100px">
      <el-form-item label="地图名称" prop="mapName">
        <el-input v-model="uploadForm.mapName" placeholder="请输入地图名称"></el-input>
      </el-form-item>

      <el-upload ref="upload" :auto-upload="false" :before-upload="beforeUpload" :file-list="fileList" :http-request="uploadHttpRequest" :limit="2"
                 accept=".fbx,.gltf,.obj,.glb" action="#" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em style="color: #409eff">点击上传</em>
        </div>

        <div slot="tip" class="el-upload__tip" style="text-align: center">
          只能上传.fbx/.gltf/.obj/.glb文件，上传后自动启用地图
        </div>
      </el-upload>
      <el-form-item label="启用状态" prop="enabledStatus">
        <el-switch v-model="uploadForm.enableStatus" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <div class="el-button-wrapper">
        <el-button :loading="uploading" icon="el-icon-upload" size="small" style="margin: 10px 0;display: inline-block"
                   type="success" @click="submitUpload">
          上传到服务器
        </el-button>
        <el-button icon="el-icon-circle-close" size="small" style="margin-left: 10px;display: inline-block"
                   @click="cancelUpload">
          取 消
        </el-button>
      </div>
    </el-form>
    <el-form v-show="!showUploadBox" class="floorParam">
      <div class="floorTitle">楼栋参数信息</div>
      <div class="floorContent">
        <el-input
          v-model="floorParam"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入内容"
          type="textarea">
        </el-input>
      </div>
      <div class="floorButton">
        <el-button :loading="uploading" icon="el-icon-upload" size="small" style="margin: 10px 0;display: inline-block"
                   type="success" @click="submitFloor">
          上传到服务器
        </el-button>
        <el-button icon="el-icon-circle-close" size="small" style="margin-left: 10px;display: inline-block"
                   @click="cancelFloor">
          取 消
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {mapActions} from "vuex";
import axios from 'axios';
import Vue from 'vue';

Vue.prototype.uploadAxiosInstance = axios
import {getToken} from '@/utils/auth'
import qs from "qs";
// import { AddMap } from '@/api/mapConfig/mapConfig'
import {floorSaveParam} from '@/api/setMap/setMap.js'

export default {
  props: {
    title: {
      type: String,
      default: "上传地图文件"
    },
    upLoadVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadUrl: '/api/sys/map-model/mapUploadAndEnableByStatus',
      fileList: [],
      uploading: false,
      uploadForm: {
        mapName: '',
        enableStatus: true
      },
      uploadFormRules: {
        mapName: {
          required: true,
          message: '请输入地图名称',
          trigger: 'blur'
        }
      },
      showUploadBox: true,
      uploadMapId: -1,
      floorParam: '[[教学楼，教学楼一楼，教学楼二楼，教学楼三楼，教学楼四楼，教学楼五楼，教学楼六楼]，' +
        '[宿舍楼，宿舍一楼，宿舍二楼，宿舍三楼，宿舍四楼，宿舍五楼]，' +
        '[操场厕所，操场厕所]]' // 记录楼层信息
    };
  },
  mounted() {
  },
  methods: {
    ...mapActions('mapConfig', {
      getAllMapInfo: 'getAllMapInfoByActions',
      getEnabledMapInfo: 'getEnabledMapInfoByActions'
    }),
    // 上传文件之前的钩子：判断上传文件格式，若返回false则停止上传
    beforeUpload(file) {
      const strRegex = "(.fbx|.gltf|.obj|.glb)$";
      const regExpObject = new RegExp(strRegex);
      if (regExpObject.test(file.name.toLowerCase())) {
        return true;
      } else {
        this.$message.error("上传文件只能是.fbx/.gltf/.obj/.glb格式！");
        return false;
      }
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息，具体信息如下图
    uploadHttpRequest(param) {
      const that = this;
      this.uploading = true;
      const formData = new FormData(); // FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append("mainFile", param.file); // 添加文件对象
      formData.append('mapName', this.uploadForm.mapName);
      formData.append('enableStatus', this.uploadForm.enableStatus);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      config.headers['Authorization'] = 'Bearer ' + getToken()
      formData.forEach((key, val) => {
        console.log(key);
        console.log(val);
        console.log("key %s: value %s", key, val)
      })
      console.log("ccccccccccccccc");
      console.log(formData);
      this.showUploadBox = false;
      // AddMap(formData).then((res) => {
      //   if (res.data.code === 200) {
      //     that.uploading = false;
      //     that.$emit('closeUpload');
      //     that.$message.success('上传地图成功');
      //     this.getAllMapInfo();
      //     this.getEnabledMapInfo();
      //   }
      // }).catch((error) => {
      //   that.$message.error(error);

      // });
      this.uploadAxiosInstance.post(this.uploadUrl, formData, config).then((res) => {
        if (res.data.code === 200) {
          that.uploading = false;
          this.showUploadBox = false;
          this.uploadMapId = res.data.data.id
        }
      }).catch((error) => {
        that.$message.error(error);
      });
    },
    // 上传至服务器
    submitUpload() {
      console.log("bbbbbbbbbbbbb");
      console.log(this.uploadAxiosInstance);
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
        } else {
          this.$message.error('请校验信息是否填写完整');
        }
      });
    },
    cancelUpload() {
      this.$refs.upload.clearFiles(); // 清除上传文件对象
      this.fileList = []; // 清空选择的文件列表
      this.$emit('closeUpload');
    },
    // 关闭对话框
    handleClose() {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$emit('closeUpload');
        })
        .catch(() => {
        });
    },
    // 上传楼层信息函数
    submitFloor() {
      let length1 = this.floorParam.length
      let string1 = this.floorParam.substring(1, length1 - 1)
      let length2 = string1.length
      let string2 = []
      for (let i = 0; i < length2;) {
        let j = i
        if (string1[i] == '[') {
          while (string1[i] != ']') {
            i++
          }
          let string2Param = string1.substring(j + 1, i)
          string2.push(string2Param)
        } else {
          i++
        }
      }
      let length3 = string2.length
      let string3 = []
      for (let i = 0; i < length3; i++) {
        let stringParam = string2[i].split(/[，,]+/)
        string3.push(stringParam)
      }
      let param = {}
      param.id = this.uploadMapId
      param.buildings = string3
      floorSaveParam(param).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$emit('closeUpload');
          this.$message.success('上传地图成功');
          this.getAllMapInfo();
          this.getEnabledMapInfo();
        }
      }).catch((error) => {
        this.$message.error(error);
      });
      this.showUploadBox = true
    },
    // 取消上传楼层信息函数
    cancelFloor() {

    }
  }
};
</script>

<style scoped>
.upload-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.floorParam {
  width: 90%;
  margin: auto;
  height: 200px;
  position: relative;
}

.floorTitle {
  width: 20%;
  position: absolute;
  left: 0%;
  top: 40%;
  transform: translate(0, -50%);
  text-align: center;
}

.floorContent {
  width: 80%;
  position: absolute;
  left: 20%;
  top: 40%;
  transform: translate(0, -50%);
}

.floorButton {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
