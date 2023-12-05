<template>
  <div class="no-item">
    <img class="no-item-img" src="@/assets/images/trace_replay/NoItem.png">
    <h6 class="no-item-description">{{ noItemDescription }}</h6>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'TraceNoItem',
  computed: {
    ...mapGetters('traceReplay', {
      noItemDescription: 'getNoItemDescription'
    })
  }
}
</script>

<style lang="scss" scoped>
.no-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .no-item-img {
    width: 60%;
    height: 30%;
  }

  .no-item-description {
    margin-top: 40px;
    font-size: 1.1rem;
    letter-spacing: 0.2rem;
    color: #d9d9d9;
  }
}
</style>
