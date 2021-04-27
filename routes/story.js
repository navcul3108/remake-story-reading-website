var express = require('express');
var router = express.Router();
var multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");
const storyQuery = require('../db_access/storyQuery');
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const {body} = req;
    const folderDir = `./public/temporFiles/`;
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

/* GET home page. */
router.get('/', async (req, res)=> {
  const genre_id = req.params.genre_id;
  const list_story = await storyQuery.listStory(genre_id);
  const num_buckets = Math.ceil(list_story.length / 4);
  const chunk_size = 4;
  let buckets = [];
  for(var i=0;i<num_buckets;i++){
    if((i+1)*chunk_size<list_story.length){
      buckets.push(list_story.slice(i*chunk_size, (i+1)*chunk_size));
    }
    else
      buckets.push(list_story.slice(i*chunk_size));
  }
  res.render('story/index', { title: 'Express', buckets: buckets });
});

/* Overview page */
router.get("/overview",async (req, res)=>{
  const story_id = req.query.id;
  if(story_id.length!==36){
    res.render("error", {message: "Liên kết không tồn tại"});
  }
  else{
    const story_info = await storyQuery.getStoryInformation(story_id, true);
    if(story_info==null)
      res.render("error", {message: "Liên kết không tồn tại"});
    else
      res.render("story/overview", {story_info: story_info});
  }  
})

/** Reading page */
router.get("/read",async (req, res)=>{
  const id = req.query.id;
  const index = parseInt(req.query.index);
  if(id.length!=36 || index<=0)
    res.status(404).render("error", {message: "Liên kết không tồn tại"});
  else{
    const chapter_info = await storyQuery.getChapterInformation(id, index);
    if(chapter_info==null)
      res.status(404).render("error", {message: "Liên kết không tồn tại"});
    else
      res.render("story/read", {chapter_info: chapter_info});
  }
})

/* REGION: UPLOAD STORY */
router.use("/upload", (req, res, next)=>{
  if(req.session.isAdmin)
    return next();
  else
    res.render("error", {message: "You are not admin!"});
})

router.get("/upload", (req, res)=>{
  res.render("story/upload");
})

router.post("/upload", upload.fields([{name:"file",maxCount:1}, {name:"coverImage", maxCount:1}]), async (req, res)=>{ 
  const id = uuid.v1();
  let {body} = req;
  const numChapters = body.num_chapters;
  let storyFile = req.files.file[0];
  let coverImage = req.files.coverImage[0];
  let chapters = [];

  fs.readdir("./public/temporFiles", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      if(!file.includes(storyFile.filename) && !file.includes(coverImage.filename)){
        fs.unlink(path.join(path.resolve("./public/temporFiles/"), file), err => {
          if (err) throw err;
        });  
      }
    }
  });


  for(var i=1;i<=numChapters;i++)
  {
    chapters.push({
      start_page: parseInt(body[`start_at_${i}`]),
      end_page: parseInt(body[`end_at_${i}`]),
      title: body[`chapter_title_${i}`],
      index: i,
      file_name: `/pdf/${body.genre}/${id}_${i}.pdf`
    });
  }
  const format = coverImage.originalname.split(".").pop();      

  const successFlag = await storyQuery.createStory(id, body.name, body.author, body.description, `/images/cover/${id}.${format}`, body.num_chapters,
                                                   body.genre, body.num_pages, chapters, "./"+storyFile.path);
  if(successFlag){
    res.render("success", {message: "You have upload story successfully!"});
    if(!fs.existsSync("./public/images/cover/"))
      fs.mkdirSync("./public/images/cover/")

    fs.copyFileSync(coverImage.path, `./public/images/cover/${id}.${format}`);
  }
  else
    res.render("error", {message: "There is an error while processing story uploading, please try again!"});
  fs.rmSync(coverImage.path);
})

router.get("/overview/:id", async (req, res)=>{
  const id = req.params.id;

  const storyInformation = await storyQuery.getStoryInformation(id);
  if(storyInformation==null)
    res.render("error", {message: "The story that you find is not exists!"});
  else
    res.render("story/overview", {info: storyInformation});
})

router.get("/all-name",async (req, res)=>{
  //console.log(req.query.filter.filters);
  const list_name = await storyQuery.getAllStoryName();
  res.status(200).json(list_name);
})

router.get("/search", async(req, res)=>{
  const id = await storyQuery.findStoryIdByName(req.query.story_name);
  if(id==null)
    res.status(404).render("error", {message: "Không tồn tại truyên mà bạn đang tìm kiếm!"});
  else
    res.redirect(`/story/overview?id=${id}`);
})
module.exports = router;
