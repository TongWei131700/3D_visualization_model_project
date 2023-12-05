<template>
  <div
    :class="{ display: $parent.showProcessDetail }"
    class="alarm-process-details-container"
  >
    <div class="alarm-process-details">
      <header class="alarm-process-title">报警详情</header>
      <div class="alarm-process-content">
        <div class="alarm-process-content-common alarm-process-content-left">
          <header class="content-left-title">
            <img src="@/assets/images/alarm/AlarmProcessLogo.png"/>
            当前查看报警
          </header>
          <div class="alarm-info">
            <ul class="alarm-info-list">
              <li class="alarm-info-item">
                <span class="item-title">报警时间：</span>
                <span class="item-value">{{ alarmDetail.alarmTime }}</span>
              </li>
              <!-- <li class="alarm-info-item">
                <span class="item-title">报警组：</span>
                <span class="item-value">{{ monitorListMap.get(alarmDetail.groupId) }}</span>
              </li> -->
              <li class="alarm-info-item">
                <span class="item-title">报警地点：</span>
                <span class="item-value">{{ alarmDetail.alarmLocation }}</span>
              </li>
              <!-- <li class="alarm-info-item">
                <span class="item-title">报警信息：</span>
                <span class="item-value">{{ alarmDetail.alarmDescription }}</span>
              </li> -->
            </ul>
            <div v-if="pictureUrls.length !== 0" class="picture-content">
              <el-image
                v-for="item in pictureUrls"
                :key="item"
                :src="item"
                class="image-tag"
                fit="contain"
              />
            </div>
          </div>
          <div class="alarm-status">
            <img src="@/assets/images/alarm/read.png"/>
          </div>
        </div>
        <div class="alarm-process-content-common alarm-process-content-right">
          <div v-if="recordUrls.length !== 0" class="record-content">
            <video
              v-for="item in recordUrls"
              :key="item"
              :src="item"
              class="video-tag"
              controls
              muted
            />
          </div>
          <!-- <div v-if="pictureUrls.length !== 0" class="picture-content">
            <el-image
              v-for="item in pictureUrls"
              :key="item"
              class="image-tag"
              :src="item"
            />
          </div> -->
          <div
            v-if="recordUrls.length"
            class="no-record-and-picture"
          >
            无该报警视频
          </div>
        </div>
      </div>
      <footer class="alarm-deal-button">
        <button class="button-style" @click="handleCancel">确定</button>
      </footer>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getRecordOrPictureById} from "@/api/alarm";

export default {
  name: "AlarmDetails",
  props: {
    alarmDetail: {
      type: Object,
    },
  },
  data() {
    return {
      pictureUrls: [],
      recordUrls: [],
    };
  },
  computed: {
    ...mapGetters("alarm", ["monitorListMap"]),
  },
  mounted() {
    getRecordOrPictureById(this.alarmDetail.alarmId).then((res) => {
      this.pictureUrls = res.data.pictureUrls;
      this.recordUrls = res.data.recordUrls;
    });
  },
  methods: {
    handleCancel() {
      this.$emit("closeDealDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.alarm-process-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 500;
  width: 90%;
  height: 90%;
  transform: translate(-50%, -50%);
  background-image: url("~@/assets/images/alarm/AlarmProcessBackground.png");
  background-size: cover;

  .alarm-process-details {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 550;
    background-image: url("~@/assets/images/alarm/AlarmProcess.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .alarm-process-title {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 10%;
      font-size: 3rem;
      letter-spacing: 2px;
      text-shadow: 0 0 10px rgb(243, 181, 24);
    }

    .alarm-process-content {
      display: flex;
      justify-content: space-between;
      height: 70%;
      padding: 10px 50px 30px;

      .alarm-process-content-common {
        width: 45%;
        height: 100%;
        padding: 10px;
        background: rgba(2, 170, 250, 0.1);
        border: 1px solid #02aafa;
        border-radius: 20px;
        box-shadow: 0 2px 2px #02aafa inset;
      }

      .alarm-process-content-left {
        .content-left-title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 10%;
          font-size: 2.2rem;
          font-weight: 700;
          color: #ff0000;
          letter-spacing: 2px;
          text-shadow: 0 0 2px #ff0000;

          img {
            width: 2rem;
            height: 2rem;
            margin-right: 10px;
          }
        }

        .alarm-info {
          overflow-y: auto;
          height: 70%;

          .alarm-info-list {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 40%;

            .alarm-info-item {
              display: flex;
              justify-content: space-between;

              .item-title {
                color: #02aafa;
                font-weight: 700;
                font-size: 1.5rem;
              }

              .item-value {
                color: #fff;
                font-size: 1.2rem;
              }
            }
          }

          .picture-content .image-tag {
            width: 90%;
            height: 50%;
            align-items: center;
            margin-top: 2rem;
            margin-left: 1.6rem;
          }
        }

        .alarm-status {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          height: 20%;

          img {
            width: 20%;
            height: 70%;
          }
        }
      }

      .alarm-process-content-right {
        overflow-y: auto;

        .record-content,
        .picture-content,
        .no-record-and-picture {
          height: 100%;
          font-weight: 500;
          font-size: 2rem;
          letter-spacing: 0.2rem;
          color: #fff;
          text-align: center;
        }

        .no-record-and-picture {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .record-content .video-tag {
          width: 80%;
          height: 45%;
          margin-top: 3rem;
        }
      }
    }

    .alarm-deal-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20%;

      .button-style {
        width: 20%;
        height: 40%;
        border: 1px solid #02aafa;
        background: rgba(2, 170, 250, 0.1);
        color: #fff;
        box-shadow: 0 2px 2px #02aafa;
        cursor: pointer;
      }

      .button-margin-left {
        margin-left: 35px;
      }
    }
  }
}

.display {
  animation-name: displayDialog;
  animation-duration: 1s;
}

@keyframes displayDialog {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
