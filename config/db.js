const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'hamza',
  database: 'library',
  charset: 'utf8mb4',
})

db.connect((err) => {
  if (err) {
    throw err
  }
  console.log(`Connected to database`.cyan.underline.bold)
})

module.exports = db
