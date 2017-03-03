'use strict'

const q = require('q')

class SnowflakeConnectionPromisified {
  constructor(connection) {
    this.connection = connection
    this.connect = q.nbind(this.connection.connect, this.connection)
  }

  execute(sqlStatement) {
    return q.Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: sqlStatement,
        complete: (err, stmt, rows) => {
          if (err) {
            reject(err)
            return
          }
          resolve({stmt: stmt, rows: rows})
        }
      })
    })
  }
}

module.exports = SnowflakeConnectionPromisified