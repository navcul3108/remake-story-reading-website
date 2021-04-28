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
    let [rows, fields] = await conn.query("Select * from account");
    for(row of rows)
        sqlContent += `Insert into \`account\`(email, password, last_name, first_name) values ("${row.email}", "${row.password}", "${row.last_name}", "${row.first_name}")\n`
    sqlContent += "\n";

    [rows, fields] = await conn.query("Select * from role");
    for(row of rows)
        sqlContent += `Insert into role(email, role) values ("${row.email}", "${row.role}")\n`
    sqlContent += "\n";
            
    [rows, fields] = await conn.query("Select * from genre");
    for(row of rows)
        sqlContent += `Insert into genre(id, \`name\`, \`description\`) values ("${row.id}", "${row.name}", "${row.description}")\n`;
    sqlContent += "\n";

    [rows, fields] = await conn.query("Select * from story");
    for(row of rows)
        sqlContent += `Insert into story(id, \`name\`, \`description\`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("${row.id}", "${row.name}", '${row.description}', "${row.author}", "${row.upload_time}", "${row.last_modified}", "${row.image_path}", ${row.num_chapters}, ${row.num_pages}, ${row.rating}, ${row.genre_id})\n`;
    sqlContent += "\n";

    [rows, fields] = await conn.query("Select * from story_chapter");
    for(row of rows)
        sqlContent += `Insert into story_chapter(story_id, title, \`index\`, file_name, start_page, end_page) values ("${row.story_id}", "${row.title}", ${row.index}, ${row.start_page}, ${row.end_page})\n`;

    fs.writeFileSync("./SQL-query/populate_data.sql", sqlContent, {encoding: "utf-8"});
}

populateData().finally(()=>{
    console.log("Success");
})