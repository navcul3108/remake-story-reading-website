function appendPostedComment(email, post_time, content){    
    let comment = $(`<div class="media mt-3"><img class="mr-3 rounded-circle" alt="User avatar" src="https://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png">
                        <div class="media-body">
                            <div class="row">
                                <div class="col-8 d-flex">
                                    <h5>${email}</h5>
                                    <span class="ml-2 text-secondary">${post_time}</span>
                                </div>
                                <div class="col-4">
                                    <div class="pull-right reply"><a class="reply" href="#"><span><i
                                                    class="fa fa-reply"></i></span>Reply </a></div>
                                </div>
                            </div>
                            ${content}
                        </div>
                    </div>`)
    $("#comment-list").append($(comment))
}

$(window).on("load", function(){
    jQuery.noConflict();
    $("#post-comment").click(function(){
        const content = $("#comment-box").val();
        const story_id = $("#story-id-store").text();
        console.log('story_id :>> ', story_id);
        if(content.length < 5){
            $("#modal-content").text("Bạn cần điền ít nhất 5 ký tự cho nội dung comment");
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
                    console.log('data :>> ', data);
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
})
