import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {DoubleSide} from 'three'
import store from 'vuex'

import flvjs from 'flv.js'
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";

class SelfModels {
  // todo: 用assign赋值
  // todo: 合并轨迹线和防区功能
  constructor(container, shareModels) {
    this.container = container
    this.scene = shareModels.scene
    this.initModels = shareModels.initModels
    this.loadModel = shareModels.loadModel
    this.moveModel = shareModels.moveModel
    this.deleteModel = shareModels.deleteModel
    this.addModelExtraInf = shareModels.addModelExtraInf
    this.camera = this.initCamera(container, shareModels)
    this.renderer = this.initRenderer(container)
    // this.CSS2DRender = this.initCSS2DRenderer(container)
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    // orbitControls.target = this.scene.position;
    this.orbitControls.maxAzimuthAngle = Math.PI / 2
    // orbitControls.minAzimuthAngle = 0;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.01
    // orbitControls.update();
    // 获取点击物体第一步
    this.addEventListenerMouseMove(container)
    // 获取点击物体第二步
    // this.getClickModel();
    // 重置渲染尺寸
    this.addEventListenerResize(container)

    this.defencePointNode = []
    this.temporaryPointNode = null
    this.stopListen = false
    this.clickEvent = null
    this.drawDefenceArea = this.drawDefenceArea
    this.initPolygonDefence = this.initPolygonDefence
    this.initcircleDefence = this.initcircleDefence
    this.denfenceType = null
    this.defenceHeight = null
    this.radius = 0
  }

