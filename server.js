const express = require('express')
const rederVueApp = require('./render-vue-app')
const app = express()

app.use('/dist', express.static('./dist'))
app.get('*', rederVueApp)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
