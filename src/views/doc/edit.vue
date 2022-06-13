<template>
<div>
  <h1>这里是编辑页面，编辑的id是{{this.id}}</h1>
</div>
</template>

<script>
export default {
  name: "",
  data () {
    return {
      id: ''
    }
  },
  created () {
    this.setId()
  },
  methods: {
    setId() {
      this.id = this.$route.params.id
    }
  }
}
</script>

<style scoped>

</style>
