<template>
  <div class="app-container">
    <h4>文档信息</h4>

    <el-row style="text-align:center;margin-top: 40px;">
      <el-button @click="back">
        返回
      </el-button>
    </el-row>
  </div>
</template>

<script>
import lendApi from '@/api/core/lend'
import '@/styles/show.css'
export default {
  name: "",
  data() {
    return {
      lendDetail: {
        lend: {
          param: {}
        },
        borrower: {}
      }
    }
  },

  created() {
    if (this.$route.params.id) {
      this.fetchDataById()
    }
  },

  methods: {
    fetchDataById() {
      lendApi.show(this.$route.params.id).then(response => {
        this.lendDetail = response.data.lendDetail
      })
    },

    back() {
      this.$router.push({path: '/core/doc/list'})
    }
  }
}
</script>

<style scoped>

</style>
