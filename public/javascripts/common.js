$("#navbar-text").ready(function(){
    $.get("/genre/all", function(data){
        data.forEach((genre, _)=>{
            $("#genre-menu").append(`<a class="dropdown-item" href="/story?genreId=${genre.id}" title="${genre.description}">${genre.name}</a>`)
        })
    })
})