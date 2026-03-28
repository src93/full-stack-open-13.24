const config = require('./utils/config')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const routerUsers = require('./controllers/users')
const routerBlog = require('./controllers/blogs')
const routerLogin = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : null
})

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :response-time :status :body'))
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/user', routerUsers)
app.use('/api/blog', routerBlog)
app.use('/api/login', routerLogin)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app