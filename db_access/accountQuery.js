const mysql = require("mysql2/promise");
require("dotenv").config();

const connConfig = require("./dbConfig").connConfig

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
    const queryString = `Select last_name, avatar_url From account where email="${email}" and password="${password}"`;

    let [rows, _] = await conn.execute(queryString);
    const isValid = rows.length ==1;
    let isAdmin = false;
    let lastName = null;
    const avatarUrl = rows[0].avatar_url;
    if(isValid){
        lastName = rows[0].last_name;
        let [rows2, _] = await conn.execute(`Select * from role where email="${email}" and role="admin"`);
        isAdmin = rows2.length ==1;
    }
    conn.end();
    return [isValid, isAdmin, lastName, avatarUrl];
}

async function getAccountProfile(email){
    const conn = await mysql.createConnection(connConfig);
    let [rows, _] = await conn.query("Select first_name, last_name, birthday, avatar_url from account where email=?", [email])
    await conn.end();
    if(rows.length===1){
        return {
            ...rows[0]
        }
    }
    else
        throw "Account is not exists";
}

async function updateProfile(email, firstName, lastName, birthday){
    const conn = await mysql.createConnection(connConfig);
    try{
        let [rows, _] = await conn.execute("Update account Set first_name=?,last_name=?,birthday=? Where email=?", [firstName, lastName, birthday, email]);
        await conn.end()
        return rows.affectedRows ===1;    
    }
    catch(e)
    {
        await conn.end();
        console.dir(e);
        return false;
    }
}

async function updateAvatar(email, new_avatar_url){
    const conn = await mysql.createConnection(connConfig);
    try{
        let [rows, _] = await conn.execute("Update account Set avatar_url=? Where email=?", [new_avatar_url, email]);
        await conn.end()
        return rows.affectedRows ===1;    
    }
    catch(e){
        await conn.end();
        console.dir(e);
        return false;
    }
}

module.exports={
    createAccount: createAccount,
    authenticateAccount: authenticateAccount,
    getAccountProfile,
    updateProfile,
    updateAvatar
}