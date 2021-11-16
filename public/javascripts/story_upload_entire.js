var description = "";

$(document).ready(function(){
    var form = $("#uploadForm").kendoForm({
        items: [
            {
                type: "group",
                label: "Story information",
                grid: {cols: 2, gutter: 10},
                items: [
                    {field: "name", label: "Name", validation: {required: true}, attributes: {autocomplete: true}},
                    {field: "author", label: "Author name", attributes: {autocomplete: true}},        
                    {field: "genre", label: "Genre", validation: {required: true}, editor: "DropDownList",
                        editorOptions: {
                            dataSource: {
                                transport: {
                                    read: {
                                        url: "/genre/all",
                                        dataType: "json"
                                    }   
                                }
                            },
                            optionLabel: "Select genre of story...",
                            dataTextField: "name",
                            dataValueField: "id"   
                        }
                    }
                ]
            },
            {field: "description", label: "Description", editor: "Editor", attributes: {autocomplete: true, encoded: false}},
            {field: "num_chapters", label: "Number of chapters", validation: {required: true}, attributes: {style: "width: 30%", type:"number", min: 1, max: 50, placeholder: 1, onchange: "changeNumberChapters()"}},
            {field: "num_pages", label: "Number of pages", validation: {required: true}, attributes: {style: "width: 30%", type:"number", min: 1, placeholder: 1, onchange: "setLimitPageNumber()"}},                    
            {
                type: "group",
                label: "Specify chapter page",
                items: []
            }
        ],
        messages: {
            submit: "Đăng tải",
            clear: "Hủy bỏ"
        }
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

    $('fieldset:contains("Specify chapter page")').append($("#storyUpload"));
    $('fieldset:contains("Story information")').append($("#avatarUpload"));

    $("#file").kendoUpload({
        validation: {
            allowedExtensions: [".pdf"],
            maxFileSize: 1e10
        }
    });
    $("#file").attr("accept", ".pdf");

    $("#coverImage").kendoUpload({
        validation: {
            allowedExtensions: [".png", ".jpg", ".jpeg"],
            maxFileSize: 1e6
        }
    });
    $("#coverImage").attr("accept", "image/png,image/jpg,image/jpeg");    
})

function changeNumberChapters(){   
    const num_chap = parseInt($("#num_chapters").val());
    $("#specified-pages *").remove();
    let pageItems = [];
    for(var i=1;i<=num_chap;i++)
        pageItems.push({
            type: "group",
            label: `Specify chapter page for chapter ${i}`,
            items: [
                {field: `chapter_title_${i}`, label: "Chapter title", validation: {required: true}, id: `chapter-title-${i}`},
                {field: `start_at_${i}`, label: "Start at", validation: {required: true}, attributes: {type: "number", min: 1}, id: `start-at-${i}`},
                {field: `end_at_${i}`, label: "End at", validation: {required: true}, attributes: {type: "number", min: 1}, id: `end-at-${i}`},
            ]
        })
    $("#specified-pages").kendoForm({
        items: pageItems
    }),
    $("#specified-pages .k-form-buttons").remove();
    setLimitPageNumber();
}

function setLimitPageNumber(){
    $('#specified-pages input[type="number"]').attr("max", $("#num_pages").val());
}

function validateFormInput(){
    const num_chap = parseInt($("#num_chapters").val());
    //validate for first chapter
    let start_at = parseInt($(`#start-at-1`).val());
    let end_at = parseInt($(`#end-at-1`).val());
    if(end_at<start_at)
    {
        $("#upload-error").text(`Your end page for chapter 1 is smaller than start page. Please correct it!`);
        return false;
    }    

    for(var i=2;i<=num_chap;i++)
    {
        let pre_end = end_at;
        start_at = parseInt($(`#start-at-${i}`).val());
        end_at = parseInt($(`#end-at-${i}`).val());

        if(start_at<=pre_end)
        {
            $("#upload-error").text(`Your end page of chapter ${i-1} is not followed by chapter ${i}`);
            return false;
        }            
        else if(end_at<start_at)
        {
            $("#upload-error").text(`Your end page for chapter ${i} is smaller than start page. Please correct it!`);
            return false;
        }    
    }    

    if($(".k-file").length<2)
    {
        $("#upload-error").text(`You must submit both cover image and story file!`);
        return false;
    }
    else{
        const coverImageUpload = $(".k-file")[0];
        const storyUpload = $(".k-file")[1];
    
        if($(storyUpload).find(".k-file-name").length!=1)
        {
            $("#upload-error").text("You can submit only one file!");
            return false;
        }    
    
        if($(coverImageUpload).find(".k-file-name").length!=1){
            $("#upload-error").text("The cover image is only one file!");
            return false;
        }
        return true;
    }
}