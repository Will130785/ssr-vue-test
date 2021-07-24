const server = require('express')()
const rederVueApp = require('./render-vue-app')

server.get('*', rederVueApp)

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
