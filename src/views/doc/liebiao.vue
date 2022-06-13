<template>
  <div class="a_tree_box">

    <div>
      <el-table
        ref="cimsDictTable"
        default-expand-all
        :data="tableData"
        style="width: 100%"
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
        :tree-props="{children:'childNode'}"
        @selection-change="handleSelectionChange"
        @select="select22"
        @select-all="selectAll"
      >
        <el-table-column label="条件" min-width="400px">
          <template slot-scope="scope">
            <!-- 这部分是设置虚线逻辑 -->
            <template v-for="(item,l) in scope.row.level">
              <!-- 根据delItemFlag判断 是true或者'true'则对应的竖虚线是多余的 需要删除 -->
              <span v-if="scope.row.delItemFlag[l] == 'false'" :key="l+1" class="l_bor1_box" :style="{'left':`${(l+1)*16 - 6}`+'px'}"></span>
              <!-- 这个是设置横的虚线 -->
              <span v-if="l == (scope.row.level -1)" :key="(l+1)*10000" class="l_bor2_box" :style="{'left':`${(l+1)*16 - 6}`+'px'}"></span>
            </template>
            <!-- 这个是设置每个层级最后的那个节点 多加一个竖线 覆盖多余的行高虚线 -->
            <span v-if="scope.row.moreOneDash" class="more_dash" :style="{'left':`${(scope.row.level)*16 - 6}`+'px'}"></span>
            <span class="showName">{{ scope.row.conditionName }}</span>
            <i v-if="scope.row.farOrSon=='first'|| scope.row.farOrSon=='middle'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;" class="el-icon-folder-add" @click="addOneRow(scope.row,scope.$index,'middle')"></i>
            <i v-if="scope.row.farOrSon=='first'|| scope.row.farOrSon=='middle'" style="font-size:18px;margin-left:5px;color:#00ff00;cursor: pointer;" class="el-icon-document-add" @click="addOneRow(scope.row,scope.$index,'last')"></i>
            <i v-if="scope.row.farOrSon=='middle'|| scope.row.farOrSon=='last'" style="font-size:18px;margin-left:5px;color:#f1ff;cursor: pointer;" class="el-icon-edit" @click="editRow(scope.row,scope.$index)"></i>
            <i v-if="scope.row.farOrSon=='middle'|| scope.row.farOrSon=='last'" style="font-size:18px;margin-left:5px;color:#1890FF;cursor: pointer;" type="primary" class="el-icon-close" @click="delRow(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>

        <el-table-column label="部门" width="140px"></el-table-column>
        <el-table-column label="详情" width="140px"></el-table-column>
        <el-table-column label="发布状态"></el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.farOrSon=='first'|| scope.row.farOrSon=='middle'" style="color:#00ff00;cursor: pointer;" @click="addOneRow(scope.row,scope.$index,'middle')">新增夹</span>
            <span v-if="scope.row.farOrSon=='first'|| scope.row.farOrSon=='middle'" style="color:#00ff00;cursor: pointer;" @click="addOneRow(scope.row,scope.$index,'last')">新增页</span>
            <span v-if="scope.row.farOrSon=='middle'|| scope.row.farOrSon=='last'" style="color:#f1ff;cursor: pointer;" @click="editRow(scope.row,scope.$index)">编辑</span>
            <span v-if="scope.row.farOrSon=='middle'|| scope.row.farOrSon=='last'" style="color:#2593fc;cursor: pointer;" @click="delRow(scope.row,scope.$index)">删除</span>
          </template>
        </el-table-column>

      </el-table>

      <!-- 编辑回显的弹框  其实新增也可以用这个弹框但是没写 -->
      <el-dialog title="提示" class="dia_box" :visible.sync="dialogFlag" width="500px">
        <el-form :model="formData">
          <el-form-item label="文档标题:" label-width="128px">
            <el-input v-model="formData.conditionName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="formData.strObj" label="部门" label-width="128px">
            <el-input v-model="formData.strObj.str1" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="formData.strObj" label="详情" label-width="128px">
            <el-input v-model="formData.strObj.str2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="formData.strObj" label="发布状态" label-width="128px">
            <el-input v-model="formData.strObj.str3" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="changeRow">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeTable',
  data () {
    return {
      ref: 'cimsDictTable',
      tableData: [], // 这个是真正的展示树状列表
      selectAddLast: null, // 点击树表的添加  middle是添加中间  last 是添加最后末梢
      cimsDictTable: [],
      sourceData: [
        {
          id: 3, // 注意数据必须要有id  否则树状数据渲染会出问题 那么我们可以再前端新增时候以时间戳为id 真正保存到数据库后会有真实id
          conditionName: '顶级条件',
          strObj: null,
          parentId: null,
          childNode: [] // childNode有值 就会形成对应的嵌套下级
        }
      ],

      dialogFlag: false,
      formData: {
        id: null,
        conditionName: '',
        strObj: {
          str1: '',
          str2: '',
          str3: '',
          str4: '',
          str5: '',
          str6: ''
        }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    getNewData () {
      this.$set(this.sourceData[0], 'childNode', [])
      this.initData()
    },
    // 获取页面数据回显
    getIdDate (id) {
      // 总数据回显 ---  假设给的数据  这条数据是默认数据的childNode
      let dataArr = [
        {
          id: 31,
          conditionName: '条件--【页】--页不可添加下级 是末梢last',
          strObj: {
            str1: '11',
            str2: '22',
            str3: '1',
            str4: 2,
            str5: '2',
            str6: '2'
          },
          parentId: 3,
          childNode: []
        },
        {
          id: 32,
          conditionName: '条件--【夹】--夹可以添加下级 是中间middle',
          strObj: null,
          parentId: 3,
          childNode: [
            {
              id: 311,
              conditionName: '机密的任务',
              strObj: null,
              parentId: 32,
              childNode: [
                {
                  id: 3221,
                  conditionName: '这个条件名字比较长 会自动换行会自动换行会自动换行会自动换行会自动换行会自动换行会自动换行会自动换行',
                  strObj: {
                    str1: '11',
                    str2: '121',
                    str3: '1',
                    str4: 2,
                    str5: '2',
                    str6: '2'
                  },
                  parentId: 311,
                  childNode: []
                },
                {
                  id: 3222,
                  conditionName: '9527',
                  strObj: {
                    str1: '11',
                    str2: '1',
                    str3: '1',
                    str4: 2,
                    str5: '2',
                    str6: '2'
                  },
                  parentId: 311,
                  childNode: []
                },
                {
                  id: 3223,
                  conditionName: '夹文件',
                  strObj: null,
                  parentId: 311,
                  childNode: []
                }
              ]
            },
            {
              id: 321,
              conditionName: '附加条件-日后再说',
              strObj: {
                str1: '11',
                str2: '33',
                str3: '1',
                str4: 2,
                str5: '2',
                str6: '2'
              },
              parentId: 3,
              childNode: []
            }
          ]
        },
        {
          id: 33,
          conditionName: '条件夹',
          strObj: null,
          parentId: 3,
          childNode: []
        }
      ]

      // // 设置id---没有id树渲染会报错--
      // let num = 121210
      // function setId (arr, pId) {
      //   for (let j = 0; j < arr.length; j++) {
      //     const element = arr[j]
      //     if (element.childNode.length == 0) {
      //       element['id'] = num
      //       element['parentId'] = pId
      //       num++
      //     } else {
      //       element['id'] = num
      //       element['parentId'] = pId
      //       num++
      //       setId(element.childNode, element['id'])
      //     }
      //   }
      // }
      // setId(dataArr, 983873292643)
      // console.log(dataArr)

      // 获取数据嵌套的层级
      function setLevel (arr, levelNum) {
        for (let j = 0; j < arr.length; j++) {
          const element = arr[j]
          if (element.childNode.length == 0) {
            element['level'] = levelNum
          } else {
            element['level'] = levelNum
            setLevel(element.childNode, levelNum + 1)
          }
        }
      }
      setLevel(dataArr, 1)

      this.$set(this.sourceData[0], 'childNode', dataArr)

      console.log(this.sourceData)
      this.initData()
    },
    // 在树表每次数据变化时候 新增 删除 编辑  都需要设置出新的状态 判断是中间层 而没有子集
    checkEveryItem () {
      // 这一步是找到空的中间层 需要添加页
      let noChildAndNoRate = []
      function checkIsNeedChild (arr, ruleName) {
        for (let j = 0; j < arr.length; j++) {
          const element = arr[j]
          if (element.childNode.length == 0) {
            if (element.strObj == null || element.strObj == 'null') {
              element['isNeedLast'] = true
              noChildAndNoRate.push({ cantName: ruleName.trim() + '/' + element.conditionName.trim() })
            } else {
              element['isNeedLast'] = false
            }
          } else {
            element['isNeedLast'] = false
            checkIsNeedChild(element.childNode, ruleName.trim() + '/' + element.conditionName.trim())
          }
        }
      }
      checkIsNeedChild(this.tableData, '')
      console.log('中间层的子集为空也就是没末梢', noChildAndNoRate)

      // 这个是找到每层级最后一个 判断是中间层 且 还有childNode  那么他的childNode就需要删除多余虚线（子集childNode多余的虚线就是父级的的那个嵌套层级 那条虚线）
      // 第一步先找到 父级（满足最后一层是中间层 且有子集childNode）
      function set_setLast (arr) {
        for (let j = 0; j < arr.length; j++) {
          const element = arr[j]
          if (element.childNode.length == 0) {
            if (j == (arr.length - 1)) {
              // element['isLastZhongjianAndHasChl'] = true
              if ((element.strObj == null || element.strObj == 'null') && element.childNode.length > 0) {
                element['isLastZhongjianAndHasChl'] = true
              } else {
                element['isLastZhongjianAndHasChl'] = false
              }
            } else {
              element['isLastZhongjianAndHasChl'] = false
            }
          } else {
            if (j == (arr.length - 1)) {
              // element['isLastZhongjianAndHasChl'] = true
              if ((element.strObj == null || element.strObj == 'null') && element.childNode.length > 0) {
                element['isLastZhongjianAndHasChl'] = true
              } else {
                element['isLastZhongjianAndHasChl'] = false
              }
            } else {
              element['isLastZhongjianAndHasChl'] = false
            }
            set_setLast(element.childNode)
          }
        }
      }
      // console.log(this.tableData[0].childNode)
      set_setLast(this.tableData[0].childNode)

      this.tableData[0]['isLastZhongjianAndHasChl'] = true

      // 第二步 根据isLastZhongjianAndHasChl和所需要删除的层次level 递归遍历 将需要删除虚线的标志为true fasle是不删 将几条虚线删不删的值放在一个数组内
      function delArrItem (arr, flagDel, num, farArr) {
        for (let j = 0; j < arr.length; j++) {
          const element = arr[j]

          let delItemFlag = JSON.parse(JSON.stringify(farArr)) // 必须深拷贝 将父级的数组继承到子集使用 深拷贝 才不会改变父级数组值
          for (let h = 0; h < element.level; h++) {
            if (flagDel == 'true' || flagDel == true) {
              if ((h + 1) == num) {
                delItemFlag[h] = 'true'
              } else {
                if (delItemFlag[h] == 'true' || delItemFlag[h] == true) { // 针对需要删除的 就不要再赋值

                } else {
                  delItemFlag[h] = 'false'
                }
              }
            } else {
              if (delItemFlag[h] == 'true' || delItemFlag[h] == true) {

              } else {
                delItemFlag[h] = 'false'
              }
            }
          }
          element['delItemFlag'] = delItemFlag

          if (element.childNode.length == 0) {
          } else {
            delArrItem(element.childNode, element.isLastZhongjianAndHasChl, element.level, element['delItemFlag'])
          }
        }
      }
      delArrItem(this.tableData[0].childNode, false, 0, [])
      // this.tableData[0]['isLastZhongjianAndHasChl'] = true

      // 这个是找到每层级最后一个 然后标志出来true 最后画虚线时候需要 单独多画一个线用来遮挡多余的当前层虚线（因为行高自适应 当某层的末梢行高超过50px时候 之前设置的top: -24px就不够了 会多出来一部分虚线 故需要遮挡掉）
      function set_lastMoreDash (arr) {
        for (let j = 0; j < arr.length; j++) {
          const element = arr[j]
          if (element.childNode.length == 0) {
            if (j == (arr.length - 1)) {
              element['moreOneDash'] = true
            } else {
              element['moreOneDash'] = false
            }
          } else {
            if (j == (arr.length - 1)) {
              element['moreOneDash'] = true
            } else {
              element['moreOneDash'] = false
            }
            set_lastMoreDash(element.childNode)
          }
        }
      }
      set_lastMoreDash(this.tableData[0].childNode)

      console.log('处理虚线', this.tableData)
    },

    Menuclose () {
      this.dialogVisibleMenu = false
    },
    setRowData (row, parentId, farOrSon, val) {
      let strObj = null
      if (farOrSon == 'last') {
        strObj = {
          str1: '',
          str2: '',
          str3: '',
          str4: '',
          str5: '',
          str6: ''
        }
      } else {
        strObj = null
      }
      return {
        id: new Date().valueOf(),
        conditionName: val.newName,
        parentId: parentId || null,
        strObj: strObj,
        edit: true,
        add: true,
        childNode: [],
        level: (row.level >= 0) ? (row.level + 1) : 1,
        farOrSon: farOrSon
      }
    },
    // 手动勾选数据行
    select22 (selection, row) {
      // 判断当前行是否选中
      // 不需要判断 id, 因为引用地址相同
      const selected = selection.some((item) => item === row)
      // 处理所有子级
      this.selectChildren(row, selected)
    },
    selectAll (selection) {
      /*
       * 这里引用别人的代码:
       * selectAll 只有两种状态: 全选和全不选
       * 所以我们只需要判断一种状态即可
       * 而且也不需要判断 id, 因为 selection 和 this.data 中对象引用地址是相同的
       */
      // tableData 第一层只要有在 selection 里面就是全选
      const isSelect = this.tableData.some((item) => selection.includes(item))
      if (isSelect) {
        selection.forEach((item) => {
          this.selectChildren(item, isSelect)
        })
      } else {
        this.tableData.forEach((item) => {
          this.selectChildren(item, isSelect)
        })
      }
    },
    selectChildren (row, selected) {
      if (row['childNode'] && Array.isArray(row['childNode'])) {
        row['childNode'].forEach((item) => {
          this.toggleSelection(item, selected)
          this.selectChildren(item, selected)
        })
      }
    },
    selectionChange (selection) {
      this.debounce(this.tableSelectChange, 100, selection)
    },
    toggleSelection (row, select) {
      row &&
      this.$nextTick(() => {
        this.$refs[this.ref] &&
        this.$refs[this.ref].toggleRowSelection(row, select)
      })
    },
    // 防抖
    debounce (fun, wait, params) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(fun, wait, params)
    },
    getSelectedList () {
      // 获取选中数据源
      let list = JSON.parse(JSON.stringify(this.cimsDictTable))
      list.forEach((e) => (e.childNode = null))
      return list
    },
    addRow (row, id, farOrSon, val) {
      console.log(row, id)
      // 去掉这个if和else是 为了达到可以不保存 就继续添加下级
      // if (!row.add) {
      // 新增行数据
      let addrow = this.setRowData(row, row.id, farOrSon, val)
      // 新增
      if (row.childNode) {
        row.childNode.push(addrow)
      } else {
        // 添加数据
        this.$set(row, 'childNode', [addrow])
      }
      // 展开行
      this.$nextTick(() => {
        // 更新后打开节点
        this.$refs.cimsDictTable.toggleRowExpansion(row, true)
        // 刷新树
        this.refTable()
      })
      // } else {
      //   this.$message({
      //     message: '请保存后再继续添加子节点!',
      //     type: 'warning'
      //   })
      // }

      // 每次添加编辑删除树表需要 重新计算出新属性状态
      this.checkEveryItem()
    },
    addOneRow (row, index, farOrSon) {
      this.selectAddLast = farOrSon
      let item = {}
      let val = { newName: `新的条件${Math.floor(Math.random() * (1 - 1000) + 1000)}` }// 假设这个就是新增是一行的值
      console.log(1123, val)
      function findRow (arrA, Id, val) {
        for (let h = 0; h < arrA.length; h++) {
          const element = arrA[h]

          if (element.childNode.length == 0) {
            if (element.id == Id) {
              item = element
            }
          } else {
            if (element.id == Id) {
              item = element
            }
            findRow(element.childNode, Id, val)
          }
        }
      }
      findRow(this.tableData, row.id, val)
      this.addRow(item, row.id, this.selectAddLast, val)
    },
    updateTableTree (parentId, nodes) {
      // 更新需要先更新上级节点
      this.$set(
        this.$refs.cimsDictTable.store.states.lazyTreeNodeMap,
        parentId,
        nodes
      )
    },
    refTable () {
      let _this = this
      function dg (data) {
        for (let i in data) {
          if (data[i].childNode) {
            _this.updateTableTree(data[i].id, data[i].childNode)
            dg(data[i].childNode)
          }
        }
      }
      dg(this.tableData)
    },
    // 删除当前条及对应下级数据
    deleteTable (row, index, arr) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (element.id == row.id) {
          arr.splice(i, 1)
        } else {
          if (element.childNode.length > 0) {
            this.deleteTable(row, index, element.childNode)
          } else {

          }
        }
      }
    },
    delRow (row, index) {
      console.log(row, index)
      this.$confirm('确认删除该条件及下级条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTable(row, index, this.tableData)
        // 每次添加编辑删除树表需要 重新计算出新属性状态
        this.checkEveryItem()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 删除行
      let delArr = []
      function dg (data) {
        for (let i in data) {
          // 过滤当前新增的数据
          if (!data[i].add) {
            delArr.push(data[i].id)
          }
          if (data[i].childNode) {
            dg(data[i].childNode)
          }
        }
      }
      dg([row])
      // 删除
    },
    editRow (row, index) {
      // 编辑
      this.$set(row, 'edit', true)
      // 使用深拷贝 否则会影响改弹框 就直接影响列表数据了 我们要的是改了弹框点击确认才改列表数据 故需要深拷贝
      this.formData = JSON.parse(JSON.stringify(row))

      this.dialogFlag = true
    },
    // 点击了弹框的确定
    changeRow () {
      let val = this.formData
      function findId (arrA, Id, val) {
        for (let h = 0; h < arrA.length; h++) {
          const element = arrA[h]

          if (element.childNode.length == 0) {
            if (element.id == Id) {
              element['conditionName'] = val.conditionName
              element['strObj'] = val.strObj
              console.log(12121, element, val)
            }
          } else {
            if (element.id == Id) {
              element['conditionName'] = val.conditionName
              element['strObj'] = val.strObj
              console.log(12121, element, val)
            }
            findId(element.childNode, Id, val)
          }
        }
      }
      findId(this.tableData, val.id, val)

      this.dialogFlag = false

      // 每次添加编辑删除树表需要 重新计算出新属性状态
      this.checkEveryItem()
    },
    proTableData (data) {
      let _this = this
      // 处理数据
      function dg (data) {
        for (let i in data) {
          _this.$set(data[i], 'edit', false)
          if (data[i].childNode) {
            // 重要:树状节点数据刷新
            _this.updateTableTree(data[i].id, data[i].childNode)
            dg(data[i].childNode)
          }
        }
      }
      dg(data)

      // 给数据判断添加父子节点标识
      function setFarSon (data) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          // console.log(element.parentId, element.parentId == undefined)
          if (element.parentId == undefined || element.parentId == null) {
            element['farOrSon'] = 'first'
            setFarSon(element.childNode)
          } else {
            if (element.strObj == null || element.strObj == 'null') {
              element['farOrSon'] = 'middle'
              setFarSon(element.childNode)
            } else {
              element['farOrSon'] = 'last'
            }
          }
        }
      }
      setFarSon(data)
    },
    initData () {
      // 数据加载   模仿数据请求
      let res = JSON.parse(JSON.stringify(this.sourceData))

      // 数据处理 添加编辑标识
      this.proTableData(res)
      this.tableData = res

      // 每次添加编辑删除树表需要 重新计算出新属性状态
      this.checkEveryItem()
    },
    load (tree, treeNode, resolve) {
      // 节点加载
      setTimeout(() => {
        resolve(tree.childNode)
      }, 1000)
    },
    handleSelectionChange (val) {
      // 全选
      this.cimsDictTable = val
    }
  }
}
</script>

