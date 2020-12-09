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
const SQL_queryComputeOrdersView = `SELECT * from compute_orders WHERE id=?`

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
    } catch (error) {
      console.log('Error in querying SQL ---> ', error)
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
    console.log('Error in connecting to database ---> ', error)
  } finally {
    conn.release
  }
}

// 9a. Test homepage
app.get('/', (req, res) => {
  res.status(200)
  res.type('application/json')
  res.send({ Hello: 'Kitty' })
})

// 9b. Create the closure function for the end point to
// perform crud operation against the database
const executeComputeOrdersView = makeQuery(SQL_queryComputeOrdersView, pool)

app.get('/order/total/:orderId', (req, res) => {
  const orderIdParam = req.params.orderId
  // console.log('orderIdParam ---> ', orderIdParam)
  executeComputeOrdersView([orderIdParam])
    .then((results) => {
      console.log('results.length ---> ', results.length)
      if (results.length > 0) {
        res.format({
          html: () => {
            console.log('html --->')
            res.status(200)
            res.send('<h1>Hello Kitty</h1>' + JSON.stringify(results))
          },
          json: () => {
            console.log('json ---> ')
            res.status
            res.json(results)
          },
        })
      } else {
        throw new Error('No record found') // check his code
      }
    })
    .catch((error) => {
      console.log('error ---> ', error)
      res.status(500)
      res.send(error)
    })
})

// 10. Redirects back to homepage if resource not found
app.use((req, res) => {
  res.redirect('/')
})

// 11. Start the app
startApp(app, pool)
