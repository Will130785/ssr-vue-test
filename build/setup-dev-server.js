// const fs = require('fs')
// const path = require('path')
// const MFS = require('memory-fs')
// const webpack = require('webpack')
// const chokidar = require('chokidar')
// const clientConfig = require('./webpack.client')
// const serverConfig = require('./webpack.server')

// const readFile = (fs, file) => {
//   try {
//     return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
//   } catch (err) {
//     console.log(err)
//   }
// }

// module.exports = function setupDevServer (app, templatePath, cb) {
//   let bundle
//   let template
//   let clientManifest

//   let ready
//   const readyPromise = new Promise(r => { ready = r })
//   const update = () => {
//     if (bundle && clientManifest) {
//       ready()
//       cb(bundle, {
//           template,
//           clientManifest
//       })
//     }
//   }

//   template = fs.readFileSync(templatePath, 'utf-8')
//   chokidar.watch(templatePath).on('change', () => {
//     template = fs.readFileSync(templatePath, 'utf-8')
//     console.log('index.html template updated')
//     update()
//   })

//   clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
//   clientConfig.output.filename = '[name].js'
//   clientConfig.plugins.push(
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin()
//   )

//   const clientCompiler = webpack(clientConfig)
//   const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
//     publicPath: clientConfig.output.publicPath
//   })

//   // app.use(require('webpack-dev-middleware')(clientCompiler, {
//   //   publicPath: clientConfig.output.publicPath,
//   //   serverSideRender: true
//   // }))
//   app.use(devMiddleware)
//   clientCompiler.hooks.done.tap('done', stats => {
//     stats = stats.toJson()
//     stats.errors.forEach(err => console.error(err))
//     stats.warnings.forEach(err => console.warn(err))
//     if (stats.errors.length) return
//     clientManifest = JSON.parse(readFile(
//       devMiddleware.fileSystem,
//       'vue-ssr-client-manifest.json'
//     ))
//     console.log('STATS', clientManifest)
//     update()
//   })

//   app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

//   const serverCompiler = webpack(serverConfig)
//   const mfs = new MFS()
//   serverCompiler.outputFileSystem = mfs
//   serverCompiler.watch({}, (err, stats) => {
//     if (err) throw err
//     stats = stats.toJson()
//     if (stats.errors.length) return

//     bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
//     update()

//   })
//   return readyPromise
// }

// const setupDevServer = (app, onServerBundleReady) => {
//   const webpack = require('webpack')
//   const MFS = require('memory-fs')
//   const path = require('path')
//   const clientConfig = require('./webpack.client.js')
//   const serverConfig = require('./webpack.server.js')

//   clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]

//   const clientCompiler = webpack(clientConfig)

//   app.use(require('webpack-dev-middleware')(clientCompiler, {
//     publicPath: clientConfig.output.publicPath,
//     serverSideRender: true
//   }))

//   app.use(require('webpack-hot-middleware')(clientCompiler))

//   global.console.log('Building SSR bundle...')
//   const serverCompiler = webpack(serverConfig)
//   const mfs = new MFS()

//   serverCompiler.outputFileSystem = mfs
//   serverCompiler.watch({}, (error, stats) => {
//     if (error) throw error

//     global.console.log(
//       `
//         ${stats.toString({
//           colors: true,
//           modules: false,
//           children: false,
//           chunks: false,
//           chunkModules: false
//         })}\n\n
//       `
//     )

//     if (stats.hasErrors()) {
//       console.error(stats.compilation.errors)
//       throw new Error(stats.compilation.errors)
//     }

//     const bundle = JSON.parse(mfs.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json'), 'utf-8'))
//     onServerBundleReady(bundle)
//   })
// }

// module.exports = setupDevServer


const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client')
const serverConfig = require('./webpack.server')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {}
}

module.exports = function setupDevServer (app, templatePath, cb) {
  let bundle
  let template
  let clientManifest

  let ready
  const readyPromise = new Promise(r => { ready = r })
  const update = () => {
    if (bundle && clientManifest) {
      ready()
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }

  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('index.html template updated.')
    update()
  })

  // modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    serverSideRender: true
  })
  app.use(devMiddleware)
  clientCompiler.hooks.done.tap('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    console.log(clientCompiler.outputFileSystem)
    devMiddleware.fileSystem = clientCompiler.outputFileSystem
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    update()
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return

    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    update()
  })

  return readyPromise
}