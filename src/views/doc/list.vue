<template>
  <div class="app-container">
    <el-button type="primary" size="mini" @click="addProject()">添加项目</el-button>
    <!-- 列表 -->
    <el-table :data="list" height="250" border row-key="id" lazy :load="load">
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
              <el-button type="primary" size="mini" @click="addCategory(scope.row.id,index)">添加分类</el-button>
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

    addCategory(id,index) {
      var timestamp = new Date().getTime()
      console.log("addCategory的index："+index)
      const newCategory = {
        id: timestamp,
        parentId: id,
        isEdit: 0,
        isDoc: 0,
        docTitle: '新分类',
        children: []
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

<style scoped>

</style>
