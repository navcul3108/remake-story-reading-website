const mysql = require("mysql2/promise");
require("dotenv").config();

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

async function listAllGenres(){
    const conn = await mysql.createConnection(connConfig);
    const queryString = "Select * From genre";
    const [rows, _] = await conn.execute(queryString);
    let result = [];
    rows.forEach((row, _)=>{
        result.push({
            id: row.id,
            name: row.name,
            description: row.description
        })
    });
    await conn.end();
    return result;
}

async function updateGenre(id, name, description){
    const queryString = `Update genre Set name="${name}", description="${description}" where id=${id}`;
    const conn = await mysql.createConnection(connConfig);

    let isSuccess = true;
    const [rows, _] = await conn.execute(queryString).catch(err=>{isSucess=false;});
    await conn.end();
    return isSuccess;
}

async function insertGenre(name, description){
    const queryString = `Insert into genre(name, description) values("${name}", "${description}")`;
    const conn = await mysql.createConnection(connConfig);

    let isSuccess = true;
    const [rows, _] = await conn.execute(queryString).catch(err=> {isSuccess=false;});
    await conn.end();
    return isSuccess;
}

module.exports = {
    listAllGenres: listAllGenres,
    updateGenre: updateGenre,
    insertGenre: insertGenre
}