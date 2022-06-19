<template>
  <div class="app-container">
    <el-button type="primary" size="mini" @click="handleAddProject">添加项目</el-button>
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
      lazy
      :show-overflow-tooltip="true"
      :load="load"
      :tree-props="{children:'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="项目分类列表" width="260">
        <template slot-scope="scope">
          <span class="showName">{{ scope.row.name }}</span>
          <el-tooltip class="item" effect="dark" content="添加子分类" placement="top">
            <i v-if="scope.row.type =='project' || scope.row.type =='category'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;"
               class="el-icon-folder-add" @click="handleAddRow(scope.row,scope.$index,'category')"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加发行版本" placement="top">
            <i v-if="scope.row.type =='project' || scope.row.type =='category'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;"
               class="el-icon-document-add" @click="handleAddRow(scope.row,scope.$index,'release_version')"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <i style="font-size:18px;margin-left:5px;color:#f1ff;cursor: pointer;"
               class="el-icon-edit" @click="handleEditRow(scope.row,scope.$index)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除此节点及所有子节点" placement="top">
            <i style="font-size:18px;margin-left:5px;color:#1890FF;cursor: pointer;"
               type="primary" class="el-icon-close" @click="handleDelRow(scope.row,scope.$index)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="description" label="项目描述" />
      <el-table-column prop="releaseNote" label="发行日志" />
      <el-table-column prop="type" label="类型" />
      <el-table-column label="发布状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pubStatus == '0'" type="danger" size="mini">未发布</el-tag>
          <el-tag v-else type="success" size="mini">已发布</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type == 'release_version'" type="primary" size="mini">
            <router-link :to="'/project/edit/' + scope.row.id">查看/编辑</router-link>
          </el-button>
          <el-button v-if="scope.row.pubStatus == '1'" type="danger" size="mini" @click="handlePublish(scope.row, scope.$index, 0)">下架</el-button>
          <el-button v-else type="primary" size="mini" @click="handlePublish(scope.row, scope.$index, 1)">发布</el-button>
          <el-button v-if="scope.row.type == 'file'" type="primary" size="mini">
            <a @click="handleDownload(scope.row.name, scope.row.url, 1)">下载</a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑回显的弹框  其实新增也可以用这个弹框但是没写 -->
    <el-dialog title="提示" class="dia_box" :visible.sync="dialogFlag" width="500px">

      <el-form :model="formData">
        <el-form-item label="标题" label-width="128px">
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
import projectApi from '@/api/project'
import cookies from "vue-cookies";

export default {
  name: "",
  data() {
    return {
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
    this.fetchData()
  },

  methods: {

    fetchData() {
      projectApi.listChildCategoryById(0, cookies.get("packagehub-token").slice(10)).then(response => {
        this.tableData = response.data.childList
      })
    },
    // 加载列表数据
    load(tree, treeNode, resolve) {
      projectApi.listChildCategoryById(tree.id, cookies.get("packagehub-token").slice(10)).then(response => {
        resolve(response.data.childList)
      })
    },

    handleAddProject(){
      this.formData = {}
      var timestamp = new Date().getTime()
      this.formData.id = timestamp
      this.formData.parentId = '0'
      this.formData.pubStatus = '0'
      this.formData.type = 'project'

      this.currentRow.status = 'addProject'
      this.dialogFlag = true
    },

    handleAddRow(row,index,type) {
      var timestamp = new Date().getTime()
      this.formData = {}
      this.formData.id = timestamp
      this.formData.parentId = row.id
      this.formData.pubStatus = '0'
      this.formData.type = type
      this.formData.department = row.department

      this.row = row
      this.currentRow.status = 'addRow'
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
      await projectApi.remove(row.id)
      console.log("已经提交后台了")
      await projectApi.listChildCategoryById(row.parentId).then(response => {
        this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, row.parentId, response.data.childList)
      })
    },

    handlePublish(row, index, pubStatus) {
      let data = {}
      this.$set(row, 'pubStatus', pubStatus)
      data.id = row.id
      data.pubStatus = pubStatus
      projectApi.update(data)
    },

    async handleSubmitRow() {
      let data = this.formData
      data.userId = cookies.get("packagehub-token").slice(10)
      let currentRow = this.currentRow
      if (currentRow.status == 'addProject') {
        console.log("新增project，父id是：" + '0')
        await projectApi.save(data)
        this.tableData.unshift(data)
      } else if (currentRow.status == 'addRow'){
        console.log("新增category，父id是：" + data.parentId)
        await projectApi.save(data)
        await projectApi.listChildCategoryById(this.row.id).then(response => {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, this.row.id, response.data.childList)
        })
        this.$refs.treeTable.toggleRowExpansion(this.row, true);
      } else if (currentRow.status == 'editRow'){
        console.log("编辑category，父id是：" + data.parentId)
        await projectApi.update(data)
        this.$set(this.row, 'title', this.formData.title)
        this.$set(this.row, 'department', this.formData.department)
        this.$set(this.row, 'description', this.formData.description)
      } else {
        console.log("你想干嘛？")
      }

      this.dialogFlag = false
    },

    handleDownload(name,url) {
      var a = document.createElement('a');
      var event = new MouseEvent('click');
      a.download = name;
      a.href = url;
      a.dispatchEvent(event);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
