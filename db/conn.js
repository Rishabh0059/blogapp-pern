//connection 
require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    user: process.env.PG_URL,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT,
    ssl:{rejectUnauthorized:false}
});

async function check(){
    await client.connect()
    // const res = await client.query('SELECT * from blogs')
    // console.log(res.rows[0]) // Hello world!
    // await client.end()    
}

check();
module.exports = client;
