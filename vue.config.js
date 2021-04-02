const path = require('path')

const pages = {
  index: {
    title: '欣和-MDS综合管理平台',
    entry: 'src/project/LOGIN/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    chunk: ['chunk-vendors', 'chunk-common', 'index']
  },
  SYSTEM: {
    title: '欣和-制造管理系统',
    entry: 'src/project/SYSTEM/main.ts',
    template: 'public/index.html',
    filename: 'SYSTEM.html',
    chunk: ['chunk-vendors', 'chunk-common', 'SYSTEM']
  }
}

const configureWebpack = {
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
}

module.exports = {
  pages,
  configureWebpack
}
