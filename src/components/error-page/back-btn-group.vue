<template>
  <div>
    <el-button size="large" type="text" @click="backHome">返回首页</el-button>
    <el-button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</el-button>
  </div>
</template>

<script>
import './error.scss'

export default {
  name: 'BackBtnGroup',
  data() {
    return {
      second: 5,
      timer: null
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev()
      else this.second--
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    backHome() {
      this.$router.push({path: '/index'})
    },
    backPrev() {
      this.$router.go(-1)
    }
  }
}
</script>
