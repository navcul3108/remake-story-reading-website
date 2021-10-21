const express = require('express');
const router = express.Router();
const {authenticateAJAX, authenticate} = require("./utils")
const {postComment, replyComment} = require("../db_access/commentQuery")

// AJAX API
router.post("/post", authenticateAJAX, async (req, res)=>{
    let {story_id, content} = req.body;
    if(!content || !story_id)
        res.status(500).json({message: "Có lỗi xảy ra!"});
    else{
        const email = req.session.email;
        let result = await postComment(story_id, email, content);
        if(!result)
            res.status(400).json({message: "Không thể bình luận!"});
        else
            res.status(200).json(result)
    }
})

router.post("/reply", authenticateAJAX, async (req, res)=>{
    const {story_id, comment_index_string, content} = req.params;
    const comment_index = parseInt(comment_index_string);
    if(!content || !story_id || !comment_index)
        res.status(500).json({message: "Có lỗi xảy ra!"});
    else{
        const email = req.session.email.email;
        let result = await replyComment(story_id, email, comment_index, content);
        if(!result)
            res.status(400).json({message: "Không thể trả lời bình luận!"});
        else
            res.status(200).json(result)
    }
})

module.exports = router