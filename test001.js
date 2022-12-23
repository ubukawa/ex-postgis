const config = require('config')
const { Pool, Query } = require('pg')

// config constants
const host = config.get('host')
const port = config.get('port')
const dbUSer = config.get('dbUser')
const dbPassword = config.get('dbPassword')
const relations = config.get('relations')

let pools = {}

for (relation of relations){
    const [database, schema, view] = relation.split('::')
    if(!pools[database]){
        pools[database] = new Pool({
            host: host,
            user: dbUSer,
            port: port,
            password: dbPassword,
            database: database
        })
    }
    pools[database].connect(async (err, client, release) => {
        if (err) throw err
        //let sql = `SELECT count(*) FROM ${schema}.${view} `
        let sql = `SELECT * FROM ${schema}.${view} limit 1`
        let res = await client.query(sql)
        console.log(res.rows) //rows contains sql response
        await client.end()
        release()
    })    
}
