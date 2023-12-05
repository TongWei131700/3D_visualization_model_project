<template>
  <div class="content">
    <div v-for='(item, index) in list1' :key="index" class="menu-item">
      <div style="font-size:26px;margin: 0 auto;text-align:center;">{{ item.name }}</div>
      <div class="paramsContent">{{ item.num }}</div>
      <i class="el-icon-more" style="position:absolute;top:10px;right:10px"></i>
    </div>

  </div>


</template>

<script>


export default {
  name: 'BasicRule',
  props: {
    searchBoxValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      currentDate: new Date(),
      list1: [
        {
          name: '破坏雷达规则',
          num: '参数1'
        },
        {
          name: '聚集规则',
          num: '参数2'
        },
        {
          name: '聚集时间规则',
          num: '参数3'
        }, {
          name: '打架判断规则',
          num: '参数4'
        }

      ],
    }
  },
  computed: {},
  methods: {}
}
</script>
<style scoped>
/* .content {
  background-color: #000;
  flex-direction: column;
  justify-content: space-between;
} */

.menu-item {
  position: relative;
  width: 48%;
  height: 300px;
  display: inline-block;
  border: 1px solid lightgray;
  border-radius: 6px;
  margin: 15px;
  padding: 20px 0 20px 10px;

}

.paramsContent {
  width: 90%;
  height: 200px;
  font-size: 12px;
  margin: 10px auto;
  color: gray;
  text-align: center;
  border: 1px solid lightgray;
  border-radius: 6px;
}
</style>
