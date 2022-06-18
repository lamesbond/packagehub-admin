module.exports = {
  devServer: {
    port: 9528, // 端口地址
    open: false, // 是否自动打开浏览器页面
    proxy: {
      '/admin': {
        // target: 'http://192.168.81.142:5080', // 李玉峰
        // target: 'http://192.168.80.209:8080', // 李震
        target: 'http://localhost', // 莫济阳
        changeOrigin: true
      },
    }
  },
  productionSourceMap: false,
  publicPath: './',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/css/variables.scss";'
      }
    }
  }
}
