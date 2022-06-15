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
    action="http://localhost/admin/oss/file/upload"
    :before-upload="beforeUpload"
    :data="uploadParam"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</div>
</template>

<script>
import projectApi from '@/api/core/project'

export default {
  name: "",
  data () {
    return {
      uploadParam: {
        module: "ningning"
      },
      fileList: [],
      textarea1: '',
      textarea2: '',
      release: {
      }
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      this.uploadParam = { module: this.$route.params.id }; //上传携带的参数名
    },
    handleChange(file, fileList) {
      // console.log("file on change: " + file.name)
      // console.log("fileList on change: " + fileList)
      // this.fileList = fileList.slice(-3);
    },
    handleRemove(file, fileList) {
      console.log("wenjain deleted:" + "  " + file.name + "  " + file.url + "  " + file.id)
      projectApi.removeFile(file.url)
      projectApi.remove(file.id)
    },
    handleSuccess(res, file, fileList) {
      var timestamp = new Date().getTime()
      file.id = timestamp
      file.url = res.data.url
      let newFile = {}
      newFile.id = timestamp
      newFile.parentId = this.$route.params.id
      newFile.name = file.name
      newFile.type = "file"
      newFile.url = res.data.url
      projectApi.save(newFile)
    },
  }
}
</script>

<style scoped>

</style>
