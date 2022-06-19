<template >
  <div class="app-container">
    <el-row type="flex" justify="space-around" style="align-items: center">

      <el-col :span="22" >
        <el-dropdown trigger="click">
          <span class="el-dropdown-link"><i class="el-icon-more-outline" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button type="text" @click="() => append()">权限</el-button></el-dropdown-item>
            <el-dropdown-item>统计</el-dropdown-item>
            <el-dropdown-item>回收站</el-dropdown-item>
            <el-dropdown-item divided>重命名版本号</el-dropdown-item>
            <el-dropdown-item>删除版本号</el-dropdown-item>
            <el-dropdown-item>更多设置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <h2 align="center">{{ this.parentCategory }}</h2>

    <el-row type="flex" justify="space-around" style="align-items: center">
      <el-col :span="20"><h4>目录</h4></el-col>
      <el-col :span="1" ><el-button type="text">暂存箱</el-button></el-col>
      <el-col :span="1" ><el-button type="text">目录管理</el-button></el-col>
    </el-row>

    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="menuData"
          node-key="id"
          empty-text="没有数据，点击上方按钮添加数据"
          default-expand-all
          :highlight-current=true
          :expand-on-click-node=false
          @node-drop="handleDrop"
          ref="selectTree"
          draggable
          @node-click="nodeclick"
          :check-on-click-node=true
          :allow-drop="allowDrop"
          :allow-drag="allowDrag">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 如果是编辑状态 -->
            <template v-if="data.isEdit==1">
              <el-input ref="input"
                        @blur="() => submitEdit(node,data)"
                        v-model="newtitle"
                        style="height:20px; line-height:20px"></el-input>
            </template>
            <!-- 如果不是编辑状态 -->
            <span v-else v-text="data.title"></span>
            <span>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link"><i class="el-icon-plus" /></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text" @click="() => append(node,data)">新建文档</el-button></el-dropdown-item>
                  <el-dropdown-item>新建表格</el-dropdown-item>
                  <el-dropdown-item>新建画板</el-dropdown-item>
                  <el-dropdown-item divided>从模板新建</el-dropdown-item>
                  <el-dropdown-item>导入</el-dropdown-item>
                  <el-dropdown-item divided>新建分组</el-dropdown-item>
                  <el-dropdown-item>添加链接</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown trigger="click">
                <span class="el-dropdown-link"><i class="el-icon-more" /></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text" @click="() => edit(node,data)">重命名</el-button></el-dropdown-item>
                  <el-dropdown-item>编辑文档</el-dropdown-item>
                  <el-dropdown-item>复制</el-dropdown-item>
                  <el-dropdown-item>移动</el-dropdown-item>
                  <el-dropdown-item>导出</el-dropdown-item>
                  <el-dropdown-item divided>移至暂存箱</el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="() => remove(node, data)">删除</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <el-footer align="center">这是底部</el-footer>
  </div>
</template>

<script>
import docApi from '@/api/doc'

export default {
  data() {
    return {
      menuData: [],
      newtitle: '',
      currentRow: {
        title: '',
        content: '',
        id: ''
      },
      defaultProps: {
        children: 'children',
        title: 'title'
      },
      showCheckbox: true,
      isExpand: true,
      parentCategory: ''
    }
  },
  created() {
    this.listMenuById(this.$route.params.versionId)
    this.listParentCategoryById(this.$route.params.versionId)
  },
  methods: {

    // 调api获取接口分组数据
    listMenuById(id) {
      docApi.listMenuById(id).then(response => {
        this.menuData = response.data.docMenu
      })
    },

    listParentCategoryById(id) {
      this.parentCategory = docApi.listParentCategoryById(id).then(response => {
        this.parentCategory = response.data.docPath
      })
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      let updateData = {}
      updateData.id = draggingNode.data.id
      updateData.destId = dropNode.data.id
      updateData.method = dropType
      docApi.update(updateData)
    },
    allowDrop() {
      return true
    },
    allowDrag() {
      return true
    },
    expandOnClickNode() {
      return true
    },

    append(node, data) {
      var timestamp = new Date().getTime()
      const newRow = {
        id: timestamp,
        isEdit: 0,
        title: 'T' + timestamp,
        children: []
      }
      var savedata = {}
      savedata.id = timestamp
      savedata.title = 'T' + timestamp
      savedata.type = 'menu'
      if (typeof(data) == "undefined") {
        savedata.parentId = this.$route.params.versionId
        docApi.save(savedata)
        this.menuData.unshift(newRow)
      } else {
        savedata.parentId = data.id
        docApi.save(savedata)

        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.unshift(newRow)
      }
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      docApi.remove(data.id)
    },

    edit(node, data) {
      this.$set(data, 'isEdit', 1)
      this.newtitle = data.title
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    submitEdit(node, data) {
      // console.log('点击了保存按钮')
      if (data.title == this.newtitle) {
        console.log('没有修改')
        this.newtitle = ''
        this.$set(data, 'isEdit', 0)
      } else {
        this.$set(data, 'title', this.newtitle)
        this.newtitle = ''
        this.$set(data, 'isEdit', 0)

        docApi.update(data)
      }
    },

    nodeclick(node, data, obj) {
      this.$router.push('/doc/detail/' + this.$route.params.versionId + '/' + node.id)
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 20px;
}
/* 修改el-input高度，方案一： */
/* 某些预处理器(sass)无法识别>>>，建议使用方案二 */
/* >>> .el-input__inner {
  height: 20px;
} */
/* 修改el-input高度，方案二： */
/deep/ .el-input__inner {
  height: 20px;
}

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
