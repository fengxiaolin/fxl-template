const baseConfig = require('./baseConfig')

module.exports = {
  notify: false, // 设置为false, 关闭browser-sync连接成功的提示
  port: baseConfig.devServe.port,
  host:baseConfig.devServe.host,
  https: baseConfig.devServe.https ? baseConfig.devServe.https : false,
  open: false, // 是否自动打开浏览器
  server: {
    baseDir: [baseConfig.build.temp, baseConfig.build.src, baseConfig.build.public],
    routes: {
      '/node_modules': './node_modules'
    }
  }
}