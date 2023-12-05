<template>
  <nav class="bottom-nav">
    <ul class="bottom-nav-list">
      <router-link to="/index">
        <li class="bottom-nav-item" @click="returnAllBuilding">
          <img src="/icon/bottomNavIcon/Firefox Twi.ico" />
          <h4>首页</h4>
        </li>
      </router-link>
      <router-link to="/device_basic_config">
        <li class="bottom-nav-item">
          <img src="/icon/bottomNavIcon/Service.ico" />
          <h4>设备管理</h4>
        </li>
      </router-link>
      <router-link to="/trace_replay">
        <li class="bottom-nav-item">
          <img src="/icon/bottomNavIcon/TraceReplay.png" />
          <h4>轨迹回放</h4>
        </li>
      </router-link>
      <router-link to="/alarm">
        <li class="bottom-nav-item">
          <img src="/icon/bottomNavIcon/GOM Player.ico" />
          <h4>报警管理</h4>
        </li>
      </router-link>
      <router-link to="/rule_config">
        <li class="bottom-nav-item">
          <img src="/icon/bottomNavIcon/Customizer God.ico" />
          <h4>规则管理</h4>
        </li>
      </router-link>
<!--      <router-link to="/device_preview">-->
<!--        <li class="bottom-nav-item">-->
<!--          <img src="/icon/bottomNavIcon/Spotify.ico" />-->
<!--          <h4>系统设置</h4>-->
<!--        </li>-->
<!--      </router-link>-->
<!--      <router-link to="/map-config">-->
<!--        <li class="bottom-nav-item">-->
<!--          <img src="/icon/bottomNavIcon/Comm Discord Dark.ico">-->
<!--          <h4>地图配置</h4>-->
<!--        </li>-->
<!--      </router-link>-->
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'BottomNav',
  methods: {
    returnAllBuilding() {
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-nav {
  width: 100%;
  .bottom-nav-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: nowrap;
      align-items: center;
      width: 5rem;
      list-style-type: none;
      transition-duration: 0.3s;
      -webkit-transition-duration: 0.3s;
      cursor: pointer;
      img {
        width: 3rem;
        height: 3rem;
      }
      h4 {
        margin-top: 10px;
        color: white;
      }
      img:hover,
      h4:hover {
        cursor: pointer;
      }
    }
    .bottom-nav-item:hover {
      cursor: pointer;
      transform: scale(1.3, 1.3);
      -webkit-transform: scale(1.3, 1.3);
      margin: 0 2rem;
    }
    .bottom-nav-item:hover:after:hover {
      content: "";
      display: block;
      width: 100%;
      height: 3rem;
    }
    .bottom-nav-item:hover + img:hover,
    .bottom-nav-item:hover + h4:hover {
      cursor: pointer;
      transform: scale(1.1, 1.1);
      -webkit-transform: scale(1.1, 1.1);
      margin: 0 1rem;
    }
  }
}
</style>
