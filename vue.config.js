module.exports = {
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
