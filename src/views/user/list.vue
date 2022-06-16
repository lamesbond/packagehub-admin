<template>
  <div class="app-container">
    <el-button type="primary" size="mini" @click="handleAddUser">添加用户</el-button>
    <!-- 列表 -->
    <el-table
      ref="treeTable"
      :data="tableData"
      row-key="id"
      border
      stripe
      size="mini"
      class="data-table"
      tooltip-effect="dark"
      header-row-class-name="data-table-header"
      :show-overflow-tooltip="true"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop='name' label="用户名" width="260"></el-table-column>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="status" label="状态" />

      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button >发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <span class="demonstration">完整功能</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <!-- 编辑回显的弹框  其实新增也可以用这个弹框但是没写 -->
    <el-dialog title="用户表单" class="dia_box" :visible.sync="dialogFlag" width="500px">

      <el-form :model="formData">
        <el-form-item label="用户名" label-width="128px">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="128px">
          <el-input v-model="formData.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="128px">
          <el-input v-model="formData.description" autocomplete="on"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmitRow">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/core/user'

export default {
  name: "",
  data() {
    return {
      currentPage: 2,
      pageTotal: null,
      tableData: [
      ], // 列表
      dialogFlag: false,
      formData: {
        id: null,
        parentId: '0',
        department: '',
        description: '',
        type: '0',
        pubStatus: '0'
      },
      currentRow: {
        status: '',
        index: ''
      },
      row: {}
      // ref: 'treeTable',
      // treeTable: [],
    }
  },

  created() {
    this.fetchData(1,10)
  },

  methods: {

    fetchData(current,size) {
      userApi.getPage(current,size).then(response => {
        this.tableData = response.data.User.records
        this.pageTotal = response.data.User.total
      })
    },

    handleAddUser(){
      this.formData = {}
      var timestamp = new Date().getTime()
      this.formData.id = timestamp
      this.formData.parentId = '0'
      this.formData.pubStatus = '0'
      this.formData.type = 'project'

      this.currentRow.status = 'addProject'
      this.dialogFlag = true
    },

    handleEditRow(row, index) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.row = row
      this.currentRow.status = 'editRow'
      this.currentRow.index = index
      this.dialogFlag = true
    },

    async handleDelRow(row,index) {
      console.log("开始删节点了")
      await userApi.remove(row.id)
      console.log("已经提交后台了")
      await userApi.listChildCategoryById(row.parentId).then(response => {
        this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, row.parentId, response.data.childList)
      })
    },

    handlePublish(row, index, pubStatus) {
      let data = {}
      this.$set(row, 'pubStatus', pubStatus)
      data.id = row.id
      data.pubStatus = pubStatus
      userApi.update(data)
    },

    async handleSubmitRow() {
      let data = this.formData
      let currentRow = this.currentRow
      if (currentRow.status == 'addProject') {
        console.log("新增project，父id是：" + '0')
        await userApi.save(data)
        this.tableData.unshift(data)
      } else if (currentRow.status == 'addRow'){
        console.log("新增category，父id是：" + data.parentId)
        await userApi.save(data)
        await userApi.listChildCategoryById(this.row.id).then(response => {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, this.row.id, response.data.childList)
        })
        this.$refs.treeTable.toggleRowExpansion(this.row, true);
      } else if (currentRow.status == 'editRow'){
        console.log("编辑category，父id是：" + data.parentId)
        await userApi.update(data)
        this.$set(this.row, 'title', this.formData.title)
        this.$set(this.row, 'department', this.formData.department)
        this.$set(this.row, 'description', this.formData.description)
      } else {
        console.log("你想干嘛？")
      }

      this.dialogFlag = false
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
