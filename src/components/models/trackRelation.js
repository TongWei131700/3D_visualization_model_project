import * as THREE from 'three'
import {Line2} from 'three/examples/jsm/lines/Line2'
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry'
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial'
// import { GetTrailPoint } from "@/api/device-list/index";
import {
  mapGetters
} from 'vuex'
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

/**
 * 初始化轨迹线
 * @author Lyc
 * @vesion 1.0
 */
export function initTrack() {
  console.log('轨迹线被执行')
  this.map = new Map()
  console.log(this.models, 'guiguiguiguiiiiiiiiiiiii')
}

/**
 * @author Lyc
 * websocket实时轨迹
 * @param {*} e
 */

export function websocketMessage(e) {
  console.log('+++++++++++++++++执行了吗')
  let level = 0
  switch (this.$store.state.traceReplay.floor) {
    case '24F':
      level = 24
      break
    case '25F':
      level = 25
      break
    case '26F':
      level = 26
      break
  }
  // 轨迹线点
  // console.log("被執行軌跡化纖")
  const parseData = JSON.parse(e.data)
  // parseData.radarSn sn 号
  const {
    radarSn,
    points,
    tid,
    floor,
    // 是轨迹点所属目标的UUID
    // uid,
    //  头像地址
    pictureUrl
  } = parseData
  if (this.$store.state.models.selectHomeFloorInfoID && (this.$store.state.models.selectHomeFloorInfoID == floor)) {
    this.$store.state.models.showTrace = true
    console.log(parseData)
    console.log('++++++++++++++++++++++++', tid)
    console.log('----------------------', points)
    const uid = tid
    let currentGeometry = null
    let currentMesh = null
    const tracks = []
    const Geometries = []
    const trackMaterial = new THREE.LineBasicMaterial({
      color: '#FF0033'
    })
    this.map = this.$store.state.mapper == null ? this.map : this.$store.state.mapper
    if (this.map.has(radarSn)) {
      if (!this.map.get(radarSn).lines[tid]) {
        const geo = this.map.get(radarSn).geos
        const lin = this.map.get(radarSn).lines
        geo[tid] = new THREE.BufferGeometry()
        lin[tid] = new THREE.Line(geo[tid], trackMaterial)
        lin[tid].name = `${radarSn}号雷达${tid}号目标`
        lin[tid].floor = floor
        const obj = {
          geos: geo,
          lines: lin
        }
        if (level !== 0) {
          if (level !== floor) {
            return
          }
        }
        // 七十五中首页轨迹线先行删除，临时操作
        // this.models.scene.add(lin[tid])
        this.map.set(radarSn, obj)
        this.$store.commit('updateMapper', this.map)
      } else {
        if (level !== 0) {
          if (level !== floor) {
            this.map.get(radarSn).lines[tid].visible = false
          }
        } else {
          this.map.get(radarSn).lines[tid].material.linewidth = 1000
          // this.map.get(radarSn).lines[tid].material.color = '0xffffff'
          // this.map.get(radarSn).lines[tid].material.color.set(0xffffff)
          this.map.get(radarSn).lines[tid].floor = 0
          this.map.get(radarSn).lines[tid].visible = true
        }
      }
    } else {
      Geometries[tid] = new THREE.BufferGeometry()
      const tem = new THREE.Line(Geometries[tid], trackMaterial)
      tem.name = `${radarSn}号雷达${tid}号目标`
      tem.floor = floor
      tracks[tid] = tem
      const obj = {
        geos: Geometries,
        lines: tracks
      }
      if (level !== 0) {
        if (level !== floor) {
          return
        }
      }
      // 七十五中首页轨迹线先行删除，临时操作
      // this.models.scene.add(tem)
      this.map.set(radarSn, obj)
      this.$store.commit('updateMapper', this.map)
    }
    currentGeometry = this.map.get(radarSn).geos[tid]
    currentMesh = this.map.get(radarSn).lines[tid]
    // 临时数组

    const arr = []
    // 储存人物照片路径,指向public/people
    const imgArray = ['/people/orangePeople.png', '/people/bluePeople.png', '/people/greenPeople.png', '/people/blackPeople.png', '/people/yellowPeople.png']
    const obj = this.models.scene.getObjectByName(uid)
    if (obj === null || obj === undefined) {
      var textureLoader = new THREE.TextureLoader()
      var imgPath
      if (pictureUrl) {
        imgPath = pictureUrl
      } else {
        // 需求修改，七十五中只用橘黄色
        imgPath = imgArray[0]
      }
      var texture = textureLoader.load(imgPath, function (texture) {
        console.log('texture++', texture)
      }, function () {
      }, function (event) {
        console.log('textureEvent', event)
      })
      console.log('texture', texture)
      var material = new THREE.SpriteMaterial({
        color: 0xffffff, // 设置精灵矩形区域颜色
        map: texture, // 设置精灵纹理贴图
        transparent: true,
        opacity: 1
      })
      var spriteAlarm = new THREE.Sprite(material)
      if (pictureUrl) {
        // spriteAlarm.scale.set(1.5, 1, 1)
        if (this.$store.state.models.traceParam.scale) {
          spriteAlarm.scale.setScalar(this.$store.state.models.traceParam.scale)
        } else spriteAlarm.scale.setScalar(0.5)
      } else {
        if (this.$store.state.models.traceParam.scale) {
          spriteAlarm.scale.setScalar(this.$store.state.models.traceParam.scale)
        }
        // 默认值0.5适用于七十五中的人物，4是茶室的人物放大倍率
        else spriteAlarm.scale.setScalar(0.5)
      }
      spriteAlarm.name = uid
      this.models.scene.add(spriteAlarm)
      setTimeout(() => {
        this.models.scene.remove(this.models.scene.getObjectByName(uid))
      }, 10000)
      console.log('spriteAlarm', spriteAlarm)
    }
    if (points.length !== 0) {
      for (const point of points) {
        if (point.goOut) {
          this.models.scene.remove(this.models.scene.getObjectByName(uid))
        } else {
          let paramX = 0
          let paramY = 8.4
          let paramZ = 0
          if (Object.keys(this.$store.state.models.traceParam).length) {
            paramX = this.$store.state.models.traceParam.positionX
            paramY = this.$store.state.models.traceParam.positionY
            paramZ = this.$store.state.models.traceParam.positionZ
          }
          this.models.scene.getObjectByName(uid).position.set((point.posX + paramX).toFixed(2), (point.posY + paramY).toFixed(2), (point.posZ + paramZ).toFixed(2))
          arr.push((point.posX + paramX).toFixed(2), (point.posY + paramY).toFixed(2), (point.posZ + paramZ).toFixed(2))
        }
      }
    } else {
      this.models.scene.remove(this.models.scene.getObjectByName(uid))
    }
    currentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
    currentGeometry.getAttribute('position').needsUpdate = true
    currentGeometry.updateFromObject(currentMesh)
  }
}

