<template>
<div>
  <h3>这是发行编辑页面</h3>

  <div style="margin: 20px 0;"></div>
  <el-input
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 10}"
    placeholder="请输入内容"
    v-model="textarea2">
  </el-input>

  <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="handleChange"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</div>
</template>

<script>
import projectApi from '@/api/core/project'

export default {
  name: "",
  data () {
    return {
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      textarea1: '',
      textarea2: '',
      release: {
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    }
  }
}
</script>

<style scoped>

</style>
