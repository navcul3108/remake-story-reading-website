const express = require('express');
const router = express.Router();
const genreQuery = require("../db_access/genreQuery");

router.get("/manage", (req, res)=>{
    console.log(req.session.isAdmin);
    if(req.session.isAdmin)
    {
        res.render("genre/manage");
    }
    else{
        res.render("error", {message: "You don't have permision for accessing this function!"});
    }
})

router.get("/all",async (req, res)=>{
    const listGenres = await genreQuery.listAllGenres();
    
    res.status(200).json(listGenres);
})

router.post("/update", async(req, res)=>{
    if(req.session.isAdmin){
        const {body} = req;
        const name = body.name;
        const description = body.description;
        const id = body.id;
        const isSucess = await genreQuery.updateGenre(id, name, description);
        if(isSucess)
            res.status(200).json("Success");
        else
            res.status(500).json("Can not update that genre");
    }  
    else{
        res.status(500).json("You are not admin!");
    }
})

router.post("/create", async(req, res)=>{
    if(req.session.isAdmin){
        const {body} = req;
        const name = body.name;
        const description = body.description;
        const isSucess = await genreQuery.insertGenre(name, description);
        if(isSucess)
            res.status(200).json("Success");
        else
            res.status(500).json("Can not update that genre");
    }  
    else{
        res.status(500).json("You are not admin!");
    }
})

module.exports = router;