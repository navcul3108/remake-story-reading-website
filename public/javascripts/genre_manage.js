$(document).ready(function () {
    $("#genre-grid").kendoGrid({
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
                                        $("#genre-grid").data("kendoGrid").dataSource.read();
                                        $("#kendro-grid").data("kendorGrid").refresh();
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
                                        $("#genre-grid").data("kendoGrid").dataSource.read();
                                        $("#kendro-grid").data("kendorGrid").refresh();
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
                    dataType: "json",
                    complete: (data, status)=>{
                        $(".k-grid-delete").remove();
                    }
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
    console.log($("#genre-grid a.k-grid-add"));
})

$("#genre-grid a.k-grid-add").click(()=>{
    console.log("Table changed!");
    $(".k-grid-delete").remove();
})

$(".k-popup-edit-form").ready(function(){
    $(".k-grid-update .k-i-check").click(function () {
        console.log($("#genre-grid").data("kendoGrid"));
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
                $("#genre-grid").data("kendoGrid").dataSource.read();
                $("#genre-grid").data("kendoGrid").refresh();
            },
            error: (err) => {
                console.log(err);
                alert(err);
            }
        })
    })
})

