const path = require('path')

const pages = {
  index: {
    title: '欣和-MDS综合管理平台',
    entry: 'src/views/LOGIN/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    chunk: ['chunk-vendors', 'chunk-common', 'index']
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
