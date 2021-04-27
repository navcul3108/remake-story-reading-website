$("#navbar-text").ready(function(){
    $.get("/genre/all", function(data){
        data.forEach((genre, _)=>{
            $("#genre-menu").append(`<a class="dropdown-item" href="/story?genreId=${genre.id}" title="${genre.description}">${genre.name}</a>`)
        })
    })
})

$(document).ready(()=>{
    $("#story-name-search").kendoAutoComplete({
        dataSource: {
            type: "json",
            transport: {
                read: "/story/all-name"
            },
            //serverFiltering: true,
        },
        filter: "contains",
        placeholder: "Tên truyện...",
        minLength: 2,
        ignoreCase: true
    })
})
