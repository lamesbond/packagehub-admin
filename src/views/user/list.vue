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
      <el-table-column prop='username' label="用户名" width="260"></el-table-column>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="roles" label="角色" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="" size="mini">正常</el-tag>
          <el-tag v-else type="warning" size="mini">被锁</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditRow(scope.row, scope.$index)">编辑</el-button>
          <el-button v-if="scope.row.status == 1" type="primary" size="mini" @click="lock(scope.row.id, 0)">锁定</el-button>
          <el-button v-else type="danger" size="mini" @click="lock(scope.row.id, 1)">解锁</el-button>
          <el-button type="danger" size="mini" @click="handleDelRow(scope.row.id)">删除</el-button>
          <el-button type="primary" size="mini"><router-link :to="'/user/auth/' + scope.row.id">授权</router-link></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageLimit"
        :total="pageTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        >
      </el-pagination>
    </div>

    <!-- 编辑回显的弹框  其实新增也可以用这个弹框但是没写 -->
    <el-dialog title="用户表单" class="dia_box" :visible.sync="dialogFlag" width="500px">

      <el-form :model="formData">
        <el-form-item label="用户名" label-width="128px">
          <el-input v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="128px">
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="128px">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="128px">
          <el-input v-model="formData.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="128px">
          <el-radio v-model="formData.roles" label="admin">管理员</el-radio>
          <el-radio v-model="formData.roles" label="uploader">上传者</el-radio>
          <el-radio v-model="formData.roles" label="client">客户</el-radio>
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
import userApi from '@/api/user'

export default {
  name: "",
  data() {
    return {
      currentPage: 1,
      pageTotal: 0,
      pageLimit: 10,
      tableData: [
      ], // 列表
      dialogFlag: false,
      formData: {
        id: null,
        username: '',
        password: '',
        email: '',
        department: '',
        role: '0',
        status: '0'
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
    this.fetchData()
  },

  methods: {

    fetchData() {
      userApi.selectPage(this.currentPage,this.pageLimit).then(response => {
        this.tableData = response.data.User.records
        this.pageTotal = response.data.User.total
      })
    },

    handleAddUser(){
      this.formData = {}
      var timestamp = new Date().getTime()
      this.formData.id = timestamp

      this.currentRow.status = 'addUser'
      this.dialogFlag = true
    },

    handleEditRow(row, index) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.row = row
      this.currentRow.status = 'editUser'
      this.currentRow.index = index
      this.dialogFlag = true
    },

    async handleDelRow(id) {
      console.log("开始删节点了")
      await userApi.remove(id)
      console.log("已经提交后台了")
      await this.fetchData()
    },

    async handleSubmitRow() {
      let data = this.formData
      let currentRow = this.currentRow
      if (currentRow.status == 'addUser') {
        await userApi.save(data)
        this.tableData.unshift(data)
      } else if (currentRow.status == 'editUser'){
        await userApi.update(data)
        this.fetchData()
      } else {
        console.log("你想干嘛？")
      }

      this.dialogFlag = false
    },

    handleSizeChange(val) {
      this.pageLimit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    lock(id, status) {
      let data = {}
      data.id = id
      data.status = status
      userApi.update(data).then(response => {
        this.$message.success(response.message)
        this.fetchData()
      })
    },
  }
}
</script>

<style lang="less" scoped>

</style>
