var express = require('express');
var router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
const storyQuery = require('../db_access/storyQuery');
const path = require("path");
const { getAllStoryComment } = require("../db_access/commentQuery");
const { uploader, authenticate } = require('./utils');

/* GET home page. */
router.get('/', async (req, res) => {
	const genre_id = req.query.genre_id;
	const list_story = await storyQuery.listStory(genre_id);
	const num_buckets = Math.ceil(list_story.length / 4);
	const chunk_size = 4;
	let buckets = [];
	for (var i = 0; i < num_buckets; i++) {
		if ((i + 1) * chunk_size < list_story.length) {
			buckets.push(list_story.slice(i * chunk_size, (i + 1) * chunk_size));
		}
		else
			buckets.push(list_story.slice(i * chunk_size));
	}
	res.render('story/index', {buckets: buckets });
});

/* Overview page */
router.get("/overview", async (req, res) => {
	const story_id = req.query.id;
	if (story_id.length !== 36) {
		res.render("error", { message: "Liên kết không tồn tại" });
	}
	else {
		const story_info = await storyQuery.getStoryInformation(story_id, true);
		if (story_info == null)
			res.render("error", { message: "Liên kết không tồn tại" });
		else {
			let reviewed = false;
			if (req.session.email) {
				reviewed = await storyQuery.checkUserReviewedStory(req.session.email, story_id);
			}
			comments = await getAllStoryComment(story_id);
			res.render("story/overview", { story_info: story_info, reviewed: reviewed, comments: comments });
		}
	}
})

/** Reading page */
router.get("/read", async (req, res) => {
	const id = req.query.id;
	const index = parseInt(req.query.index);
	if (id.length != 36 || index <= 0)
		res.status(404).render("error", { message: "Liên kết không tồn tại" });
	else {
		const chapter_info = await storyQuery.getChapterInformation(id, index);
		if (chapter_info == null)
			res.status(404).render("error", { message: "Liên kết không tồn tại" });
		else
			res.render("story/read", { chapter_info: chapter_info });
	}
})

/* REGION: UPLOAD STORY */
router.use("/upload", (req, res, next) => {
	if (req.session.isAdmin)
		return next();
	else
		res.render("error", { message: "Bạn không có quyền truy cập trang này" });
})

router.get("/upload/method", (req, res) => {
	res.render("story/upload-method");
})

router.get("/upload/entire",  (req, res) => {
	res.render("story/upload-entire");
})

