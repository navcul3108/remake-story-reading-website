$(document).ready(()=>{
    $("#storyGrid").kendoGrid({
        columns: [
            {
                field: "name",
                title: "Tên truyện",
                width: "25%"
            },
            {
                field: "author",
                title: "Tác giả",
                width: "15%"
            },
            {
                field: "description",
                title: "Mô tả",
                width: "40%"
            },
            {  
                title: "Cập nhật",
                command: [
                    {
                        name: "update",
                        click: function(e){
                            if(confirm("Bạn có muốn cập nhật truyện này?")){
                                const tr = $(e.target).closest("tr");
                                const data = this.dataItem(tr);
                                $.ajax({
                                    type: "post",
                                    url: "/story/update",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        id: data.id,
                                        name: data.name,
                                        author: data.author,
                                        description: data.description
                                    }),
                                    success: (data) => {
                                        console.log(data);
                                        alert(data);
                                        $("#genreGrid").data("kendoGrid").refresh();
                                    },
                                    error: (err) => {
                                        console.log(err);
                                        alert(err);
                                    }
                                })
                            }
                            else{
                                $("#genreGrid").data("kendoGrid").refresh();
                            }
                        }
                    },
                    {
                        name: "Delete",
                        click: function(e){
                            if(confirm("Bạn muốn xóa truyện này?")){
                                const tr = $(e.target).closest("tr");
                                const data = this.dataItem(tr);
                                $.ajax({
                                    type: "post",
                                    url: "/story/delete",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        id: data.id
                                    }),
                                    success: (data) => {
                                        console.log(data);
                                        alert(data);
                                        $("#genreGrid").data("kendoGrid").refresh();
                                    },
                                    error: (err) => {
                                        console.log(err);
                                        alert(err);
                                    }
                                })   
                            }
                            else{
                                $("#genreGrid").data("kendoGrid").refresh();
                            }
                        }
                    },
                    {
                        name: "Cập nhật chương",
                        click: function(e){
                            const tr = $(e.target).closest("tr");
                            console.log(tr);
                            const data = this.dataItem(tr);
                            window.location.href = `/chapter/manage?story_id=${data.id}`;
                        }
                    }
                ],
                width: "20%"
            }
        ],
        dataSource: {
            transport: {
                read: {
                    url: "/story/all-story",
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: {
                            editable: false,
                            nullable: false
                        },
                        name: {
                            type: "string",
                            editable: true
                        },
                        author: {
                            type: "string",
                            editable: true
                        },
                        description: {
                            type: "string",
                            editable: true
                        }
                    }
                }
            }
        },
        toolbar: ["search"],
        editable: true,
        scrollable: true,
        batch: false,
        pageable: {
            pageSize: 10,
            refresh: true
        }
    })
})
