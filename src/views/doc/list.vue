<template>
  <div class="a_tree_box">
    <el-button type="primary" size="mini" @click="addProject()">添加项目</el-button>
    <!-- 列表 -->
    <el-table :data="list" border row-key="id" lazy :load="load">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="docTitle" label="文档列表" width="260" />
      <el-table-column prop="amount" label="部门" />
      <el-table-column prop="period" label="项目描述" />
      <el-table-column prop="param.status" label="发布状态" />

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope", type="index">
          <el-button type="primary" size="mini">
            <router-link :to="'/doc/detail/' + scope.row.id">查看/编辑</router-link>
          </el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">菜单</span>
            <el-dropdown-menu slot="dropdown">
              <el-button type="primary" size="mini" @click="addCategory(scope.row,scope.row.$index)">添加分类</el-button>
              <i v-if="scope.row.farOrSon=='first'|| scope.row.farOrSon=='middle'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;"
                 class="el-icon-folder-add" @click="addOneRow(scope.row,scope.$index,'middle')"></i>
              <el-button type="primary" size="mini" @click="addVersion(scope.row.id,index)">添加版本</el-button>
              <el-button type="primary" size="mini" @click="addVersion(scope.row.id)">重命名</el-button>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="warning" size="mini" @click="delete(scope.row.id)">删除</el-button>

          <el-button
            type="warning"
            size="mini"
            @click="makeLoan(scope.row.id)"
          >
            发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import docApi from '@/api/core/doc'
export default {
  name: "",
  data() {
    return {
      list: [] // 列表
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      docApi.listChildProjectById(0).then(response => {
        this.list = response.data.childList
      })
    },
    // 加载列表数据
    load(tree, treeNode, resolve) {
      docApi.listChildProjectById(tree.id).then(response => {
        resolve(response.data.childList)
      })
    },

    addProject() {
      var timestamp = new Date().getTime()
      console.log("新增的projectid：" + timestamp)
      const newProject = {
        id: timestamp,
        parentId: 0,
        isEdit: 0,
        isDoc: 0,
        docTitle: '新项目',
        children: []
      }
      docApi.save(newProject)
      this.list.push(newProject)
    },

    addCategory(row,index) {
      var timestamp = new Date().getTime()
      console.log("addCategory的index："+index)
      const newCategory = {
        id: timestamp,
        parentId: row.id,
        isEdit: 0,
        isDoc: 0,
        docTitle: '新分类',
        children: []
      }
      if (row.children) {
        row.children.push(newCategory)
      } else {
        // 添加数据
        this.$set(row, 'children', [newCategory])
      }
      docApi.save(newCategory)
    },

    addVersion(id,index) {
      var timestamp = new Date().getTime()
      console.log("addVersion的index："+index)
      const newVersion = {
        id: timestamp,
        parentId: id,
        isEdit: 0,
        isDoc: 1,
        docTitle: '新版本',
        children: []
      }
      docApi.save(newVersion)
    }
  }
}
</script>

<style lang="less" scoped>
// 树状表格样式
.a_tree_box {
  width: calc(100vw - 300px);
  height: 100%;
  margin-bottom: 20px;
  padding: 40px;

  .cd-tool {
    display: flex;
    flex-direction: row;
  }

  .data-table {
    /deep/ .cell {
      display: flex;
      align-items: center;
    }

    // 固定表格高度
    /deep/ td {
      height: 50px;
      padding: 0;
    }

    /deep/ tbody {
      tr {
        overflow: hidden;

        td {
          // width: 40px !important;
          // background-color: #1fff!important;
          // background-color: rgba(255, 255, 255, 0); //必须设置为透明色  否则 warning-row 显示不出来
          .cell {
            padding: 0 !important;
            // background-color: #1fff;

            height: 100%;
            position: relative;
            overflow: visible !important;

            .l_bor1_box {
              top: -24px;
              display: inline-block;
              width: 1px;
              height: 100%;
              border-left: 1px dashed #ccc;
              position: absolute;
            }

            .l_bor2_box {
              display: inline-block;
              width: 30px;
              height: 1px;
              border-top: 1px dashed #ccc;
              position: absolute;
            }

            .more_dash {
              display: inline-block;
              width: 1px;
              height: 50%;
              border-top: 1px dashed #ccc;
              position: absolute;
              top: calc(50% - 1px);
              // background-color: rgba(248, 250, 252, 1);
              background-color: rgb(255, 253, 253);
            }

            .el-table__expand-icon {
              //这个是将所有的条件前面的图标 固定掉
              display: inline-block;
              width: 20px !important;
              min-width: 20px !important;
              position: relative;
              z-index: 999;
              // background-color: #1fff;
            }

            .el-table__placeholder {
              //这个是将所有的条件前面的空白 固定成20px   这样才会有间隔层级视觉效果 如果不做固定 会导致 条件文字多的时候 有的是20xp 有的不是 就导致看起来没层级一样
              display: inline-block;
              width: 25px !important;
              max-width: 25px !important;
              min-width: 25px !important;
            }

            .l_bor3_box {
              display: inline-block;
              width: 1px;
              height: 15px;
              border-left: 1px dashed #ccc;
              top: 15px;
              left: -13px;
              position: relative;
            }
          }
        }

        td:nth-child(n + 2) {
          .cell {
            span {
              // background-color: #1fff;
              display: inline-block;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
    }
  }

  .showName {
    display: inline-block;
    // max-width: 100px;
    // white-space: nowrap;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .one_two {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }

  .isML10 {
    margin-left: 10px; //判断有无数据 没数据就需要左偏移对齐
  }

  .abcd {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: 3px;
  }

  .tip_icon {
    width: 20px;
    height: 20px;
    cursor: pointer;

    position: relative;
    top: -1px;
    left: 30px;
  }

  .tip_box {
    display: inline-block;
    width: fit-content !important;
    min-width: 105px;
    color: red;
    font-weight: 700;
    position: relative;
    top: 1px;
    margin-left: 33px;
    font-size: 17px;
  }

  /deep/ .el-input__inner {
    margin-left: 3px !important;
    padding: 0 !important;
    width: 44px !important;
    height: 25px !important;
    text-align: center !important;
  }

  .dia_box {
    /deep/ .el-input {
      text-align: left;

      .el-input__inner {
        width: 300px !important;
        height: 35px !important;
        text-align: left !important;
      }
    }
  }
}
</style>
