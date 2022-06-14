<template>
<div>
  <el-row type="flex" justify="space-around" style="align-items: center">
    <el-col :span="22"><h3>{{ this.doc.title }}</h3></el-col>
    <el-col :span="22"><h3>{{ versionId }}</h3></el-col>
    <el-col :span="1"><el-button type="text" @click="save()">更新</el-button></el-col>
  </el-row>
  <wangedit ref='wangedit'></wangedit>
</div>
</template>

<script>
import docApi from '@/api/core/doc'
import wangedit from '@/components/WangEditor/wangedit'
import { mapState, mapMutations } from 'vuex'
export default {
  components: { wangedit },
  name: "",
  data () {
    return {
      doc: {
      }
    }
  },
  computed: {
    versionId() {
      return this.$store.state.doc.versionId
    }
  },
  created () {
    this.getOne()
  },
  methods: {
    getOne() {
      docApi.getOne(this.$route.params.id).then(response => {
        this.doc = response.data.doc
      })
    },
    save() {
      this.$refs.wangedit.saveText()
    }
  },

  mounted() {
    if (!this.$store.state.doc.versionId) {
      this.$store.dispatch('doc/setversionid')
    }
  }
}
</script>

<style scoped>

</style>
