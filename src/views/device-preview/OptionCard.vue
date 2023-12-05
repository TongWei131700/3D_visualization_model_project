<template>
  <div>
    <dialog-drag
      v-if="getDeviceVisible"
      id="option-card"
      title="添加设备"
      @close="closeDeviceOption"
    >
      <div style="width: 150px;">
        <el-button
          v-for="device in deviceInfo"
          :key="device.key"
          plain
          size="mini"
          style="margin:0 0 10px 0; width: 100%;"
          type="primary"
          @click="addDevice(device)"
        >{{ device.name }}
        </el-button>
      </div>
    </dialog-drag>
  </div>

</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {DEVICE_INFO} from '../../store/config'
import DialogDrag from '@c/vue-dialog-drag/VueDialogDrag'

export default {
  name: 'OptionCard',
  components: {
    DialogDrag
  },
  data() {
    return {
      deviceInfo: [],
      formMonitor: {},
      visible: false
    }
  },
  computed: {
    ...mapGetters('device', [
      'getDeviceVisible',
      'getCurrentStep'
    ])
  },
  watch: {},
  created() {
    this.deviceInfo = DEVICE_INFO
  },
  methods: {
    ...mapMutations('device', {
      setDeviceOptionVisible: 'SET_DEVICE_OPTION_VISIBLE',
      setCurrentStep: 'SET_CURRENT_STEP',
      setSelectedDevice: 'SET_SELECTED_DEVICE',
      setFormMonitor: 'setFormMonitor',
      setFormType: 'SET_TYPE'
    }),
    /**
     * @author Lyc
     * 关闭添加设备 card
     */
    closeDeviceOption() {
      this.setDeviceOptionVisible(false)
    },
    closeEditDevice() {
      this.visible = false
    },
    /**
     * 添加设备
     * @author Lyc
     * @param device
     */
    addDevice(device) {
      if (this.getCurrentStep === 1) {
        this.setCurrentStep(2)
      }
      console.log('添加设备：', device)
      this.$emit('addDeviceModel', device.name)
      this.setSelectedDevice(device.name)
      // this.getDevicePreInfo(device.key);
      this.closeDeviceOption()
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 150px;
  background-color: transparent;
}
</style>