router.post("/upload/entire", uploader.fields([{ name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), async (req, res) => {
	const id = uuid.v1();
	let { body } = req;
	const numChapters = body.num_chapters;
	let storyFile = req.files.file[0];
	let coverImage = req.files.coverImage[0];
	let chapters = [];

	for (var i = 1; i <= numChapters; i++) {
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
		body.genre, body.num_pages, chapters, "./" + storyFile.path);
	if (successFlag) {
		res.render("success", { message: "Đăng tải truyện thành công!" });
		if (!fs.existsSync("./public/images/cover/"))
			fs.mkdirSync("./public/images/cover/")

		fs.copyFileSync(coverImage.path, `./public/images/cover/${id}.${format}`);
	}
	else
		res.render("error", { message: "Có lỗi xảy ra trong quá trình đăng tải, vui lòng nhập đúng thông tin và thử lại" });
	fs.rmSync(coverImage.path);
})

router.get("/upload/each-chapter", (req, res) => {
	res.render("story/upload-each");
})

router.post("/upload/each-chapter", uploader.fields([{ name: "chapterFiles"}, { name: "coverImage", maxCount: 1 }]),async (req, res)=>{
	const id = uuid.v1();
	let { body } = req;
	let chapterFiles = req.files.chapterFiles.map((val, index)=>val.path);
	let coverImage = req.files.coverImage[0];
	let chapters = [];

	for (let i = 1; i <= body.num_chapters; i++) {
		chapters.push({
			start_page: 0,
			end_page: 0,
			title: body[`chapter_title_${i}`],
			index: i,
			file_name: `/pdf/${body.genre}/${id}_${i}.pdf`
		});
	}
	[chapters, body.num_pages] = await storyQuery.extractPDFNumPages(chapterFiles, chapters);

	const format = coverImage.originalname.split(".").pop();
	const successFlag = await storyQuery.createStory(id, body.name, body.author, body.description, `/images/cover/${id}.${format}`, body.num_chapters,
	body.genre, body.num_pages, chapters);
	if (successFlag) {
		res.render("success", { message: "Đăng tải truyện thành công!" });
		if (!fs.existsSync("./public/images/cover/"))
			fs.mkdirSync("./public/images/cover/")

		fs.renameSync(coverImage.path, `./public/images/cover/${id}.${format}`);
		if(!fs.existsSync(`./public/pdf/${body.genre}`))
			fs.mkdirSync(`./public/pdf/${body.genre}`)
		storyQuery.moveTemporaryFilesToPublicFolder(chapterFiles.map((val, _)=>path.resolve(val)), chapters.map((val, _)=>path.resolve("public"+val.file_name)))
	}
	else{
		res.render("error", { message: "Có lỗi xảy ra trong quá trình đăng tải, vui lòng nhập đúng thông tin và thử lại" });
		for(let filePath of chapterFiles)
			fs.rmSync(path.resolve(filePath));
	}
})

router.get("/overview/:id", async (req, res) => {
	const id = req.params.id;

	const storyInformation = await storyQuery.getStoryInformation(id);
	if (storyInformation == null)
		res.render("error", { message: "Truyện bạn tìm kiếm không tồn tại" });
	else
		res.render("story/overview", { info: storyInformation });
})

router.get("/all-name", async (req, res) => {
	//console.log(req.query.filter.filters);
	const list_name = await storyQuery.getAllStoryName();
	res.status(200).json(list_name);
})

router.get("/search", async (req, res) => {
	const id = await storyQuery.findStoryIdByName(req.query.story_name);
	if (id == null)
		res.status(404).render("error", { message: "Không tồn tại truyên mà bạn đang tìm kiếm!" });
	else
		res.redirect(`/story/overview?id=${id}`);
})

/** Management region */
router.get("/manage", (req, res) => {
	if (req.session.isAdmin)
		res.render("story/manage");
	else
		res.render("error", { message: "Bạn không phải Admin!" });

})

router.post("/update", async (req, res) => {
	if (req.session.isAdmin) {
		const { body } = req;
		const story_id = body.id;
		const name = body.name;
		const author = body.author;
		const description = body.description;
		await storyQuery.updateStory(story_id, name, author, description);
		res.status(200).json("Cập nhật thành công!");
	}
	else
		res.status(400).json("Bạn không phải Admin!");
})

router.post("/delete", async (req, res) => {
	if (req.session.isAdmin) {
		const { body } = req;
		const story_id = body.id;
		const story_info = await storyQuery.getStoryInformation(story_id);
		if (story_info == null)
			res.status(404).json("Không tìm thấy truyện!");
		else {
			// Delete story inside database
			await storyQuery.deleteStory(story_id);
			// Delete cover image
			if (fs.existsSync(path.resolve("./public" + story_info.image_path)))
				fs.unlinkSync(path.resolve("./public" + story_info.image_path));
			// Delete chapter file
			fs.readdir(`./public/pdf/${story_info.genre_id}`, (err, files) => {
				if (err) throw err;

				for (file of files) {
					if (file.includes(story_id))
						fs.unlinkSync(path.join(`./public/pdf/${story_info.genre_id}/`, file));
				}
			})

			res.status(200).json("Xóa thành công!");
		}
	}
	else
		res.status(400).json("Bạn không phải Admin!");
})

router.get("/all-story", async (req, res) => {
	if (req.session.isAdmin)
		res.status(200).json(await storyQuery.getAllStory());
	else
		res.status(404).json("Bạn không phải admin");
})

router.post("/rate", async (req, res) => {
	const { body } = req;
	const { email, story_id, rating } = body;
	if (email == null || story_id == null || rating == null)
		res.render("error", { message: "Yêu cầu không hợp lệ" });
	else {
		const isSuccess = await storyQuery.rateStory(story_id, email, rating);
		if (isSuccess)
			res.redirect("/story/overview?id="+story_id);
		else
			res.render("error", { message: "Có lỗi xảy ra trong quá trình xử lý" });
	}
})

router.get("/favourite", authenticate, async (req, res)=>{
	const email = req.session.email;
	const favouriteStories = await storyQuery.getFavouriteStory(email);
	res.render("story/favourite", {favouriteStories: favouriteStories});
})
module.exports = router;
