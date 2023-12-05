<template>
  <div
    class="global-header"
    :style="{backgroundImage:'url('+require('/src/assets/images/index_header/header.png')+')'}"
  >
    <time class="header-time text-linear-gradient">
      {{ currentTime }}
    </time>
    <div class="header-mid-title"></div>
    <h1 class="header-title text-linear-gradient">校园安全防控预警系统</h1>
<!--    <div class="header-user-wrapper">
      <el-dropdown class="header-user-content" placement="bottom-start">
        <div class="trigger-div">
          <div class="user-logo">
            <img src="@/assets/images/user_face/default.png" alt="">
          </div>
          <span class="user-name text-linear-gradient">
            {{ username }}
          </span>
        </div>
        <user-related-operations />
      </el-dropdown>
    </div>-->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { gainCurrentTime } from '@/utils/timeUtils'
/*import UserRelatedOperations from '@c/user-related-operations/UserRelatedOperations'*/

export default {
  name: 'IndexHeader',
  /*components: { UserRelatedOperations },*/
  data() {
    return {
      currentTime: ''
      /*username: this.$store.getters['user/userInfo'].userName*/
    }
  },
  methods: {
    ...mapActions('index', {
      getTodayDoneOrUndone: 'getTodayDoneOrUndoneByActions'
    }),
    getCurrentTime() {
      const { year, month, day, hour, minute, second, week } = gainCurrentTime()
      this.currentTime = `${year}/${month}/${day} ${hour}:${minute}:${second} ${week}`
      setTimeout(this.getCurrentTime, 1000)
      if (hour === '00' && minute === '00' && second === '00') {
        this.getTodayDoneOrUndone()
      }
    }
  },
  mounted() {
    setTimeout(this.getCurrentTime, 0)
  }
}
</script>

<style lang="scss" scoped>
.text-linear-gradient{
  background-image: linear-gradient(#fff,rgb(175,215,254));
  -webkit-background-clip:text;
  color: transparent;
}

.global-header {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .header-time{
    width: 35%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 1.2rem;
  }
  .header-title{
    padding-top: 0.4rem;
    font-size: 1.9rem;
    margin-right: 42%;
  }
  .header-user-wrapper{
    display: flex;
    justify-content: center;
    width: 35%;
    height: 40px;
    .header-user-content {
      width: 30%;
      height: 40px;
      .trigger-div {
        display: flex;
        position: relative;
        .user-logo{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-right: 1.5rem;
          img{
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
        .user-name{
          height: 40px;
          line-height: 40px;
          font-size: 1.125rem;
        }
      }
    }
  }
}
</style>
