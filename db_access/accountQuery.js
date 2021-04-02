const mysql = require("mysql2/promise");
require("dotenv").config();

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

/**
 *
 *  Create an account, if operation is success, return true otherwise return false
 * @param {*} email
 * @param {*} password
 * @param {*} firstName
 * @param {*} lastName
 * @return {boolean} 
 */
async function createAccount(email, password, firstName, lastName){
    const conn = await mysql.createConnection(connConfig);
    const queryString = `Insert into account(email, password, first_name, last_name) Values("${email}", "${password}", "${firstName}", "${lastName}")`;
    let isSucess = true;

    const _ = await conn.execute(queryString).catch(err => {isSucess=false;});
    if(isSucess){
        const __ = await conn.execute(`Insert into role(email) values("${email}")`)
            .catch(err=>{
                isSucess=false;
                conn.execute(`Delete From account where email="${email}"`);
            });
    }
    conn.end();
    return isSucess;
}

/**
 * Create an account with default role.
 *
 * @param {*} email
 * @param {*} password
 * @return {Array} isValid, isAdmin, lastName 
 */
async function authenticateAccount(email, password){
    const conn = await mysql.createConnection(connConfig);
    const queryString = `Select last_name From account where email="${email}" and password="${password}"`;

    let [rows, _] = await conn.execute(queryString);
    const isValid = rows.length ==1;
    let isAdmin = false;
    let lastName = null;
    if(isValid){
        lastName = rows[0].last_name;
        let [rows2, _] = await conn.execute(`Select * from role where email="${email}" and role="admin"`);
        isAdmin = rows2.length ==1;
    }
    conn.end();
    return [isValid, isAdmin, lastName];
}

module.exports={
    createAccount: createAccount,
    authenticateAccount: authenticateAccount
}