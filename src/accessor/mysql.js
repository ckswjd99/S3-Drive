const mysql = require('mysql')

class MySqlAccessor {
  constructor(host, user, password, dbname, poolNum=10) {
    const dbConfig = {
      host, user, password, dbname, 
      connectionLimit: poolNum
    }
    this.dbPool = mysql.createPool(dbConfig)
  }

  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if(!err) {
          conn.query(sqlQuery, (err, result) => {
            conn.release()
            if (!err) resolve(result)
            else reject(err)
          })
        }
        else reject(err)
      })
    })
  }

  select (table, columns, where) {
    const cols = columns.join(',')
    const sqlQuery = `SELECT ${cols} FROM ${table} ${where ? `WHERE ${where}` : ''}`
    return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if(!err) {
          conn.query(sqlQuery, (err, result) => {
            conn.release()
            if (!err) resolve(result)
            else reject(err)
          })
        }
        else reject(err)
      })
    })
  }

  selectOne (table, columns, where) {
    const cols = columns.join(',')
    const sqlQuery = `SELECT ${cols} FROM ${table} ${where ? `WHERE ${where}` : ''}`
    return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if(!err) {
          conn.query(sqlQuery, (err, result) => {
            conn.release()
            if (!err) resolve(result === [] ? null : result[0])
            else reject(err)
          })
        }
        else reject(err)
      })
    })
  }

  insert (table, keyval) {
    const keys = Object.keys(keyval).join(',')
    const vals = Object.values(keyval).map(v => `'${v}'`).join(',')
    const sqlQuery = `INSERT INTO ${table} (${keys}) VALUES (${vals});`
    return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if(!err) {
          conn.query(sqlQuery, (err, result) => {
            conn.release()
            if (!err) resolve(result)
            else reject(err)
          })
        }
        else reject(err)
      })
    })
  }

  update (table, set, where) {
    const keys = Object.keys(set)
    const vals = Object.values(set)
    const setQuery = keys.map((k, i) => `${k}='${vals[i]}'`).join(',')
  
    const sqlQuery = `UPDATE ${table} SET ${setQuery} WHERE ${where}`
    return new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if(!err) {
          conn.query(sqlQuery, (err, result) => {
            conn.release()
            if (!err) resolve(result)
            else reject(err)
          })
        }
        else reject(err)
      })
    })
  }
}


module.exports = MySqlAccessor
