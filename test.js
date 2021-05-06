const mysql = require("mysql2/promise");
require("dotenv").config();
const fs = require("fs");

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

async function populateData(){
    let sqlContent = "Use story_reading_website";
    const conn = await mysql.createConnection(connConfig);
    let [rows, fields] = await conn.query("Select email from account");
    for(row of rows){
        let rate = Math.ceil(Math.random()*5) ;  
        await conn.execute("Insert into rating(story_id, email, rate) Values(?, ?, ?)", ["2563d480-a76f-11eb-9cad-272a2cc7219a", row.email, rate]);
    }

    await conn.end();
}

var arr = [{a: 1},{a:2},{a:3}];
var sum = arr.reduce((pre, cur)=>pre+=cur.a, 0);
console.log(sum);