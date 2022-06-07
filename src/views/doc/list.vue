<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table :data="list" border row-key="id" lazy :load="load">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="docTitle" label="文档列表" width="260" />
      <el-table-column prop="amount" label="部门" />
      <el-table-column prop="period" label="项目描述" />
      <el-table-column prop="param.status" label="发布状态" />

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            <router-link :to="'/doc/detail/' + scope.row.id">
              查看
            </router-link>
          </el-button>

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
      docApi.listProjectById(0).then(response => {
        this.list = response.data.list
      })
    },
    // 加载列表数据
    load(tree, treeNode, resolve) {
      docApi.listProjectById(tree.id).then(response => {
        resolve(response.data.list)
      })
    }
  }
}
</script>

<style scoped>

</style>
