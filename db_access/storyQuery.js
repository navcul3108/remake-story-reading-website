const mysql = require("mysql2/promise");
require("dotenv").config();
const scissors = require("scissors");
const fs = require("fs");
const path = require("path");

async function splitStoryIntoChapters(filePath, id, genreId, image_path, chapters)
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

async function createStory(id, name, author, description, image_path, num_chapters, genre_id, num_pages, chapters, uploadFilePath){
    const conn = await mysql.createConnection(connConfig);
    let isSucess = true;
    const now = new Date();
    await conn.execute("Insert into story(id, name, description, author, upload_time, last_modified, image_path, num_chapters, genre_id, num_pages) Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                        [id, name, description, author, now, now, image_path, num_chapters, genre_id, num_pages])
                .catch(err=>{
                    console.log(err);
                    conn.rollback();
                    isSucess = false;
                })
    await conn.end();
    if(isSucess){
        isSucess = await createStoryChapters(id, chapters);
        if(isSucess){
            isSucess = await splitStoryIntoChapters(uploadFilePath, id, genre_id, image_path, chapters);
        }
    }
    return isSucess;
}

async function listStory(genre_id){
    console.log(genre_id)
    const conn = await mysql.createConnection(connConfig);
    let row = null, _= null;
    if(genre_id==null){
        [rows, _] = await conn.query("Select id, name, author, image_path, genre_id, rating From story");
    }
    else{
        [rows, _] = await conn.query("Select id, name, author, image_path, genre_id, rating From story where id = ?", [genre_id]);
    }
    await conn.end();
    let result = [];
    for(row of rows)
        result.push({
           id: row.id,
           name: row.name,
           author: row.author,
           genre_id: row.genre_id,
           image_path: row.image_path,
           rating: row.rating               
        })
    return result;
}

async function getStoryInformation(id, return_chapters=false){
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, genre_id, num_pages, rating, genre_name, genre_description From story_and_genre_view where id = ?", [id])
    if(rows.length==1){
        const row = rows[0];
        let story_info = {
            id: id, 
            name: row.name,
            description: row.description,
            author: row.author,
            upload_time: row.upload_time,
            last_modified: row.last_modified,
            image_path: row.image_path,
            num_chapters: row.num_chapters,
            genre_id: row.genre_id, 
            num_pages: row.num_pages,
            rating: row.rating,
            genre_name: row.genre_name,
            genre_description: row.genre_description
        };
        if(return_chapters){
            const [rows2, fields2] = await conn.query("Select * from story_chapter where story_id=? order by `index` asc", [id]);
            let chapters = rows2.map((row, idx)=>{
                return {
                    index: row.index,
                    title: row.title,
                    link : `/story/read?id=${id}&index=${row.index}`,
                    start_page: row.start_page,
                    end_page: row.end_page,
                    num_page: row.end_page-row.start_page+1
                }
            });
            story_info["chapters"] = chapters;
        }
        await conn.end();
        return story_info;
    }
    else{
        await conn.end();
        return null;
    }
}

async function getChapterInformation(id, index){
    if(index<=0)
        return null;

    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select * from story_chapter where story_id=? and `index`=?", [id, index]);
    if(rows.length==1){
        let chapter_info = rows[0];
        const [rows2, fields2] = await conn.query("Select name,num_chapters from story where id=?", [id]);
        chapter_info.story_name = rows2[0].name;
        chapter_info.prev_link = null;
        chapter_info.next_link = null;
        if(index>1)
            chapter_info.prev_link = `/story/read?id=${id}&index=${index-1}`;
        
        if(index<rows2[0].num_chapters-1)
            chapter_info.next_link = `/story/read?id=${id}&index=${index+1}`;

        await conn.end();
        return chapter_info;
    }
    else{
        await conn.end();
        return null;
    }

}

module.exports = {
    createStory: createStory,
    getStoryInformation: getStoryInformation,
    listStory: listStory,
    getChapterInformation: getChapterInformation
}