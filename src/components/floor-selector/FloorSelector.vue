<template>
  <div>
    <el-select v-model="value" placeholder="请选择楼层" @change="selectFloor" :loading="load">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.label"
      />
    </el-select>
  </div>
</template>

<script>
import {Vector3} from 'three'
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'FloorSelector',
  data() {
    return {
      options: [],
      value: '全部楼层显示',
      dialogVisible: false,
      selVal: '',
      obj: null,
      buildingString: '',
      buildingName: [],
      load: false
    }
  },
  computed: {
    ...mapGetters('models', {
      shareModels: 'getShareModels', // 这里拿到shareModels的值
      getSelectHomeFloorInfo: 'getSelectHomeFloorInfo',
      getIfShowLoad: 'getIfShowLoad'
    }),
    // ...mapGetters(
    //   ['MainPageSelfModel'],
    //   ['TraceReplaySelfModel']
    // )
    ...mapGetters('selfModelInfo', {
      MainPageSelfModel: 'getMainPageSelfModel',
      TraceReplaySelfModel: 'getTraceReplaySelfModel',
      DevicePreviewSelfModel: 'getDevicePreviewSelfModel'
    })
  },
  watch: {
    getSelectHomeFloorInfo: {
      handler: function (val) {
        if(val != this.value) {
          this.value = val
        }
      },
      deep: true
    },
    getIfShowLoad: {
      handler: function(val) {
        if (val) {
          this.load = true
        } else {
          this.load = false
        }
      },
      deep: true
    }
  },
  mounted() {
    // 初始化后端返回的楼层组
    this.buildingString = JSON.parse(window.localStorage.getItem('infoMsg')).floorParam
    let length1 = this.buildingString.length
    let string1 = this.buildingString.substring(1, length1 - 1)
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
    this.buildingPerFloor = string3
    this.buildingName = []
    for (let i = 0; i < this.buildingPerFloor.length; i++) {
      for (let j = 1; j < this.buildingPerFloor[i].length; j++) {
        this.buildingName.push(this.buildingPerFloor[i][j].replace(/\s*/g, ""))
      }
    }
    // 放入options中
    this.options = [{
      value: '全部楼层',
      label: '全部楼层'
    }]
    for (let i = 0; i < this.buildingName.length; i++) {
      let param = {}
      param.value = this.buildingName[i]
      param.label = this.buildingName[i]
      this.options.push(param)
    }
  },
  methods: {
    ...mapActions('models', [
      'initShareModels'// 这里调用initShareModels
    ]),
    ...mapActions('traceReplay', ['setFloor']),
    ...mapActions('selfModelInfo', ['saveMainPageSelfModel']),
    ...mapMutations('models', [
      'uploadSelectHomeFloorInfo',
      'uploadShowTrace'
    ]),
    currentSel(selVal) {
      this.selVal = selVal
      console.log('****************************')
      console.log(selVal)
      console.log(this.MainPageSelfModel)
      console.log(this.TraceReplaySelfModel)
      if (this.MainPageSelfModel || this.DevicePreviewSelfModel) {
        // console.log(this.DevicePreviewSelfModel, 11111111111111, this.MainPageSelfModel);
        this.obj1 =
          this.MainPageSelfModel == null
            ? this.DevicePreviewSelfModel.scene.getObjectByName('mainModel')
            : this.MainPageSelfModel.scene.getObjectByName('mainModel')
        if (this.MainPageSelfModel == null) {
          this.saveMainPageSelfModel(this.DevicePreviewSelfModel)
        }
        console.log(this.obj1, 2222222222222)
      }
      if (this.TraceReplaySelfModel) {
        this.obj2 = this.TraceReplaySelfModel.scene.getObjectByName('mainModel')
      }
      const map = this.$store.state.mapper
      if (map != null) {
        for (const m of map) {
          m[1].lines.forEach((item) => {
            console.log(item, '-------------------------->')
            if (item != null) this.MainPageSelfModel.deleteModel(item)
          })
        }
        this.$store.commit('updateMapper', new Map())
      }
      switch (selVal) {
        case '24F':
          if (this.obj1) {
            this.obj1.children[1].visible = true
            this.obj1.children[2].visible = false
            this.obj1.children[3].visible = false
            console.log('高度为')
            console.log(this.MainPageSelfModel.camera.position)
            // -0.7853981633974483
            // 0.6154797086703874
            // 0.5235987755982989
            this.MainPageSelfModel.camera.position.x = 50
            this.MainPageSelfModel.camera.position.y = 40
            this.MainPageSelfModel.camera.position.z = 50
            this.MainPageSelfModel.camera.rotation.x = -0.7853981633974483
            this.MainPageSelfModel.camera.rotation.y = 0.6154797086703874
            this.MainPageSelfModel.camera.rotation.z = 0.5235987755982989

            // this.obj1.children[1].position.y = this.obj1.position.y;
            // this.obj1.children[1].position.y += 80;
            // this.MainPageSelfModel.scene.traverse((child)=>{
            //    if (child.floor && child.floor == 24 && child.name == '已添加防区') {
            //      child.position.y +=80;
            //    }
            // })
            console.log(this.MainPageSelfModel.scene, 'oooooooooo')
            this.MainPageSelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24 && child.type != 'Line') {
                child.visible = true
                // if (child.type == "Group") {
                //   if (child.position.y < -5) child.position.y += 8;
                //   console.log(child, "pppppppppppppp");
                // } else {
                //   child.position.y = this.obj1.position.y;
                //   child.position.y += 8;
                // }
              }
              if (child.floor && child.floor == 25) {
                child.visible = false
              }
              if (child.floor && child.floor == 26) {
                child.visible = false
              }

              //  if(child.name==='已添加防区') {
              //     console.log(child.name, 2626);
              //     // child.position.y += 4;
              //   }
            })
          }

          if (this.obj2) {
            this.obj2.children[1].visible = true
            this.obj2.children[2].visible = false
            this.obj2.children[3].visible = false
            this.TraceReplaySelfModel.camera.position.y = 62
            this.TraceReplaySelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24) {
                child.visible = true
              }
              if (child.floor && child.floor == 25) {
                child.visible = false
              }
              if (child.floor && child.floor == 26) {
                child.visible = false
              }
            })
          }
          break
        case '25F':
          if (this.obj1) {
            this.obj1.children[1].visible = false
            this.obj1.children[2].visible = true
            this.obj1.children[3].visible = false

            this.MainPageSelfModel.camera.position.x = 50
            this.MainPageSelfModel.camera.position.y = 48
            this.MainPageSelfModel.camera.position.z = 50
            this.MainPageSelfModel.camera.rotation.x = -0.7853981633974483
            this.MainPageSelfModel.camera.rotation.y = 0.6154797086703874
            this.MainPageSelfModel.camera.rotation.z = 0.5235987755982989

            this.MainPageSelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24) {
                child.visible = false
              }
              if (child.floor && child.floor == 25) {
                child.visible = true
              }
              if (child.floor && child.floor == 26) {
                child.visible = false
              }

              if (child.name === '已添加防区') {
                console.log(child.name, 2626)
                // child.position.y += 4;
              }
            })
          }

          if (this.obj2) {
            this.obj2.children[1].visible = false
            this.obj2.children[2].visible = true
            this.obj2.children[3].visible = false
            this.TraceReplaySelfModel.camera.position.y = 70
            this.TraceReplaySelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24) {
                child.visible = false
              }
              if (child.floor && child.floor == 25) {
                child.visible = true
              }
              if (child.floor && child.floor == 26) {
                child.visible = false
              }
            })
          }
          break

        case '26F':
          if (this.obj1) {
            this.obj1.children[1].visible = false
            this.obj1.children[2].visible = false
            this.obj1.children[3].visible = true

            this.MainPageSelfModel.camera.position.x = 50
            this.MainPageSelfModel.camera.position.y = 56
            this.MainPageSelfModel.camera.position.z = 50

            this.MainPageSelfModel.camera.rotation.x = -0.7853981633974483
            this.MainPageSelfModel.camera.rotation.y = 0.6154797086703874
            this.MainPageSelfModel.camera.rotation.z = 0.5235987755982989

            console.log(this.obj1, 11111)
            // this.obj1.children[3].position.y = this.obj1.position.y;
            // this.obj1.children[3].position.y -= 80;
            // this.MainPageSelfModel.scene.traverse((child)=>{
            //    if (child.floor && child.floor === 26 && child.name === '已添加防区') {
            //      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            //      child.position.y -=80;
            //    }
            // })
            this.MainPageSelfModel.scene.traverse((child) => {
              if (child.floor === 26) {
                console.log('nininiiiiniiiii')
                console.log(child.floor === 26)
              }
              if (child.floor && child.floor == 24) {
                child.visible = false
              }
              if (child.floor && child.floor == 25) {
                child.visible = false
              }
              if (child.floor && child.floor == 26 && child.type != 'Line') {
                child.visible = true
                // if (child.type == "Group") {
                //   if (child.position.y > 1) {
                //     child.position.y -= 8;
                //   }
                // } else {
                //   child.position.y = this.obj1.position.y;
                //   child.position.y -= 8;
                // }

                // if(child.name==='已添加防区') {
                //   console.log(child.name, 2626);
                //   child.position.y += 4;
                // }
              }
            })
          }

          if (this.obj2) {
            this.obj2.children[1].visible = false
            this.obj2.children[2].visible = false
            this.obj2.children[3].visible = true
            console.log(this.TraceReplaySelfModel.camera.position)
            this.TraceReplaySelfModel.camera.position.y = 78
            this.TraceReplaySelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24) {
                child.visible = false
              }
              if (child.floor && child.floor == 25) {
                child.visible = false
              }
              if (child.floor && child.floor == 26) {
                child.visible = true
              }
            })
          }
          break

        case '全部楼层显示':
          if (this.obj1) {
            this.obj1.children[1].visible = true
            this.obj1.children[2].visible = true
            this.obj1.children[3].visible = true

            this.MainPageSelfModel.camera.position.x = 50
            this.MainPageSelfModel.camera.position.y = 50
            this.MainPageSelfModel.camera.position.z = 50

            this.MainPageSelfModel.camera.rotation.x = -0.7853981633974483
            this.MainPageSelfModel.camera.rotation.y = 0.6154797086703874
            this.MainPageSelfModel.camera.rotation.z = 0.5235987755982989
            // this.MainPageSelfModel.camera.position.y = 50;
            // this.obj1.children[3].position.y = this.obj1.position.y;
            // this.obj1.children[1].position.y = this.obj1.position.y;
            this.MainPageSelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24 && child.type != 'Line') {
                child.visible = true
                // if (child.type == "Group") {
                //   if (child.position.y > -5) {
                //     child.position.y -= 8;
                //   }
                // } else child.position.y = this.obj1.position.y;
              }
              if (child.floor && child.floor == 25) {
                child.visible = true
              }
              if (child.floor && child.floor == 26 && child.type != 'Line') {
                child.visible = true

                // if (child.type == "Group") {
                //   if (child.position.y < 1) {
                //     child.position.y += 8;
                //   }
                // } else child.position.y = this.obj1.position.y;
              }

              //  if(child.name==='已添加防区') {
              //     console.log(child.name, 2626);
              //     child.position.y += 4;
              //   }
            })
          }

          if (this.obj2) {
            this.obj2.children[1].visible = true
            this.obj2.children[2].visible = true
            this.obj2.children[3].visible = true
            this.TraceReplaySelfModel.camera.position.y = 78
            this.TraceReplaySelfModel.scene.traverse((child) => {
              if (child.floor && child.floor == 24) {
                child.visible = true
              }
              if (child.floor && child.floor == 25) {
                child.visible = true
              }
              if (child.floor && child.floor == 26) {
                child.visible = true
              }
            })
          }
          break
        default:
      }
      // if(sel)
      // obj.children[2].visible = false;
      // this.dialogVisible = true;
      // this.$emit("FloorLevel", selVal);
      this.setFloor(selVal)
    },
    // 新选择楼层函数
    selectFloor(val) {
      this.uploadSelectHomeFloorInfo(val)
      this.uploadShowTrace(false)
      this.$emit('resetTrace')
    }
  }
}
</script>
