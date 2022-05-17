const express = require('express')
const { usersRouter } = require('./routes/users.routes')
const { repairsRouter } = require('./routes/repairs.routes')
const { globalErrorHandler } = require('./controllers/errors.controllers')

const app = express()

app.use(express.json())

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/repairs', repairsRouter);

app.use('*', globalErrorHandler)

module.exports = {
  app
}