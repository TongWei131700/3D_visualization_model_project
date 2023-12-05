<template>
  <section id="camera-Table">
    <avue-crud
      :data="cameraData"
      :option="cameraOption"
      :row-style="monitorGroupRowStyle"
    >
      <template slot="cameraSn" slot-scope="scope">
        <el-tag
          class="camera-tag"
          effect="plain"
        >
          {{ scope.row.cameraSn }}
        </el-tag>
      </template>
      <template slot="cameraName" slot-scope="scope">
        <el-tag
          class="camera-tag"
          effect="plain"
        >
          {{ scope.row.cameraName }}
        </el-tag>
      </template>
      <template slot="cameraOnline" slot-scope="scope">
        <span v-if="scope.row.cameraOnline === '1'">{{ '在线' }}</span>
        <span v-else-if="scope.row.cameraOnline === '0'">{{ '离线' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="cameraOnOff" slot-scope="scope">
        <span v-if="scope.row.cameraOnOff === '1'">{{ '开启' }}</span>
        <span v-else-if="scope.row.cameraOnOff === '0'">{{ '关闭' }}</span>
        <span v-else>{{ '未知' }}</span>
      </template>
      <template slot="cameraId" slot-scope="scope">
        <span v-if="scope.row.cameraId === null">{{ '暂未配置摄像头IP' }}</span>
        <span v-else>{{ scope.row.cameraId }}</span>
      </template>

      <template slot="menu" slot-scope="scope">
        <el-button
          icon="el-icon-edit"
          round
          size="small"
          type="primary"
          @click="handleEditBolt(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="scope.row.groupId !== 0"
          icon="el-icon-delete"
          round
          size="small"
          type="primary"
          @click="handleDeleteCamera(scope.row)"
        >删除
        </el-button>
      </template>
    </avue-crud>
    <camera-edit-dialog
      v-if="isEditDialogOpen"
      :editing-info="editingBoltInfo"
      :is-open-edit-dialog="isEditDialogOpen"
      @closeDialog="isEditDialogOpen = false"
    />
  </section>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import CameraEditDialog from '@/views/device-basic-config/camera/CameraTableEdit'
import {deleteCamera} from '@/api/device/BasicConfig'

export default {
  name: 'CameraTable',
  components: {CameraEditDialog},
  props: {
    searchBoxValue: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      editingBoltInfo: {},
      isEditDialogOpen: false
    }
  },
  computed: {
    ...mapGetters('BasicConfig', {
      cameraInfo: 'getcameraInfo'

    }),
    cameraData() {
      const camera = []
      this.cameraInfo.forEach((item) => {
        camera.push(item)
      })
      return camera
    },
    cameraOption() {
      return {
        align: 'center',
        border: true,
        menuAlign: 'center',
        delBtn: false,
        editBtn: false,
        header: false,
        column: [
          {
            label: '摄像头所属绑定组名',
            prop: 'groupName'
          },
          {
            label: '摄像头设备号',
            prop: 'cameraSn'
          },
          {
            label: '摄像头名称',
            prop: 'cameraName'
          },
          // {
          //   label: '摄像头高度',
          //   prop: 'cameraHigh'
          // },
          {
            label: '摄像头启用状态',
            prop: 'cameraOnOff'
          },
          {
            label: '摄像头在线状态',
            prop: 'cameraOnline'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('BasicConfig', {
      getCameraInfo: 'getAllCameraByActions'
    }),
    // 表格行颜色控制
    monitorGroupRowStyle({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: 'rgba(127,255,170, .1)'
        }
      }
      return {
        backgroundColor: 'rgba(127,255,170, .17)'
      }
    },
    handleEditBolt(caremaRowData) {
      console.log(caremaRowData)
      this.editingBoltInfo = {
        groupId: caremaRowData.groupId,
        cameraId: caremaRowData.cameraId,
        groupName: caremaRowData.groupName,
        cameraSn: caremaRowData.cameraSn,
        cameraIp: caremaRowData.cameraIp,
        cameraName: caremaRowData.cameraName,
        cameraHigh: caremaRowData.cameraHigh,
        cameraOnline: caremaRowData.cameraOnline,
        cameraOnOff: caremaRowData.cameraOnOff
      }
      this.isEditDialogOpen = true
    },
    openDelConfirm() {
      return this.$confirm(`确定要删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleDeleteCamera(RadarRowData) {
      const requestBody = RadarRowData.cameraSn
      this.openDelConfirm().then(() => {
        deleteCamera(requestBody).then(() => {
          this.$message({
            duration: 1000,
            type: 'success',
            message: '删除摄像机成功'
          })
          this.getCameraInfo()
        }).catch(() => {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '删除摄像机失败'
          })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
