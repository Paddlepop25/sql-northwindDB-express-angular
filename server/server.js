// 1. import all the node modules
const express = require('express'),
  bodyParser = require('body-parser'),
  secureEnv = require('secure-env'),
  cors = require('cors'),
  mysql = require('mysql2/promise')

// 2. construct new express object
const app = express()

// 3. Initialize all the relevant params for the  express middleware
app.use(cors())

//limit: '50mb' is to limit request so won't get hacked
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

// 4. Integrate with secure env
global.env = secureEnv({ secret: 'isasecret' })

// 5. get port env variable value fom secure env
const APP_PORT = global.env.APP_PORT
console.log('APP_PORT ---> ', APP_PORT)

// 6. create MySQL connection Pool to connect to database
// require to pass in all the database credentials (take from .env)
const pool = mysql.createPool({
  host: global.env.MYSQL_SERVER,
  port: global.env.MYSQL_SVR_PORT,
  user: global.env.MYSQL_USERNAME,
  password: global.env.MYSQL_PASSWORD,
  connectionLimit: global.env.MYSQL_CON_LIMIT,
  database: global.env.MYSQL_SCHEMA,
})

// 7. Construct SQL - select all statement and insert one record

// 8. Establish connection , take in params and query the RDBMS
// this is a javascript closure. it construct a function with 2 parameters: sql and pool
// the closure is function within a function and return a function
const makeQuery = (sql, pool) => {
  console.log('sql ---> ', sql)
  return async (args) => {
    const conn = await pool.getConnection()
    try {
      let results = await conn.query(sql, args || []) // once okay, it will bind to database and return results
      console.log('results[0] ---> ', results[0])
      return results[0] // [0] is data, [1] is metadata
    } catch (err) {
      console.log(err)
    } finally {
      conn.release()
    }
  }
}

const startApp = async (app, pool) => {
  const conn = await pool.getConnection()
  try {
    console.log('Test database connection...')
    await conn.ping()
    app.listen(APP_PORT, () => {
      console.log(`App started on ${APP_PORT}`)
    })
  } catch (error) {
    console.log(error)
  } finally {
    conn.release
  }
}

// 9. Create the closure function for the end point to
// perform crud operation against the database

app.use((req, res) => {
  res.redirect('/')
})

startApp(app, pool)
