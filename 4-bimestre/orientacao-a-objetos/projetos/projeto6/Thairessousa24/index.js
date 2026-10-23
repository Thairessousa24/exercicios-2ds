const express = require('express')
const app = express()

const routerPrincipal = require('./routes')

app.use(express.json());
app.use('/api', routerPrincipal)

module.exports = app