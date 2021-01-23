// 实现这个项目的构建任务
const del = require('del')
const bs = require('browser-sync').create() // create()方法提供自动创建一个开发服务器
const { src, dest, parallel, series, watch } = require('gulp')
// 自动加载插件， 就不用每次手动载入插件，通过 gulp-load-plugins插件完成自动载入插件
const plugins = require('gulp-load-plugins')()
const minimist = require('minimist')

// 简单定义数据
const data = {
  menus: [
      {
          name: 'Home',
          icon: 'aperture',
          link: 'index.html'
      },
      {
          name: 'Features',
          link: 'features.html'
      },
      {
          name: 'About',
          link: 'about.html'
      },
      {
          name: 'Contact',
          link: '#',
          children: [
              {
                  name: 'Twitter',
                  link: 'https://twitter.com/w_zce'
              },
              {
                  name: 'About',
                  link: 'https://weibo.com/zceme'
              },
              {
                  name: 'divider'
              },
              {
                  name: 'About',
                  link: 'https://github.com/zce'
              }
          ]
      }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 清除之前的编译出来的文件
const clean = () => { 
  return del(['dist', 'temp'])
}

/**
 * base参数：基准路径是src, 会保留src下面的文件路径
 * sass() 功能： 转换sass文件
 * sass() 工作时， 默认用_(下划线)开头的样式文件时主文件中被依赖的文件， 所以默认不会被转换构建
 * {outputStyle: 'expanded'} 表示通过sass 指定选项表示构建生成的样式代码 {} 完全展开
*/
const style = () => { 
  return src('src/assets/styles/*.scss', { base: 'src'}) 
    .pipe(plugins.sass({outputStyle: 'expanded'})) 
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true })) // 以流的方式
}

/**
 * script 是完成项目的js 构建
 * babel({ presets: ['@babel/preset-env']})转换es6+ 的新特性， 这样使得在开发过程中能够使用过es的新特性， 而在项目上线使用前转换成浏览器能够执行的格式。presets: ['@babel/preset-env'] 能够通过在项目项目中新建.bablerc文件设置
*/
const script = () => { 
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env']}))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

/**
 * 完成对项目中页面的构建
 * 页面模板编译
*/
// src('src/**/*.html', { base: 'src' }) 表示匹配src 目录下任意子文件夹下的html 文件
const page = () => { 
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) //swig 模板引擎转换插件 .pipe(swig({ data }))  传入数据
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

/**
 * 图片转换*/
const image = () => { 
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
} 

/**
 * 字体文件
*/
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

/**
 * 额外的将public 文件夹下的文件拷贝过去
*/
const extra = () => { 
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

/**
 * 热更新(自动编译刷新浏览器页面)
*/
const serve = () => { 
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)
  bs.init({
    notify: false, // 设置为false, 关闭browser-sync连接成功的提示
    port: 8000,
    // open: false, // 是否自动打开浏览器
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': './node_modules'
      }
    }
  })
}

/**
 * useref 文件资源引用引用
 * 压缩HTML,CSS, JS
*/
const useref = () => { 
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // html js css 压缩
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true, // collapseWhitespace: true 压缩html文件中的空格
      minifyCSS: true, // minifyCSS: true, 压缩html 中 css 中的空格
      minifyJS: true // minifyJS: true 压缩html文件中的js 空格
    }))) 
    .pipe(dest('dist'))
}

/**
 * 创建组合任务将 style、script、page组合执行
 * 因为style, script, page 他们联系不是很紧密， 所以可以同时执行， 提高构建速度
 * compile任务只是完成 src 文件夹下需要编译的任务
*/
const compile = parallel(style, script, page)

/**
 * build任务将compile任务和extr任务再次组合成一个新的任务， 完成对src 文件下所有文件的编译和public 文件下所有文件的拷贝任务
 * series通过series 丰富build 任务， 在每次新构建之前， 先去清除上一次构建出来的文件， 然后再进行build任务
 * 上线之前执行的任务
*/
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
) 

const develop = series(compile, serve)

const env = () => { 
  const env = process.env.NODE_ENV = minimist(process.argv).env
  console.log('## 当前环境：', env || '无')
}

const predeploy = () => { 
  const env = process.env.NODE_ENV
  if (!env) throw new Error('Missing NODE_ENV')
  const ftpConf = gulpConf.ftp[env]
  console.log('## 正在部署到远端服务器（' + ftpConf.host + ':' + ftpConf.remotePath + '）...')
  return gulp.src('dist/**')
    .pipe(plugins.sftp(ftpConf))
}

const start = develop
const deploy = series(env, predeploy)


module.exports = {
  build,
  clean,
  develop,
  serve,
  start,
  deploy,
}