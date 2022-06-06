<template>
  <div class="custom-tree-container">
    <div class="block" style="width:300px">
      <p>使用 scoped slot</p>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="nodeclick"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <!-- 如果是编辑状态 -->
          <template v-if="data.isEdit==1">
            <el-input ref="input"
                      @blur="() => submitEdit(node,data)"
                      v-model="newdocTitle"
                      style="height:20px line-height:20px"></el-input>
            <!-- 放弃、提交按钮废弃，改为失去焦点自动提交 -->
            <!-- <el-button type="text"
              size="mini"
              @click="() => cancelEdit(node,data)">C</el-button>
            <el-button type="text"
              size="mini"
              @click="() => submitEdit(node,data)">S</el-button> -->
          </template>
          <!-- 如果不是编辑状态 -->
          <span v-else
                v-text="data.docTitle"></span>
          <span>
            <el-button v-if="data.id!=1" type="text" size="mini" @click="() => edit(node,data)">E</el-button>
            <el-button type="text" size="mini" @click="() => append(node,data)">+</el-button>
            <el-button v-if="data.id!=1" type="text" size="mini" @click="() => remove(node, data)">D</el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import { showMenu } from '@/api/tmp/appium'
import { updateApiGroup } from '@/api/tmp/appium'

// let id = 1000
export default {
  name: '',
  data() {
    return {
      data: [],
      newdocTitle: '',
      defaultProps: {
        children: 'children',
        docTitle: 'docTitle'
      }
    }
  },
  created() {
    this.getMenuData()
  },
  methods: {
    // 调api获取接口分组数据
    getMenuData() {
      showMenu(1)
        .then(response => {
          this.data = response.data.docMenu
          console.log('data:', this.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDragStart(node, ev) {
      console.log('drag start', node.data.docTitle)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.data.docTitle)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.data.docTitle)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.data.docTitle)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag end: ',
        dropNode && dropNode.data.docTitle,
        dropType
      )
      // 调后端更新
      this.updateApiGroup(this.data)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.data.docTitle, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.id === 1) {
        return false
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      // 顶层默认分组不允许拖拽
      if (draggingNode.data.id === 1) {
        return false
      } else {
        return true
      }
      // return draggingNode.data.docTitle.indexOf('三级 3-2-2') === -1
    },

    append(node, data) {
      // var pid = data.parentApiGroupId + ':' + data.id
      var timestamp = new Date().getTime()
      const newChild = {
        id: timestamp,
        isEdit: 0,
        docTitle: 'T' + timestamp,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.updateApiGroup(this.data)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.updateApiGroup(this.data)
    },

    edit(node, data) {
      console.log(
        'before:',
        data.id,
        // data.parentApiGroupId,
        data.docTitle,
        data.isEdit
      )
      this.$set(data, 'isEdit', 1)
      this.newdocTitle = data.docTitle
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      console.log('after:', data.id, data.docTitle, data.isEdit)
    },

    submitEdit(node, data) {
      // console.log('点击了保存按钮')
      if (data.docTitle == this.newdocTitle) {
        console.log('没有修改')
        this.newdocTitle = ''
        this.$set(data, 'isEdit', 0)
      } else {
        this.$set(data, 'docTitle', this.newdocTitle)
        this.newdocTitle = ''
        this.$set(data, 'isEdit', 0)
        // console.log('after:', data.id, data.docTitle)
        // console.log(this.data)
        this.updateApiGroup(this.data)
      }
    },

    cancelEdit(node, data) {
      // console.log('放弃编辑')
      // console.log(data.id, data.docTitle)
      this.newdocTitle = ''
      this.$set(data, 'isEdit', 0)
    },

    updateApiGroup(data) {
      console.log(data)
      updateApiGroup(1, data)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },

    nodeclick(node, data, obj) {
      console.log('点击了：', node.id, node.docTitle)
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
.el-input__inner {
  height: 20px;
}
</style>

