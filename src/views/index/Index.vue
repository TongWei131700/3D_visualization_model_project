<template>
  <div id="index-page" onSelectStart="return false">
    <div style="position:absolute;top: 40%;left: 50%; transform: translate(-50%, -50%);z-index: 1" v-if="showCard">
      <test-card @closeCard="closeCard" :cardSn="cardSn"/>
    </div>
    <div class="index-layout-on-both-sides index-layout-left">
      <div class="index-layout-left-top">
        <security-alarm/>
      </div>
      <div class="index-layout-left-middle">
        <!-- <radar-online-statistics /> -->
        <alarm-frequency-change/>
      </div>
      <div class="index-layout-left-bottom">
        <radar-online-statistics/>
      </div>

    </div>
    <!-- <div class="index-layout-on-both-sides index-layout-right">
         <div class="index-layout-right-top-bottom">
            <people-counting></people-counting>
         </div>
      </div> -->
    <div class="floor-selector">
      <floor-selector @resetTrace="resetTrace"/>
    </div>

<!--    为了方便调试，先注释此div,然后打开下面的div-->
    <div v-show="showTrace && tempShow" class="trajectories-change">
      <TrajectoriesChange @cancelTrace='cancelTrace'/>
    </div>
    <!--    <div class="trajectories-change">-->
    <!--      <TrajectoriesChange @cancelTrace='cancelTrace'/>-->
    <!--    </div>-->

    <nav class="index-page-footer">
      <bottom-nav/>
    </nav>
    <div class="index-map">
      <models @openSensorCard="openSensorCard"/>
    </div>
    <div class="index-background">
      <celestial-background/>
    </div>
  </div>
</template>

<script>
import FloorSelector from '@/components/floor-selector/FloorSelector'
import SecurityAlarm from '@/views/index/components/SecurityAlarm'
import AlarmFrequencyChange from '@/views/index/components/AlarmFrequencyChange'
import BottomNav from '@/views/index/components/BottomNav'
import CelestialBackground from '@/components/celestial-background/CelestialBackground'
import Models from './components/models.vue'
import RadarOnlineStatistics from '@/views/index/components/RadarOnlineStatistics'
import PeopleCounting from './components/PeopleCounting'
import TrajectoriesChange from './components/trajectoriesChange'
import testCard from './components/testCard'
import {mapGetters} from 'vuex'

export default {
  name: 'Index',
  components: {
    PeopleCounting,
    FloorSelector,
    RadarOnlineStatistics,
    CelestialBackground,
    BottomNav,
    SecurityAlarm,
    AlarmFrequencyChange,
    Models,
    TrajectoriesChange,
    testCard
  },
  computed: {
    ...mapGetters('models', {
      getShowTrace: 'getShowTrace'
    }),
  },
  data() {
    return {
      showTrace: false,
      tempShow: true,
      showCard: false, // 是否展示气体监测卡片
      cardSn: '', //记录要打开传感器的sn号
    }
  },
  watch: {
    getShowTrace(val) {
      if (val) {
        this.showTrace = true
      } else this.showTrace = false
    }
  },
  methods: {
    closeCard() {
      this.showCard = false
    },
    cancelTrace() {
      this.tempShow = false
    },
    resetTrace() {
      this.tempShow = true
    },
    /**
     * 打开传感器卡片
     */
    openSensorCard(data) {
      this.showCard = false // 先关闭其他传感器的卡片视图，避免数据获取不一致
      this.showCard = true
      this.cardSn = data
    }
  },
  destroyed() {
    this.$store.state.models.ifShowLoad = false// 使楼层加载状态处于正常状态
  }
}
</script>
<style lang="scss" scoped>
$distanceFromLRSides: 10px;
$distanceFromTopSide: 10px;

#index-page {
  position: relative;
  width: 100%;
  height: 100%;

  .index-layout-on-both-sides {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1000;
    width: 20%;
    height: calc(100% - #{2 * $distanceFromTopSide});
    min-width: 250px;

    &.index-layout-left,
    &.index-layout-right {
      position: absolute;
      top: $distanceFromTopSide;
    }

    &.index-layout-left {
      left: $distanceFromLRSides;
    }

    &.index-layout-right {
      right: $distanceFromLRSides;
    }

    .index-layout-left-top,
    .index-layout-right-top {
      height: 40%;
    }

    .index-layout-left-middle {
      height: 25%;
    }

    .index-layout-left-bottom {
      height: 35%;
    }

    .index-layout-right-top-bottom {
      height: 55%;
    }
  }

  .index-page-footer {
    position: absolute;
    left: 20%;
    bottom: 1.2rem;
    z-index: 1000;
    width: 60%;
  }

  .index-map {
    height: 100%;
  }

  .index-background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -200;
    width: 100%;
    height: 100%;
  }

  .floor-selector {
    position: absolute;
    top: $distanceFromTopSide;
    left: 21%;
  }

  .trajectories-change {
    width: 20%;
    position: absolute;
    top: 0;
    right: 0;
  }
}</style>