/**
 * 轨迹回放
 * @author Lyc
 * @param {} param
 */
export async function initTraceReplay(param) {
  if (!Object.keys(this.$store.state.models.selectHomeFloorInfo).length) {
    this.$message({
      duration: 3000,
      type: 'warning',
      message: '请先选择对应的楼层，再查看轨迹！！！'
    })
    return
  }
  // 先清除已经存在的线名
  if (this.$store.state.traceReplay.trailLineName.length) {
    for (let k = 0; k < this.$store.state.traceReplay.trailLineName.length; k++) {
      if (this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k])) {
        this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k]).visible = false
        this.models.scene.remove(this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k]))
      }
    }
  }
  // 清除已经存在的图像
  if (this.$store.state.traceReplay.trailImgName.length) {
    for (let k = 0; k < this.$store.state.traceReplay.trailImgName.length; k++) {
      if (this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k])) {
        this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k]).visible = false
        this.models.scene.remove(this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k]))
      }
    }
  }
  this.$store.state.traceReplay.trailLineName = []
  let map = new Map() // 映射，用来存储不同轨迹线的具体信息
  let i = 0
  const timer2 = setInterval(() => {
    if (i === param.length - 1) {
      clearInterval(timer2)
    }
    // 只对选中的楼层与轨迹点所在的楼层相同时，再进行操作处理
    if (this.$store.state.models.selectHomeFloorInfoID && (this.$store.state.models.selectHomeFloorInfoID == param[i].floor)) {
      // map中不存在uid的情况下新建一条轨迹线
      if (!map.has(param[i].uid)) {
        let geometry = new THREE.BufferGeometry() // 几何体
        let material = new THREE.LineBasicMaterial({color: 0xff0000}) // 材质
        let line = new THREE.Line(geometry, material) // 创建一条轨迹线
        line.name = param[i].uid
        this.$store.state.traceReplay.trailLineName.push(line.name) // 往Vuex中添加线名，方便删除线条
        this.models.scene.add(line) // 新创建的线条添加到场景中

        // 创建图片到场景中
        let textureLoader = new THREE.TextureLoader()
        let texture = textureLoader.load('/people/orangePeople.png')
        let ImgMaterial = new THREE.SpriteMaterial({
          color: 0xffffff, // 设置精灵矩形区域颜色
          map: texture, // 设置精灵纹理贴图
          transparent: true,
          opacity: 1
        })
        let spriteAlarm = new THREE.Sprite(ImgMaterial)
        if (this.$store.state.models.traceParam.scale) {
          spriteAlarm.scale.setScalar(this.$store.state.models.traceParam.scale)
        }
        // 默认值0.5适用于七十五中的人物，4是茶室的人物放大倍率
        else spriteAlarm.scale.setScalar(0.5)
        spriteAlarm.name = param[i].uid + 'Img'
        this.models.scene.add(spriteAlarm)
        this.$store.state.traceReplay.trailImgName.push(spriteAlarm.name) // 往Vuex中添加图片名，方便删除图片
        let obj = {
          geometry,
          line,
          pointsArr: [] // 用于储存该uid下的所有点，用来绘制轨迹线
        }
        map.set(param[i].uid, obj) // 在map中存储，键名为uid
      }
      // 以下为轨迹点的位置偏移值调整逻辑
      let paramX = 0
      let paramY = 8.4
      let paramZ = 0
      if (Object.keys(this.$store.state.models.traceParam).length) {
        paramX = this.$store.state.models.traceParam.positionX
        paramY = this.$store.state.models.traceParam.positionY
        paramZ = this.$store.state.models.traceParam.positionZ
      }
      // 将最新的轨迹点放入对应的uid数组中
      if (this.models.scene.getObjectByName(param[i].uid + 'Img')) this.models.scene.getObjectByName(param[i].uid + 'Img').position.set((param[i].posX + paramX).toFixed(2), (param[i].posY + paramY).toFixed(2), (param[i].posZ + paramZ).toFixed(2))
      map.get(param[i].uid).pointsArr.push(param[i].posX + paramX, param[i].posY + paramY, param[i].posZ + paramZ)
      map.get(param[i].uid).geometry.setAttribute('position', new THREE.Float32BufferAttribute(map.get(param[i].uid).pointsArr, 3))
      map.get(param[i].uid).geometry.attributes.position.needsUpdate = true
      map.get(param[i].uid).geometry.updateFromObject(map.get(param[i].uid).line)
    }
    i++
  }, 500)
  this.$store.state.traceReplay.interValClock = timer2
}