  initCamera(container) {
    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight,
      0.01, 10000)
    camera.position.set(50, 50, 50)
    camera.name = '全局摄像机'
    this.scene.add(camera)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    // 灯跟着相机走, 效果不错
    // camera.add(pointLight);
    return camera
  }

  initRenderer(container) {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      // 设置背景透明
      alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    return renderer
  }

  // 初始化2D渲染器
  initCSS2DRenderer(container) {
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(container.innerWidth, container.innerHeight)
    labelRenderer.domElement.style.position = 'absolute'
    // 相对鼠标的相对偏移
    // labelRenderer.domElement.style.top = '-16px'
    // labelRenderer.domElement.style.left = '0px'
    // //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
    labelRenderer.domElement.style.pointerEvents = 'none'
    container.appendChild(labelRenderer.domElement)
    return labelRenderer
  }

  addEventListenerMouseMove(container) {
    // 注册鼠标移动事件, 为鼠标点击获取对象做准备, 并且需要两个变量, mouse, caycaster;
    container.addEventListener('mousemove', (event) => {
      this.mouse.x = ((event.clientX - container.getBoundingClientRect().left) / container
        .clientWidth) * 2 - 1
      // this.mouse.y = -((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;
      this.mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container
        .clientHeight) * 2 + 1
    }, false)
  }

  // 关键函数，通过点击模型获取对应model
  getClickModel() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objects = this.raycaster.intersectObjects(this.scene.children, true)
    if (objects.length === 0) return
    console.log(objects, 888888888)
    // 点击到的对象, 但这个对象是设备的小块组成部分, 需要找到根对象
    let object = objects[0].object
    // 点击平面直接返回
    // if (object.name === 'plane') return object;
    // 1.先判断是否为杆, 2.再判断是否为其他物体, 因为杆是其他物体的父物体
    // if (object.name === 'pole') {
    //   return object;
    // }
    while (object != null && object.parent.parent != null) {
      // && !(object.parent.name === 'pole')) {
      object = object.parent
    }
    return object
  }

  // 此处硬编码，单独设计函数，实现点击建筑获取整栋建筑模型
  getClickBuilding() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objects = this.raycaster.intersectObjects(this.scene.children, true)
    if (objects.length === 0) return
    // 判断是否是楼层
    let objectFlag = objects[0].object.parent
    if (objectFlag.name !== '图层_02') return
    let obj = objects[0]
    let objuuID = obj.uuid
    let obj1 = obj.object.parent
    let obj2 = obj1.parent
    let obj2uuID = obj2.uuid
    let obj3 = obj2.parent
    let obj3uuID = obj3.uuid
    console.log('obj2, obj3', obj2uuID, obj3uuID)
    // // 除点击模型外，其余全隐藏
    // let object = objects[0]
    // // let objectID = object.object.ID
    // let tempObj = object.object.parent.parent
    // console.log(tempObj)
    this.scene.traverse((obj) => {
      if (obj.uuid != objuuID && obj.uuid != obj2uuID && obj.uuid != obj3uuID) {
        console.log(obj.uuid)
      }
    });
  }

  getClickInfo() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objects = this.raycaster.intersectObjects(this.scene.children, true)
    return objects[0]
  }

  addEventListenerResize(container) {
    container.addEventListener('resize', (event) => {
      this.camera.aspect = container.innerWidth / container.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(container.innerWidth, container.innerHeight)
    }, false)
  }

  /**
   * author：liminglin
   * @param {*} type 绘制防区的形状
   */
  drawDefenceArea(type, height) {
    // this.scene.traverse((obj)=>{
    //   if(obj.name === '防区') {
    //     this.scene.remove(obj);
    //     // obj.geometry.dispose()
    //   }
    // });
    const obj = this.scene.getObjectByName('防区')
    if (obj) {
      this.scene.remove(obj)
    }
    const node = []

    this.defenceHeight = height
    const length = this.defencePointNode.length
    if (type === 'circle') {
      // 通过shpae基类path的方法绘制轮廓（本质也是生成顶点）
      // let shape = new THREE.Shape();
      // let distance = this.temporaryPointNode.distanceTo(this.defencePointNode[0]);
      // shape.absarc(this.defencePointNode[0].x,this.defencePointNode[0].z,distance,0,2*Math.PI);//圆弧轮廓
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&');
      // console.log(shape.getPoints(15));//查看shape顶点数据
      // let geometry = new THREE.ShapeGeometry(shape, 25);
      // let material = new THREE.MeshBasicMaterial( { color: 0x00ee00, side: THREE.DoubleSide} );
      // let line = new THREE.Mesh( geometry, material);
      // line.name = '防区';
      // line.rotation.x = Math.PI /2;
      // line.position.y = 5;
      console.log(type)
      if (this.defencePointNode.length > 0 && this.defencePointNode.length <= 2 && this.temporaryPointNode != null) {
        console.log('1111111')
        console.log(this.temporaryPointNode)
        const distance = this.temporaryPointNode.distanceTo(this.defencePointNode[0])
        console.log('555555555555555555555555555555555555')
        console.log(distance)
        const geometry = new THREE.CircleGeometry(distance, 32)
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ee00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        })

        const circle = new THREE.Mesh(geometry, material)
        circle.position.set(this.defencePointNode[0].x, height, this.defencePointNode[0].z)
        // circle.position.set(0,10,0);
        circle.name = '防区'
        // circle.name = '已添加防区'
        circle.rotation.x = Math.PI / 2
        console.log(circle)
        this.scene.add(circle)
      }
    }

    if (type === 'polygon') {
      if (this.defencePointNode.length > 0) {
        for (let i = 0; i < length; i++) {
          node.push(new THREE.Vector2(this.defencePointNode[i].x, this.defencePointNode[i].z))
        }

        // node.push(new THREE.Vector2(this.temporaryPointNode.x, this.temporaryPointNode.z));
        const geometry = new THREE.ShapeGeometry(new THREE.Shape(node))

        const material = new THREE.MeshBasicMaterial({
          color: 0x00ee00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        })
        // this.mesh.bufferGeometry.dispose();
        // this.mesh.bufferGeometry = newBufferGemety
        const line = new THREE.Mesh(geometry, material)
        line.name = '防区'
        line.rotation.x = Math.PI / 2
        // line.position.y += 0.3
        line.position.y = height
        this.scene.add(line)
      }
    }
  }

  drawDefenceAreaLast(floor, deviceSn) {
    const node = []

    const length = this.defencePointNode.length
    // for(let i = 0; i < length; i++) {
    //   node.push(this.defencePointNode[i].x, this.defencePointNode[i].y, this.defencePointNode[i].z);
    // }
    // node.push(this.defencePointNode[0].x, this.defencePointNode[0].y, this.defencePointNode[0].z);
    // // node.push(this.temporaryPointNode.x, this.temporaryPointNode.y, this.temporaryPointNode.z);

    // console.log(node);

    if (this.defencePointNode.length > 1) {
      for (let i = 0; i < length; i++) {
        node.push(new THREE.Vector2(this.defencePointNode[i].x, this.defencePointNode[i].z))
      }

      // node.push(new THREE.Vector2(this.temporaryPointNode.x, this.temporaryPointNode.z));
      const geometry = new THREE.ShapeGeometry(new THREE.Shape(node))

      const material = new THREE.MeshBasicMaterial({
        color: 0x00ee00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })
      // this.mesh.bufferGeometry.dispose();
      // this.mesh.bufferGeometry = newBufferGemety

      const line = new THREE.Mesh(geometry, material)
      line.name = '防区最终'
      line.rotation.x = Math.PI / 2
      if (floor === 24) {
        line.position.y = -11
      } else if (floor === 25) {
        line.position.y = -2
      } else if (floor === 26) {
        line.position.y = 4
      }
      // line.position.y = 4;
      line.floor = floor
      line.deviceSn = deviceSn

      console.log('***************************************')
      line.denfenceType = 'polygon'
      this.defenceType = 'polygon'
      this.scene.add(line)
      return line
    }
  }

  // 节流与防抖
  debounce(fn, delay) {
    let timer = null // 借助闭包
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(fn, delay) // 简化写法
    }
  }

  drawDefenceAreaLine() {
    // this.scene.traverse((obj)=>{
    //   if(obj.name === '防区线') {
    //     this.scene.remove(obj);
    //   }
    // })

    const obj = this.scene.getObjectByName('防区线')
    if (obj) {
      this.scene.remove(obj)
    }
    if (this.defencePointNode.length > 0) {
      const [...node] = this.defencePointNode
      node.push(this.temporaryPointNode)
      node.push(this.defencePointNode[0])

      const geometry = new THREE.BufferGeometry().setFromPoints(node)
      const material = new THREE.LineBasicMaterial({vertexColors: true, color: 0x0000ff})
      // var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );

      // geometry.vertices.push(this.defencePointNode[0]);
      // geometry.vertices.push(this.temporaryPointNode);
      // geometry.colors.push( color1, color2 );

      const line = new THREE.Line(geometry, material)
      line.name = '防区线'
      const LINE = line.clone()
      this.scene.add(LINE)
      node.pop()
      node.pop()
    }
  }

  // 按下tab键之后最终的防区线
  drawDefenceAreaLineLast(floor, deviceSn) {
    const [...node] = this.defencePointNode
    if (this.defencePointNode.length > 0) {
      // node.push(this.temporaryPointNode);
      // node.push(this.defencePointNode[0]);

      const geometry = new THREE.BufferGeometry().setFromPoints(node)

      const material = new THREE.LineBasicMaterial({vertexColors: true, color: 0x0000ff})
      const line = new THREE.Line(geometry, material)
      line.name = '防区线最终'
      this.scene.add(line)
    }
  }

  // enter键确定圆形防区
  drawDefenceCircleAreaLast(floor, deviceSn) {
    if (this.defencePointNode.length > 1) {
      const distance = this.defencePointNode[1].distanceTo(this.defencePointNode[0])
      console.log(distance)
      const geometry = new THREE.CircleGeometry(distance, 32)
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ee00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })

      const circle = new THREE.Mesh(geometry, material)
      circle.position.set(this.defencePointNode[0].x, this.defenceHeight, this.defencePointNode[0].z)
      // circle.position.set(0,10,0);
      // circle.name = '最终圆形防区'
      circle.name = '已添加防区'
      circle.rotation.x = Math.PI / 2
      circle.floor = floor
      circle.deviceSn = deviceSn
      circle.defenceType = 'circle'
      this.defenceType = 'circle'
      this.radius = distance
      this.scene.add(circle)
      console.log('circle')
      console.log('circle')
      console.log('circle')
      console.log('circle')
      console.log('circle')
      console.log(circle)
      const obj2 = this.scene.getObjectByName('防区线')
      this.scene.remove(obj2)
      const obj1 = this.scene.getObjectByName('防区')
      this.scene.remove(obj1)
      return circle
    }
  }

  // 初始化圆形防区
  initcircleDefence(defencePointNode, floor, deviceSn) {
    const obj = this.scene.getObjectByName('mainModel')
    if (defencePointNode.length > 1) {
      const distance = defencePointNode[1].distanceTo(defencePointNode[0])
      console.log(defencePointNode[0])
      console.log(defencePointNode[1])
      console.log('半径是：')
      console.log(distance)
      const geometry = new THREE.CircleGeometry(distance, 32)
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ee00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })

      const circle = new THREE.Mesh(geometry, material)
      circle.position.set(defencePointNode[0].x, defencePointNode[0].y, defencePointNode[0].z)

      // if (floor === 24) {
      //   circle.position.y = -11
      //   // obj.children[1].add(circle);
      // } else if (floor === 25) {
      //   circle.position.y = -2
      //   // obj.children[2].add(circle);
      // } else if (floor === 26) {
      //   circle.position.y = 4
      //   // obj.children[3].add(circle);
      // }

      // circle.position.set(0,10,0);
      circle.name = '已添加防区'
      circle.rotation.x = Math.PI / 2
      circle.deviceSn = deviceSn
      circle.floor = floor
      console.log(circle)
      this.scene.add(circle)
    }
  }

  // 根据点画防区
  initPolygonDefence(defencePointNode, floor, deviceSn) {
    const obj = this.scene.getObjectByName('mainModel')
    console.log('绘制多边形防区')

    console.log(defencePointNode)
    const node = []
    for (let i = 0; i < defencePointNode.length; i++) {
      node.push(new THREE.Vector2(defencePointNode[i].x, defencePointNode[i].z))
    }
    const areaGeometry = new THREE.ShapeGeometry(new THREE.Shape(node))

    const areaMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ACD32,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    // this.mesh.bufferGeometry.dispose();
    // this.mesh.bufferGeometry = newBufferGemety
    const area = new THREE.Mesh(areaGeometry, areaMaterial)
    area.name = '已添加防区'
    area.rotation.x = Math.PI / 2
    // area.position.y = defencePointNode[0].y - 1
    area.position.y = defencePointNode[0].y
    // line.position.y += 0.3
    // if (floor === 24) {
    //   area.position.y = -11
    //   // obj.children[1].add(area);
    // } else if (floor === 25) {
    //   area.position.y = -2
    //   // obj.children[2].add(area);
    // } else if (floor === 26) {
    //   area.position.y = 4
    //   // obj.children[3].add(area);
    // }
    area.floor = floor
    area.deviceSn = deviceSn
    console.log('绘制完毕')
    // area.position.y = height;
    this.scene.add(area)
  }

  listenBySL(element, type, handler, capture = false) {
    if (element.addEventListener) {
      // W3C内核
      element.addEventListener(type, handler, capture)
    } else {
      // IE内核
      element.attachEvent('on' + type, handler, capture)
    }

    return {
      'remove': function () {
        if (element.removeEventListener) {
          // W3C内核
          element.removeEventListener(type, handler, capture)
        } else {
          // IE内核
          element.detachEvent('on' + type, handler, capture)
        }
      }
    }
  }

  // 画防区
  drawDefenceAreaEvent(getBoundingClientRect) {
    // this.stopListen = false;
    // 重新进入需要再次清空数组
    this.defencePointNode = []
    this.temporaryPointNode = null

    console.log('画防区')
    const raycaster = new THREE.Raycaster()
    const rayVector = new THREE.Vector3()

    this.clickEvent = this.listenBySL(window, 'click', (event) => {
      console.log('点击' + event.button)
      if (event.button === 0) {
        const mouse = new THREE.Vector2()
        mouse.x = ((event.clientX - getBoundingClientRect.left) / this.renderer.domElement.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - getBoundingClientRect.top) / this.renderer.domElement.clientHeight) * 2 + 1
        console.log('鼠标点击位置%%%%%%%%%%:' + mouse.x + ':' + mouse.y)
        rayVector.set(mouse.x, mouse.y, 0.5)
        raycaster.setFromCamera(rayVector, this.camera)

        // 射线和模型求交，选中一系列直线
        const intersects = raycaster.intersectObjects(this.scene.children, true)

        for (let i = 0; i < intersects.length; i++) {
          console.log('点击的模型位置：')
          console.log(intersects[0].point)
          if (intersects[i].object.type === 'Mesh') {
            const pointNode = new THREE.Vector3()
            // console.log(intersects[0].point);
            pointNode.copy(intersects[i].point)
            pointNode.y = this.defenceHeight
            // console.log(pointNode);
            this.defencePointNode.push(pointNode)
            break
          }
        }
      }
      console.log('+++this.defencePointNode', this.defencePointNode)
    })

    this.mousemoveEvent = this.listenBySL(window, 'mousemove', (event) => {
      // console.log('yidong');

      const mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - getBoundingClientRect.left) / this.renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - getBoundingClientRect.top) / this.renderer.domElement.clientHeight) * 2 + 1
      // console.log('鼠标点击位置:' + mouse.x + ':' + mouse.y);
      rayVector.set(mouse.x, mouse.y, 0.5)
      raycaster.setFromCamera(rayVector, this.camera)

      // 射线和模型求交，选中一系列直线
      const intersects = raycaster.intersectObjects(this.scene.children, true)

      if (intersects.length > 0) {
        // console.log(intersects[0].point);
        this.temporaryPointNode = new THREE.Vector3()
        // console.log(intersects[0].point);
        this.temporaryPointNode.copy(intersects[0].point)
        this.temporaryPointNode.y = this.defenceHeight
        // this.temporaryPointNode = temporaryPointNode;
        if (this.defencePointNode.length > 0) {
          // this.debounce(this.drawDefenceAreaLine(), 1000);
          // this.debounce(this.drawDefenceArea(), 1000);
        }
        // console.log(pointNode);
      }
    })
  }

  /**
   * 创建视频小卡片
   * @param {*} position 位置
   */
  createVideoCard(position, videoUrl) {
    const videoCardGroup = new THREE.Group()
    videoCardGroup.name = 'videoCardGroup'
    console.log('创建视频卡片内部函数')
    // let video = document.createElement("VIDEO");
    // let video = document.getElementById("trailer0");

    const video = document.createElement('VIDEO')
    this.flvPlayerInit(
      video,
      videoUrl
    )

    video.setAttribute('width', '600')
    video.setAttribute('height', '300')
    video.muted = true

    // let img = document.createElement("img");
    // img.src = '/video/角标.png';

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat

    const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
    // const element = document.getElementById('test');
    const geometry = new THREE.PlaneGeometry(4, 2)
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.x = position.x + 3.5
    mesh.position.y = position.y + 2
    mesh.position.z = position.z

    videoCardGroup.add(mesh)
    // this.scen.add( mesh );

    this.video = video

    const ImageLoader = new THREE.ImageLoader()
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load('/texture/border.png', (img) => {
        // image对象作为参数，创建一个纹理对象Texture
        const texture2 = new THREE.Texture(img)
        // 下次使用纹理时触发更新
        texture2.needsUpdate = true
        const material2 = new THREE.MeshPhongMaterial({
          shininess: 30,
          map: texture2, // 设置纹理贴图
          transparent: true,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 4,
          polygonOffsetUtils: -4
        })

        console.log('加载border')
        const geometry2 = new THREE.PlaneGeometry(4.5, 2.5)
        const mesh2 = new THREE.Mesh(geometry2, material2) // 网格模型对象Mesh
        mesh2.position.copy(mesh.position)
        videoCardGroup.add(mesh2)
        // this.scen.add(mesh2); //网格模型添加到场景中
      },
      null, error => {
        console.error(error)
      })

    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load('/texture/borderline.png', (img) => {
        // image对象作为参数，创建一个纹理对象Texture
        const texture2 = new THREE.Texture(img)
        // 下次使用纹理时触发更新
        texture2.needsUpdate = true
        const material3 = new THREE.MeshPhongMaterial({
          shininess: 30,
          map: texture2, // 设置纹理贴图
          transparent: true,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 4,
          polygonOffsetUtils: -4
        })

        const geometry3 = new THREE.PlaneGeometry(2, 2)
        const mesh3 = new THREE.Mesh(geometry3, material3) // 网格模型对象Mesh
        mesh3.position.copy(position)
        videoCardGroup.add(mesh3)
        this.scene.add(videoCardGroup) // 网格模型添加到场景中

        console.log(mesh3)
        videoCardGroup.visible = true
        console.log('视频卡片:' + videoCardGroup)
        return videoCardGroup
      },
      null, error => {
        console.error(error)
        return error
      })
  }

  /**
   * 创建视频卡片
   * @param {*} position 位置
   */
  createVideoCard1(position, floor, videoUrl) {
    console.log('创建视频卡片1')
    // console.log('this.camera.position.x',this.camera.position.x)
    localStorage.setItem('cameraPositionx', JSON.stringify(this.camera.position.x))
    localStorage.setItem('cameraPositiony', JSON.stringify(this.camera.position.y))
    localStorage.setItem('cameraPositionz', JSON.stringify(this.camera.position.z))
    localStorage.setItem('cameraRotationx', JSON.stringify(this.camera.rotation.x))
    localStorage.setItem('cameraRotationy', JSON.stringify(this.camera.rotation.y))
    localStorage.setItem('cameraRotationz', JSON.stringify(this.camera.rotation.z))

    const videoCardGroup = new THREE.Group()
    const video = document.createElement('VIDEO')
    this.flvPlayerInit(
      video,
      videoUrl
    )
    const clicknumber = 1
    video.setAttribute('width', '6000')
    video.setAttribute('height', '3000')
    video.controls = true

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat
    const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
    var geometry = new THREE.PlaneGeometry(50, 30)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 0
    mesh.position.y = 25
    mesh.position.z = 0
    videoCardGroup.add(mesh)
    this.video = video
    const ImageLoader = new THREE.ImageLoader()
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load('/texture/border.png', (img) => {
        // image对象作为参数，创建一个纹理对象Texture
        const texture2 = new THREE.Texture(img)
        // 下次使用纹理时触发更新
        texture2.needsUpdate = true
        const material2 = new THREE.MeshPhongMaterial({
          shininess: 30,
          map: texture2, // 设置纹理贴图
          transparent: true,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 40,
          polygonOffsetUtils: -4
        })
        console.log('加载border')
        var geometry2 = new THREE.PlaneGeometry(56, 38)
        const mesh2 = new THREE.Mesh(geometry2, material2) // 网格模型对象Mesh
        mesh2.position.copy(mesh.position)

        videoCardGroup.add(mesh2)
      },
      null, error => {
        console.error(error)
      })
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load('/texture/borderline.png', (img) => {
        // image对象作为参数，创建一个纹理对象Texture
        const texture2 = new THREE.Texture(img)
        // 下次使用纹理时触发更新
        texture2.needsUpdate = true
        const material3 = new THREE.MeshPhongMaterial({
          shininess: 30,
          map: texture2, // 设置纹理贴图
          transparent: true,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 4,
          polygonOffsetUtils: -4
        })
        const geometry3 = new THREE.PlaneGeometry(2, 20)
        const mesh3 = new THREE.Mesh(geometry3, material3) // 网格模型对象Mesh
        mesh3.position.copy(position)
        videoCardGroup.add(mesh3)
        videoCardGroup.floor = floor
        videoCardGroup.name = 'videoCard'
        this.scene.add(videoCardGroup) // 网格模型添加到场景中
        videoCardGroup.visible = true
        videoCardGroup.cameraPositionx = parseFloat(localStorage.getItem('cameraPositionx'))
        videoCardGroup.cameraPositiony = parseFloat(localStorage.getItem('cameraPositiony'))
        videoCardGroup.cameraPositionz = parseFloat(localStorage.getItem('cameraPositionz'))
        videoCardGroup.cameraRotationx = parseFloat(localStorage.getItem('cameraRotationx'))
        videoCardGroup.cameraRotationy = parseFloat(localStorage.getItem('cameraRotationy'))
        videoCardGroup.cameraRotationz = parseFloat(localStorage.getItem('cameraRotationz'))
        console.log('cameraPositionx:', videoCardGroup.cameraPositionx)

        this.camera.position.x = 0
        this.camera.position.y = 25
        this.camera.position.z = 92.52626380512427

        this.camera.rotation.x = -0.01000000000000007
        this.camera.rotation.y = 0
        this.camera.rotation.z = 0
      },
      null, error => {
        console.error(error)
        return error
      })
    return videoCardGroup
  }

  /**
   *
   创建雷达人数卡片
   position:位置
   Sn:radar的序列号
   number:人数
   flag:0表示初始化,显示内容为雷达离线  1表示更新,显示内容为区域人数：number
   needupdate: 0表示当前显示楼层与需要更新的雷达的楼层不符，虽然人数有变化，但不显示
   storePosition: 储存store中的卡片位置信息
   */

  createRadarNumberCard(position, Sn, number, floor, flag, needupdate, storePosition) {
    console.log(position, Sn, number, floor, flag, needupdate)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 100
    const ctx1 = canvas.getContext('2d')
    // 制作矩形
    ctx1.clearRect(0, 0, 300, 100)
    ctx1.font = '50px 宋体'
    ctx1.lineWidth = 30
    ctx1.textAlign = 'center'
    ctx1.textBaseline = 'middle'
    if (flag === 0) {
      ctx1.fillStyle = 'rgba(4, 164, 172, 0.9)'
      ctx1.fillRect(0, 0, 300, 100)
      ctx1.fillStyle = '#ff0000'
      ctx1.fillText('\0' + '雷达离线' + '\0', canvas.width / 2, canvas.height / 2)
    } else {
      ctx1.fillStyle = 'rgba(4, 164, 172, 1)'
      ctx1.fillRect(0, 0, 300, 100)
      ctx1.fillStyle = '#00ff00'
      ctx1.fillText('\0' + '区域人数:' + number + '\0', canvas.width / 2, canvas.height / 2)
    }
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    const material = new THREE.SpriteMaterial({map: texture})
    const text = new THREE.Sprite(material)
    let positionX = 1
    let positionY = 0.5
    if (storePosition.positionX && storePosition.positionY) {
      positionX = storePosition.positionX
      positionY = storePosition.positionY
    }
    text.scale.set(positionX, positionY, 4)
    // text.position.x = position.x - 0.5
    // text.position.y = position.y + 0.3
    text.position.x = position.x
    text.position.y = position.y + 0.15
    text.position.z = position.z
    text.name = 'radarCard'
    text.floor = floor
    text.deviceSn = Sn
    if (needupdate === 0) {
      text.visible = false
    } else {
      text.visible = true
    }
    this.scene.add(text)
  }

  // createRadarNumberCard(position, Sn, number, floor, flag, needupdate, storePosition) {
  //   console.log(position, Sn, number, floor, flag, needupdate)
  //   const canvas = document.createElement('canvas')
  //   canvas.width = 300
  //   canvas.height = 200
  //   const ctx1 = canvas.getContext('2d')
  //   // 制作矩形
  //   ctx1.clearRect(0, 0, 300, 200)
  //   ctx1.font = '50px 宋体'
  //   ctx1.lineWidth = 30
  //   ctx1.textAlign = 'center'
  //   ctx1.textBaseline = 'middle'
  //   if (flag === 0) {
  //     ctx1.fillStyle = 'rgba(4, 164, 172, 0.9)'
  //     ctx1.fillRect(0, 0, 300, 200)
  //     ctx1.fillStyle = '#ff0000'
  //     ctx1.fillText('\0' + '雷达离线' + '\0', canvas.width / 2, canvas.height / 2)
  //   } else {
  //     ctx1.fillStyle = 'rgba(4, 164, 172, 1)'
  //     ctx1.fillRect(0, 0, 300, 200)
  //     ctx1.fillStyle = '#00ff00'
  //     ctx1.fillText('\0' + '区域人数:' + number + '\0', canvas.width / 4 * 2, canvas.height / 4)
  //     // ctx1.fillStyle = '#00ff00'
  //     // ctx1.fillText('\0' + '气体正常' + '\0', canvas.width / 4 * 2, canvas.height / 4 * 3)
  //     ctx1.fillStyle = '#f50722'
  //     ctx1.fillText('\0' + 'co2超标' + '\0', canvas.width / 4 * 2, canvas.height / 4 * 3)
  //   }
  //   const texture = new THREE.Texture(canvas)
  //   texture.needsUpdate = true
  //   const material = new THREE.SpriteMaterial({map: texture})
  //   const text = new THREE.Sprite(material)
  //   let positionX = 1
  //   let positionY = 0.5
  //   if (storePosition.positionX && storePosition.positionY) {
  //     positionX = storePosition.positionX
  //     positionY = storePosition.positionY
  //   }
  //   text.scale.set(positionX, positionY, 4)
  //   // text.position.x = position.x - 0.5
  //   // text.position.y = position.y + 0.3
  //   text.position.x = position.x
  //   text.position.y = position.y + 1
  //   text.position.z = position.z
  //   text.name = 'radarCard'
  //   text.floor = floor
  //   text.deviceSn = Sn
  //   if (needupdate === 0) {
  //     text.visible = false
  //   } else {
  //     text.visible = true
  //   }
  //   this.scene.add(text)
  //   console.log('++++this.scene', this.scene)
  // }

  /**
   * flv初始化
   * @param {*} videoElement
   * @param {*} url
   */
  flvPlayerInit(videoElement, url) {
    // const videoElement = document.getElementById(elementId);
    console.log('videoElement', videoElement)
    console.log(flvjs)
    const flvPlayer = flvjs.createPlayer({
      isLive: true,
      type: 'flv',
      url: url,
      hasAudio: false
    })
    flvPlayer.attachMediaElement(videoElement)
    flvPlayer.load()
    setTimeout(() => {
      flvPlayer.play()
    }, 3000)
    // flvPlayer.play();
  }

  render() {
    this.renderer.render(this.scene, this.camera)
    // 2D渲染
    // this.CSS2DRender.render(this.scene, this.camera)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    // console.log(this.stopListen);
    if (!this.stopListen) {
      // if(this.defencePointNode.length > 1) {
      //   this.initPolygonDefence(this.defencePointNode, 5)
      // }
      this.drawDefenceArea(this.denfenceType, this.defenceHeight)
      this.drawDefenceAreaLine()
    }
    // console.log(this.defencePointNode);
    this.render()
  }
}

export default SelfModels
