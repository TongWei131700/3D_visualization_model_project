<template>
  <div class="map-settings">
    <header class="map-settings-header">
      <h5>地图设置</h5>
      <img src="@/assets/images/mapconfig/SettingsLogo.png">
    </header>
    <main class="map-settings-body">
      <div v-if="!editMapSettingsStatus" class="no-edit-status">
        <img class="tip-image" src="@/assets/images/mapconfig/TipLogo.png">
        <h4 class="tip-details">选中后配置地图详细信息</h4>
      </div>
      <div v-else class="edit-status">
        <el-form
          ref="mapSettingsForm"
          :model="settingsForm"
          :rules="mapSettingsRules"
          class="map-settings-form"
          label-position="left"
          label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="地图id" prop="id">
                <el-input v-model="settingsForm.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="楼层高度" prop="id">
                <el-input v-model="settingsForm.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="楼层数" prop="id">
                <el-input v-model="settingsForm.id" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地图名称" prop="mapName">
                <el-input v-model="settingsForm.mapName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地图启用状态" prop="isEnabled">
                <el-switch
                  v-model="settingsForm.isEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div v-show="false">
                <el-form-item label="地图缩放比例" prop="scaling">
                  <el-slider
                    v-model="settingsForm.scaling"
                    :max="5"
                    :min="0"
                    :step="0.1"
                    show-input>
                  </el-slider>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="false">
            <el-col :span="8">
              <el-form-item label="地图坐标X轴位置" prop="positionX">
                <el-slider
                  v-model="settingsForm.positionX"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地图坐标Y轴位置" prop="positionY">
                <el-slider
                  v-model="settingsForm.positionY"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地图坐标Z轴位置" prop="positionZ">
                <el-slider
                  v-model="settingsForm.positionZ"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="false">
            <el-col :span="8">
              <el-form-item label="X轴旋转角度" prop="rotationX">
                <el-slider
                  v-model="settingsForm.rotationX"
                  :max="360"
                  :min="0"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Y轴旋转角度" prop="rotationY">
                <el-slider
                  v-model="settingsForm.rotationY"
                  :max="360"
                  :min="0"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Z轴旋转角度" prop="rotationZ">
                <el-slider
                  v-model="settingsForm.rotationZ"
                  :max="360"
                  :min="0"
                  show-input>
                </el-slider>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="submit-button-row">
              <el-button
                round
                type="primary"
                @click.stop="submitForm('mapSettingsForm')">提交修改
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </main>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import {deepCopy} from "@/utils/utils";

export default {
  name: "MapSettings",
  data() {
    return {
      settingsForm: null,
      mapSettingsRules: {
        mapName: {
          required: true,
          message: '请输入地图名称',
          trigger: 'blur'
        }
      }
    };
  },
  computed: {
    ...mapGetters('mapConfig', {
      editMapSettingsStatus: 'getEditMapSettingsStatus',
      editingMapInfo: 'getEditingMapInfo',
    })
  },
  // 缓存用vuex有BUG 存在于不同keep-alive组件组切换时，vuex会清空数据 建议使用storage
  watch: {
    editingMapInfo(newVal) {
      this.settingsForm = deepCopy(newVal);
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    }
  },
  methods: {
    ...mapMutations('mapConfig', {
      updateEditingMapInfo: 'updateEditingMapInfo'
    }),
    ...mapActions('mapConfig', {
      updateMapSettings: 'updateMapSettings',
      getAllMapInfoByActions: 'getAllMapInfoByActions',
      getEnabledMapInfoByActions: 'getEnabledMapInfoByActions'
    }),
    // 提交对地图的修改
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let newSettingsForm = {}
          newSettingsForm.id = this.settingsForm.id
          newSettingsForm.mapName = this.settingsForm.mapName
          newSettingsForm.isEnabled = this.settingsForm.isEnabled
          await this.updateMapSettings(newSettingsForm);
          // await this.updateMapSettings(this.settingsForm);
          await this.getAllMapInfoByActions();
          await this.getEnabledMapInfoByActions();
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请检查设置填写是否完整'
          });
        }
      });
    }
  },
  /*activated() {
    if (this.editingMapInfo) {
      this.settingsForm = deepCopy(this.editingMapInfo);
    }
  },
  deactivated() {
    this.updateEditingMapInfo(this.settingsForm);
  }*/
};
</script>

<style scoped>
/deep/ .map-settings-form .el-row {
  margin: 10px 0;
}

/deep/ .map-settings-form .el-row .el-col {
  padding: 0 20px;
}

/deep/ .el-form-item__label {
  color: #fff;
}
</style>
<style lang="scss" scoped>
.map-settings {
  height: 100%;

  .map-settings-header {
    display: flex;
    align-items: center;
    height: 20px;

    h5 {
      margin-right: 20px;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.2rem;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  .map-settings-body {
    width: 97%;
    height: calc(100% - 60px);
    margin: 20px auto;

    .no-edit-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;

      .tip-image {
        width: 40px;
        height: 40px;
      }

      .tip-details {
        margin-top: 20px;
        font-size: 40px;
        font-weight: 550;
        letter-spacing: 0.2rem;
      }
    }

    .edit-status {
      height: 100%;

      .map-settings-form {
        height: 100%;
        padding: 50px 80px;

        .submit-button-row {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
