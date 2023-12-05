<template>
  <div class="main">
    <dv-border-box-8 style="padding: 10px">
      <el-form
        :model="traceParam"
        label-position="left"
        label-width="80px"
        size="small"
        text-color="#fff"
      >
        <el-form-item label="轨迹线偏移值X">
          <el-slider
            v-model="traceParam.positionX"
            :max="20"
            :min="-20"
            :step="0.1"
            show-input
            @change="changeTraceParam"
          />
        </el-form-item>
        <el-form-item label="轨迹线偏移值Y">
          <el-slider
            v-model="traceParam.positionY"
            :max="20"
            :min="-20"
            :step="0.1"
            show-input
            @change="changeTraceParam"
          />
        </el-form-item>
        <el-form-item label="轨迹线偏移值Z">
          <el-slider
            v-model="traceParam.positionZ"
            :max="20"
            :min="-20"
            :step="0.1"
            show-input
            @change="changeTraceParam"
          />
        </el-form-item>
        <!--        逆时针旋转-->
<!--        <el-form-item label="轨迹线旋转值r">-->
<!--          <el-slider-->
<!--            v-model="traceParam.rotation"-->
<!--            :max="360"-->
<!--            :min="0"-->
<!--            :step="0.1"-->
<!--            show-input-->
<!--            @change="changeTraceParam"-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item label="照片大小缩放">
          <el-slider
            v-model="traceParam.scale"
            :max="10"
            :min="0"
            :step="0.01"
            show-input
            @change="changeTraceParam"
          />
        </el-form-item>
        <!--        <el-form-item label="轨迹线绘图频率">-->
        <!--          <el-slider-->
        <!--            v-model="traceParam.frequency"-->
        <!--            :min="0"-->
        <!--            :max="1000"-->
        <!--            :step="1"-->
        <!--            show-input-->
        <!--            @change="changeTraceParam"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="轨迹线步长缩放">-->
        <!--          <el-slider-->
        <!--            v-model="traceParam.distanceScale"-->
        <!--            :min="0"-->
        <!--            :max="1000"-->
        <!--            :step="1"-->
        <!--            show-input-->
        <!--            @change="changeTraceParam"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <div style="margin-left: 30%">
          <el-button size="small" type="primary" @click="submitTrace">保存修改</el-button>
          <el-button size="small" @click="cancelTrace">隐藏</el-button>
        </div>
      </el-form>
    </dv-border-box-8>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import {floorShotAdd} from "@/api/setMap/setMap.js"

export default {
  name: "trajectoriesChange",
  data() {
    return {
      // 轨迹线可调节参数
      traceParam: {
        positionX: 0,
        positionY: 8.4,
        positionZ: 0,
        scale: 0.5,
        rotation: 0
        // frequency: 1,
        // distanceScale: 1
      }
    }
  },
  computed: {
    ...mapGetters('models', {
      getSaveTraceParam: 'getSaveTraceParam'
    }),
  },
  watch: {
    getSaveTraceParam: {
      handler: function (val) {
        if (val.trailOffsetX) this.traceParam.positionX = this.getSaveTraceParam.trailOffsetX
        if (val.trailOffsetY) this.traceParam.positionY = this.getSaveTraceParam.trailOffsetY
        // // 七十五中临时修改，方便部署，y值设死
        // if(this.getSaveTraceParam.floorName == '教学楼一楼')  this.traceParam.positionY = 7.2
        // if(this.getSaveTraceParam.floorName == '教学楼二楼')  this.traceParam.positionY = 8.1
        // if(this.getSaveTraceParam.floorName == '教学楼三楼')  this.traceParam.positionY = 9
        // if(this.getSaveTraceParam.floorName == '教学楼四楼')  this.traceParam.positionY = 9.9
        // if(this.getSaveTraceParam.floorName == '教学楼五楼')  this.traceParam.positionY = 10.8
        // if(this.getSaveTraceParam.floorName == '教学楼六楼')  this.traceParam.positionY = 11.7
        if (val.trailOffsetZ) this.traceParam.positionZ = this.getSaveTraceParam.trailOffsetZ
        if (val.imageScale) this.traceParam.scale = this.getSaveTraceParam.imageScale
        this.uploadTraceParam(this.traceParam)
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('models', ['uploadTraceParam']),
    changeTraceParam() {
      let param = {}
      param.positionX = this.traceParam.positionX
      param.positionY = this.traceParam.positionY
      param.positionZ = this.traceParam.positionZ
      param.scale = this.traceParam.scale
      // param.rotation = this.traceParam.rotation
      // param.frequency = this.traceParam.frequency
      // param.distanceScale = this.traceParam.distanceScale
      this.uploadTraceParam(param)
    },
    submitTrace() {
      let sendParam = {}
      sendParam = {...this.getSaveTraceParam}
      sendParam.imageScale = this.traceParam.scale
      sendParam.trailOffsetX = this.traceParam.positionX
      sendParam.trailOffsetY = this.traceParam.positionY
      sendParam.trailOffsetZ = this.traceParam.positionZ
      // sendParam.trailRotation = this.traceParam.rotation
      // console.log("sendParm",sendParam)
      floorShotAdd(sendParam).then(res => {
        if (res.code == 200) {
          this.$message.success(`${res.msg}`)
        }
      }).catch(err => {
        this.$message.error(`${err}`)
      })
    },
    cancelTrace() {
      this.$emit('cancelTrace')
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
}

/deep/ .el-form-item__label {
  color: white;
}
</style>