<style lang="less" scoped>
// 树状表格样式
.a_tree_box {
  width: calc(100vw - 300px);
  height: 100%;
  margin-bottom: 20px;
  padding: 40px;
  .cd-tool {
    display: flex;
    flex-direction: row;
  }
  .data-table {
    /deep/ .cell {
      display: flex;
      align-items: center;
    }

    // 固定表格高度
    /deep/td {
      height: 50px;
      padding: 0;
    }
    /deep/tbody {
      tr {
        overflow: hidden;
        td {
          // width: 40px !important;
          // background-color: #1fff!important;
          // background-color: rgba(255, 255, 255, 0); //必须设置为透明色  否则 warning-row 显示不出来
          .cell {
            padding: 0 !important;
            // background-color: #1fff;

            height: 100%;
            position: relative;
            overflow: visible !important;
            .l_bor1_box {
              top: -24px;
              display: inline-block;
              width: 1px;
              height: 100%;
              border-left: 1px dashed #ccc;
              position: absolute;
            }
            .l_bor2_box {
              display: inline-block;
              width: 30px;
              height: 1px;
              border-top: 1px dashed #ccc;
              position: absolute;
            }
            .more_dash {
              display: inline-block;
              width: 1px;
              height: 50%;
              border-top: 1px dashed #ccc;
              position: absolute;
              top: calc(50% - 1px);
              // background-color: rgba(248, 250, 252, 1);
              background-color: rgb(255, 253, 253);
            }
            .el-table__expand-icon {
              //这个是将所有的条件前面的图标 固定掉
              display: inline-block;
              width: 20px !important;
              min-width: 20px !important;
              position: relative;
              z-index: 999;
              // background-color: #1fff;
            }
            .el-table__placeholder {
              //这个是将所有的条件前面的空白 固定成20px   这样才会有间隔层级视觉效果 如果不做固定 会导致 条件文字多的时候 有的是20xp 有的不是 就导致看起来没层级一样
              display: inline-block;
              width: 25px !important;
              max-width: 25px !important;
              min-width: 25px !important;
            }
            .l_bor3_box {
              display: inline-block;
              width: 1px;
              height: 15px;
              border-left: 1px dashed #ccc;
              top: 15px;
              left: -13px;
              position: relative;
            }
          }
        }
        td:nth-child(n + 2) {
          .cell {
            span {
              // background-color: #1fff;
              display: inline-block;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .showName {
    display: inline-block;
    // max-width: 100px;
    // white-space: nowrap;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .one_two {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
  .isML10 {
    margin-left: 10px; //判断有无数据 没数据就需要左偏移对齐
  }
  .abcd {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: 3px;
  }
  .tip_icon {
    width: 20px;
    height: 20px;
    cursor: pointer;

    position: relative;
    top: -1px;
    left: 30px;
  }
  .tip_box {
    display: inline-block;
    width: fit-content !important;
    min-width: 105px;
    color: red;
    font-weight: 700;
    position: relative;
    top: 1px;
    margin-left: 33px;
    font-size: 17px;
  }

  /deep/ .el-input__inner {
    margin-left: 3px !important;
    padding: 0 !important;
    width: 44px !important;
    height: 25px !important;
    text-align: center !important;
  }

  .dia_box {
    /deep/.el-input {
      text-align: left;
      .el-input__inner {
        width: 300px !important;
        height: 35px !important;
        text-align: left !important;
      }
    }
  }
}
</style>
