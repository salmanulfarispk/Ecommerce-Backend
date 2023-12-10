const mongoose=require("mongoose")
const bcrypt=require("bcrypt")





const userSchema= new mongoose.Schema({

    name:String,
    email:String,
    username:String,
    password:String,  
    
})


userSchema.pre("save", async function(next){
    const user= this;
    if(!user.isModified("password"))  return next();
      
      const hashedpassword= await bcrypt.hash(user.password, 10);
     user.password = hashedpassword;
     next();

});




module.exports= mongoose.model("user",userSchema)