'use strict'

const express = require('express')
const mysql = require('mysql')
const port = 8888
const config = {
  host: "127.0.0.1",
  user: "root",
  password: "example",
  port: 3306,
  database: "arrowdb"
}

const mustacheExpress = require('mustache-express');

function run() {
  let app = express()
  app.listen(port)

  app.engine('html', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/templates')

  app.get('/', showHomePage)
}

function showHomePage(req, res) {
  executeQuery('SELECT venue, start_date FROM tournament', (result) => {

    res.render('full-page.html', {"dbresult": result})
  })
}

function executeQuery(sql, callback) {
  let connection = mysql.createConnection(config)
  connection.connect((err) => {
    if (err) throw err;

    connection.query(sql, (err, result) => {
      if (err) throw err;

      connection.destroy()
      callback(result)
    })
  })
}

run()
