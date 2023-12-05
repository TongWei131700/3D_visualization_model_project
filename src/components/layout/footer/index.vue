<template>
  <div class="bottom" onselectstart="return false;">
    Copyright © 2019-{{ copyrightDate }} 智慧哨兵
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      // 版权时间
      copyrightDate: "",
    }
  },
  created() {
    this.copyrightDate = new Date().getFullYear();
  },
}
</script>

<style scoped>
.bottom {
  width: 100%;
  height: 50px;
  line-height: 50px;
  /*position: absolute;*/
  /*bottom: 0;*/
  /*left: 0;*/
  z-index: 1000;
  background-color: #CAD3C8;
  text-align: center;
}
</style>
