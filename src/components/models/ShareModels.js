import * as THREE from 'three'
import {
  FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader'
// import { OrbitControls } from '../../assets/examples/jsm/controls/OrbitControls';
import * as MathUtils from 'three/src/math/MathUtils'
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import { resolve } from 'eslint-plugin-promise/rules/lib/promise-statics'
// import {ObjectLoader} from "three";
// import {OBJLoader2} from "three/examples/jsm/loaders/OBJLoader2";

class ShareModels {
  constructor() {
    this.scene = this.initScene()
    // this.initPlane();
    this.initModels = {}
    this.initPlane = initPlane
    this.initPlaneByHandeler = initPlaneByHandeler
    this.loadSimapleModel = loadSimapleModel
    this.initPlaneAsync = initPlaneAsync
    this.initDeviceModels = this.initDeviceModels1
    this.loadModel = this.loadModel1
    this.moveModel = this.moveModel1
    this.deleteModel = this.deleteModel1
    this.addModelExtraInf = this.addModelExtraInf1
    console.log('sharemodel初始化完毕')
  }

  initScene() {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xa0a0a0, 100, 10000);

    // 灯光效果
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 10, 0)
    scene.add(hemiLight)
    // scene.add(new THREE.AmbientLight(0x666666));
    // const dirLight = new THREE.DirectionalLight(0xcccccc)
    const dirLight = new THREE.DirectionalLight(0xcccccc, 0.1)
    dirLight.position.set(10, 10, 10)
    scene.add(dirLight)
    // scene.position.x = 100;
    // scene.position.z = 100;
    return scene
  }

  // 这里面有几个相机模型指定的路径,
  initDeviceModels1() {
    const models = {}
    // 加载杆子
    const pole = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.5, 0.5, 14, 32),
      new THREE.MeshPhongMaterial({
        color: 0xffffff
      })
    )
    pole.position.set(0, 7, 0)
    models.pole = pole
    // 加载相机
    const loader = new FBXLoader()
    const promise1 = new Promise(resolve => {
      loader.load('selfModels/camera/qiuji/ball_camera1.fbx', object => {
        // object.scale.setScalar(0.1);
        // object.rotation.y = Math.PI;
        // object.position.x = 2;
        // object.position.y = 2;
        models.ballHeadCamera = object
        resolve('完毕')
      })
    })
    const promise2 = new Promise(resolve => {
      loader.load('selfModels/camera/qiangji/camera.fbx', object => {
        models.gunCamera = object
        resolve('完毕')
      })
    })
    const promise3 = new Promise(resolve => {
      loader.load('selfModels/other/warningLight/warningLight.FBX', object => {
        models.warningLight = object
        resolve('完毕')
      })
    })
    const promise4 = new Promise(resolve => {
      loader.load('selfModels/other/radar/newRadar.fbx', object => {
        models.radar = object
        resolve('完毕')
      })
    })
    const promise5 = new Promise(resolve => {
      loader.load('selfModels/other/radar/sensor.fbx', object => {
        models.sensor = object
        resolve('完毕')
      })
    })

    return Promise.all([models, promise1, promise2, promise3, promise4, promise5])
  }

  /**
   *
   * @param type
   * @param scene
   * @returns {Promise<unknown>}
   */
  loadModel1(type, scene) {
    return new Promise(resolve => {
      switch (type) {
        case 'ballHeadCamera':
          // 加载模型是异步, 这里判断初始化模型结束否, 未结束另外加载
          if (this.initModels.ballHeadCamera !== undefined) {
            const object = this.initModels.ballHeadCamera.clone()
            loadBallHeadCamera(object)
          } else {
            const loader = new FBXLoader()
            loader.load('selfModels/camera/qiuji/ball_camera1.fbx', object => {
              loadBallHeadCamera(object)
            })
          }

          function loadBallHeadCamera(object) {
            object.scale.setScalar(0.04)
            object.rotation.y = Math.PI
            object.position.x = 2
            object.name = 'testBallHeadCamera'
            const group = new THREE.Group()
            // ---
            const groupInner = new THREE.Group()
            // 出现问题, 在object.children[13]处总是出现无法操作的问题
            // 原因, 每次循环后, object的子对象重新排列
            for (let i = 2; i < 26 - 1; i++) {
              groupInner.add(object.children[2])
            }
            object.add(groupInner)

            // ---
            group.add(object)
            scene.add(group)
            group.name = 'ballHeadCamera'
            group.position.y = Math.PI
            resolve(group)
          }

          break
        case 'gunCamera':
          if (this.initModels.gunCamera !== undefined) {
            const object = this.initModels.gunCamera.clone()
            loadGunCamera(object)
          } else {
            const loader = new FBXLoader()
            loader.load('selfModels/camera/qiangji/camera.fbx', object => {
              loadGunCamera(object)
            })
          }

          function loadGunCamera(object) {
            object.scale.setScalar(0.01)
            object.children[1].scale.set(1.5, 1, 1)
            object.children[1].position.x = 70
            object.name = 'testGunCamera'
            const temGroup = new THREE.Group()
            temGroup.add(object.children[0])
            object.add(temGroup)
            temGroup.position.x = 250
            temGroup.children[0].position.x = -120

            // let temPole = pole;
            const group = new THREE.Group()
            group.add(object)
            scene.add(group)
            group.name = 'gunCamera'
            group.rotation.y = Math.PI
            resolve(group)
          }

          break
        case 'warningLight':
          if (this.initModels.warningLight !== undefined) {
            const object = this.initModels.warningLight.clone()
            loadWarningLight(object)
          } else {
            const loader = new FBXLoader()
            loader.load('selfModels/other/warningLight/warningLight.FBX', object => {
              loadWarningLight(object)
            })
          }

          function loadWarningLight(object) {
            object.name = 'testWarningLight'
            object.scale.setScalar(0.05)
            // object[0]是红色透明外壳, 1是第一层不透明物资, 2是第二层不透明物资底部
            // 3是第二层不透明物资上部, 4是第二层不透明物资中部, 5是黑色底座, 6是白色开关
            object.children[0].material.opacity = 0.5

            object.children[5].material.color.set(0xbababa)
            object.children[5].material.transparent = true
            object.children[5].material.opacity = 0.7

            object.children[3].parent.remove(object.children[3])
            object.children[2].parent.remove(object.children[2])
            object.children[4].parent.remove(object.children[4])

            object.children[1].material.color.set(0xffffff)
            object.children[1].material.transparent = true
            object.children[1].material.opacity = 0.6

            const group = new THREE.Group()
            // group.add(object);
            const light = new THREE.PointLight(0xff0000, 2, 60)
            light.add(object)
            group.add(light)
            group.position.y = 7
            scene.add(group)

            group.name = 'warningLight'
            resolve(group)
          }

          break
        case 'radar':
          if (this.initModels.radar !== undefined) {
            const object = this.initModels.radar.clone()
            loadRadar(object)
            console.log('if执行')
          } else {
            const loader = new FBXLoader()
            loader.load('selfModels/other/radar/newRadar.fbx', object => {
              loadRadar(object)
            })
            console.log('else执行')
          }

          function loadRadar(object) {
          // // 孩子0是上面的雷达
          // // 孩子1是下面的杆子, 不算柳丁
          // // 孩子2是孩子0下面的开关,
          // // 孩子3是四颗柳丁
          // object.scale.setScalar(0.02)
          // object.rotation.y = 0
          // // 删除这段代码，为了使得group与原来object的中心保持一致，旋转不会出现偏差
          // // object.position.z = 1
          // // object.position.y = -2.658
          // object.name = 'testRadar'
          // const temGroup = new THREE.Group()
          // temGroup.add(object.children[2])
          // temGroup.add(object.children[0])
          // object.add(temGroup)
          //
          // const group = new THREE.Group()
          // group.add(object)
          // group.name = 'radar'
          // group.rotation.y = 0
          // scene.add(group)
          // console.log('group+++++++++++++++', group, object)
          // resolve(group)
            object.scale.setScalar(0.01)
            object.rotation.y = 0
            object.name = 'testRadar'
            const group = new THREE.Group()
            group.add(object)
            group.name = 'radar'
            scene.add(group)
            resolve(group)
          }

          console.log('break')
          break
        case 'sensor' :
          if (this.initModels.sensor !== undefined) {
            const object = this.initModels.sensor.clone()
            loadSensor(object)
          } else {
            const loader = new FBXLoader()
            loader.load('selfModels/other/radar/sensor.fbx', object => {
              loadSensor(object)
            })
          }

          function loadSensor(object) {
            object.scale.setScalar(0.01)
            object.rotation.y = 0
            object.name = 'testSenor'
            const group = new THREE.Group()
            group.add(object)
            group.name = 'sensor'
            scene.add(group)
            resolve(group)
          }
          break
      }
    })
  }

  /**
   * 移动模型
   * @param type 设备类型
   * @param moveDate 移动数据{deviceHigh, deviceAngle, deviceRotationAngle, x, y, z}
   * @param model 当前模型
   */
  moveModel1(type, moveDate, model) {
    function heightAngle() {
      model.position.y = moveDate.deviceHigh
      // model.rotation.y = MathUtils.degToRad(moveDate.deviceAngle);
      model.rotation.y = -MathUtils.MathUtils.degToRad(moveDate.deviceAngle)
    }

    switch (type) {
      case 'ballHeadCamera':
        heightAngle()
        const selfCenter = model.children[0]
        model.position.set(moveDate.monitorMapX, 7, moveDate.monitorMapZ)
        selfCenter.children[selfCenter.children.length - 1].rotation.y = -MathUtils.MathUtils.degToRad(moveDate.deviceRotationAngle)
        break
      case 'gunCamera':
        heightAngle()
        model.position.set(moveDate.monitorMapX, 7, moveDate.monitorMapZ)
        model.children[0].children[1].rotation.y = -MathUtils.MathUtils.degToRad(moveDate.deviceRotationAngle)
        break
      case 'radar':
        heightAngle()
        const selfRadar = model.children[0]
        model.position.set(moveDate.monitorMapX, 7, moveDate.monitorMapZ)
        selfRadar.children[selfRadar.children.length - 1].rotation.y = -MathUtils.MathUtils.degToRad(moveDate.deviceRotationAngle)
        break
      default:
        console.log('err')
    }
  }

  deleteModel1(model) {
    console.log(model, '删除模型--------------------------------->')
    // model.traverse(obj => {
    //   console.log(obj, "shanchu")
    //   if (obj.type === 'Mesh') {
    //     let object = [1, 2, 3];
    //     object = null;
    //     obj.geometry.dispose();
    //     if (obj.material instanceof Array) {
    //       obj.material.forEach(item => {
    //         item.dispose();
    //       })
    //     } else obj.material.dispose();
    //   }
    // });
    let obj = model
    while (obj.children != null) {
      obj.children.forEach(child => {
        if (child.type === 'Mesh') {
          child.geometry.dispose()
          if (child.material instanceof Array) {
            child.material.forEach(item => {
              item.dispose()
            })
          } else obj.material.dispose()
        }
      })
      obj = obj.children
    }
    console.log('执行了删除')
    if (model.parent) {
      model.parent.remove(model)
    }
    // console.log(model.parent, model.rendering,"查看是否删除")
  }

  addModelExtraInf1(model, info) {
    for (const key in info) {
      model[key] = info[key]
    }
  }
}

