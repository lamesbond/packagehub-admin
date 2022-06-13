<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-container>
      <el-aside width="300px" style="height:100%; background-color: rgb(238, 241, 246)">
        <el-row type="flex" justify="space-around" style="align-items: center">
          <el-col :span="22"><h3>{{ this.parentCategory }}</h3></el-col>
          <el-col :span="1" >
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"><i class="el-icon-plus" /></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" @click="() => append()">新建文档</el-button></el-dropdown-item>
                <el-dropdown-item>新建表格</el-dropdown-item>
                <el-dropdown-item>新建画板</el-dropdown-item>
                <el-dropdown-item divided>从模板新建</el-dropdown-item>
                <el-dropdown-item>导入</el-dropdown-item>
                <el-dropdown-item divided>新建分组</el-dropdown-item>
                <el-dropdown-item>添加链接</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-around" style="align-items: center">
          <el-col :span="20"><h4>目录</h4></el-col>
          <el-col :span="1" ><span class="el-dropdown-link"><i class="el-icon-s-operation" /></span></el-col>
          <el-col :span="1" ><span class="el-dropdown-link"><i class="el-icon-search" /></span></el-col>
          <el-col :span="1">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"><i class="el-icon-more" /></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><el-button type="text" >目录管理</el-button></el-dropdown-item>
                <el-dropdown-item>知识库设置</el-dropdown-item>
                <el-dropdown-item divided>导出知识库</el-dropdown-item>
                <el-dropdown-item>回收站</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
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
                            style="height:20px line-height:20px"></el-input>
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
      </el-aside>
      <el-container>
        <el-header>
          <el-row type="flex" justify="space-around" style="align-items: center">
            <el-col :span="5"><span><h4>{{ this.currentTitle }}</h4></span></el-col>
            <el-col :span="1"><span><i class="el-icon-search" /></span></el-col>
            <el-col :span="5"><el-button>分享</el-button></el-col>
            <el-col :span="5"><el-button>编辑</el-button></el-col>
            <el-col :span="1">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link"><i class="el-icon-more-outline" /></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text" >翻译</el-button></el-dropdown-item>
                  <el-dropdown-item>移动</el-dropdown-item>
                  <el-dropdown-item divided>复制</el-dropdown-item>
                  <el-dropdown-item>全屏</el-dropdown-item>
                  <el-dropdown-item><i class="el-icon-printer" /> 打印</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <wangEditor :myContent="this.currentContent" />
        </el-main>
        <el-footer>这是底部</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import docApi from '@/api/core/doc'
import wangEditor from '@/components/WangEditor'
export default {
  components: {
    wangEditor
  },
  data () {
    return {
      menuData: [],
      newtitle: '',
      currentTitle: '',
      currentContent: '',
      defaultProps: {
        children: 'children',
        title: 'title'
      },
      showCheckbox: true,
      isExpand: true,
      parentCategory: ''
    }
  },
  created () {
    this.listMenuById(this.$route.params.id)
    this.listParentCategoryById(this.$route.params.id)
  },
  methods: {
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data);
    //   console.log("idchecked::"+checked);
    //   console.log(indeterminate);
    // },
    // forArr(arr, isExpand) {
    //   let self = this;
    //   this.isExpand = !this.isExpand;
    //   arr.forEach((el) => {
    //     self.$refs.selectTree.store.nodesMap[el.id].expanded = isExpand;
    //     if(el.children){
    //       self.forArr(el.children, isExpand);
    //     }
    //   });
    // },

    // 调api获取接口分组数据
    listMenuById(id) {
      docApi.listMenuById(id).then(response => {
        this.menuData = response.data.docMenu
      })
    },
    // handleDragStart(node, ev) {
    //   console.log('drag start', node.data.title)
    // },
    // handleDragEnter(draggingNode, dropNode, ev) {
    //   console.log('tree drag enter: ', dropNode.data.title)
    // },
    // handleDragLeave(draggingNode, dropNode, ev) {
    //   console.log('tree drag leave: ', dropNode.data.title)
    // },
    // handleDragOver(draggingNode, dropNode, ev) {
    //   console.log('tree drag over: ', dropNode.data.title)
    // },
    // handleDragEnd(draggingNode, dropNode, dropType, ev) {
    //   console.log(
    //     'tree drag end: ',
    //     "handleDragEnddraggingNode: ",draggingNode,
    //     "dropNode:",dropNode,
    //     "标题",dropNode.data.title,
    //     "dropType",dropType,
    //     "ev",ev
    //   )
    //   // 调后端更新
    //   this.updateApiGroup(this.data)
    // },
    listParentCategoryById(id) {
      this.parentCategory = docApi.listParentCategoryById(id).then(response => {
        this.parentCategory = response.data.docPath
      })
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag drop: ',
        "源节点标题: ",draggingNode.data.title,
        "目标标题",dropNode.data.title,
        "dropType",dropType,
        "ev",ev
      )
      let updateData = {}
      updateData.id = draggingNode.data.id
      updateData.destId = dropNode.data.id
      updateData.method = dropType
      docApi.update(updateData)
    },
    allowDrop(draggingNode, dropNode, type) {
      return true
    },
    allowDrag(draggingNode) {
      return true
    },
    expandOnClickNode(){
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
      if (typeof(data) == "undefined") {
        console.log("data无值，添加顶级节点")
        savedata.parentId = this.$route.params.id
        console.log("要增加的数据是：",savedata)
        docApi.save(savedata)

        this.menuData.unshift(newRow)
      } else {
        console.log("data有值，添加子节点")
        savedata.parentId = data.id
        console.log("要增加的数据是：",savedata)
        docApi.save(savedata)

        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.unshift(newRow)
      }
      // var pid = data.parentApiGroupId + ':' + data.id

    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      docApi.remove(data.id)
    },

    edit(node, data) {
      console.log(
        'before:',
        data.id,
        // data.parentApiGroupId,
        data.title,
        data.isEdit
      )
      this.$set(data, 'isEdit', 1)
      this.newtitle = data.title
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      console.log('after:', data.id, data.title, data.isEdit)
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
        // console.log('after:', data.id, data.title)
        console.log("修改过后的data：",data.id, data.title)
        docApi.update(data)
      }
    },

    cancelEdit(node, data) {
      // console.log('放弃编辑')
      // console.log(data.id, data.title)
      this.newtitle = ''
      this.$set(data, 'isEdit', 0)
    },

    updateDoc(data) {
      console.log(data)
      docApi.update(data)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },

    nodeclick(node, data, obj) {
      console.log('点击了：', node.id, node.title)
      this.currentTitle = node.title
      this.currentContent = node.content
      // this.$store.dispatch('appium/changeApiGroupId', node.id)
      console.log(this.currentContent)
    },
  },
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
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
