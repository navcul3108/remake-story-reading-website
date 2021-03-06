const avatarUrl = $("#avatar-img").attr("src");

function appendPostedComment(email, post_time, content){    
    let comment = $(`<div class="media mt-3">
                        <img class="mr-3 rounded-circle" alt="User avatar" src="${avatarUrl}">
                        <div class="media-body">
                            <div class="row">
                                <div class="col-8 d-flex">
                                    <h5>${email}</h5>
                                    <span class="ml-2 text-secondary">${post_time}</span>
                                </div>
                                <div class="col-4">
                                    <div class="pull-right reply">
                                        <button class="btn btn-success btn-sm reply" onclick="createReplyBox(this, ${$("button.reply").length})">
                                            <span><i class="fa fa-reply text-primary"></i></span>
                                            Reply 
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ${content}
                            <div class="reply-region"></div>
                        </div>
                    </div>`)
    $("#comment-list").append($(comment))
}

function appendPostedReply(email, post_time, comment_index, content){
    let replyElement = $(`
    <div class="media mt-4"><a class="pr-3" href="#"><img class="rounded-circle"
        alt="User avatar"
        src="${avatarUrl}"></a>
        <div class="media-body">
            <div class="row">
                <div class="col-12 d-flex">
                    <h5>${email}</h5>
                    <span class="ml-2 text-secondary">${post_time}</span>
                </div>
            </div>
            ${content}
        </div>
    </div>
    `)
    $(`.reply-region:eq(${comment_index})`).append($(replyElement));
}

function createReplyBox(replyBtn, commentIndex){
    const replyRegion = $(replyBtn).closest(".row").siblings(".reply-region");
    $("#reply-box").removeAttr("hidden");
    console.log('commentIndex :>> ', commentIndex);
    $("#reply-box").data("index", commentIndex);
    $(replyRegion).append($("#reply-box"));
}

$(window).on("load", function(){
    jQuery.noConflict();
    $("#post-comment-btn").click(function(){
        const content = $("#comment-box-input").val();
        const story_id = $("#story-id-store").text();
        console.log('story_id :>> ', story_id);
        if(content.length < 5){
            $("#modal-content").text("B???n c???n ??i???n ??t nh???t 5 k?? t??? cho n???i dung comment");
            $("#notify-modal").modal("show");
        }
        else{
            $.post({
                url: "/comment/post",
                dataType: "json",
                data: {
                    content: content,
                    story_id: story_id
                },
                success: function(data){
                    $("#comment-box-input").val("");
                    appendPostedComment(data.email, data.post_time, data.content);
                },
                error: function(err, status){
                    console.log('err :>> ', err);
                    console.log('status :>> ', status);
                    $("#modal-content").text(err.message);
                    $("#notify-modal").modal("show");                
                }
            })
        }
    })

    $("#reply-comment-btn").click(function(){
        const content = $("#reply-box-input").val();
        const story_id = $("#story-id-store").text();
        const comment_index = $("#reply-box").data("index");
        console.log('comment_index :>> ', comment_index);
        if(content.length < 5){
            $("#modal-content").text("B???n c???n ??i???n ??t nh???t 5 k?? t??? cho n???i dung tr??? l???i");
            $("#notify-modal").modal("show");
        }
        else{
            $.post({
                url: "/comment/reply",
                dataType: "json",
                data: {
                    content: content,
                    story_id: story_id,
                    comment_index: comment_index
                },
                success: function(data){
                    $("#reply-box").prop("hidden", true);
                    appendPostedReply(data.email, data.post_time, data.comment_index, data.content);
                },
                error: function(err, status){
                    $("#modal-content").text(err.responseJSON.message);
                    $("#notify-modal").modal("show");                
                }
            })
        }
    })
})