/**
 * 建立一个简易的模型，用于加载大模型文件前的临时展示
 * @param params
 */
function loadSimapleModel(handeler) {
  const that = this
  const loader = new FBXLoader()
  loader.load('/models/xingqing1.fbx', obj => {
    if (!that.scene.getObjectByName('mainModel')) {
      handeler.$store.state.models.ifShowLoad = true// 使楼层加载状态处于选择状态
      that.scene.add(obj)
      obj.name = 'tempModel'
      const mapConfig = JSON.parse(window.localStorage.getItem('infoMsg'))// 获取保存在localStorage中的地图配置参数信息
      obj.rotation.set(mapConfig.rotationX, mapConfig.rotationY, mapConfig.rotationZ)
      obj.position.set(mapConfig.positionX, mapConfig.positionY, mapConfig.positionZ)
      obj.scale.setScalar(mapConfig.scaling)
      obj.traverse(child => {
        if (child.isMesh) {
          const material = child.material
          // material.color = new THREE.Color(0x518bf6)
          material.opacity = 0.7
          material.transparent = true
          // material.depthWrite = false
        }
      })
    }
  })
}

/**
 * 专用于首页的加载模型函数，用于处理楼层选择器是否加载
 * @param params
 */
function initPlaneByHandeler(params, handeler) {
  const that = this
  const loader = new FBXLoader()
  loader.load(params.modelUrl, object => {
    if (that.scene.getObjectByName('tempModel')) {
      let obj = that.scene.getObjectByName('tempModel')
      obj.visible = false
      while (obj.children != null) {
        obj.children.forEach(child => {
          if (child.type === 'Mesh') {
            child.geometry.dispose()
            if (child.material instanceof Array) {
              child.material.forEach(item => {
                item.dispose()
              })
            } else obj.material.dispose()
          }
        })
        obj = obj.children
      }
      if (obj.parent) {
        obj.parent.remove(obj)
      }
    }
    handeler.$store.state.models.ifShowLoad = false// 使楼层加载状态处于正常状态
    that.scene.add(object)
    object.name = 'mainModel'
    object.rotation.set(params.rotationX, params.rotationY, params.rotationZ)
    object.position.set(params.positionX, params.positionY, params.positionZ)
    object.scale.setScalar(params.scaling)
    /**
     * 遍历模型，赋值材质透明度或者颜色
     */
    object.traverse(child => {
      if (child.isMesh) {
        const material = child.material
        material.opacity = 0.7
        material.transparent = true
      }
    })
  })
}

