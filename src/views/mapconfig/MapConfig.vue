<template>
  <div class="map-config-wrapper">
    <div class="map-config-container">
      <div class="map-info-list-wrapper">
        <map-info-list></map-info-list>
      </div>
      <div class="map-settings-wrapper">
        <map-settings></map-settings>
      </div>
    </div>

  </div>
</template>

<script>
import MapInfoList from "@c/map-config/MapInfoList";
import MapSettings from "@c/map-config/MapSettings";

export default {
  name: "MapConfig",
  components: {MapSettings, MapInfoList}
};
</script>

<style lang="scss" scoped>
.map-config-wrapper {
  height: 100%;
  overflow: auto;

  .map-config-container {
    display: flex;
    flex-direction: column;
    width: calc(100% - 10px);
    height: calc(100% - 20px);
    padding: 10px 30px;
    margin: 10px auto;

    .map-info-list-wrapper {
      height: 45%;
    }

    .map-settings-wrapper {
      height: 55%;
    }
  }

  .bgc {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -500;
  }
}
</style>
