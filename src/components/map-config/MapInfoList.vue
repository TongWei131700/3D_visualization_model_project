<template>
  <div class="map-info-list">
    <header class="map-info-list-header">
      <h5>地图信息</h5>
      <img src="@/assets/images/mapconfig/MapLogo.png">
    </header>
    <main class="map-info-list-body">
      <el-button type="primary" style="margin: 5px 0" @click="changeUpLoadVisible">+ 上传新地图</el-button>
      <map-upload :upLoadVisible="upLoadVisible" title="上传地图文件" @closeUpload="closeUpload"></map-upload>
      <avue-crud :data="mapInfoList" :option="mapInfoListOption" @row-click="handleEditMapSettings"
        class="avue-crud-wrapper">
        <template slot="isEnabled" slot-scope="scope">
          <el-tag type="info" size="mini"
            v-if="scope.row.isEnabled === false || scope.row.isEnabled === undefined">未启用</el-tag>
          <el-tag type="success" size="mini" v-else>已启用</el-tag>
        </template>
        <template slot-scope="scope" slot="menu">

          <el-button v-if="scope.row.groupId !== 0" type="primary" icon="el-icon-delete" size="small" round
            @click="handleDelete(scope.row)">删除
          </el-button>

        </template>
      </avue-crud>
    </main>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import MapUpload from "@c/map-config/MapUpload";
import { deleteMapByName } from '@/api/mapConfig/mapConfig'

export default {
  name: "MapInfoList",
  components: { MapUpload },
  data() {
    return {
      // 是否打开上传地图对话框
      upLoadVisible: false
    };
  },
  computed: {
    ...mapGetters('mapConfig', {
      mapInfoList: 'getMapInfoList'
    }),
    mapInfoListOption() {
      return {
        size: 'small',
        align: 'center',
        defaultSort: {
          prop: 'isEnabled',
          order: 'descending'
        },
        // menu: false,
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        header: false,
        columnBtn: false,
        addBtn: false,
        refreshBtn: false,
        border: true,
        column: [
          {
            label: '地图名称',
            prop: 'mapName'
          },
          {
            label: '地图启用状态',
            prop: 'isEnabled',
            slot: true
          }
        ]
      };
    },
  },
  methods: {
    ...mapMutations('mapConfig', {
      updateEditMapSettingsStatus: 'updateEditMapSettingsStatus',
      updateEditingMapInfo: 'updateEditingMapInfo'
    }),
    ...mapActions('mapConfig', {
      getAllMapInfo: 'getAllMapInfoByActions',
      getEnabledMapInfo: 'getEnabledMapInfoByActions'
    }),
    // 调用actions获得所有地图信息以及当前使用的地图信息
    async getMapInfo() {
      await this.getAllMapInfo();
      await this.getEnabledMapInfo();
    },
    // 点击设置指定行的地图配置信息
    handleEditMapSettings(row) {
      console.log("aaaaaaaaaaaaaaaaaa");
      console.log(row);
      this.updateEditMapSettingsStatus(true);
      // 在表格下方显示地图具体配置信息 Object.assign();
      this.updateEditingMapInfo(row);
    },
    // 开启上传对话框
    changeUpLoadVisible() {
      this.upLoadVisible = true;
    },
    // 关闭上传对话框
    closeUpload() {
      this.upLoadVisible = false;
    },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDelete(row) {
      console.log("待删除行", row);
      this.openDelConfirm().then(() => {

        deleteMapByName({mapName:row.mapName}).then(res => {
          console.log(res);
          this.$message({
            duration: 1000,
            type: 'success',
            message: '删除地图成功'
          })
          location.reload()
        })
          .catch(() => {
            this.$message({
              duration: 1000,
              type: 'error',
              message: '删除地图失败'
            })
          })
      })

    }
  },
  created() {
    this.getMapInfo();
  }
};
</script>

<style lang="scss" scoped>
.map-info-list {
  height: 100%;

  .map-info-list-header {
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

  .map-info-list-body {
    width: 97%;
    height: calc(100% - 60px);
    margin: 20px auto;

    .avue-crud-wrapper {
      height: 85%;
      overflow: auto;
    }
  }
}
</style>
