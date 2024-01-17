const userModel =  require("../model/userModel");

const bcrypt = require("bcrypt");


module.exports.register = async (req, res, next) =>{
   try {
    const {username, email, password } = req.body

    const userNameCheck = await userModel.findOne({username});
    if(userNameCheck){
      return res.status(400).json({message:"username aslready exists", status:false})
    }
    const emailNameCheck = await userModel.findOne({email});
    if(emailNameCheck){
      return res.status(400).json({message:"email aslready exists", status:false})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      email, 
      username, 
      password:hashedPassword
  });
  delete user.password
  return res.status(201).json({ status:true, user})
    
   } catch (error) {
      next(error)
   }
}

module.exports.login = async (req, res, next) =>{
    try {
     const {username,  password } = req.body
     const userCheck = await userModel.findOne({username});
     
     
     if(!userCheck){
        

       return res.status(400).json({message:"incoreect username or password", status:false});

     }
     
   const isPasswordValid = await bcrypt.compare(password, userCheck.password);

   if(!isPasswordValid){

    return res.status(400).json({message:"incoreect username or password", status:false});

   }
   return res.status(201).json({ status:true, userCheck})
     
    } catch (error) {
       next(error)
    }
 }
 module.exports.setAvatar = async (req, res, next) =>{
  try {
   const userId = req.params.id;
   const avatarImage = req.body.image;
   const userData = await userModel.findByIdAndUpdate(userId,{
    isAvatarImageSet: true,
    avatarImage
   });
   return res.status(200).json({isSet:userData.isAvatarImageSet, image:userData.avatarImage});
   
  } catch (error) {
     next(error)
  }
}

module.exports.getAllUsers = async(req, res, next)=>{
  try {
 
    const users = await userModel.find({_id : { $ne : req.params.id}}).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ])
    return res.status(200).json({status :true, data:users})
    
  } catch (error) {
    next(error)
  }
}