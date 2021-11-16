$(document).ready(function () {
    $("#avatar-image").kendoUpload({
        validation: {
            allowedExtensions: [".png", ".jpg", ".jpeg"],
            maxFileSize: 1e6
        }
    })

    $("#avatar-region").on("click", function(e){
        jQuery.noConflict();
        $("#upload-modal").modal("show");
    })

    $("#avatarImage").attr("accept", "image/png,image/jpg,image/jpeg");

    $.ajax({
        url: "/api/users/profile", 
        dataType: "json",
        success: function(data) {
            $("#avatar-region>img").attr("src", data.avatar_url);
            $("#old-avatar>img").attr("src", data.avatar_url);
            $("input[name='oldPath']").attr("value", data.avatar_url)
            form = $("#profile-form").kendoForm({
                formData: {
                    firstName: data.first_name,
                    lastName: data.last_name,
                    birthday: data.birthday ? data.birthday : null
                },
                items: [
                    {
                        type: "group",
                        label: "Họ tên",
                        layout: "grid",
                        grid: { cols: 2, gutter: 10 },
                        items: [
                            {
                                field: "firstName",
                                label: "Họ và tên đệm",
                                validation: { required: true },
                                attributes: { autocomplete: true },
                                colSpan: 1
                            },
                            {
                                field: "lastName",
                                label: "Tên",
                                validation: { required: true },
                                attributes: { autocomplete: true },
                                colSpan: 1
                            },
                        ]
                    },
                    {
                        field: "birthday",
                        label: "Ngày tháng năm sinh",
                        editor: "DatePicker",
                        validation: { required: true },
                        attributes: {
                            style: "width: 40%"
                        }
                    }
                ],
                messages: {
                    submit: "Cập nhật",
                    clear: "Hủy bỏ"
                }
            })

            form.bind("submit", (e)=>{   
                let birthdayString= $("input[name='birthday']").val();
                let birthday = new Date(birthdayString);
                birthday.setHours(12);
                let submitData = {
                    firstName: $("input[name='firstName']").val(),
                    lastName: $("input[name='lastName']").val(),
                    birthday: birthday.toISOString()
                };
                console.log(new Date(submitData.birthday).toISOString(), data.birthday)
                if(submitData.firstName===data.first_name && submitData.lastName===data.last_name && new Date(submitData.birthday).getDate()==new Date(data.birthday).getDate()){
                    alert("Bạn cần thay đổi thông tin nếu muốn cập nhật");
                    return false;
                }
                $("input[name='birthday']").val(birthday.toISOString());
                return true;
            });
        }
    })
})