const User = require('./userModel')
const jwt = require('jsonwebtoken')

 const registerUser = async(req,res)=> {
    try {
        console.log(req.body);
        const {name,password,email} = req.body;
        console.log('email'+email);
        const userExists = await User.findOne({email})
        if(userExists){
            res.json({message: 'User already exists'})
        }else{
            const newUser = new User({
                name,
                email,
                password
            })
           await newUser.save()
            res.json(newUser)
        }
    } catch (error) {
        console.error(error)
    }
}

 const loginUser = async(req,res)=> {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            res.json({message:"User doesn't exists"})
        }else{
            if(password !== user.password){
                res.json({message:"Email or password is incorrect"})
            }else{
                const payload = {
                    email,
                    name:user.name
                };
                jwt.sign(payload,'secret',(err,token)=> {
                    if(err)console.log(err);
                    else{
                        res.json({token:token})
                    }
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={
registerUser,
loginUser
}