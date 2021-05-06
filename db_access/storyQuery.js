const mysql = require("mysql2/promise");
require("dotenv").config();
const scissors = require("scissors");
const fs = require("fs");
const path = require("path");
const { exception } = require("console");

const connConfig = {
    host: "localhost",
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
};

async function removeIncompleteStory(story_id){
    const conn = await mysql.createConnection(connConfig);
    await conn.execute("Delete from story_chapters where story_id = ?", [story_id]);
    await conn.execute("Delete from story where id = ?", [story_id]);
    await conn.end();
}
/**
 *  Split PDF according to information in chapters
 *
 * @param {Command} pdf
 * @param {Array} chapters: Information of list chapters
 * @param {number} [current_index=0]
 * @param {string} story_id: id of story
 */
function splitPDFRecursively(file_path, pdf, story_id, chapters, num_pages, current_index = 0) {
    if (current_index >= chapters.length) {
        pdf.cleanup();
        if(fs.existsSync(path.resolve(file_path))){
            fs.unlinkSync(path.resolve(file_path));
            console.log("deleted temporary file "+file_path);    
        }
    }
    else {
        chapter = chapters[current_index];
        if (chapter.start_page > num_pages || chapter.end_page > num_pages) {
            throw exception("Chapter page information is incorrect!");
        }
        if (chapter.start_page <= chapter.end_page){
            console.log(`Writing on file ${chapter.file_name}, index: ${current_index}`);
            pdf.range(chapter.start_page, chapter.end_page)
            .pdfStream()
            .pipe(fs.createWriteStream(`./public/${chapter.file_name}`))
            .on("finish", () => {
                console.log(`Successfully!`);
                splitPDFRecursively(file_path, pdf, story_id, chapters, num_pages, current_index+1);
            })
            .on("error", (err) => {
                console.log("Error when splitting pdf: " + err.message);
                let temp_idx = 0;
                while(temp_idx<current_index){
                    fs.unlinkSync(chapters[temp_idx].file_name)
                    temp_idx ++;
                }
                fs.unlinkSync(path.resolve(file_path));
                removeIncompleteStory(story_id);
            });

        }
    }
}

async function splitStoryIntoChapters(filePath, id, genreId, chapters) {
    if (!fs.existsSync(filePath))
        return false;

    var pdf = scissors(path.resolve(filePath));
    if (!fs.existsSync(`./public/pdf/${genreId}/`))
        fs.mkdirSync(`./public/pdf/${genreId}`);

    const num_chapters = chapters.length;
    const num_pages = await pdf.getNumPages();
    try {
        splitPDFRecursively(filePath, pdf, id, chapters, num_pages);
    }
    catch (err) {
        console.log(err.message);
        return false;
    }
    return true;
}


async function createStoryChapters(id, chapters) {
    const conn = await mysql.createConnection(connConfig);
    var queryString = "Insert into story_chapter(story_id, title, `index`, file_name, start_page, end_page) Values(?, ?, ?, ?, ?, ?)";
    let isSucess = true;

    for (var i in chapters) {
        var chapter = chapters[i];
        await conn.execute(queryString, [id, chapter.title, chapter.index, chapter.file_name, chapter.start_page, chapter.end_page])
            .catch(err => {
                console.log(err);
                conn.rollback();
                isSucess = false;
            });
        if (!isSucess)
            break;
    }

    await conn.end();
    return isSucess;
}

