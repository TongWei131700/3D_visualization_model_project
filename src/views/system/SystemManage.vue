<template>
  <div class="basic-config-wrapper hidden-scroll">
    <div class="basic-config-content">
      <header class="basic-config-tab">
        <avue-tabs :option="basicConfigTabOption" @change="handleChange"/>
      </header>
      <div v-if="currentTab === '用户管理'">
        <main class="basic-config-info">
          <div class="info-body">
            <user-manage/>
          </div>
        </main>
      </div>
      <div v-if="currentTab === '角色管理'">
        <main class="basic-config-info">
          <div class="info-body">
          <role-manage />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import UserManage from "./UserManage";
import RoleManage from "./RoleManage";
export default {
  name: "SystemManage",
  components: {RoleManage, UserManage},
  data() {
    return {
      column: [
        {
          label: '用户管理'
        },
        {
          label: '角色管理'
        },
      ],
      currentTab: '用户管理',
    }
  },
  computed: {
    // 页面头部Tab标签配置选项
    basicConfigTabOption() {
      return {
        column: this.column,
      }
    }
  },
  methods: {
    handleChange(column) {
      this.currentTab = column.label
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-config-wrapper {
  height: 100%;
  background-color: #fff;

  .basic-config-content {
    width: 95%;
    margin: 0 auto;

    .basic-config-tab {
      font-size: 1.2rem;
    }

    .basic-config-search-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .search-box-title {
        width: 150px;
        height: 40px;
        line-height: 40px;
        background-color: rgba(222, 225, 230, .9);
        text-align: center;
      }
    }

    .tag-legend {
      height: 60px;
      padding: 15px;
      margin-top: 20px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .tag-legend-title {
        font-size: 16px;

        .el-icon-picture-outline-round {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .tag-legend-body {
        .tag-margin-left {
          margin-left: 30px;
        }
      }
    }

    .basic-config-info {
      margin-top: 20px;
      padding: 20px 15px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      .info-title {
        font-size: 16px;

        .el-icon-info {
          margin-left: 0.8rem;
          color: rgba(0, 0, 0, .3);
          font-size: 18px;
        }
      }

      .info-body {
        padding: 20px 10px;
      }
    }
  }
}
</style>

<style scoped>
.basic-config-wrapper {
  --infoTagFontColor: #909399;
  --radarTagFontColor: #FF8C00;
  --ptzTagFontColor: #32CD32;
  --boltTagFontColor: #9370DB;
}

/deep/ .info-tag {
  border-color: var(--infoTagFontColor);
  color: var(--infoTagFontColor);
}

/deep/ .radar-tag {
  border-color: var(--radarTagFontColor);
  color: var(--radarTagFontColor);
}

/deep/ .camera-tag {
  border-color: var(--boltTagFontColor);
  color: var(--boltTagFontColor);
}

</style>
