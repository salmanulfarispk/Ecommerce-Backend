const jwt=require("jsonwebtoken")





module.exports={

// Admin login

  login: async (req,res)=>{
    const {email,password}=req.body;
    //   console.log("admin:",req.body);

   if( email === process.env.ADMIN_EMAIL &&   password === process.env.ADMIN_PASSWORD){
    
      const token= jwt.sign(
       { email },
       process.env.ADMIN_ACCESS_TOKEN_SECRET  
      );

      return res.status(200).json({
        status:"success",
        message:"Admin registered succesfully",
        data:token,
      });

   }else{
    return res.status(404).json({
        status:"error",
        message:"invalid admin",
    });

   }

  },


}