async function createStory(id, name, author, description, image_path, num_chapters, genre_id, num_pages, chapters, uploadFilePath) {
    const conn = await mysql.createConnection(connConfig);
    let isSucess = true;
    const now = new Date();
    await conn.execute("Insert into story(id, name, description, author, upload_time, last_modified, image_path, num_chapters, genre_id, num_pages) Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, description, author, now, now, image_path, num_chapters, genre_id, num_pages])
        .catch(err => {
            console.log(err);
            conn.rollback();
            isSucess = false;
        })
    await conn.end();
    if (isSucess) {
        isSucess = await createStoryChapters(id, chapters);
        if (isSucess) {
            isSucess = await splitStoryIntoChapters(uploadFilePath, id, genre_id, chapters);
        }
    }
    return isSucess;
}

async function listStory(genre_id) {

    const conn = await mysql.createConnection(connConfig);
    let row = null, _ = null;
    if (genre_id == null) {
        [rows, _] = await conn.query("Select id, name, author, image_path, genre_id, rating From story");
    }
    else {
        [rows, _] = await conn.query("Select id, name, author, image_path, genre_id, rating From story where genre_id = ?", [genre_id]);
    }
    await conn.end();
    let result = [];
    for (row of rows)
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

async function getStoryInformation(id, return_chapters = false) {
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, genre_id, num_pages, rating, genre_name, genre_description From story_and_genre_view where id = ?", [id])
    if (rows.length == 1) {
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

        // Get rating information
        let [rows3, fields3] = await conn.query("Select rate, count(*) as 'num_rates' from rating where story_id=? group by rate order by rate desc;", [id]);
        let sum = rows3.reduce((pre, cur)=> pre+=cur.num_rates, 0);
        let rating_info = {};
        for(rate_info of rows3)
            rating_info[rate_info.rate] = {percent: 100*rate_info.num_rates/sum, num_rates: rate_info.num_rates}
        story_info.rating_info = rating_info;

        if (return_chapters) {
            const [rows2, fields2] = await conn.query("Select * from story_chapter where story_id=? order by `index` asc", [id]);
            let chapters = rows2.map((row, idx) => {
                return {
                    index: row.index,
                    title: row.title,
                    link: `/story/read?id=${id}&index=${row.index}`,
                    start_page: row.start_page,
                    end_page: row.end_page,
                    num_page: row.end_page - row.start_page + 1
                }
            });
            story_info["chapters"] = chapters;
        }
        await conn.end();
        return story_info;
    }
    else {
        await conn.end();
        return null;
    }
}

async function getChapterInformation(id, index) {
    if (index <= 0)
        return null;

    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select * from story_chapter where story_id=? and `index`=?", [id, index]);
    if (rows.length == 1) {
        let chapter_info = rows[0];
        const [rows2, fields2] = await conn.query("Select name,num_chapters from story where id=?", [id]);
        chapter_info.story_name = rows2[0].name;
        chapter_info.prev_link = null;
        chapter_info.next_link = null;
        if (index > 1)
            chapter_info.prev_link = `/story/read?id=${id}&index=${index - 1}`;

        if (index < rows2[0].num_chapters - 1)
            chapter_info.next_link = `/story/read?id=${id}&index=${index + 1}`;

        await conn.end();
        return chapter_info;
    }
    else {
        await conn.end();
        return null;
    }
}

async function getAllStoryName() {
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select name from story");
    await conn.end();
    return rows.map((ele, idx) => ele.name);
}

async function findStoryIdByName(name) {
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select id from story where `name`=?", [name]);
    if (rows.length == 1)
        return rows[0].id;
    else
        return null;
}

async function updateStory(story_id, name, author, description){
    const conn = await mysql.createConnection(connConfig);
    await conn.execute("Call update_story(?, ?, ?, ?)", [story_id, name, author, description]);
    await conn.end();
}

async function deleteStory(story_id){
    const conn = await mysql.createConnection(connConfig);
    await conn.execute("Call delete_story(?)", [story_id]);
    await conn.end();
}

async function getAllStory(){
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select id, `name`, author, `description` from story");
    await conn.end();
    return rows;
}

async function rateStory(story_id, email, rating){
    if(1<= rating && rating<=5){
        const conn = await mysql.createConnection(connConfig);
        try{
            await conn.execute("Insert into rating(story_id, email, rate) values(?, ?, ?)", [story_id, email, rating]);
            return true;
        }
        catch(e){
            await conn.rollback();
            console.log("Error while rating story: ", e);
            return false;
        }
    }
    return false;
}

async function checkUserReviewedStory(email, story_id){
    const conn = await mysql.createConnection(connConfig);
    const [rows, fields] = await conn.query("Select * from rating where email=? and story_id = ?", [email, story_id]);
    await conn.end();
    return rows.length>0;
}

module.exports = {
    createStory: createStory,
    getStoryInformation: getStoryInformation,
    listStory: listStory,
    getChapterInformation: getChapterInformation,
    getAllStoryName: getAllStoryName,
    findStoryIdByName: findStoryIdByName,
    updateStory: updateStory,
    deleteStory: deleteStory,
    getAllStory: getAllStory,
    rateStory: rateStory,
    checkUserReviewedStory: checkUserReviewedStory
}