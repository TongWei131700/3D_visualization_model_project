<template>
  <div class="body">
    <div ref="starsRef" class="stars">
      <div v-for="item in list_star" ref="star" class="star"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CelestialBackground',
  data() {
    return {
      list_star: 800, // 星星数量
      distance: 800 // 间距
    }
  },
  mounted() {
    const starArr = this.$refs.star
    starArr.forEach((item) => {
      const speed = 0.2 + (Math.random() * 1)
      const thisDistance = this.distance + (Math.random() * 300)
      item.style.transformOrigin = `0 0 ${thisDistance}px`
      item.style.transform = `
        translate3d(0,0,-${thisDistance}px)
        rotateY(${Math.random() * 360}deg)
        rotateX(${Math.random() * -50}deg)
        scale(${speed},${speed})`
    })
  }
}
</script>

<style lang="css" scoped>
.body {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: radial-gradient(
    200% 100% at bottom center,
    #03060d,
    #090f1d,
    #1b2947
  );
  background: radial-gradient(
    200% 105% at top center,
    #1b2947 10%,
    #090f1d 65%,
    #03060d
  );
  background-attachment: fixed;
  overflow: hidden;
}

@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 45%;
  animation: rotate 90s infinite linear;
  bottom: 0;
}

.star {
  width: 2px;
  height: 2px;
  background: #f7f7b6;
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden;
}
</style>
