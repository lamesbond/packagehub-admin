<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onDestroyed="onDestroyed"
        @customPaste="customPaste"
      />
    </div>
  </div>
</template>

<script>
import docApi from '@/api/core/doc'
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: '<p></p>',
      toolbarConfig: { },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: 'uploadImage',
      },
      mode: 'default', // or 'simple'
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor)
    },
    onDestroyed(editor) {
      editor.destroyed
    },
    customPaste(editor, event, callback) {
      // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
      const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
      // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

      // 自定义插入内容
      editor.insertText(text)

      // 返回 false ，阻止默认粘贴行为
      event.preventDefault()
      callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）

      // 返回 true ，继续默认的粘贴行为
      // callback(true)
    },
    saveText() {
      let data = {}
      data.id = this.$route.params.id
      data.content = this.editor.getHtml()
      docApi.update(data)
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout( () => {
      docApi.getOne(this.$route.params.id).then(response => {
        this.html = response.data.doc.content
      })
    }, 1500)
  },
})
</script>

<style src="@wangeditor/editor/dist/css/style.css" scoped>

</style>
