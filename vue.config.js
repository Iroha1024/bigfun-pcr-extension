const path = require('path')
const { IgnorePlugin } = require('webpack')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    plugins: [
      new IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': resolve('./src/plugins/ant-design-vue/icons.js')
      }
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/extension/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/extension/content-scripts.js'
            ]
          }
        }
      }
    }
  },
  css: {
    extract: false
  }
}
