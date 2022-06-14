<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
      />
    </div>
  </div>
</template>

<script>
import docApi from '@/api/core/doc'
import Vue from 'vue'
import { Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default Vue.extend({
  components: { Editor },
  data() {
    return {
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: { },
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly : true
      },
      mode: 'default' // or 'simple'
    }
  },
  props: ['currentRow'],
  methods: {
    getOne(id) {
      setTimeout(() => {
        docApi.getOne(id).then(response => {
          this.html = response.data.doc.content
        })
      }, 1500)
    }

  }
})
</script>

<style src="@wangeditor/editor/dist/css/style.css" scoped>

</style>
