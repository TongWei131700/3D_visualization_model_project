<template>
  <div id="login" ref="star" class="login-page">
    <header class="login-title">
      <h2 class="zh-CN-title">系统登录</h2>
      <h4 class="en-title">System Login</h4>
    </header>
    <div class="login-border"/>
    <section
      :style="{backgroundImage:'url('+require('@/assets/images/user_face/login-default.png')+')'}"
      class="login-content"
    >
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            auto-complete="off"
            class="wid-300"
            placeholder="请输入用户名"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            auto-complete="off"
            class="wid-300"
            placeholder="请输入密码"
            show-password
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item
          class="login-captcha"
          prop="captcha"
        >
          <el-input
            v-model="loginForm.captcha"
            auto-complete="off"
            class="input-captcha"
            placeholder="请输入验证码"
            @keyup.enter.native="handleLogin"
          />
          <img
            :src="codeUrl"
            class="captcha-image"
            @click="getCode"
          >
        </el-form-item>
        <el-checkbox
          v-model="loginForm.rememberMe"
          class="wid-300 remember-me"
        >记住密码
        </el-checkbox>
        <el-button
          :loading="loading"
          class="margin-top-20 wid-300"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form>
    </section>
  </div>
</template>

<script>
import * as Three from 'three'
import * as Postprocessing from 'postprocessing'
import Cookies from 'js-cookie'
import {encrypt, decrypt} from '@/utils/jsencrypt'
import {getCodeImg} from '@/api/login'
import {loadRoutes} from "../../utils/routerUtil";
import {getRoute, getPerms} from "../../api/login";

export default {
  name: 'LoginIndex',
  data() {
    return {
      /* 与three后通道处理相关的数据 */
      scene: '',
      camera: '',
      cloudParticles: [],
      composer: '',
      ambient: '',
      renderer: '',
      star: '',
      loader: '',
      cloudgeo: '',
      cloudMaterial: '',
      bloomEffect: '',
      textureEffect: '',
      effectPass: '',
      /* 与登录相关的数据 */
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        rememberMe: false,
        uuid: ''
      },
      // 登录规则
      loginRules: {
        username: [
          {required: true, trigger: 'blur', message: '用户名不能为空'}
        ],
        password: [
          {required: true, trigger: 'blur', message: '密码不能为空'}
        ],
        captcha: [
          {required: true, trigger: 'blur', message: '验证码不能为空'}
        ]
      },
      /* 是否正在登录 */
      loading: false,

      codeUrl: '', // 验证码URL

      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  mounted() {
    // 初始化场景
    this.init()
  },
  methods: {
    /* 与场景有关的代码开始 */
    init() {
      this.star = this.$refs.star
      this.scene = new Three.Scene()
      this.camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
      this.camera.position.z = 1
      this.camera.rotation.x = 1.16
      this.camera.rotation.y = -0.12
      this.camera.rotation.z = 0.27
      this.ambient = new Three.AmbientLight(0x555555)
      this.scene.add(this.ambient)
      this.directionalLight()
      this.renderInit()
      this.load()
    },
    directionalLight() {
      const directionalLight = new Three.DirectionalLight(0xff8c19)
      directionalLight.position.set(0, 0, 0)
      this.scene.add(directionalLight)
      const orangeLight = new Three.PointLight(0xcc6600, 50, 450, 1.7)
      orangeLight.position.set(200, 300, 100)
      this.scene.add(orangeLight)
      const redLight = new Three.PointLight(0xd8547e, 50, 450, 1.7)
      redLight.position.set(100, 300, 100)
      this.scene.add(redLight)
      const blueLight = new Three.PointLight(0x3677ac, 50, 450, 1.7)
      blueLight.position.set(300, 300, 200)
      this.scene.add(blueLight)
    },
    renderInit() {
      this.renderer = new Three.WebGLRenderer()
      this.renderer.setSize(this.star.clientWidth, this.star.clientHeight)
      this.scene.fog = new Three.FogExp2(0x03544e, 0.001)
      this.renderer.setClearColor(this.scene.fog.color)
      this.star.appendChild(this.renderer.domElement)
    },
    load() {
      this.loader = new Three.TextureLoader()
      this.loader.load(require('@/assets/images/login/smoke.png'), (texture) => {
        this.cloudgeo = new Three.PlaneBufferGeometry(500, 500)
        this.cloudMaterial = new Three.MeshLambertMaterial({
          map: texture,
          transparent: true
        })
        for (let p = 0; p < 50; p++) {
          const cloud = new Three.Mesh(this.cloudgeo, this.cloudMaterial)
          cloud.position.set(
            Math.random() * 800 - 400,
            500,
            Math.random() * 500 - 500
          )
          cloud.rotation.x = 1.16
          cloud.rotation.y = -0.12
          cloud.rotation.z = Math.random() * 2 * Math.PI
          cloud.material.opacity = 0.55
          this.cloudParticles.push(cloud)
          this.scene.add(cloud)
        }
      })
      this.Postproc()
    },
    Postproc() {
      this.loader.load(require('@/assets/images/login/stars.jpg'), (texture) => {
        this.textureEffect = new Postprocessing.TextureEffect({
          blendFunction: Postprocessing.BlendFunction.COLOR_DODGE,
          texture: texture
        })
        this.textureEffect.blendMode.opacity.value = 0.2
        this.bloomEffect = new Postprocessing.BloomEffect({
          blendFunction: Postprocessing.BlendFunction.COLOR_DODGE,
          kernelSize: Postprocessing.KernelSize.SMALL,
          useLuminanceFilter: true,
          luminanceThreshold: 0.9,
          luminanceSmoothing: 0.4
        })
        this.bloomEffect.blendMode.opacity.value = 1.5

        this.effectPass = new Postprocessing.EffectPass(
          this.camera,
          this.bloomEffect,
          this.textureEffect
        )
        this.effectPass.renderToScreen = true

        this.composer = new Postprocessing.EffectComposer(this.renderer)
        this.composer.addPass(new Postprocessing.RenderPass(this.scene, this.camera))
        this.composer.addPass(this.effectPass)
        window.addEventListener('resize', this.onWindowResize, false)// 调整屏幕
        this.render()
      })
    },
    onWindowResize() {
      const element = document.getElementById('login')
      this.camera.aspect = element.clientWidth / element.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(element.clientWidth, element.clientHeight)
    },
    render() {
      this.cloudParticles.forEach((p) => {
        p.rotation.z -= 0.003
      })
      this.renderer.render(this.scene, this.camera)
      this.composer.render(0.1)
      requestAnimationFrame(this.render)
    },
    /* 与场景有关的代码结束 */
    /* 与登录有关的代码开始 */
    getCode() {
      getCodeImg()
        .then((res) => {
          this.codeUrl = `data:image/gif;base64,${res.img}`
          this.loginForm.uuid = res.uuid
        })
        .catch(() => {
          this.$message.error('获取验证码失败')
        })
    },
    getCookie() {
      // 查找是否存在cookie 若不存在则返回undefined
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 不为空 按cookie的来哦
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        // value 以 string保存 若存在cookie需要显示转换为Boolean
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      /* validate 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：
      是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise */
      // 前面我们已经对表单进行内置校验 所以无需第二个参数
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, {expires: 30})
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(async () => {
              // 动态加载路由
              await getRoute().then(res => {
                if (res.code === 200) {
                  loadRoutes(res.data);
                } else {
                  this.$message.error(res.message)
                }
              })

              // 动态获取权限
              await getPerms().then(res => {
                if (res.code === 200) {
                  // 存储权限信息
                  this.$store.commit('account/setPermissions', [
                    {
                      id: '*',
                      operation: res.data,
                    }])
                } else {
                  this.$message.error(res.msg)
                }
              })

              // 获取用户信息
              await this.$store.dispatch('user/getUserInfo').then(res => {
                // 路由跳转
                this.$router.push({path: this.redirect || '/index'})
              })
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        }
      })
    }
  }
}
</script>

