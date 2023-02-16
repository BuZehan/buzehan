const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
   // 打包
   lintOnSave: false,
   // 基本路径
   publicPath: './',
   // 输出文件目录
   outputDir: 'dist',
   // 放置生成的静态文件目录（js css img）
   assetsDir: 'static',
   // 生产环境是否生成 sourceMap 文件
   productionSourceMap: false,
   configureWebpack: (config) => {
     if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...
       config.mode = 'production'
       config.performance = { // 打包文件大小配置
         maxEntrypointSize: 10000000,
         maxAssetSize: 30000000
       }
     }
   }
})
