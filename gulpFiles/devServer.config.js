const baseConfig = require('./baseConfig')

module.exports = {
  notify: false, // 设置为false, 关闭browser-sync连接成功的提示
  port: baseConfig.devServe.port,
  host:baseConfig.devServe.host,
  https:baseConfig.devServe.https?baseConfig.devServe.https:false,
  server: {
    baseDir: [baseConfig.build.tmp, baseConfig.build.src, baseConfig.build.static],
    routes: {
      '/node_modules': './node_modules'
    }
  }
}