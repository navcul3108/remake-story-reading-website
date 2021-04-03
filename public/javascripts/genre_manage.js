$(document).ready(function () {
    $("#genreGrid").kendoGrid({
        columns: [
            {
                field: "id",
                title: "Index",
                editable: false
            },
            {
                field: "name",
                title: "Name"
            },
            {
                field: "description",
                title: "Description"
            },
            { 
                command: [
                    {
                        name: "update",
                        click: function(e){
                            const tr = $(e.target).closest("tr");
                            const data = this.dataItem(tr);
                            if(data.id){
                                $.ajax({
                                    type: "post",
                                    url: "/genre/update",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        id: data.id,
                                        name: data.name,
                                        description: data.description
                                    }),
                                    success: (data) => {
                                        console.log(data);
                                        alert(data);
                                        $("#genreGrid").data("kendoGrid").dataSource.read();
                                    },
                                    error: (err) => {
                                        console.log(err);
                                        alert(err);
                                    }
                                })    
                            }
                            else{
                                $.ajax({
                                    type: "post",
                                    url: "/genre/create",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        name: data.name,
                                        description: data.description
                                    }),
                                    success: (data) => {
                                        console.log(data);
                                        alert(data);
                                        $("#genreGrid").data("kendoGrid").dataSource.read();
                                    },
                                    error: (err) => {
                                        console.log(err);
                                        alert(err);
                                    }
                                })    
                            }
                        }
                    },
                    "destroy"
                ] 
            }],
        dataSource: {
            transport: {
                read: {
                    url: "/genre/all",
                    dataType: "json"
                },
                // update: {
                //     url: "/genre/update",
                //     type: "POST",
                //     dataType: "json",
                //     contentType: "application/json",
                //     data: function (data) {
                //         alert(data);
                //         $("#genreGrid").data("kendoGrid").dataSource.read();
                //     }
                // },
                create: {
                    url: "/genre/create",
                    type: "POST"
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
                        description: {
                            type: "string",
                            editable: true
                        }
                    }
                }
            }
        },
        toolbar: ["create"],
        pageSize: 20,
        scrollable: false,
        editable: true,
        batch: false,
        pageable:{
            pageSize: 10,
            refresh: true
        }
    });
    $("table").addClass("table table-striped");
    $("thead").addClass("thead-dark");
})

$(".k-popup-edit-form").ready(function(){
    console.log('Form is ready');
    $(".k-grid-update .k-i-check").click(function () {
        console.log($("#genreGrid").data("kendoGrid"));
        $.ajax({
            type: "POST",
            url: "/genre/update",
            dataType: "json",
            data: JSON.stringify({
                id: $(".k-no-editor").text(),
                name: $("input#name").val(),
                description: $("input#description").val()
            }),
            success: (data) => {
                console.log(data);
                alert(data);
                $("#genreGrid").data("kendoGrid").dataSource.read();
            },
            error: (err) => {
                console.log(err);
                alert(err);
            }
        })
    })
})

