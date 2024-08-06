const { defineConfig } = require('@vue/cli-service')

const target = 'http://localhost:4000';

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // hot: true,
    // watchFiles: {
    //   paths: ['/node_modules/', '/uploads/'] // 핫 리로딩 대상에서 제외할 파일/디렉토리 지정
    // },
    port: 8001,
    host: '0.0.0.0',
    proxy: {
      '^/auth': {
        target,
        changeOrigin: true
      }
    }
  }
})