const express = require('express')
const app = express()
const PORT = 3001

app.listen(PORT, () => {
  console.log('server is running => ' + `http://localhost:${PORT}`)
})

app.use('/', express.static('./public'))
app.use('/intro', express.static('./public'))
app.use('/check', express.static('./public'))
