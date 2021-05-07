$(document).ready(()=>{
    const story_id_val = $("#story_id").val();
    $("#chapter-grid").kendoGrid({
        columns: [
            {
                field: "index",
                title: "Số thứ tự",
                width: "10%"
            },
            {
                field: "title",
                title: "Tiêu đề",
                width: "50%"
            },
            {
                field: "num_page",
                title: "Số trang",
                width: "15%"
            },
            {
                command: {
                    name: "update",
                    click: function(e){
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        $.ajax({
                            type: "post",
                            url: "/chapter/update",
                            contentType: "application/json",
                            data: JSON.stringify({
                                story_id: story_id_val,
                                index: data.index,
                                title: data.title
                            }),
                            success: (data)=>{
                                alert(data);
                                $("#chapter-grid").data("kendoGrid").dataSource.read();
                                $("#chapter-grid").data("kendoGrid").refresh();
                            },
                            error: (err)=>{
                                alert(err);
                                $("#chapter-grid").data("kendoGrid").refresh();
                            }
                        })
                    }
                },
                width: "25%"
            }
        ],
        dataSource: {
            transport: {
                read: {
                    url: `/chapter/all-chapter?story_id=${story_id_val}`,
                    dataType: "json",
                    complete: function(data, status){
                        $("a.k-grid-insert").attr("data-toggle", "modal");
                        $("a.k-grid-insert").attr("data-target", "#insert-form-modal");
                    }
                }
            },
            schema: {
                model: {
                    id: "index",
                    fields: {
                        index: {
                            editable: false,
                            type: "number"
                        },
                        title: {
                            editable: true,
                            type: "string"
                        },
                        num_page: {
                            editable: false,
                            type: "number"
                        }
                    }
                }
            }
        },
        toolbar: [{name: "insert", text: "Cập nhật chương mới", imageClass: "k-button", className: "insert-chapter", iconClass: "k-icon k-i-plus"}],
        pageSize: 20,
        scrollable: false,
        editable: true,
        batch: false,
        pageable:{
            pageSize: 10,
            refresh: true
        }    
    })
})