<style scoped>
/deep/ .el-input__inner {
  height: 50px;
  line-height: 50px;
  border-color: #6e7486;
  border-radius: 10px;
  background-color: transparent;
  color: #fff;
}

/deep/ .el-form-item__error {
  margin-left: 50px;
}

/deep/ .el-checkbox {
  display: block;
}

/deep/ .el-button {
  border: none;
  background-color: #ffa500;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

/deep/ .el-input__inner {
  height: 50px;
  line-height: 50px;
  border-color: #fff;
  border-radius: 10px;
  background-color: transparent;
  color: #fff;
}

/deep/ .el-form-item__content {
  display: inline-flex;
  justify-content: space-between;
  width: 400px;
  height: 50px;
}

/deep/ .el-checkbox__label {
  color: #fff;
}
</style>

<style lang="scss" scoped>
.wid-300 {
  width: 300px
}

.margin-top-20 {
  margin-top: 20px;
}

.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .login-title {
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translateX(-300px);
    width: 600px;
    height: 80px;
    text-align: center;

    .zh-CN-title {
      height: 50px;
      font-size: 45px;
      font-weight: 200;
      line-height: 50px;
      color: #ffa500;
    }

    .en-title {
      margin-top: 10px;
      height: 40px;
      line-height: 40px;
      font-size: 25px;
      font-weight: 200;
      color: #ffa500;
    }
  }

  .login-border {
    position: absolute;
    top: 85px;
    left: 50%;
    width: 600px;
    height: 50px;
    transform: translateX(-300px);
    border-top: 2px solid #ffa500;
    border-left: 2px solid #ffa500;
    border-right: 2px solid #ffa500;

    &::before {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 50px;
      height: 50px;
      content: '';
      border-bottom: 2px solid #ffa500;
    }

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50px;
      height: 50px;
      content: '';
      border-bottom: 2px solid #ffa500;
    }
  }

  .login-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 550px;
    border: 1px solid #fff;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: 150px 30px;
    transform: translate(-200px, -200px);

    .login-form {
      height: 400px;
      margin-top: 150px;
      text-align: center;

      .login-captcha {
        width: 400px;
        height: 70px;

        .input-captcha {
          width: 140px;
          margin-left: 40px;
        }

        .captcha-image {
          width: 140px;
          height: 50px;
          margin-right: 40px;
          cursor: pointer;
        }
      }

      .remember-me {
        margin-left: 50px;
      }
    }
  }
}
</style>