// 初始化场景模型, 需要六个参数初始化
function initPlane(params) {
  console.log(params, '初始化参数')
  let loader
  const that = this
  if (params.modelUrl.endsWith('glb') || params.modelUrl.endsWith('gltf')) {
    loader = new GLTFLoader()
    console.log('glb')
  } else if (params.modelUrl.endsWith('fbx') || params.modelUrl.endsWith('FBX')) {
    loader = new FBXLoader()
    console.log('fbx')
  } else {
    params.modelUrl = 'selfModels/kaifeng/version1/gucang.glb'
    loader = new GLTFLoader()
    console.log('glb2')
  }
  loader.load(params.modelUrl, object => {
    if (that.scene.getObjectByName('tempModel')) {
      let obj = that.scene.getObjectByName('tempModel')
      obj.visible = false
      while (obj.children != null) {
        obj.children.forEach(child => {
          if (child.type === 'Mesh') {
            child.geometry.dispose()
            if (child.material instanceof Array) {
              child.material.forEach(item => {
                item.dispose()
              })
            } else obj.material.dispose()
          }
        })
        obj = obj.children
      }
      if (obj.parent) {
        obj.parent.remove(obj)
      }
    }
    console.log(object)
    if (params.modelUrl.endsWith('glb') || params.modelUrl.endsWith('gltf')) {
      object = object.scene
    }
    that.scene.add(object)
    object.name = 'mainModel'
    // 初始化地图
    // let newParams = {}
    // newParams.positionX = 0
    // newParams.positionY = 7
    // newParams.positionZ = 0
    // newParams.rotationX = 0
    // newParams.rotationY = 0.78
    // newParams.rotationZ = 0
    // newParams.scaling = 0.1
    object.rotation.set(params.rotationX, params.rotationY, params.rotationZ)
    object.position.set(params.positionX, params.positionY, params.positionZ)
    object.scale.setScalar(params.scaling)
    // let newParams = {}
    // newParams.scaling = 0.075
    // newParams.rotationX = 0
    // newParams.rotationY = -0.77
    // newParams.rotationZ = 0
    // newParams.positionX = 0
    // newParams.positionY = -5
    // newParams.positionZ = -6
    // object.rotation.set(newParams.rotationX, newParams.rotationY, newParams.rotationZ)
    // object.position.set(newParams.positionX, newParams.positionY, newParams.positionZ)
    // object.scale.setScalar(newParams.scaling)
    /**
     * 遍历模型，赋值材质透明度或者颜色
     */
    object.traverse(child => {
      if (child.isMesh) {
        const material = child.material
        // material.color = new THREE.Color(0x518bf6)
        material.opacity = 0.7
        material.transparent = true
        // material.depthWrite = false
      }
    })
  })
}

