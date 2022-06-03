<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table :data="list" border row-key="id" lazy :load="load">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="docTitle" label="文档标题" width="160" />
      <el-table-column prop="amount" label="标的金额" />
      <el-table-column prop="period" label="投资期数" />
      <el-table-column prop="param.returnMethod" label="还款方式" />
      <el-table-column prop="param.status" label="状态" />

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            <router-link :to="'/doc/detail/' + scope.row.id">
              查看
            </router-link>
          </el-button>

          <el-button
            v-if="scope.row.status == 1"
            type="warning"
            size="mini"
            @click="makeLoan(scope.row.id)"
          >
            放款
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
      docApi.listByParentId(0).then(response => {
        this.list = response.data.list
      })
    },
    // 加载列表数据
    load(tree, treeNode, resolve) {
      docApi.listByParentId(tree.id).then(response => {
        resolve(response.data.list)
      })
    },

    makeLoan(id) {
      this.$confirm('确定放款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return docApi.makeLoan(id)
        })
        .then(response => {
          //放款成功则重新获取数据列表
          this.fetchData()
          this.$message({
            type: 'success',
            message: response.message
          })
        })
        .catch(error => {
          console.log('取消', error)
          if (error === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消放款'
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
