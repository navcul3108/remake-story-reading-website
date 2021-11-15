const router = require("express")()
const {getAccountProfile} = require("../db_access/accountQuery")
const {authenticateAJAX} = require("./utils")

router.get("/users/profile", authenticateAJAX, async(req, res)=>{
    try{
        let profile = await getAccountProfile(req.session.email);
        res.status(200).json(profile)
    }
    catch(e){
        if(typeof e ==="string")
            res.status(404).json(e)
    }
})

module.exports = router