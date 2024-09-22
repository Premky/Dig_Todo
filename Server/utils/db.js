import mysql from 'mysql'

const con = mysql.createConnection({
    host:'localhost',
    user:'software',    
    password:'Mark3@Rifile',
    database:'kppo_program'
})

// const con = mysql.createConnection({
//     host:'localhost',
//     user:'root',    
//     password:'',
//     database:'kppo_program'
// })

con.connect(function(err){
    if(err){
        console.log("Connection Error")
    }
    else{
        console.log("Connected")
    }
})

export default con;