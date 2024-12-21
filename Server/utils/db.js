import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// const con = mysql.createConnection({
<<<<<<< HEAD
//     host:'localhost',
=======
//     host:'192.168.162.15',
//     port:'3306',
>>>>>>> 1baa66d62f13ffceb515ebc3de2ef77081f841e8
//     user:'software',    
//     password:'Mark3@Rifile',
//     database:'kppo_program'
// })
port:process.env.DB_PORT; 

const con = mysql.createConnection({
    host:process.env.DB_HOST,
    ...(process.env.DB_PORT && { port: process.env.DB_PORT }),
    user:process.env.DB_USER,    
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    ssl:{
        rejectUnauthorized:false,
    }
})
console.log(con)

const con = mysql.createConnection({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,    
    user:process.env.DB_USER,    
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    ssl:{
        rejectUnauthorized:false,
    }
})

con.connect(function(err){
    if(err){
        console.log("Connection Error")
    }
    else{
        console.log("Connected")
    }
})

export default con;