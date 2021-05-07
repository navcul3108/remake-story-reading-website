const mysql = require("mysql2/promise");
const { stringify } = require("uuid");
require("dotenv").config();

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

async function updateTitleOfChapter(story_id, index, new_title){
    const conn = await mysql.createConnection(connConfig);
    try{
        await conn.execute("Update story_chapter Set title = ? where story_id = ? and `index` = ?", [new_title, story_id, index]);
        await conn.end();
        return true;
    }
    catch(e){
        console.error(e);
        await conn.rollback();
        await conn.end();
        return false;
    }
}

async function insertNewChapter(story_id, title, num_pages, file_name){
    const conn = await mysql.createConnection(connConfig);
    try{
        await conn.execute("Call insert_new_chapter(?, ?, ?, ?)", [story_id, title,file_name, num_pages]);
        await conn.end();
        return true;
    }
    catch(e){
        console.error(e);
        await conn.rollback();
        await conn.end();
        return false;
    }
}

module.exports = {
    updateTitleOfChapter: updateTitleOfChapter,
    insertNewChapter: insertNewChapter
}