<template>
  <div class="main-wrapper">
    <header class="header-nav">
      <router-view name="header"/>
    </header>
    <div class="content">
      <keep-alive exclude="Index,TraceReplayIndex,DevicePreView,BasicConfig">
        <router-view name="content"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Layout',
  // computed: {
  //   ...mapGetters('setMap', {
  //     initMapInfo: 'getInitMapInfo'
  //   }),
  //   ...mapGetters('models', {
  //     shareModels: 'getShareModels'
  //   })
  // },
  // watch: {
  // initMapInfo: function(val, oldVal) {
  //}
  // shareModels: function(val) {
  //   console.log(val, '初始化场景')
  //   // val.initPlane(this.initMapInfo);
  //   if (this.initMapInfo) {
  //     this.shareModels.initPlane(this.initMapInfo)
  //   }
  // }
  //},
  //mounted() {
  // if (this.shareModels === null) {
  //   this.initShareModels()
  // }
  // this.initMap()
  //},
  // methods: {
  //   ...mapActions('models', ['initShareModels']),
  //   ...mapActions('setMap', ['initMap'])
  // }
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;

  .header-nav {
    height: 60px;
  }

  .content {
    height: calc(100% - 60px);
  }
}
</style>
