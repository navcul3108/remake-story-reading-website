var express = require('express');
var router = express.Router();
const storyQuery = require("../db_access/storyQuery");
const fs = require("fs");
const uuid = require("uuid");
var multer = require("multer");
const chapterQuery = require('../db_access/chapterQuery');
const scissors = require("scissors");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      const folderDir = `./temporFiles/`;
      if(!fs.existsSync(folderDir))
        fs.mkdirSync(folderDir);
      cb(null, folderDir);
    },
    filename: (req, file, cb)=>{
      const format = file.originalname.split(".").pop();
      cb(null, uuid.v1()+"."+format);
    }
})

var upload = multer({storage: storage});

router.get("/manage",async (req, res)=>{
    if(req.session.isAdmin)
    {
        const story_id = req.query.story_id;
        const story_info = await storyQuery.getStoryInformation(story_id);
        res.render("chapter/manage", {story_info: story_info});
    }
    else
        res.render("error", {message: "Bạn không phải Admin!"});
})

/* Return json data containing all chapter infomation of a story */
router.get("/all-chapter",async (req, res)=>{
    const story_id = req.query.story_id;
    const chapters = await storyQuery.getAllChapters(story_id);
    res.status(200).json(chapters);
})

/*AJAX request */
router.post("/update",async (req, res)=>{
    if(req.session.isAdmin){
        let {story_id, index, title} = req.body;
        if(story_id==null || index==null || title==null)
            res.status(400).json("Bad request!");
        else{
            index = parseInt(index);
            const isSuccess = await chapterQuery.updateTitleOfChapter(story_id, index, title);
            if(isSuccess)
                res.status(200).json("Cập nhật thành công!");
            else
                res.status(500).json("Có lỗi xảy ra trong quá tình xử lý");   
        }
    }   
    else{
        res.status(400).json("Bạn không phải Admin!");
    }
})

router.post("/insert", upload.single("chapter_file"), async (req, res)=>{
    if(req.session.isAdmin){
        const {body} = req;
        let {story_id, genre_id, title, num_chapters} = body;
        num_chapters = parseInt(num_chapters);
        const file = req.file;

        if(!fs.existsSync(`./public/pdf/${genre_id}/`))
            fs.mkdirSync(`./public/pdf/${genre_id}/`);

        var pdf = scissors(path.resolve("./"+file.path));
        const num_pages = await pdf.getNumPages();

        const file_name = `/pdf/${genre_id}/${story_id}_${num_chapters+1}.pdf`;
        fs.rename(path.resolve("./"+file.path), path.resolve(`./public/${file_name}`),
           async (err)=>{
                if(err)
                    res.render("error", {message: "Có lỗi xảy ra!"});
                else{
                    const isSuccess = await chapterQuery.insertNewChapter(story_id, title, num_pages, file_name);
                    if(isSuccess)
                        res.redirect(`/chapter/manage?story_id=${story_id}`);
                    else
                        res.render("error", {message: "Có lỗi xảy ra trong quá trình cập nhật!"})            
                }
            });
    }   
    else{
        res.render("error", {message: "Bạn không phải Admin!"});
    }
})

module.exports = router