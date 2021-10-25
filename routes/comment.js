const express = require('express');
const router = express.Router();
const {authenticateAJAX} = require("./utils")
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
    let {story_id, comment_index, content} = req.body;
    if(content==null || story_id==null || comment_index==null)
        res.status(500).json({message: "Có lỗi xảy ra!"});
    else{
        comment_index = parseInt(comment_index);
        const email = req.session.email;
        let result = await replyComment(story_id, email, comment_index, content);
        if(!result)
            res.status(400).json({message: "Không thể trả lời bình luận!"});
        else
            res.status(200).json(result)
    }
})

module.exports = router