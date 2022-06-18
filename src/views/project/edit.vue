<template>
<div>
  <h3>这是发行{{ this.projectPath }}编辑页面</h3>

  <div style="margin: 20px 0;"></div>
  <el-input
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 10}"
    placeholder="请输入内容"
    v-model="releaseNote">
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

  <el-button @click='save'>编辑完成，点击保存</el-button>
</div>
</template>

<script>
import projectApi from '@/api/project'

export default {
  name: "",
  data () {
    return {
      projectPath: '',
      releaseNote: '',
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
  created() {
    projectApi.listChildCategoryById(this.$route.params.id).then(response => {
      this.fileList = response.data.childList
    })
    projectApi.listParentCategoryById(this.$route.params.id).then(response => {
      this.projectPath = response.data.projectPath
    })
    projectApi.getOne(this.$route.params.id).then(response => {
      this.releaseNote = response.data.project.releaseNote
    })

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
    save() {
      let savedata = {}
      savedata.releaseNote = this.releaseNote
      savedata.id = this.$route.params.id
      projectApi.update(savedata)
    }
  }
}
</script>

<style scoped>

</style>