/**
 * async 与 await写的加载地图函数
 */
function initPlaneAsync(params) {
  return new Promise(resolve => {
    console.log(params, '初始化参数')
    let loader
    const that = this
    if (params.modelUrl.endsWith('glb') || params.modelUrl.endsWith('gltf')) {
      loader = new GLTFLoader()
      console.log('glb')
    } else if (params.modelUrl.endsWith('fbx') || params.modelUrl.endsWith('FBX')) {
      loader = new FBXLoader()
      console.log('fbx')
    } else {
      params.modelUrl = 'selfModels/kaifeng/version1/gucang.glb'
      loader = new GLTFLoader()
      console.log('glb2')
    }
    loader.load(params.modelUrl, object => {
      console.log(object)
      if (params.modelUrl.endsWith('glb') || params.modelUrl.endsWith('gltf')) {
        object = object.scene
      }
      that.scene.add(object)
      object.name = 'mainModel'
      object.rotation.set(params.rotationX, params.rotationY, params.rotationZ)
      object.position.set(params.positionX, params.positionY, params.positionZ)
      object.scale.setScalar(params.scaling)
      /**
         * 遍历模型，赋值材质透明度或者颜色
         */
      object.traverse(child => {
        if (child.isMesh) {
          const material = child.material
          // material.color = new THREE.Color(0x518bf6)
          material.opacity = 0.7
          material.transparent = true
          // material.depthWrite = false
        }
      })
      resolve()
    })
  })
}

export default ShareModels
