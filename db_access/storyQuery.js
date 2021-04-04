const mysql = require("mysql2/promise");
require("dotenv").config();
const scissors = require("scissors");
const fs = require("fs");
const path = require("path");

async function pageStoryIntoChapters(filePath, id, genreId, image_path, chapters)
{
    if(!fs.existsSync(filePath))
        return false;

    var pdf = scissors(path.resolve(filePath));
    if(!fs.existsSync(`./public/pdf/${genreId}/`))
        fs.mkdirSync(`./public/pdf/${genreId}`);

    let successFlag = true;
    const num_chapters = chapters.length;
    const numPages = await pdf.getNumPages();
    try{
        for(var idx in chapters){
            let chapter = chapters[idx];
            if(chapter.start_page>numPages || chapter.end_page>numPages)
            {
                successFlag = false;
                break;
            }
            if(chapter.start_page<=chapter.end_page && successFlag)
                pdf.range(chapter.start_page, chapter.end_page)
                    .pdfStream()
                    .pipe(fs.createWriteStream(`./public/${chapter.file_name}`))
                    .on("finish", ()=>{
                        console.log("Save file successfully!");
                    })
                    .on("error", (err)=>{
                        console.log(err.message);
                        successFlag = false;
                    });
        }
    }
    catch(err){
        console.log(err.message);
    }
    //fs.rmSync(filePath);
    pdf.cleanup();
    return successFlag;
}

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

async function createStoryChapters(id, chapters){
    const conn = await mysql.createConnection(connConfig);
    var queryString = "Insert into story_chapter(story_id, title, `index`, file_name, start_page, end_page) Values(?, ?, ?, ?, ?, ?)";
    let isSucess = true;

    for(var i in chapters)
    {
        var chapter = chapters[i];
        await conn.execute(queryString, [id, chapter.title, chapter.index, chapter.file_name, chapter.start_page, chapter.end_page])
                .catch(err=>{
                    console.log(err);
                    conn.rollback();
                    isSucess=false;
                });
        if(!isSucess)
            break;
    }

    await conn.end();
    return isSucess;
}

async function createStory(id, name, author, description, image_path, num_chapters, genre_id, chapters, uploadFilePath){
    const conn = await mysql.createConnection(connConfig);
    let isSucess = true;
    const now = new Date();
    await conn.execute("Insert into story(id, name, description, author, upload_time, last_modified, image_path, num_chapters, genre_id) Values(?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                        [id, name, description, author, now, now, image_path, num_chapters, genre_id])
                .catch(err=>{
                    console.log(err);
                    conn.rollback();
                    isSucess = false;
                })
    await conn.end();
    if(isSucess){
        isSucess = await createStoryChapters(id, chapters);
        if(isSucess){
            isSucess = await pageStoryIntoChapters(uploadFilePath, id, genre_id, image_path, chapters);
        }
    }
    return isSucess;
}

module.exports = {
    createStory: createStory
}