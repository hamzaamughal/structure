const express = require('express')
const colors = require('colors')
const morgan = require('morgan')

const { notFound, errorHandler } = require('./middleware/errorMiddleware.js')
const userRoutes = require('./routes/userRoutes.js')

require('dotenv').config()
const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Api is working.....' })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
