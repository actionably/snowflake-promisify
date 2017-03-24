'use strict'

const q = require('q')
const _ = require('lodash')

class SnowflakeConnectionPromisified {
  constructor(connection) {
    this.connection = connection
    this.connectAsync = q.nbind(this.connection.connect, this.connection)
    this.destroyAsync = q.nbind(this.connection.destroy, this.connection)
  }

  executeAsync(sqlStatementOrParams) {
    return q.Promise((resolve, reject) => {
      const complete = (err, stmt, rows) => {
        if (err) {
          reject(err)
          return
        }
        resolve({stmt: stmt, rows: rows})
      }
      let params = {}
      if (_.isString(sqlStatementOrParams)) {
        params.sqlText = sqlStatementOrParams
      } else {
        params = _.clone(sqlStatementOrParams)
      }
      params.complete = complete
      this.connection.execute(params)
    })
  }
}

module.exports = SnowflakeConnectionPromisified