const args = process.argv.slice(2)
let data = null
if (args.includes('--production')) {
  data = require('./product.js')
} else { 
  data = require('./dev.js')
}


module.exports = {
  data,
  devServe:{
    host:'localhost',
    port:8000,
    https:true,
  },
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
        styles: 'src/assets/styles/*.scss',
        scripts: 'src/assets/scripts/*.js',
        html: 'src/*.html',
        images: 'src/assets/images/**',
        fonts: 'src/assets/fonts/**',
        public: 'public/**',
        tmpHtml: 'temp/*.html'
    }
  }
}