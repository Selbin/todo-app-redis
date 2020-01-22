const express = require('express')
const dotenv = require('dotenv')
const listRoutes = require('./server/routes/listRouter')
const todoRoutes = require('./server/routes/todoRouter')

const app = express()

dotenv.config()

app.use(express.json())
app.use('/list', listRoutes)
app.use('/todo', todoRoutes)

app.listen(process.env.APP_PORT, () => console.log('listening to port', process.env.APP_PORT))
