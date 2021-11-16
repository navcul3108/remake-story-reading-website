const mysql = require("mysql2/promise");
const connConfig = require("./dbConfig").connConfig

/**
 * Post a comment to a story
 *
 * @param {string} story_id
 * @param {string} email
 * @param {number} index start from 0
 * @param {string} content
 * @returns {Object} 
 */
async function postComment(story_id, email, content){
    const conn = await mysql.createConnection(connConfig);
    try{
        const [[[row], _]] = await conn.execute("Call post_comment(?, ?, ?)", [story_id, email, content])
                .catch(err=>{
                    console.error(err);
                    conn.rollback();
                })
        await conn.end();
        return {
            email: row.i_email,
            post_time: row.i_post_time.toLocaleString(),
            content: row.i_content
        };
    }
    catch(e){
        console.error(e);
        await conn.rollback();
        await conn.end();
        return null;
    }
}

/**
 * Reply a comment
 *
 * @param {string} story_id 
 * @param {string} email
 * @param {number} comment_index start from 0
 * @param {number} reply_index start from 0
 * @param {string} content
 * @return {Object} 
 */
async function replyComment(story_id, email, comment_index, content){
    const conn = await mysql.createConnection(connConfig);
    try{
        const [[[row], _]] = await conn.execute("Call reply_comment(?, ?, ?, ?)", [story_id, email, comment_index, content])
                .catch(err=>{
                    console.error(err);
                    conn.rollback();
                })
        await conn.end();
        return {
            email: row.i_email,
            comment_index: row.i_comment_index,
            post_time: row.i_post_time.toLocaleString(),
            content: row.i_content
        };
    }
    catch(e){
        console.error(e);
        await conn.rollback();
        await conn.end();
        return null;
    }
}

/**
 *  Return all comments of a story, if story_id is incorrect, return empty Array instead
 *  
 * @param {string} story_id
 * @return {Array} 
 */
async function getAllStoryComment(story_id){
    const conn = await mysql.createConnection(connConfig);
    try{
        let comment_rows = (await conn.query("Select account.email, avatar_url, post_time, `index`, content From story_comment join account on story_comment.email=account.email where story_id = ? Order By `index`", [story_id]))[0];
        let reply_rows = (await conn.query("Select account.email, avatar_url, post_time, comment_index, reply_index, content From story_reply join account on story_reply.email=account.email where story_id = ? Order By comment_index, reply_index", [story_id]))[0];
        let uniqueEmails = [];
        let all_replies = reply_rows.map((text_row, _)=>{
            return {
                comment_index: text_row.comment_index,
                post_time: text_row.post_time.toLocaleString(),
                reply_index: text_row.reply_index,
                email: text_row.email,
                avatarUrl: text_row.avatar_url,
                content: text_row.content
            };
        });
        result = []
        for(comment of comment_rows){
            let replies = all_replies.filter((reply, _)=>reply.comment_index==comment.index)     
            result.push({
                email: comment.email,
                content: comment.content,
                post_time: comment.post_time.toLocaleString(),
                avatarUrl: comment.avatar_url,
                replies: replies
            })
        }
        await conn.end();
        return result;
    }
    catch(e){
        console.error(e);
        await conn.rollback();
        await conn.end();
        return []
    }
}

module.exports = {postComment, replyComment, getAllStoryComment}