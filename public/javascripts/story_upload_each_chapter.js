var description = "";

function changeNumberChapters(){
    const num_chap = parseInt($("#num_chapters").val());

    $("#multi-chapter-upload > *").remove();
    let formOptionItems = []
    for(let i=1;i<=num_chap;i++){
        formOptionItems.push({
            type: "group",
            label: `Cập nhật cho chương thứ ${i}`,
            items: [
                {field: `chapter_title_${i}`, label: "Chapter title", validation: {required: true}, id: `chapter-title-${i}`},
            ]
        })
    }

    $("#multi-chapter-upload").kendoForm({
        items: formOptionItems
    })
    $("<div><input name='chapterFiles' class='chapter-upload' type='file'/></div>").insertAfter($("#multi-chapter-upload > fieldset"))
    $("#multi-chapter-upload .k-form-buttons").remove();
    $(".chapter-upload").kendoUpload({
        validation: {
            allowedExtensions: [".pdf"],
            maxFileSize: 1e10
        }
    })
}

function validateFormInput(){
    const num_chap = parseInt($("#num_chapters").val());
    if($(".k-file").length<2)
    {
        $("#upload-error").text(`You must submit both cover image and story file!`);
        return false;
    }
    else{
        const coverImageUpload = $(".k-file")[0]; 
    
        if($(coverImageUpload).find(".k-file-name").length!=1){
            $("#upload-error").text("The cover image is only one file!");
            return false;
        }
        return true;
    }
}

$(document).ready(function(){
    jQuery.fn.insertAt = function(index, element) {
        var lastIndex = this.children().size();
        if (index < 0) {
          index = Math.max(0, lastIndex + 1 + index);
        }
        this.append(element);
        if (index < lastIndex) {
          this.children().eq(index).before(this.children().last());
        }
        return this;
    }

    let formOptionItems = [
        {
            type: "group",
            label: "Thông tin truyện",
            grid: {cols: 2, gutter: 10},
            items: [
                {field: "name", label: "Tên truyện", validation: {required: true}, attributes: {autocomplete: true}},
                {field: "author", label: "Tên tác giả", attributes: {autocomplete: true}},        
                {field: "genre", label: "Thể loại", validation: {required: true}, editor: "DropDownList",
                    editorOptions: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: "/genre/all",
                                    dataType: "json"
                                }   
                            }
                        },
                        optionLabel: "Lựa chọn thể loại truyện",
                        dataTextField: "name",
                        dataValueField: "id"   
                    }
                }
            ]
        },
        {field: "description", label: "Mô tả", editor: "Editor", attributes: {autocomplete: true, encoded: false}},
        {field: "num_chapters", label: "Số chương", validation: {required: true}, attributes: {style: "width: 30%", type:"number", min: 1, max: 50, placeholder: 1, onchange: "changeNumberChapters()"}},
        {
            type: "group",
            label: "Upload các chương",
            items: []
        }
    ]
    let form = $("#uploadForm").kendoForm({
        items: formOptionItems
    });


    form.bind("submit", (e)=>{   
        $("#uploadForm textarea").val(description);     
        return validateFormInput();
    });

    form.bind("change", (ev)=>{
        description = $("#uploadForm iframe.k-content").contents().find("body").text();
        $("#upload-error").text("");
    })

    $("#uploadForm").append($('<h3 class="text-danger" id="upload-error"></h3>'));
    $('fieldset:contains("Thông tin truyện")').append($("#avatarUpload"));
    $('fieldset:contains("Upload các chương")').append($("#multi-chapter-upload"));

    $("#coverImage").kendoUpload({
        validation: {
            allowedExtensions: [".png", ".jpg", ".jpeg"],
            maxFileSize: 1e6
        }
    });
    $("#coverImage").attr("accept", "image/png,image/jpg,image/jpeg");    
})