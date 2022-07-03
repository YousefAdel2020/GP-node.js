const { Client } = require('pg')

const client = new Client({
    user: process.env.DBUSERNAME,
    host: process.env.DBLOCALHOST,
    database: process.env.DBNAME,
    password: process.env.DBUSERPASSWORD,
    port: process.env.DBPORT,
  })
  
client.connect(function(err) {
    if (err) {
      console.log("Can not connect with DB yaaah", err)
      throw err;
    }
    console.log("Connected!");
});

module.exports = client

// TODO: Delete it
// testing the database
client.query('SELECT * from public.auth_user', (err, data) => {
  if (err) {
      console.log("error", err.stack)
  } else {
      console.log("Suc", data.rows)
      users = data.rows;
  }
})