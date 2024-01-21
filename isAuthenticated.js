const jwt = require('jsonwebtoken')
async function isAuthenticated(req,res,next){
    try {
        const token = req.headers["authorization"]?.split(" ")[1]
        jwt.verify(token,"secret",(err,user)=> {
            if(err){
                res.json({message:err})
            }else{
                req.user=user;
                next();
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = isAuthenticated;
