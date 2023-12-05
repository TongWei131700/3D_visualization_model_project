<template>
  <div>
    <el-tree
      ref="tree"
      :load="loadNode"
      :props="props"
      lazy
      show-checkbox
      @check-change="handleCheckChange">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "BuildingTree",
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      buildingString: '',
      buildingName: [],
      buildingPerFloor: [],
    };
  },
  mounted() {
    this.buildingString = JSON.parse(window.localStorage.getItem('infoMsg')).floorParam
    let length1 = this.buildingString.length
    let string1 = this.buildingString.substring(1, length1 - 1)
    let length2 = string1.length
    let string2 = []
    for (let i = 0; i < length2;) {
      let j = i
      if (string1[i] == '[') {
        while (string1[i] != ']') {
          i++
        }
        let string2Param = string1.substring(j + 1, i)
        string2.push(string2Param)
      } else {
        i++
      }
    }
    let length3 = string2.length
    let string3 = []
    for (let i = 0; i < length3; i++) {
      let stringParam = string2[i].split(/[，,]+/)
      string3.push(stringParam)
    }
    this.buildingPerFloor = string3
    let length4 = string3.length
    this.buildingName = []
    for (let i = 0; i < length4; i++) {
      this.buildingName.push(string3[i][0])
    }
  },
  methods: {
    handleCheckChange() {
      let res = this.$refs.tree.getCheckedNodes()
      let selectName = []
      for (let i = 0; i < res.length; i++) {
        let name = res[i].name
        name = name.replace(/\s*/g, "")
        selectName.push(name)
      }
      this.$emit('selectBuilding', selectName)
    },
    loadNode(node, resolve) {
      this.$nextTick(() => {
        if (node.level === 0) {
          let Level0 = []
          for (let i = 0; i < this.buildingName.length; i++) {
            let param = {}
            param.name = this.buildingName[i]
            Level0.push(param)
          }
          return resolve(Level0);
        }
        if (node.level > 1) return resolve([]);
        if (node.data.name) {
          let k = -1
          for (let i = 0; i < this.buildingName.length; i++) {
            if (node.data.name == this.buildingName[i]) {
              k = i
              break
            }
          }
          if (this.buildingPerFloor[k].length > 2 || ((this.buildingPerFloor[k].length == 2) && (this.buildingPerFloor[k][0] != this.buildingPerFloor[k][1].replace(/\s*/g, "")))) {
            console.log('ggggggggam!!!!')
            setTimeout(() => {
              let data = [];
              for (let j = 1; j < this.buildingPerFloor[k].length; j++) {
                let param = {}
                param.name = this.buildingPerFloor[k][j]
                data.push(param)
              }
              resolve(data);
            }, 500);
          } else {
            setTimeout(() => {
              let data = [];
              resolve(data);
            }, 500);
          }
        }
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-tree {
  background-color: transparent;
}

::v-deep .el-tree-node__label {
  color: black !important;
  font-size: 15px !important;
}

::v-deep .el-tree-node__children .el-tree-node__content {
  margin-top: 5px !important;
}

::v-deep .el-tree-node__children {
  margin-top: 5px !important;
}

::v-deep .el-tree-node__content:hover {
  background-color: rgba(61, 174, 224, 0.4);
}

::v-deep .el-tree-node:focus .el-tree-node__content {
  background-color: rgba(74, 157, 231, 0.5) !important;
  color: #fff !important;
}
</style>
