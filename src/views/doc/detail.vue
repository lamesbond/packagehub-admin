<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">

      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        目录
        <i class="el-icon-s-operation"></i>
        <i class="el-icon-search"></i>
        <div class="custom-tree-container">
          <div class="block">
            <p>使用 scoped slot</p>
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-plus" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">新建文档</el-dropdown-item>
                  <el-dropdown-item command="b">狮子头</el-dropdown-item>
                  <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                  <el-dropdown-item divided command="d">新建分组</el-dropdown-item>
                  <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">重命名</el-dropdown-item>
                  <el-dropdown-item command="b">复制</el-dropdown-item>
                  <el-dropdown-item command="c">移动</el-dropdown-item>
                  <el-dropdown-item divided command="d">删除</el-dropdown-item>
                  <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
            </el-tree>
          </div>
        </div>
      </el-aside>

      <div v-show="isShowRight" class="show-right">
        <h1 v-for="(i,index) in site" :key="i.ud">{{ i.con }}</h1>
      </div>

      <div v-show="isShowRight" >
        <h1 v-for="(i,index) in site" :key="i.ud">{{ i.con }}</h1>
      </div>

    </el-container>

  </div>
</template>

<script>
import docApi from '@/api/core/doc'
import '@/styles/show.css'
let id = 1000

export default {
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      tableData: Array(20).fill(item),
      isShowRight: true,
      site: [
        { ud: 1, con: '哈哈01' },
        { ud: 2, con: '哈哈02' },
        { ud: 3, con: '哈哈03' }
      ],
      showMenu: true,
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data)),
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },

  methods: {
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button size='mini' type='text' on-click={ () => this.append(data) }>Append</el-button>
            <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>)
    },

    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    toggleMenu() {
      this.showMenu === true ? this.showMenu = false : this.showMenu = true
    },
    handleCommand(command) {
      this.$message('click on item ' + command)
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
  padding-right: 8px;
}
 .show-right{
   width: 1000px;
   background-color: #fff;
   box-shadow:1px 2px 3px 3px #ccc  //四周阴影
 }
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
