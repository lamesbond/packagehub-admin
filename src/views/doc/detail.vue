<template>
  <div>
    <el-switch
      v-model="draggable"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="启动菜单拖拽"
      inactive-text="关闭菜单拖拽"
    ></el-switch>

    <el-button
      type="primary"
      size="mini"
      round
      @click="batchSave"
      v-if="draggable"
    >保存批量拖拽</el-button
    >
    <el-button
      type="primary"
      size="mini"
      round
      @click="cancelBatchDrag"
      v-if="draggable"
    >取消批量拖拽</el-button
    >

    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      show-checkbox
      node-key="catId"
      :default-expanded-keys="expandedKey"
      :draggable="draggable"
      :allow-drop="allowDrop"
      @node-drop="handleDrop"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">
            Edit
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="dialogType"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input
            v-model="category.productUnit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
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
      menus: [],
      //expandedKey 菜单默认展开的结构状态 传入父节点id
      expandedKey: [],
      //dialogVisible控制对话框/模态框是否展示 默认不展示
      dialogVisible: false,
      //修改新增复用对话框的依据 edit|append
      dialogType: "",
      //菜单拖拽功能判断当前节点的子节点最大深度
      maxLevel: 0,
      //菜单拖拽后封装新的节点信息
      updateNodes: [],
      //菜单拖拽开启标记 默认不开启
      draggable: false,
      //pCid用于批量拖拽后向后台传递最新节点信息后保持之前结构用 由于可能需要展开多个菜单所以用数组接收
      pCid: [],
      //对话框内表单绑定的数据对象 其中菜单ID-catId是对话框修改新增复用的依据
      category: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        icon: "",
        productUnit: "",
        catId: null,
      },
      defaultProps: {
        //label：哪个属性是作为标签的值需要展示出来，children：哪个属性需要作为标签的子树
        children: "children",
        label: "name",
      },
    };
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
      console.log('drag start', node.data.title)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.data.title)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.data.title)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.data.title)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag end: ',
        dropNode && dropNode.data.title,
        dropType
      )
      // 调后端更新
      this.updateApiGroup(this.data)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.data.title, dropType)
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
        // console.log(this.data)
        this.updateApiGroup(this.data)
      }
    },

    cancelEdit(node, data) {
      // console.log('放弃编辑')
      // console.log(data.id, data.title)
      this.newtitle = ''
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
.el-input__inner {
  height: 20px;
}
</style>

