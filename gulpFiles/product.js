module.exports = {
  menus: [
      {
          name: '线上首页',
          icon: 'aperture',
          link: 'index.html'
      },
      {
          name: '线上主营',
          link: 'features.html'
      },
      {
          name: '线上关于',
          link: 'about.html'
      },
      {
          name: '联系我们',
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
  pkg: require('../package.json'),
  date: new Date()
}