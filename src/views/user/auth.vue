<template>
  <div class="app-container">
    <el-container>
      <el-aside width="1200px">
        <h1>项目授权</h1>
        <el-table
          ref="treeTable"
          :data="projetcTable"
          row-key="id"
          border
          stripe
          size="mini"
          class="data-table"
          tooltip-effect="dark"
          header-row-class-name="data-table-header"
          lazy
          @select="handleSelectProject"
          :show-overflow-tooltip="true"
          :load="projectLoad"
          :tree-props="{children:'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
          <el-table-column prop="name" label="项目分类列表" width="260">
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
        </el-table>
        <h1>文档授权</h1>
        <el-table
          ref="treeTable"
          :data="docTable"
          row-key="id"
          border
          stripe
          size="mini"
          class="data-table"
          tooltip-effect="dark"
          header-row-class-name="data-table-header"
          lazy
          @select="handleSelectDoc"
          :show-overflow-tooltip="true"
          :load="docLoad"
          :tree-props="{children:'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
          <el-table-column prop="title" label="文档列表" width="260"></el-table-column>
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="description" label="文档描述" />
          <el-table-column prop="type" label="类型" />
          <el-table-column label="发布状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pubStatus == '0'" type="danger" size="mini">未发布</el-tag>
              <el-tag v-else type="success" size="mini">已发布</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>

      <el-main>
        <el-button type="primary" round @click="save">保存</el-button>
        <h1>已选择项目</h1>
        <el-tag
          :key="tag"
          v-for="tag in this.selectedProject"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag.name}}
        </el-tag>

        <h1>已选择文档</h1>
        <el-tag
          :key="tag"
          v-for="tag in this.selectedDoc"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag.title}}
        </el-tag>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import projectApi from "@/api/project";
import docApi from "@/api/doc";
import userApi from '@/api/user'
import cookies from "vue-cookies";

export default {
  name: "",
  data() {
    return {
      projetcTable: [], // 列表
      docTable: [], // 列表
      selectedProject: [],
      selectedDoc: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      projectApi.listNextChildNode(0, cookies.get("packagehub-token").slice(10)).then(response => {
        this.projetcTable = response.data.childList
      })
      docApi.listNextChildNode(0, cookies.get("packagehub-token").slice(10)).then(response => {
        this.docTable = response.data.childList
      })
    },
    // 加载列表数据
    projectLoad(tree, treeNode, resolve) {
      projectApi.listNextChildNode(tree.id, cookies.get("packagehub-token").slice(10)).then(response => {
        resolve(response.data.childList)
      })
    },
    // 加载列表数据
    docLoad(tree, treeNode, resolve) {
      docApi.listNextChildNode(tree.id, cookies.get("packagehub-token").slice(10)).then(response => {
        resolve(response.data.childList)
      })
    },

    handleSelectProject(selection, row) {
      console.log("先择的project是：" + selection + row.name)
      this.selectedProject = selection
    },

    handleSelectDoc(selection, row) {
      console.log("先择的doc是：" + selection + row.title)
      this.selectedDoc = selection
    },

    handleClose(tag) {
      console.log("quxiaozuxnaz")
    },

    checkSelectable(row) {
      return row.type == 'project' || row.type == 'doc'
    },

    save() {
      let projectList = []
      let docList = []
      let authData = {}
      for (var i =0; i < this.selectedProject.length; i++) {
        console.log(this.selectedProject[i].id)
        projectList.push(this.selectedProject[i].id)
      }
      for (var i =0; i < this.selectedDoc.length; i++) {
        console.log(this.selectedDoc[i].id)
        docList.push(this.selectedDoc[i].id)
      }
      authData.userId = this.$route.params.id
      authData.projectList = projectList
      authData.docList = docList
      userApi.auth(authData)
    }
  }
}
</script>

<style scoped>

</style>
