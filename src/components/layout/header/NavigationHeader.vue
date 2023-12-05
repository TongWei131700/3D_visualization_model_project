<template>
  <nav class="navigation-bar">
    <header class="navigation-bar-left">
      <h2 class="navigation-title"/>
    </header>
    <ul class="navigation-bar-center">
      <span class="title">校园安全防控预警系统</span>
      <li :key="route.name" v-for="route in routerInfo">
        <span/>
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
    <div class="navigation-bar-right">
      <div class="navigation-bar-time">
        <div>
          {{ currentTime.year }}/{{ currentTime.month }}/{{ currentTime.day }}
        </div>
        <div>
          <span>{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
          <span style="margin-left: 5px">{{ currentTime.week }}</span>
        </div>
      </div>
      <el-dropdown class="navigation-bar-user-info-content" placement="bottom-start">
        <div class="trigger-div">
          <div class="user-logo">
            <img src="@/assets/images/user_face/default.png" alt="">
          </div>
          <span class="user-name">
            {{ $store.getters['user/userInfo'].userName }}
          </span>
        </div>
          <user-related-operations />
      </el-dropdown>
    </div>
  </nav>
</template>

<script>
import {gainCurrentTime} from '@/utils/timeUtils'
import {getRouters} from '@/utils/routerUtil'
import UserRelatedOperations from '@c/user-related-operations/UserRelatedOperations'

export default {
  name: 'NavigationHeader',
  components: {
    UserRelatedOperations
  },
  data() {
    return {
      currentTime: {
        year: 0,
        month: 0,
        day: 0,
        week: '',
        hour: 0,
        minute: 0,
        second: 0
      },
      routerInfo: [],
      /*username: this.$store.getters['user/userInfo'].userName*/
    }
  },
  mounted() {
    this.refreshTime()
    this.routerInfo = getRouters()
  },
  methods: {
    getCurrentTime() {
      const {year, month, day, hour, minute, second, week} = gainCurrentTime()
      Object.assign(this.currentTime, {
        year, month, day, hour, minute, second, week
      })
    },
    refreshTime() {
      setInterval(this.getCurrentTime, 1000)
    },
  }
}
</script>

<style lang="scss" scoped>
.navigation-bar {
  display: flex;
  height: 100%;
  background-color: #0e0e26;
  border-bottom: 1px solid #0668ba;
  box-shadow: 0 3px 1px rgb(2, 51, 130);
  line-height: 60px;

  .navigation-bar-left {
    width: 15%;
    height: 100%;

    .navigation-title {
      height: 100%;
      font-size: 24px;
      text-align: center;
      background-image: linear-gradient(#fff, rgb(175, 215, 254));
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .navigation-bar-center {
    //display: flex;
    justify-content: space-around;
    align-items: center;
    width: 70%;
    height: 100%;

    .title {
      color: white;
      font-size: 19px;
      font-family: 黑体;
      font-weight: bold;
      margin-right: 38px;
    }

    li {
      display: inline;
      list-style: none;
      font-size: 18px;
      cursor: pointer;
      margin-right: 18px;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 12px;
        border-radius: 50%;
        background-color: #355996;
      }

      a {
        color: rgba(255, 255, 255, .7);
        font-size: 15px;
        transition: 0.2s;
        cursor: pointer;
      }

      a:hover {
        color: #FFFFFF;
      }

      a.router-link-active {
        color: #99ffff;
        font-size: 18px;
        text-shadow: 2px 10px 5px #FFFF00;
      }
    }
  }

  .navigation-bar-right {
    display: flex;
    justify-content: space-around;
    width: 15%;
    height: 100%;

    .navigation-bar-time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40%;
      height: 100%;
      color: orange;
      font-size: 10px;

      div {
        height: 20px;
        line-height: 20px;
      }
    }

    .navigation-bar-user-info-content {
      width: 38%;
      height: 100%;
      :hover {
        background: #3e94c2;
      }

      .trigger-div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        cursor: pointer;

        .user-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-right: 1rem;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
          }
        }

        .user-name {
          height: 40px;
          line-height: 40px;
          font-size: 13px;
          cursor: pointer;
          color: white;
        }
      }
    }
  }
}
</style>
