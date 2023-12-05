<template>
  <div id="trace-replay">
    <div class="floor-selector">
      <floor-selector/>
    </div>
    <div class="trace-replay-map">
      <trace-replay-model/>
    </div>
    <div class="right-card-wrapper">
      <transition name="el-fade-in-linear">
        <trace-date-time-picker
          v-show="isShowDateTimePicker"
          @closeDateTimePicker="isShowDateTimePicker = false"
        />
      </transition>
      <transition name="el-fade-in-linear">
        <trace-list
          v-show="!isShowDateTimePicker"
          @openDateTimePicker="isShowDateTimePicker = true"
        />
      </transition>
    </div>
    <div class="trace-play-background">
      <celestial-background/>
    </div>
  </div>
</template>
<script>

import TraceDateTimePicker from '@/views/trace-replay/components/TraceDateTimePicker'
import TraceList from '@/views/trace-replay/components/TraceList'
import CelestialBackground from '@c/celestial-background/CelestialBackground'
import TraceReplayModel from '@/views/trace-replay/components/TraceReplayModel'
import FloorSelector from '@/components/floor-selector/FloorSelector'

export default {
  name: 'TraceReplayIndex',
  components: {
    TraceReplayModel,
    CelestialBackground,
    TraceList,
    TraceDateTimePicker,
    FloorSelector
  },
  data() {
    return {
      isShowDateTimePicker: true,
    }
  },
}
</script>

<style lang="scss" scoped>
#trace-replay {
  position: relative;
  width: 100%;
  height: 100%;

  .floor-selector {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 500;
  }

  .trace-replay-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 75%;
    height: 100%;
  }

  .right-card-wrapper {
    position: absolute;
    top: 1px;
    bottom: 1px;
    right: 0;
    width: 25%;
    height: calc(100% - 2px);
  }

  .trace-play-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
  }
}
</style>
