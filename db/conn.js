//connection 
require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
   connectionString:process.env.DB_URL,
   ssl:{
    rejectUnauthorized:false
   }
});

async function check(){
    await client.connect()
    // const res = await client.query('SELECT * from blogs')
    // console.log(res.rows[0]) // Hello world!
    // await client.end()    
}

check();
module.exports = client;
