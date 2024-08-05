const mysql2 = require('mysql2'); 

const pool = mysql2.createPool({
    host:"localhost",
    user:"root",
    password:"legspin2803@",
    database:"login"
})  




module.exports=pool.promise();
