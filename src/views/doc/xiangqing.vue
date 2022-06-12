<template>
  <div class="custom-tree-container">
    <h1>idea</h1>
    <div class="block" style="width:300px">
      <el-button @click="forArr(data, isExpand)">{{isExpand ? "展开":"折叠"}}</el-button>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="true"
        show-checkbox
        check-strictly
        @node-click="nodeclick"
        @node-drop="handleDrop"
        ref="selectTree"
        draggable
        check-on-click-node="true"
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
                <el-button type="text" @click="() => append(node,data)">新建文档</el-button>
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
                <el-button v-if="data.id!=1" type="text" @click="() => edit(node,data)">重命名</el-button>
                <el-dropdown-item>编辑文档</el-dropdown-item>
                <el-dropdown-item>复制</el-dropdown-item>
                <el-dropdown-item>移动</el-dropdown-item>
                <el-dropdown-item>导出</el-dropdown-item>
                <el-dropdown-item divided>移至暂存箱</el-dropdown-item>
                <el-button v-if="data.id!=1" type="text" @click="() => remove(node, data)">   删除</el-button>
              </el-dropdown-menu>
            </el-dropdown>
<!--            <el-button v-if="data.id!=1" type="text" size="mini" @click="() => edit(node,data)">E</el-button>-->
<!--            <el-button type="text" size="mini" @click="() => append(node,data)">+</el-button>-->
<!--            <el-button v-if="data.id!=1" type="text" size="mini" @click="() => remove(node, data)">D</el-button>-->
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import docApi from '@/api/core/doc'

export default {
  data () {
    return {
      data: [],
      newtitle: '',
      defaultProps: {
        children: 'children',
        title: 'title'
      },
      showCheckbox: true,
      isExpand: true
    }
  },
  created () {
    // 创建时初始化signalList的值，也可以是一个方法
    // 或者在某事件触发时改变signalList的值，树会随之改变
    this.listMenuById(this.$route.params.id)
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data);
      console.log("idchecked::"+checked);
      console.log(indeterminate);
    },
    forArr(arr, isExpand) {
      let self = this;
      this.isExpand = !this.isExpand;
      arr.forEach((el) => {
        self.$refs.selectTree.store.nodesMap[el.id].expanded = isExpand;
        if(el.children){
          self.forArr(el.children, isExpand);
        }
      });
    },

    // 调api获取接口分组数据
    listMenuById(id) {
      docApi.listMenuById(id).then(response => {
        this.data = response.data.docMenu
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
      docApi.updateDocPosition(updateData)
    },
    allowDrop(draggingNode, dropNode, type) {
      return true
      // if (dropNode.data.id === 1) {
      //   return false
      // } else {
      //   return true
      // }
    },
    allowDrag(draggingNode) {
      return true
      // 顶层默认分组不允许拖拽
      // if (draggingNode.data.id === 1) {
      //   return false
      // } else {
      //   return true
      // }
      // return draggingNode.data.title.indexOf('三级 3-2-2') === -1
    },

    append(node, data) {
      // var pid = data.parentApiGroupId + ':' + data.id
      var timestamp = new Date().getTime()
      const newChild = {
        id: timestamp,
        isEdit: 0,
        title: 'T' + timestamp,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      // console.log("要增加的数据是：",data)
      var savedata = {}
      savedata.id = timestamp
      savedata.parentId = data.id
      savedata.title = 'T' + timestamp
      console.log("要增加的数据是：",savedata)
      docApi.save(savedata)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      docApi.removeById(data.id)
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
      this.$store.dispatch('appium/changeApiGroupId', node.id)
      console.log(this.$store.getters.apiGroupId)
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
</style>
