const path = require('path')

const pages = {
  index: {
    title: '欣和-MSS综合管理平台',
    entry: 'src/project/LOGIN/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    chunk: ['chunk-vendors', 'chunk-common', 'index']
  },
  SYSTEM: {
    title: '欣和-MSS综合管理平台',
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
  devServer: {
    disableHostCheck: true
  },
  pages,
  configureWebpack,
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  }
}
