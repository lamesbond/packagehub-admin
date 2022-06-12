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
      <el-table-column label="文档列表" width="260">
        <template slot-scope="scope">
          <span class="showName">{{ scope.row.title }}</span>
          <el-tooltip class="item" effect="dark" content="添加子分类" placement="top">
            <i v-if="scope.row.isDoc !=='1'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;"
               class="el-icon-folder-add" @click="handleAddRow(scope.row,scope.$index,'0',)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加发行版本" placement="top">
            <i v-if="scope.row.isDoc !=='1'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;"
               class="el-icon-document-add" @click="handleAddRow(scope.row,scope.$index,'1','新版本')"></i>
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
      <el-table-column label="发布状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pubStatus === '0'" type="danger" size="mini">未发布</el-tag>
          <el-tag v-else type="success" size="mini">已发布</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            <router-link :to="'/doc/detail/' + scope.row.id">查看/编辑</router-link>
          </el-button>
          <el-button v-if="scope.row.pubStatus == '1'" type="danger" size="mini" @click="handlePublish(scope.row.id, 0)">下架</el-button>
          <el-button v-else type="primary" size="mini" @click="handlePublish(scope.row.id, 1)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑回显的弹框  其实新增也可以用这个弹框但是没写 -->
    <el-dialog title="提示" class="dia_box" :visible.sync="dialogFlag" width="500px">

      <el-form :model="formData">
        <el-form-item label="标题" label-width="128px">
          <el-input v-model="formData.title" autocomplete="off"></el-input>
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
import docApi from '@/api/core/doc'

export default {
  name: "",
  data() {
    return {
      tableData: [
        {
          pubStatus: ''
        }
      ], // 列表
      dialogFlag: false,
      formData: {
        id: null,
        parentId: '0',
        department: '',
        description: '',
        isDoc: '0',
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
      docApi.listChildCategoryById(0).then(response => {
        this.tableData = response.data.childList
      })
    },
    // 加载列表数据
    load(tree, treeNode, resolve) {
      docApi.listChildCategoryById(tree.id).then(response => {
        resolve(response.data.childList)
      })
    },

    handleAddProject(){
      this.formData = {}
      var timestamp = new Date().getTime()
      this.formData.id = timestamp
      this.formData.parentId = '0'
      this.formData.pubStatus = '0'
      this.formData.isDoc = '0'

      this.currentRow.status = 'addProject'
      this.dialogFlag = true
    },

    handleAddRow(row,index,isDoc) {
      var timestamp = new Date().getTime()
      this.formData = {}
      this.formData.id = timestamp
      this.formData.parentId = row.id
      this.formData.pubStatus = '0'
      this.formData.isDoc = isDoc
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
      await docApi.remove(row.id)
      await docApi.listChildCategoryById(0).then(response => {
        this.tableData = response.data.childList
        this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, 0, response.data.childList)
      })
    },

    handlePublish(id, pubStatus) {
      console.log("发布的id是" + id)
      let data = {}
      data.id = id
      data.pubStatus = pubStatus
      docApi.update(data)
      /// index为索引
      this.$set(this.tableData[id], pubStatus, '0')
    },

    async handleSubmitRow() {
      let data = this.formData
      let currentRow = this.currentRow
      if (currentRow.status == 'addProject') {
        console.log("新增project，父id是：" + '0')
        await docApi.save(data)
        this.tableData.unshift(data)
      } else if (currentRow.status == 'addRow'){
        console.log("新增category，父id是：" + data.parentId)
        await docApi.save(data)
        await docApi.listChildCategoryById(this.row.id).then(response => {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, this.row.id, response.data.childList)
        })
        this.$refs.treeTable.toggleRowExpansion(this.row, true);
      } else if (currentRow.status == 'editRow'){
        console.log("编辑category，父id是：" + data.parentId)
        await docApi.update(data)
        // this.$set(this.tableData, currentRow.index, this.row)
        await docApi.listChildCategoryById(this.row.parentId).then(response => {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, this.row.parentId, response.data.childList)
        })
      } else {
        console.log("你想干嘛？")
      }

      this.dialogFlag = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
