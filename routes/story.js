var express = require('express');
var router = express.Router();
var multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");
const storyQuery = require('../db_access/storyQuery');

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const {body} = req;
    const folderDir = `./public/temporFiles/`;
    if(!fs.existsSync(folderDir))
      fs.mkdirSync(folderDir);
    cb(null, folderDir);
  },
  filename: (req, file, cb)=>{
    const filename = file.originalname.replace(/.pdf/g, "");
    cb(null, filename.replace(/[/\\?%*: |"<>]/g, '-').replace(/[^a-zA-Z0-9_]/g, '_')+'-'+uuid.v1()+".pdf");
  }
})

var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
                                                   body.genre, chapters, "./"+storyFile.path);
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

module.exports = router;
